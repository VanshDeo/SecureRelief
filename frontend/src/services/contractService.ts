import { ethers } from 'ethers';
import { DISASTER_RELIEF_ABI, MOCK_USDC_ABI, CONTRACT_ADDRESSES, CONTRACT_HELPERS } from '../contracts/index';
import toast from 'react-hot-toast';

/**
 * DisasterReliefContractService
 * Comprehensive service for interacting with deployed smart contracts
 */
export class DisasterReliefContractService {
  provider: any;
  signer: any;
  disasterReliefContract: any;
  usdcContract: any;
  initialized: boolean;
  txCallbacks: any;

  constructor(provider: any, signer: any) {
    this.provider = provider;
    this.signer = signer;
    this.disasterReliefContract = null;
    this.usdcContract = null;
    this.initialized = false;
    this.txCallbacks = {
      onSubmitted: null, // ({hash,label}) => void
      onMined: null,     // ({hash, receipt, label}) => void
      onError: null      // ({error, label}) => void
    };
  }

  /**
   * Initialize contract instances
   */
  async initialize() {
    try {
      console.log('Initializing contract service with addresses:', CONTRACT_ADDRESSES)

      if (CONTRACT_ADDRESSES.DISASTER_RELIEF_SYSTEM) {
        console.log('Creating DisasterReliefSystem contract instance...')
        this.disasterReliefContract = new ethers.Contract(
          CONTRACT_ADDRESSES.DISASTER_RELIEF_SYSTEM,
          DISASTER_RELIEF_ABI,
          this.signer
        );

        // Test contract connection
        try {
          const owner = await this.disasterReliefContract.owner()
          console.log('DisasterReliefSystem contract connected, owner:', owner)
        } catch (error) {
          console.warn('DisasterReliefSystem contract test failed:', error.message)
        }
      } else {
        console.warn('DISASTER_RELIEF_SYSTEM address not configured')
      }

      const usdcAddress = CONTRACT_ADDRESSES.MOCK_USDC || CONTRACT_ADDRESSES.FUJI_USDC;
      if (usdcAddress) {
        console.log('Creating USDC contract instance with address:', usdcAddress)
        this.usdcContract = new ethers.Contract(
          usdcAddress,
          MOCK_USDC_ABI,
          this.signer
        );

        // Test USDC contract connection
        try {
          const symbol = await this.usdcContract.symbol()
          console.log('USDC contract connected, symbol:', symbol)
        } catch (error) {
          console.warn('USDC contract test failed:', error.message)
        }
      } else {
        console.warn('USDC contract address not configured')
      }

      this.initialized = true;
      console.log('Contract service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize contract service:', error);
      throw error;
    }
  }

  /**
   * Check if contracts are initialized
   */
  ensureInitialized() {
    if (!this.initialized || !this.disasterReliefContract) {
      throw new Error('Contract service not initialized');
    }
  }

  /**
   * Register callbacks for tx lifecycle
   */
  setTxCallbacks(callbacks = {}) {
    this.txCallbacks = { ...this.txCallbacks, ...callbacks };
  }

  // =============================================
  // INTERNAL HELPERS
  // =============================================

  /**
   * Build gas overrides with estimate and EIP-1559 fee data
   */
  async getGasOverrides(contract: any, method: string, args: any[] = []) {
    try {
      const feeData = await this.provider.getFeeData();
      let overrides: any = {};

      // Gas limit with 20% buffer
      if (contract?.estimateGas?.[method]) {
        try {
          const estimate = await contract.estimateGas[method](...args);
          // estimate is a bigint in ethers v6
          const buffered = (estimate * 120n) / 100n;
          overrides.gasLimit = buffered;
        } catch (e) {
          // Estimation may fail if call would revert; skip gasLimit
          console.warn(`Gas estimation failed for ${method}:`, e?.message || e);
        }
      }

      // Apply fee data if available
      if (feeData?.maxFeePerGas) overrides.maxFeePerGas = feeData.maxFeePerGas;
      if (feeData?.maxPriorityFeePerGas) overrides.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;

      return overrides;
    } catch (error) {
      console.warn('Failed to compute gas overrides:', error?.message || error);
      return {};
    }
  }

  /**
   * Normalize/parse ethers errors into user-friendly messages
   */
  parseEthersError(error) {
    const raw = error?.shortMessage || error?.message || String(error);
    const code = error?.code || error?.info?.error?.code;

    if (code === 4001 || /user rejected/i.test(raw)) return 'User rejected the transaction';
    if (/insufficient funds/i.test(raw)) return 'Insufficient funds for gas or value';
    if (/nonce (too low|has already been used)/i.test(raw)) return 'Transaction nonce issue. Please try again';
    if (/replacement transaction underpriced/i.test(raw)) return 'Replacement transaction underpriced';
    if (/execution reverted/i.test(raw)) {
      // Try extracting revert reason
      const m = raw.match(/reverted:\s?(.*)$/i);
      return m?.[1] ? `Reverted: ${m[1]}` : 'Transaction reverted by EVM';
    }
    return raw;
  }

