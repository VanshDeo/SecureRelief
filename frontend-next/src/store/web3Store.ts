import { create } from 'zustand'
import { ethers } from 'ethers'
import toast from 'react-hot-toast'
import { DisasterReliefContractService } from '../services/contractService'
import apiService from '../services/apiService'
import { handleError, showSuccess } from '../utils/errorHandler'

// Role Permissions Constant
const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: [
    'manage:all',
    'view:all',
    'disaster:create',
    'disaster:update',
    'disaster:delete',
    'vendor:approve',
    'vendor:reject',
    'user:manage',
    'analytics:full',
    'system:configure'
  ],
  government: [
    'disaster:create',
    'disaster:update',
    'disaster:verify',
    'vendor:approve',
    'analytics:view',
    'reports:generate'
  ],
  treasury: [
    'funds:manage',
    'treasury:view',
    'treasury:allocate',
    'analytics:financial'
  ],
  oracle: [
    'data:verify',
    'price:update',
    'validation:perform'
  ],
  vendor: [
    'voucher:redeem',
    'inventory:manage',
    'transaction:process',
    'profile:update',
    'analytics:vendor'
  ],
  victim: [
    'voucher:claim',
    'aid:request',
    'profile:update',
    'donation:track'
  ],
  donor: [
    'donation:make',
    'impact:track',
    'profile:update',
    'analytics:donation'
  ],
  guest: [
    'public:view',
    'donation:make',
    'transparency:view',
    'disaster:view',
    'proof:view'
  ]
};

// Avalanche network configuration with fallback RPC URLs
const AVALANCHE_CONFIG = {
  chainId: 43113, // Fuji testnet
  chainName: 'Avalanche Fuji Testnet',
  nativeCurrency: {
    name: 'AVAX',
    symbol: 'AVAX',
    decimals: 18,
  },
  rpcUrls: [
    'https://api.avax-test.network/ext/bc/C/rpc',
    'https://rpc.ankr.com/avalanche_fuji',
    'https://avalanche-fuji-c-chain.publicnode.com',
  ],
  blockExplorerUrls: ['https://testnet.snowtrace.io/'],
}

// LocalStorage key for wallet connection persistence
const WALLET_CONNECTED_KEY = 'securerelief_wallet_connected'

// Retry configuration for RPC calls
const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 5000, // 5 seconds
  backoffMultiplier: 2,
}

// Helper function to retry async operations with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = RETRY_CONFIG.maxRetries,
  delay = RETRY_CONFIG.initialDelay
): Promise<T> {
  try {
    return await fn()
  } catch (error: any) {
    // Check if it's a rate limiting error
    const isRateLimited =
      error?.code === -32005 ||
      error?.code === 429 ||
      error?.message?.includes('rate limit') ||
      error?.message?.includes('too many requests')

    if (retries > 0 && isRateLimited) {
      const nextDelay = Math.min(delay * RETRY_CONFIG.backoffMultiplier, RETRY_CONFIG.maxDelay)
      console.log(`Rate limited, retrying in ${delay}ms... (${retries} retries left)`)
      await new Promise(resolve => setTimeout(resolve, delay))
      return retryWithBackoff(fn, retries - 1, nextDelay)
    }

    throw error
  }
}

// Define the store state interface
interface Web3Store {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  isInitialized: boolean;
  account: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  chainId: number | null;
  balance: string;
  usdcBalance: string;

  // Contract service
  contractService: DisasterReliefContractService | null;

  // User role and permissions
  // User role and permissions
  user: any; // Ideally this should be a typed User interface
  userRole: string | null;
  permissions: string[];
  roleHierarchy: Record<string, number>;
  rolePermissions: Record<string, string[]>;

  // Auth State
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  authMethod: string | null;

  // Contract data
  disasterZones: any[];
  vendors: any[];
  vouchers: any[];

