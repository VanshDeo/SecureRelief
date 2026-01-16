import { useCallback } from 'react';
import { useWeb3Store } from '../store/web3Store';
import toast from 'react-hot-toast';

/**
 * useContract Hook
 * Provides easy access to contract functions and state management
 */
export const useContract = () => {
  const {
    contractService,
    isConnected,
    account,
    userRole,
    balance,
    usdcBalance,
    disasterZones,
    vendors,
    vouchers,
    createDisasterZone,
    registerVendor,
    verifyVendor,
    issueVoucher,
    redeemVoucher,
    useFaucet,
    transferUSDC,
    updateBalance,
    refreshDisasterZones,
    refreshVouchers,
    refreshVendors,
  } = useWeb3Store();

  // ==============================================
  // DISASTER ZONE OPERATIONS
  // ==============================================

  const handleCreateDisasterZone = useCallback(async (zoneData) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return { success: false };
    }

    if (userRole !== 'admin') {
      toast.error('Only admins can create disaster zones');
      return { success: false };
    }

    try {
      const result = await createDisasterZone(
        zoneData.name,
        zoneData.latitude,
        zoneData.longitude,
        zoneData.radiusKm,
        zoneData.initialFundingUSDC
      );

      if (result.success) {
        await refreshDisasterZones();
      }

      return result;
    } catch (error) {
      const message = error?.shortMessage || error?.message || 'Unknown error';
      console.error('Create disaster zone failed:', message);
      toast.error(message);
      return { success: false, error: message };
    }
  }, [isConnected, userRole, createDisasterZone, refreshDisasterZones]);

  const handleGetDisasterZone = useCallback(async (zoneId) => {
    if (!contractService) {
      throw new Error('Contract service not available');
    }

    return await contractService.getDisasterZone(zoneId);
  }, [contractService]);

  const handleGetDisasterZoneStats = useCallback(async (zoneId) => {
    if (!contractService) {
      throw new Error('Contract service not available');
    }

    return await contractService.getDisasterZoneStats(zoneId);
  }, [contractService]);

  const handleAddFunding = useCallback(async (zoneId, amountUSDC) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return { success: false };
    }

    if (!contractService) {
      throw new Error('Contract service not available');
    }

    try {
      const result = await contractService.addFunding(zoneId, amountUSDC);

      if (result.success) {
        await updateBalance();
        await refreshDisasterZones();
      }

      return result;
    } catch (error) {
      const message = error?.shortMessage || error?.message || 'Unknown error';
      console.error('Add funding failed:', message);
      toast.error(message);
      return { success: false, error: message };
    }
  }, [isConnected, contractService, updateBalance, refreshDisasterZones]);

  // ==============================================
  // VENDOR OPERATIONS
  // ==============================================

  const handleRegisterVendor = useCallback(async (vendorData) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return { success: false };
    }

    if (userRole !== 'admin') {
      toast.error('Only admins can register vendors');
      return { success: false };
    }

    try {
      const result = await registerVendor(
        vendorData.vendorAddress,
        vendorData.name,
        vendorData.location,
        vendorData.zoneId,
        vendorData.ipfsKycHash
      );

      if (result.success) {
        await refreshVendors(vendorData.zoneId);
      }

      return result;
    } catch (error) {
      const message = error?.shortMessage || error?.message || 'Unknown error';
      console.error('Register vendor failed:', message);
      toast.error(message);
      return { success: false, error: message };
    }
  }, [isConnected, userRole, registerVendor, refreshVendors]);

  const handleVerifyVendor = useCallback(async (vendorAddress, zoneId) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return { success: false };
    }

    if (userRole !== 'admin') {
      toast.error('Only admins can verify vendors');
      return { success: false };
    }

    try {
      const result = await verifyVendor(vendorAddress, zoneId);

      if (result.success) {
        await refreshVendors(zoneId);
      }

      return result;
    } catch (error) {
      const message = error?.shortMessage || error?.message || 'Unknown error';
      console.error('Verify vendor failed:', message);
      toast.error(message);
      return { success: false, error: message };
    }
  }, [isConnected, userRole, verifyVendor, refreshVendors]);

  const handleGetVendor = useCallback(async (vendorAddress) => {
    if (!contractService) {
      throw new Error('Contract service not available');
    }

    return await contractService.getVendor(vendorAddress);
  }, [contractService]);

  const handleGetZoneVendors = useCallback(async (zoneId) => {
    if (!contractService) {
      throw new Error('Contract service not available');
    }

    return await contractService.getZoneVendors(zoneId);
  }, [contractService]);

  // ==============================================
  // VOUCHER OPERATIONS
  // ==============================================

  const handleIssueVoucher = useCallback(async (voucherData) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return { success: false };
    }

    if (userRole !== 'admin') {
      toast.error('Only admins can issue vouchers');
      return { success: false };
    }

    try {
      const result = await issueVoucher(
        voucherData.beneficiaryAddress,
        voucherData.amountUSDC,
        voucherData.zoneId,
        voucherData.categories,
        voucherData.expiryDays
      );

      if (result.success) {
        await refreshVouchers();
      }

      return result;
    } catch (error) {
      const message = error?.shortMessage || error?.message || 'Unknown error';
      console.error('Issue voucher failed:', message);
      toast.error(message);
      return { success: false, error: message };
    }
  }, [isConnected, userRole, issueVoucher, refreshVouchers]);

  const handleRedeemVoucher = useCallback(async (voucherData) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return { success: false };
    }

    if (userRole !== 'vendor') {
      toast.error('Only verified vendors can redeem vouchers');
      return { success: false };
    }

    try {
      const result = await redeemVoucher(
        voucherData.voucherId,
        voucherData.amountUSDC,
        voucherData.category,
        voucherData.ipfsHash
      );

      if (result.success) {
        await refreshVouchers();
        await updateBalance();
      }

      return result;
    } catch (error) {
      const message = error?.shortMessage || error?.message || 'Unknown error';
      console.error('Redeem voucher failed:', message);
      toast.error(message);
      return { success: false, error: message };
    }
  }, [isConnected, userRole, redeemVoucher, refreshVouchers, updateBalance]);

  const handleGetVoucher = useCallback(async (voucherId) => {
    if (!contractService) {
      throw new Error('Contract service not available');
    }

    return await contractService.getVoucher(voucherId);
  }, [contractService]);

  const handleGetUserVouchers = useCallback(async (userAddress = account) => {
    if (!contractService || !userAddress) {
      return [];
    }

    return await contractService.getUserVouchers(userAddress);
  }, [contractService, account]);

  // ==============================================
  // USDC OPERATIONS
  // ==============================================

  const handleGetUSDCBalance = useCallback(async (address = account) => {
    if (!contractService || !address) {
      return '0';
    }

    return await contractService.getUSDCBalance(address);
  }, [contractService, account]);

  const handleUseFaucet = useCallback(async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return { success: false };
    }

    try {
      const result = await useFaucet();
      return result;
    } catch (error) {
      const message = error?.shortMessage || error?.message || 'Unknown error';
      console.error('Use faucet failed:', message);
      toast.error(message);
      return { success: false, error: message };
    }
  }, [isConnected, useFaucet]);

  const handleTransferUSDC = useCallback(async (to, amountUSDC) => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return { success: false };
    }

    try {
      const result = await transferUSDC(to, amountUSDC);
      return result;
    } catch (error) {
      const message = error?.shortMessage || error?.message || 'Unknown error';
      console.error('Transfer USDC failed:', message);
      toast.error(message);
      return { success: false, error: message };
    }
  }, [isConnected, transferUSDC]);

  // ==============================================
  // UTILITY FUNCTIONS
  // ==============================================

  const handleRefreshData = useCallback(async () => {
    try {
      await Promise.all([
        updateBalance(),
        refreshDisasterZones(),
        refreshVouchers(),
      ]);
    } catch (error) {
      console.error('Refresh data failed:', error);
    }
  }, [updateBalance, refreshDisasterZones, refreshVouchers]);

  const isAuthorized = useCallback((requiredRole) => {
    if (!isConnected || !userRole) return false;

    const roleHierarchy = {
      admin: 4,
      vendor: 3,
      victim: 2,
      donor: 1
    };

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }, [isConnected, userRole]);

  // ==============================================
  // RETURN HOOK INTERFACE
  // ==============================================

  return {
    // State
    isConnected,
    account,
    userRole,
    balance,
    usdcBalance,
    disasterZones,
    vendors,
    vouchers,
    contractService,

    // Disaster Zone Operations
    createDisasterZone: handleCreateDisasterZone,
    getDisasterZone: handleGetDisasterZone,
    getDisasterZoneStats: handleGetDisasterZoneStats,
    addFunding: handleAddFunding,

    // Vendor Operations
    registerVendor: handleRegisterVendor,
    verifyVendor: handleVerifyVendor,
    getVendor: handleGetVendor,
    getZoneVendors: handleGetZoneVendors,

    // Voucher Operations
    issueVoucher: handleIssueVoucher,
    redeemVoucher: handleRedeemVoucher,
    getVoucher: handleGetVoucher,
    getUserVouchers: handleGetUserVouchers,

    // USDC Operations
    getUSDCBalance: handleGetUSDCBalance,
    useFaucet: handleUseFaucet,
    transferUSDC: handleTransferUSDC,

    // Utility Functions
    refreshData: handleRefreshData,
    isAuthorized,
  };
};

export default useContract;