  /**
   * Execute a contract write with monitoring and toasts
   */
  async execute(contract, method, args = [], label = 'Transaction') {
    if (!contract || !method) throw new Error('Invalid contract call');
    try {
      const overrides = await this.getGasOverrides(contract, method, args);
      // Submit tx
      const tx = await contract[method](...args, overrides);
      toast.loading(`${label}: submitting...`, { id: tx.hash });
      if (this.txCallbacks.onSubmitted) this.txCallbacks.onSubmitted({ hash: tx.hash, label });

      // Wait for 1 confirmation
      const receipt = await tx.wait(1);
      toast.success(`${label}: confirmed`, { id: tx.hash });
      if (this.txCallbacks.onMined) this.txCallbacks.onMined({ hash: tx.hash, receipt, label });

      return { tx, receipt };
    } catch (error) {
      const msg = this.parseEthersError(error);
      toast.error(`${label}: ${msg}`);
      if (this.txCallbacks.onError) this.txCallbacks.onError({ error: msg, label });
      throw error;
    }
  }

  // =============================================
  // DISASTER ZONE MANAGEMENT
  // =============================================

  /**
   * Create a new disaster zone
   */
  async createDisasterZone(name, latitude, longitude, radiusKm, initialFundingUSDC) {
    this.ensureInitialized();

    try {
      const coords = CONTRACT_HELPERS.formatCoordinates(latitude, longitude);
      const radiusMeters = radiusKm * 1000;
      const fundingAmount = CONTRACT_HELPERS.formatUSDCAmount(initialFundingUSDC);
      const { tx, receipt } = await this.execute(
        this.disasterReliefContract,
        'createDisasterZone',
        [name, coords.latitude, coords.longitude, radiusMeters, fundingAmount],
        `Create disaster zone "${name}"`
      );

      // Extract zone ID from events
      const event = receipt.logs.find(log => {
        try {
          const parsed = this.disasterReliefContract.interface.parseLog(log);
          return parsed.name === 'DisasterZoneCreated';
        } catch {
          return false;
        }
      });

      const zoneId = event ?
        this.disasterReliefContract.interface.parseLog(event).args.zoneId :
        null;

      return {
        success: true,
        txHash: tx.hash,
        zoneId: zoneId ? Number(zoneId) : null
      };
    } catch (error) {
      console.error('Error creating disaster zone:', error);
      throw error;
    }
  }

  /**
   * Get disaster zone information
   */
  async getDisasterZone(zoneId) {
    this.ensureInitialized();

    try {
      const zone = await this.disasterReliefContract.getDisasterZone(zoneId);

      return {
        id: Number(zone.id),
        name: zone.name,
        coordinates: CONTRACT_HELPERS.parseCoordinates(zone.latitude, zone.longitude),
        radius: Number(zone.radius),
        initialFunding: CONTRACT_HELPERS.parseUSDCAmount(zone.initialFunding),
        currentFunding: CONTRACT_HELPERS.parseUSDCAmount(zone.currentFunding),
        totalSpent: CONTRACT_HELPERS.parseUSDCAmount(zone.totalSpent),
        active: zone.active,
        createdAt: new Date(Number(zone.createdAt) * 1000),
        createdBy: zone.createdBy
      };
    } catch (error) {
      console.error('Error fetching disaster zone:', error);
      throw error;
    }
  }

  /**
   * Get disaster zone statistics
   */
  async getDisasterZoneStats(zoneId) {
    this.ensureInitialized();

    try {
      const stats = await this.disasterReliefContract.getDisasterZoneStats(zoneId);

      return {
        name: stats.name,
        active: stats.active,
        initialFunding: CONTRACT_HELPERS.parseUSDCAmount(stats.initialFunding),
        currentFunding: CONTRACT_HELPERS.parseUSDCAmount(stats.currentFunding),
        totalSpent: CONTRACT_HELPERS.parseUSDCAmount(stats.totalSpent),
        vendorCount: Number(stats.vendorCount)
      };
    } catch (error) {
      console.error('Error fetching disaster zone stats:', error);
      throw error;
    }
  }