  // Actions
  initialize: () => Promise<void>;
  connectWallet: (silent?: boolean) => Promise<void>;
  switchToAvalanche: () => Promise<void>;
  determineUserRole: (account: string, contractService: DisasterReliefContractService) => Promise<string>;
  disconnect: () => void;
  updateBalance: () => Promise<void>;
  refreshDisasterZones: () => Promise<void>;
  refreshVouchers: () => Promise<void>;
  refreshVendors: (zoneId?: number) => Promise<void>;
  createDisasterZone: (name: string, latitude: string | number, longitude: string | number, radiusKm: string | number, initialFundingUSDC: string | number) => Promise<any>;
  registerVendor: (vendorAddress: string, name: string, location: string, zoneId: number, ipfsKycHash: string) => Promise<any>;
  verifyVendor: (vendorAddress: string, zoneId: number) => Promise<any>;
  issueVoucher: (beneficiaryAddress: string, amountUSDC: string | number, zoneId: number, categories: number[], expiryDays?: number) => Promise<any>;
  redeemVoucher: (voucherId: number, amountUSDC: string | number, category: number, ipfsHash: string) => Promise<any>;
  useFaucet: () => Promise<any>;
  transferUSDC: (to: string, amountUSDC: string | number) => Promise<any>;
  setUserRole: (role: string) => void;

  // Auth Actions
  login: (credentials: any) => Promise<any>;
  logout: () => Promise<void>;
  register: (registrationData: any) => Promise<any>;
  updateProfile: (updates: any) => Promise<any>;
  initializeAuth: () => Promise<void>;

  // Access Control
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  can: (action: string) => boolean;
}