  /**
   * Add funding to disaster zone
   */
  async addFunding(zoneId, amountUSDC) {
    this.ensureInitialized();

    try {
      const amount = CONTRACT_HELPERS.formatUSDCAmount(amountUSDC);
      const { tx } = await this.execute(
        this.disasterReliefContract,
        'addFunding',
        [zoneId, amount],
        `Add $${amountUSDC} USDC to zone ${zoneId}`
      );
      return { success: true, txHash: tx.hash };
    } catch (error) {
      console.error('Error adding funding:', error);
      throw error;
    }
  }

  // =============================================
  // VENDOR MANAGEMENT
  // =============================================

  /**
   * Register a new vendor
   */
  async registerVendor(vendorAddress, name, location, zoneId, ipfsKycHash) {
    this.ensureInitialized();

    try {
      const { tx } = await this.execute(
        this.disasterReliefContract,
        'registerVendor',
        [vendorAddress, name, location, zoneId, ipfsKycHash],
        `Register vendor "${name}"`
      );
      return { success: true, txHash: tx.hash };
    } catch (error) {
      console.error('Error registering vendor:', error);
      throw error;
    }
  }

  /**
   * Verify a vendor
   */
  async verifyVendor(vendorAddress, zoneId) {
    this.ensureInitialized();

    try {
      const { tx } = await this.execute(
        this.disasterReliefContract,
        'verifyVendor',
        [vendorAddress, zoneId],
        'Verify vendor'
      );
      return { success: true, txHash: tx.hash };
    } catch (error) {
      console.error('Error verifying vendor:', error);
      throw error;
    }
  }

  /**
   * Get vendor information
   */
  async getVendor(vendorAddress) {
    this.ensureInitialized();

    try {
      const vendor = await this.disasterReliefContract.getVendor(vendorAddress);

      return {
        address: vendor.vendorAddress,
        name: vendor.name,
        location: vendor.location,
        disasterZoneId: Number(vendor.disasterZoneId),
        ipfsKycHash: vendor.ipfsKycHash,
        verified: vendor.verified,
        totalRedeemed: CONTRACT_HELPERS.parseUSDCAmount(vendor.totalRedeemed),
        transactionCount: Number(vendor.transactionCount),
        reputationScore: Number(vendor.reputationScore),
        registeredAt: new Date(Number(vendor.registeredAt) * 1000)
      };
    } catch (error) {
      console.error('Error fetching vendor:', error);
      throw error;
    }
  }

  /**
   * Get vendors for a disaster zone
   */
  async getZoneVendors(zoneId) {
    this.ensureInitialized();

    try {
      const vendorAddresses = await this.disasterReliefContract.getZoneVendors(zoneId);

      const vendors = await Promise.all(
        vendorAddresses.map(address => this.getVendor(address))
      );

      return vendors;
    } catch (error) {
      console.error('Error fetching zone vendors:', error);
      throw error;
    }
  }

  // =============================================
  // VOUCHER MANAGEMENT
  // =============================================

  /**
   * Issue a voucher to a beneficiary
   */
  async issueVoucher(beneficiaryAddress, amountUSDC, zoneId, categories, expiryDays = 30) {
    this.ensureInitialized();

    try {
      const amount = CONTRACT_HELPERS.formatUSDCAmount(amountUSDC);
      const { tx, receipt } = await this.execute(
        this.disasterReliefContract,
        'issueVoucher',
        [beneficiaryAddress, amount, zoneId, categories, expiryDays],
        `Issue voucher to ${beneficiaryAddress}`
      );

      // Extract voucher ID from events
      const event = receipt.logs.find(log => {
        try {
          const parsed = this.disasterReliefContract.interface.parseLog(log);
          return parsed.name === 'VoucherIssued';
        } catch {
          return false;
        }
      });

      const voucherId = event ?
        this.disasterReliefContract.interface.parseLog(event).args.voucherId :
        null;

      return {
        success: true,
        txHash: tx.hash,
        voucherId: voucherId ? Number(voucherId) : null
      };
    } catch (error) {
      console.error('Error issuing voucher:', error);
      throw error;
    }
  }

  /**
   * Redeem a voucher
   */
  async redeemVoucher(voucherId, amountUSDC, category, ipfsHash) {
    this.ensureInitialized();

    try {
      const amount = CONTRACT_HELPERS.formatUSDCAmount(amountUSDC);
      const { tx } = await this.execute(
        this.disasterReliefContract,
        'redeemVoucher',
        [voucherId, amount, category, ipfsHash],
        `Redeem voucher #${voucherId}`
      );
      return { success: true, txHash: tx.hash };
    } catch (error) {
      console.error('Error redeeming voucher:', error);
      throw error;
    }
  }

  /**
   * Get voucher information
   */
  async getVoucher(voucherId) {
    this.ensureInitialized();

    try {
      const voucher = await this.disasterReliefContract.getVoucher(voucherId);

      return {
        id: Number(voucher.id),
        beneficiary: voucher.beneficiary,
        amount: CONTRACT_HELPERS.parseUSDCAmount(voucher.amount),
        disasterZoneId: Number(voucher.disasterZoneId),
        allowedCategories: voucher.allowedCategories,
        createdAt: new Date(Number(voucher.createdAt) * 1000),
        expiryTime: new Date(Number(voucher.expiryTime) * 1000),
        used: voucher.used,
        usedBy: voucher.usedBy,
        usedAt: voucher.usedAt > 0 ? new Date(Number(voucher.usedAt) * 1000) : null
      };
    } catch (error) {
      console.error('Error fetching voucher:', error);
      throw error;
    }
  }

  /**
   * Get user vouchers
   */
  async getUserVouchers(userAddress) {
    this.ensureInitialized();

    try {
      const voucherIds = await this.disasterReliefContract.getUserVouchers(userAddress);

      const vouchers = await Promise.all(
        voucherIds.map(id => this.getVoucher(Number(id)))
      );

      return vouchers;
    } catch (error) {
      console.error('Error fetching user vouchers:', error);
      throw error;
    }
  }

  // =============================================
  // USDC TOKEN FUNCTIONS
  // =============================================

  /**
   * Get USDC balance
   */
  async getUSDCBalance(address) {
    if (!this.usdcContract) return '0';

    try {
      const balance = await this.usdcContract.balanceOf(address);
      return CONTRACT_HELPERS.parseUSDCAmount(balance).toString();
    } catch (error) {
      console.error('Error fetching USDC balance:', error);
      return '0';
    }
  }

  /**
   * Use MockUSDC faucet (for testing)
   */
  async useFaucet() {
    if (!this.usdcContract) throw new Error('USDC contract not available');

    try {
      const { tx } = await this.execute(
        this.usdcContract,
        'faucet',
        [],
        'Use USDC faucet'
      );
      return { success: true, txHash: tx.hash };
    } catch (error) {
      console.error('Error using faucet:', error);
      throw error;
    }
  }

  /**
   * Transfer USDC
   */
  async transferUSDC(to, amountUSDC) {
    if (!this.usdcContract) throw new Error('USDC contract not available');

    try {
      const amount = CONTRACT_HELPERS.formatUSDCAmount(amountUSDC);
      const { tx } = await this.execute(
        this.usdcContract,
        'transfer',
        [to, amount],
        `Transfer ${amountUSDC} USDC`
      );
      return { success: true, txHash: tx.hash };
    } catch (error) {
      console.error('Error transferring USDC:', error);
      throw error;
    }
  }

  // =============================================
  // EVENT LISTENING
  // =============================================

  /**
   * Listen for contract events
   */
  setupEventListeners(callbacks: any = {}) {
    if (!this.disasterReliefContract) return;

    // Disaster zone events
    this.disasterReliefContract.on('DisasterZoneCreated', (zoneId, name, ...args) => {
      if (callbacks.onDisasterZoneCreated) {
        callbacks.onDisasterZoneCreated({ zoneId: Number(zoneId), name, args });
      }
    });

    // Voucher events
    this.disasterReliefContract.on('VoucherIssued', (voucherId, beneficiary, ...args) => {
      if (callbacks.onVoucherIssued) {
        callbacks.onVoucherIssued({ voucherId: Number(voucherId), beneficiary, args });
      }
    });

    this.disasterReliefContract.on('VoucherRedeemed', (voucherId, vendor, beneficiary, amount, category) => {
      if (callbacks.onVoucherRedeemed) {
        callbacks.onVoucherRedeemed({
          voucherId: Number(voucherId),
          vendor,
          beneficiary,
          amount: CONTRACT_HELPERS.parseUSDCAmount(amount),
          category
        });
      }
    });

    // Proof events
    this.disasterReliefContract.on('ProofOfAidSubmitted', (proofId, voucherId, vendor, ipfsHash, category, amount) => {
      if (callbacks.onProofOfAidSubmitted) {
        callbacks.onProofOfAidSubmitted({
          proofId: Number(proofId),
          voucherId: Number(voucherId),
          vendor,
          ipfsHash,
          category,
          amount: CONTRACT_HELPERS.parseUSDCAmount(amount)
        });
      }
    });
  }

  /**
   * Remove all event listeners
   */
  removeEventListeners() {
    if (this.disasterReliefContract) {
      this.disasterReliefContract.removeAllListeners();
    }
  }
}

export default DisasterReliefContractService;