export const useWeb3Store = create<Web3Store>((set, get) => ({
  // Connection state
  isConnected: false,
  isConnecting: false,
  isInitialized: false,
  account: null,
  provider: null,
  signer: null,
  chainId: null,
  balance: '0',
  usdcBalance: '0',

  // Contract service
  contractService: null,

  // User role and permissions - enhanced for RBAC
  userRole: null, // 'admin', 'vendor', 'donor', 'victim', 'government', 'oracle', 'treasury'
  permissions: [],
  roleHierarchy: {
    admin: 10,
    government: 8,
    treasury: 7,
    oracle: 6,
    vendor: 5,
    victim: 4,
    donor: 3,
    guest: 1
  },
  rolePermissions: ROLE_PERMISSIONS,

  // Auth State
  user: null,
  isAuthenticated: false,
  isLoadingAuth: true,
  authMethod: null,

  // Contract data
  disasterZones: [],
  vendors: [],
  vouchers: [],

  // Initialize Web3 connection
  initialize: async () => {
    try {
      console.log('Initializing Web3 store...')

      if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        console.log('Ethereum provider detected')
        const provider = new ethers.BrowserProvider(window.ethereum)

        // Check if user previously connected (persistence)
        const wasConnected = typeof window !== 'undefined' && localStorage.getItem(WALLET_CONNECTED_KEY) === 'true'

        // Check if already connected or was previously connected
        try {
          const accounts = await provider.send('eth_accounts', [])
          if (accounts.length > 0 || wasConnected) {
            console.log('Found existing connection or previous session, attempting to reconnect...')
            await get().connectWallet(true) // Silent mode for auto-reconnect
          } else {
            console.log('No existing connection found')
          }
        } catch (error) {
          console.log('Error checking existing accounts:', error)
          // If we were previously connected, try to reconnect anyway
          if (wasConnected) {
            console.log('Attempting reconnection from previous session...')
            await get().connectWallet(true) // Silent mode for auto-reconnect
          }
        }

        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
          console.log('Accounts changed:', accounts)
          if (accounts.length === 0) {
            console.log('All accounts disconnected')
            get().disconnect()
          } else {
            console.log('Account changed, reconnecting...')
            get().connectWallet()
          }
        })

        // Listen for chain changes
        window.ethereum.on('chainChanged', (chainId) => {
          console.log('Chain changed to:', chainId)
          window.location.reload()
        })
      } else {
        console.log('No Ethereum provider found')
      }

      set({ isInitialized: true })
      console.log('Web3 store initialized successfully')
    } catch (error) {
      console.error('Web3 initialization error:', error)
      toast.error('Failed to initialize Web3')
      set({ isInitialized: true })
    }
  },

  // Connect wallet
  // When silent is true, attempts to reconnect without prompting (for auto-reconnect on page load)
  connectWallet: async (silent = false) => {
    const state = get()
    if (state.isConnecting) return

    set({ isConnecting: true })

    try {
      // Check for Web3 provider
      if (typeof window === 'undefined' || typeof window.ethereum === 'undefined') {
        if (!silent) {
          toast.error('Please install MetaMask or another Web3 wallet')
        }
        set({ isConnecting: false })
        return
      }

      console.log('Creating provider...')
      const provider = new ethers.BrowserProvider(window.ethereum)

      // Request account access
      // Use eth_accounts (no prompt) for silent reconnect, eth_requestAccounts (prompts) for explicit connect
      console.log(silent ? 'Checking accounts silently...' : 'Requesting accounts...')
      const accounts = silent
        ? await provider.send('eth_accounts', [])
        : await provider.send('eth_requestAccounts', [])

      // If silent mode and no accounts, exit quietly (user needs to explicitly connect)
      if (silent && accounts.length === 0) {
        console.log('No authorized accounts found, silent reconnect aborted')
        set({ isConnecting: false })
        // Clear localStorage since we couldn't reconnect
        if (typeof window !== 'undefined') {
          localStorage.removeItem(WALLET_CONNECTED_KEY)
        }
        return
      }

      const signer = await provider.getSigner()
      const account = await signer.getAddress()
      console.log('Connected to account:', account)

      const network = await provider.getNetwork()
      console.log('Current network:', network.chainId.toString(), network.name)

      // Check if on correct network and switch if needed
      if (network.chainId !== BigInt(AVALANCHE_CONFIG.chainId)) {
        console.log('Wrong network detected, switching to Avalanche...')
        try {
          await get().switchToAvalanche()
          // Re-get network info after switch
          const newNetwork = await provider.getNetwork()
          console.log('Switched to network:', newNetwork.chainId.toString())
        } catch (switchError) {
          console.error('Failed to switch network:', switchError)
          toast.error('Please manually switch to Avalanche Fuji testnet in your wallet')
          set({ isConnecting: false })
          return
        }
      }

      // Get balance with retry logic (non-blocking)
      let formattedBalance = '0'
      try {
        const balance = await retryWithBackoff(async () => {
          return await provider.getBalance(account)
        })
        formattedBalance = ethers.formatEther(balance)
      } catch (balanceError) {
        console.warn('Failed to fetch balance (rate limited), will retry later:', balanceError)
        // Don't fail the connection just because balance fetch failed
        // Schedule a delayed balance update
        setTimeout(() => {
          get().updateBalance().catch(e => console.warn('Delayed balance update failed:', e))
        }, 3000)
      }

      // Initialize contract service with error handling
      let contractService = null
      let usdcBalance = '0'
      let userRole = 'donor' // Default role

      try {
        console.log('Initializing contract service...')
        contractService = new DisasterReliefContractService(provider, signer)
        // Setup tx lifecycle callbacks for global monitoring
        contractService.setTxCallbacks({
          onSubmitted: ({ hash, label }) => {
            console.log(`${label} submitted:`, hash)
          },
          onMined: async ({ hash, label }) => {
            console.log(`${label} confirmed:`, hash)
            // Auto-refresh balances and vouchers post tx
            try {
              await get().updateBalance()
              await get().refreshVouchers()
            } catch (e) {
              console.warn('Post-tx refresh failed:', e)
            }
          },
          onError: ({ error, label }) => {
            console.warn(`${label} error:`, error)
          }
        })
        await contractService.initialize()
        console.log('Contract service initialized successfully')

        // Get USDC balance with retry logic
        try {
          usdcBalance = await retryWithBackoff(async () => {
            return await contractService.getUSDCBalance(account)
          })
        } catch (usdcError) {
          console.warn('Failed to fetch USDC balance (rate limited), will retry later:', usdcError)
          // Schedule a delayed USDC balance update
          setTimeout(() => {
            get().updateBalance().catch(e => console.warn('Delayed USDC balance update failed:', e))
          }, 5000)
        }

        // Determine user role
        userRole = await get().determineUserRole(account, contractService)

        // Setup event listeners
        contractService.setupEventListeners({
          onDisasterZoneCreated: (data) => {
            console.log('Disaster zone created:', data)
            get().refreshDisasterZones()
          },
          onVoucherIssued: (data) => {
            console.log('Voucher issued:', data)
            get().refreshVouchers()
          },
          onVoucherRedeemed: (data) => {
            console.log('Voucher redeemed:', data)
            get().refreshVouchers()
            get().updateBalance()
          },
          onProofOfAidSubmitted: (data) => {
            console.log('Proof of aid submitted:', data)
          }
        })
      } catch (contractError) {
        console.warn('Contract initialization failed, continuing with limited functionality:', contractError)
        toast('Contract connection failed. Some features may be limited.', { icon: '⚠️' })
      }

      set({
        isConnected: true,
        isConnecting: false,
        account,
        provider,
        signer,
        chainId: Number(network.chainId),
        balance: formattedBalance,
        usdcBalance,
        userRole,
        contractService,
      })

      // Save connection state to localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem(WALLET_CONNECTED_KEY, 'true')
      }

      toast.success(`Connected as ${userRole}`)
      console.log('Wallet connection completed successfully')
    } catch (error: any) {
      console.error('Wallet connection error:', error)
      let errorMessage = 'Failed to connect wallet'

      // Check if it's a rate limiting error
      const isRateLimited =
        error?.code === -32005 ||
        error?.code === 429 ||
        error?.message?.includes('rate limit') ||
        error?.message?.includes('too many requests')

      if (isRateLimited) {
        errorMessage = 'RPC rate limit reached. Please wait a moment and try again.'
      } else if (error.code === 4001) {
        errorMessage = 'Connection rejected by user'
      } else if (error.code === -32002) {
        errorMessage = 'Connection request already pending'
      } else if (error.message?.includes('User rejected')) {
        errorMessage = 'Connection rejected by user'
      }

      toast.error(errorMessage)
      set({ isConnecting: false })
    }
  },

  // Switch to Avalanche network
  switchToAvalanche: async () => {
    try {
      console.log('Attempting to switch to Avalanche Fuji testnet...')
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${AVALANCHE_CONFIG.chainId.toString(16)}` }],
      })
      console.log('Successfully switched to Avalanche Fuji')
    } catch (switchError) {
      console.error('Switch network error:', switchError)

      // If network doesn't exist, add it
      if (switchError.code === 4902) {
        console.log('Network not found, attempting to add Avalanche Fuji...')
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${AVALANCHE_CONFIG.chainId.toString(16)}`,
              chainName: AVALANCHE_CONFIG.chainName,
              nativeCurrency: AVALANCHE_CONFIG.nativeCurrency,
              rpcUrls: AVALANCHE_CONFIG.rpcUrls,
              blockExplorerUrls: AVALANCHE_CONFIG.blockExplorerUrls,
            }],
          })
          console.log('Successfully added Avalanche Fuji network')
        } catch (addError) {
          console.error('Failed to add Avalanche network:', addError)
          throw new Error('Failed to add Avalanche network. Please add it manually.')
        }
      } else if (switchError.code === 4001) {
        throw new Error('Network switch rejected by user')
      } else {
        throw new Error(`Failed to switch network: ${switchError.message}`)
      }
    }
  },

  // Determine user role based on contract state and permissions
  determineUserRole: async (account, contractService) => {
    try {
      if (!contractService || !contractService.disasterReliefContract) {
        return 'donor' // Default role if contract not available
      }

      const contract = contractService.disasterReliefContract
      const state = get()

      // Define role mappings and permissions
      const rolePermissions = {
        admin: [
          'manage:all',
          'view:all',
          'disaster:create',
          'disaster:update',
          'disaster:delete',
          'vendor:approve',
          'vendor:reject',
          'user:manage',
          'analytics:full',
          'system:configure'
        ],
        government: [
          'disaster:create',
          'disaster:update',
          'disaster:verify',
          'vendor:approve',
          'analytics:view',
          'reports:generate'
        ],
        treasury: [
          'funds:manage',
          'treasury:view',
          'treasury:allocate',
          'analytics:financial'
        ],
        oracle: [
          'data:verify',
          'price:update',
          'validation:perform'
        ],
        vendor: [
          'voucher:redeem',
          'inventory:manage',
          'transaction:process',
          'profile:update',
          'analytics:vendor'
        ],
        victim: [
          'voucher:claim',
          'aid:request',
          'profile:update',
          'donation:track'
        ],
        donor: [
          'donation:make',
          'impact:track',
          'profile:update',
          'analytics:donation'
        ]
      }

      // 1. Check if Admin (Owner)
      try {
        const owner = await contract.owner()
        if (owner.toLowerCase() === account.toLowerCase()) {
          console.log('User identified as Admin (Owner)');
          set({ permissions: rolePermissions.admin });
          return 'admin';
        }
      } catch (e) {
        console.warn('Failed to check owner:', e)
      }

      // 2. Check if Vendor
      try {
        const vendor = await contract.getVendor(account)
        // Check if vendor exists (address not empty)
        if (vendor && vendor.vendorAddress && vendor.vendorAddress !== ethers.ZeroAddress) {
          console.log('User identified as Vendor');
          set({ permissions: rolePermissions.vendor });
          return 'vendor';
        }
      } catch (e) {
        // Not a vendor or call failed (reverts if not found in some implementations)
      }

      // 3. Default to Donor
      // TODO: Add specific checks for Government, Treasury, Oracle, Victim via AccessControl if available
      console.log('User identified as Donor (Default)');
      set({ permissions: rolePermissions.donor });
      return 'donor';
    } catch (error) {
      console.error('Role determination error:', error)
      return 'donor'
    }
  },

  // Disconnect wallet
  disconnect: () => {
    const { contractService } = get()
    if (contractService) {
      contractService.removeEventListeners()
    }

    // Clear connection persistence from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(WALLET_CONNECTED_KEY)
    }

    set({
      isConnected: false,
      account: null,
      provider: null,
      signer: null,
      chainId: null,
      balance: '0',
      usdcBalance: '0',
      userRole: null,
      permissions: [],
      contractService: null,
      disasterZones: [],
      vendors: [],
      vouchers: [],
    })
    toast.success('Wallet disconnected')
  },

  // Update balance with retry logic
  updateBalance: async () => {
    const { provider, account, contractService } = get()
    if (!provider || !account) return

    try {
      // Try to get AVAX balance with retry
      let formattedBalance = '0'
      try {
        const balance = await retryWithBackoff(async () => {
          return await provider.getBalance(account)
        })
        formattedBalance = ethers.formatEther(balance)
      } catch (balanceError) {
        console.warn('Failed to update AVAX balance:', balanceError)
      }

      // Try to get USDC balance with retry
      let usdcBalance = '0'
      if (contractService) {
        try {
          usdcBalance = await retryWithBackoff(async () => {
            return await contractService.getUSDCBalance(account)
          })
        } catch (usdcError) {
          console.warn('Failed to update USDC balance:', usdcError)
        }
      }

      set({ balance: formattedBalance, usdcBalance })
    } catch (error) {
      console.error('Balance update error:', error)
    }
  },

  // Data refresh functions
  refreshDisasterZones: async () => {
    const { contractService } = get()
    if (!contractService) return

    try {
      const contract = contractService.disasterReliefContract
      const zones = []
      if (contract?.disasterZoneCounter) {
        try {
          const count = await contract.disasterZoneCounter()
          const total = Number(count)
          for (let i = 1; i <= total; i++) {
            try {
              const z = await contractService.getDisasterZone(i)
              zones.push(z)
            } catch (e) {
              // Skip missing/deleted zones
            }
          }
        } catch (e) {
          console.warn('Failed to enumerate disaster zones:', e)
        }
      }
      set({ disasterZones: zones })
    } catch (error) {
      console.error('Error refreshing disaster zones:', error)
    }
  },

  refreshVouchers: async () => {
    const { contractService, account } = get()
    if (!contractService || !account) return

    try {
      const vouchers = await contractService.getUserVouchers(account)
      set({ vouchers })
    } catch (error) {
      console.error('Error refreshing vouchers:', error)
    }
  },

  refreshVendors: async (zoneId) => {
    const { contractService } = get()
    if (!contractService) return

    try {
      if (zoneId) {
        const vendors = await contractService.getZoneVendors(zoneId)
        set({ vendors })
      }
    } catch (error) {
      console.error('Error refreshing vendors:', error)
    }
  },

  // Contract interaction helpers
  createDisasterZone: async (name, latitude, longitude, radiusKm, initialFundingUSDC) => {
    const { contractService } = get()
    if (!contractService) throw new Error('Contract service not available')

    return await contractService.createDisasterZone(name, latitude, longitude, radiusKm, initialFundingUSDC)
  },

  registerVendor: async (vendorAddress, name, location, zoneId, ipfsKycHash) => {
    const { contractService } = get()
    if (!contractService) throw new Error('Contract service not available')

    return await contractService.registerVendor(vendorAddress, name, location, zoneId, ipfsKycHash)
  },

  verifyVendor: async (vendorAddress, zoneId) => {
    const { contractService } = get()
    if (!contractService) throw new Error('Contract service not available')

    return await contractService.verifyVendor(vendorAddress, zoneId)
  },

  issueVoucher: async (beneficiaryAddress, amountUSDC, zoneId, categories, expiryDays = 30) => {
    const { contractService } = get()
    if (!contractService) throw new Error('Contract service not available')

    return await contractService.issueVoucher(beneficiaryAddress, amountUSDC, zoneId, categories, expiryDays)
  },

  redeemVoucher: async (voucherId, amountUSDC, category, ipfsHash) => {
    const { contractService } = get()
    if (!contractService) throw new Error('Contract service not available')

    return await contractService.redeemVoucher(voucherId, amountUSDC, category, ipfsHash)
  },

  useFaucet: async () => {
    const { contractService } = get()
    if (!contractService) throw new Error('Contract service not available')

    const result = await contractService.useFaucet()
    if (result.success) {
      await get().updateBalance()
    }
    return result
  },

  transferUSDC: async (to, amountUSDC) => {
    const { contractService } = get()
    if (!contractService) throw new Error('Contract service not available')

    const result = await contractService.transferUSDC(to, amountUSDC)
    if (result.success) {
      await get().updateBalance()
    }
    return result
  },

  setUserRole: (role: string) => {
    const { user } = get();
    set({
      userRole: role,
      user: user ? { ...user, role } : { role }, // Update user object too if exists
      permissions: ROLE_PERMISSIONS[role] || [] // Sync permissions
    })
    toast.success(`Role switched to ${role}`)
  },

  // Auth Actions Implementation
  initializeAuth: async () => {
    const { isConnected, account, userRole: web3Role } = get();
    set({ isLoadingAuth: true });

    try {
      // Development mode health check
      if (process.env.NODE_ENV === 'development') {
        try {
          // Silent health check
          await apiService.getHealthStatus();
        } catch (error) {
          // Ignore
        }
      }

      // 1. Check Traditional Auth
      const authToken = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');

      if (authToken && userData) {
        try {
          apiService.setAuthToken(authToken);
          const verification = await apiService.verifyToken();

          if (verification.success) {
            const parsedUser = JSON.parse(userData);
            set({
              user: {
                ...parsedUser,
                authMethod: 'traditional',
                permissions: ROLE_PERMISSIONS[parsedUser.role] || []
              },
              userRole: parsedUser.role,
              permissions: ROLE_PERMISSIONS[parsedUser.role] || [],
              isAuthenticated: true,
              authMethod: 'traditional',
              isLoadingAuth: false
            });
            return;
          }
        } catch (error) {
          console.warn('Token verification failed', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          apiService.setAuthToken(null);
        }
      }

      // 2. Check Web3 Auth (if wallet connected)
      if (isConnected && account && web3Role) {
        try {
          const dbUser = await apiService.getUserByWallet(account);
          if (dbUser.success && dbUser.data) {
            const web3User = {
              ...dbUser.data,
              authMethod: 'wallet',
              permissions: ROLE_PERMISSIONS[dbUser.data.role] || [],
              verified: true
            };
            set({
              user: web3User,
              userRole: dbUser.data.role,
              permissions: ROLE_PERMISSIONS[dbUser.data.role] || [],
              isAuthenticated: true,
              authMethod: 'wallet',
              isLoadingAuth: false
            });
            return;
          } else {
            // Mock/Create user
            const newUser = {
              walletAddress: account,
              role: web3Role,
              status: 'active',
              name: `User ${account.slice(0, 6)}...${account.slice(-4)}`,
              authMethod: 'wallet',
              permissions: ROLE_PERMISSIONS[web3Role] || [],
              verified: false
            };

            // Attempt to sync with backend, but don't block
            apiService.createUser(newUser).catch(e => console.warn('User creation background sync failed', e));

            set({
              user: newUser,
              userRole: web3Role,
              permissions: ROLE_PERMISSIONS[web3Role] || [],
              isAuthenticated: true,
              authMethod: 'wallet',
              isLoadingAuth: false
            });
            return;
          }
        } catch (error) {
          console.warn('Web3 Auth lookup failed', error);
        }
      }

      // 3. Guest Fallback
      const guestUser = {
        id: 'guest',
        role: 'guest',
        name: 'Guest User',
        authMethod: 'guest',
        permissions: ROLE_PERMISSIONS.guest || [],
        verified: false
      };
      set({
        user: guestUser,
        userRole: 'guest',
        permissions: ROLE_PERMISSIONS.guest || [],
        isAuthenticated: false,
        authMethod: 'guest',
        isLoadingAuth: false
      });

    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ isLoadingAuth: false });
    }
  },

  login: async (credentials: any) => {
    set({ isLoadingAuth: true });
    try {
      const response = await apiService.login(credentials);
      if (response.success && response.data) {
        const { token, user: userData } = response.data;
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(userData));
        apiService.setAuthToken(token);

        set({
          user: {
            ...userData,
            authMethod: 'traditional',
            permissions: ROLE_PERMISSIONS[userData.role] || []
          },
          userRole: userData.role,
          permissions: ROLE_PERMISSIONS[userData.role] || [],
          isAuthenticated: true,
          authMethod: 'traditional',
          isLoadingAuth: false
        });
        showSuccess(`Welcome back, ${userData.firstName || userData.name}!`);
        return userData;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      handleError(error, { context: 'Login' });
      set({ isLoadingAuth: false });
      throw error;
    }
  },

  logout: async () => {
    const { authMethod, disconnect } = get();
    try {
      try { await apiService.logout(); } catch (e) { console.warn(e); }

      if (authMethod === 'wallet') {
        disconnect();
      }

      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      apiService.setAuthToken(null);

      const guestUser = {
        id: 'guest',
        role: 'guest',
        name: 'Guest User',
        authMethod: 'guest',
        permissions: ROLE_PERMISSIONS.guest || [],
        verified: false
      };

      set({
        user: guestUser,
        userRole: 'guest',
        permissions: ROLE_PERMISSIONS.guest || [],
        isAuthenticated: false,
        authMethod: 'guest',
        isLoadingAuth: false
      });
      showSuccess('Logged out successfully');
    } catch (error) {
      handleError(error, { context: 'Logout' });
    }
  },

  register: async (registrationData: any) => {
    set({ isLoadingAuth: true });
    try {
      const response = await apiService.register(registrationData);
      set({ isLoadingAuth: false });
      if (response.success && response.data) {
        showSuccess('Registration successful! Please check your email.');
        return response.data;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      set({ isLoadingAuth: false });
      handleError(error, { context: 'Registration' });
      throw error;
    }
  },

  updateProfile: async (updates: any) => {
    set({ isLoadingAuth: true });
    try {
      const response = await apiService.updateProfile(updates);
      if (response.success && response.data) {
        const updatedUser = response.data;
        const { user } = get();
        const newUser = { ...user, ...updatedUser, permissions: ROLE_PERMISSIONS[updatedUser.role] || user.permissions };

        if (get().authMethod === 'traditional') {
          localStorage.setItem('userData', JSON.stringify(updatedUser));
        }

        set({
          user: newUser,
          userRole: updatedUser.role, // Ensure role stays synced
          permissions: newUser.permissions,
          isLoadingAuth: false
        });
        showSuccess('Profile updated successfully');
        return updatedUser;
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error) {
      set({ isLoadingAuth: false });
      handleError(error, { context: 'Profile Update' });
      throw error;
    }
  },

  // Access Control Implementation
  hasRole: (requiredRole: string) => {
    const { userRole, roleHierarchy } = get()
    if (!userRole) return false

    // Check hierarchy: current role value >= required role value
    // This allows higher privilged roles to access lower level features
    const currentLevel = roleHierarchy[userRole.toLowerCase()] || 0
    const requiredLevel = roleHierarchy[requiredRole.toLowerCase()] || 0

    return currentLevel >= requiredLevel
  },

  hasPermission: (permission: string) => {
    const { permissions } = get()
    // 'manage:all' is a super-admin permission that grants everything
    return permissions.includes(permission) || permissions.includes('manage:all')
  },

  can: (action: string) => {
    return get().hasPermission(action)
  },
}))

// No top-level initialization; should be called within a useEffect for Next.js App Router
