/**
 * AVAX Integration Utility for Disaster Relief Platform
 * Handles native AVAX token operations with the smart contract
 */

import { ethers } from 'ethers';

// Contract ABI for AVAX-specific functions
const AVAX_FUNCTIONS_ABI = [
    // AVAX Bond Creation
    "function issueAVAXBond(uint256 maturityMonths, string memory donorType) external payable returns (uint256 bondId)",

    // Direct AVAX Donation
    "function donateAVAX() external payable",

    // AVAX Yield Generation
    "function generateAVAXYield() external",

    // AVAX Emergency Payouts
    "function executeBulkAVAXPayout(bytes32 eventId, address[] memory beneficiaries, uint256[] memory amounts, uint8[] memory methods) external",

    // AVAX Pool Information
    "function getPoolBalances() external view returns (uint256 avaxBalance, uint256 usdcBalance, uint256 avaxYield, uint256 usdcYield)",

    // Enhanced Impact Metrics
    "function getImpactMetrics() external view returns (uint256 totalBonds, uint256 totalAVAXValue, uint256 totalUSDCValue, uint256 totalAVAXYield, uint256 totalUSDCYield, uint256 totalAVAXRelief, uint256 totalUSDCRelief, uint256 disastersHelped, uint256 avgResponseTimeSec, uint256 currentAPYBasisPoints, uint256 activeBondCount)",

    // Bond Information with Token Types
    "function getDonorBonds(address donor) external view returns (uint256[] memory bondIds, uint256[] memory principalAmounts, uint256[] memory currentValues, uint256[] memory yieldEarned, uint256[] memory maturityTimes, bool[] memory activeStatus, uint8[] memory tokenTypes)",

    // Redeem Bonds (works for both AVAX and USDC)
    "function redeemBond(uint256 bondId) external",

    // Emergency Withdraw (works for both AVAX and USDC)
    "function emergencyWithdraw(uint256 bondId) external"
];

// Token Types
export const TOKEN_TYPES = {
    AVAX: 0,
    USDC: 1
};

// Payment Methods
export const PAYMENT_METHODS = {
    CRYPTO: 0,
    BANK_TRANSFER: 1,
    MOBILE_MONEY: 2,
    CUSTODIAL: 3
};

class AVAXDisasterReliefService {
    contractAddress: string;
    provider: any;
    contract: any;

    constructor(contractAddress: string, provider: any) {
        this.contractAddress = contractAddress;
        this.provider = provider;
        this.contract = null;
    }

    // Initialize contract with signer
    async init(signer: any) {
        this.contract = new ethers.Contract(
            this.contractAddress,
            AVAX_FUNCTIONS_ABI,
            signer
        );
    }

    // =========================================================================
    // AVAX BOND OPERATIONS
    // =========================================================================

    /**
     * Create an AVAX bond using native tokens from wallet
     * @param avaxAmount - Amount of AVAX to bond
     * @param maturityMonths - Bond maturity (6-60 months)
     * @param donorType - Type of donor (Individual, Corporate, ESG)
     * @returns Transaction result with bond ID
     */
    async createAVAXBond(avaxAmount: number, maturityMonths: number, donorType: string = "Individual"): Promise<any> {
        try {
            if (!this.contract) throw new Error("Contract not initialized");

            const avaxValue = ethers.parseEther(avaxAmount.toString());

            // Validate inputs
            if (avaxAmount < 0.1) {
                throw new Error("Minimum AVAX bond amount is 0.1 AVAX");
            }

            if (maturityMonths < 6 || maturityMonths > 60) {
                throw new Error("Maturity must be between 6-60 months");
            }

            const tx = await this.contract.issueAVAXBond(maturityMonths, donorType, {
                value: avaxValue
            });

            const receipt = await tx.wait();

            return {
                success: true,
                transactionHash: receipt.hash,
                avaxAmount: avaxAmount.toString(),
                maturityMonths: maturityMonths.toString(),
                donorType
            };

        } catch (error: any) {
            console.error("AVAX bond creation failed:", error);
            throw new Error(`Failed to create AVAX bond: ${error.message}`);
        }
    }

    /**
     * Make a direct AVAX donation (no bond, immediate availability)
     * @param avaxAmount - Amount of AVAX to donate
     * @returns Transaction result
     */
    async donateAVAX(avaxAmount: number): Promise<any> {
        try {
            if (!this.contract) throw new Error("Contract not initialized");

            const avaxValue = ethers.parseEther(avaxAmount.toString());

            if (avaxAmount <= 0) {
                throw new Error("Donation amount must be greater than 0");
            }

            const tx = await this.contract.donateAVAX({
                value: avaxValue
            });

            const receipt = await tx.wait();

            return {
                success: true,
                transactionHash: receipt.hash,
                avaxAmount: avaxAmount.toString(),
                type: 'donation'
            };

        } catch (error: any) {
            console.error("AVAX donation failed:", error);
            throw new Error(`Failed to donate AVAX: ${error.message}`);
        }
    }

    // =========================================================================
    // BOND MANAGEMENT
    // =========================================================================

    /**
     * Get all bonds for a specific donor with token type information
     * @param donorAddress - Address of the bond holder
     * @returns Array of bond objects with token types
     */
    async getDonorBonds(donorAddress: string): Promise<any[]> {
        try {
            if (!this.contract) throw new Error("Contract not initialized");

            const result = await this.contract.getDonorBonds(donorAddress);

            const bonds = [];
            for (let i = 0; i < result.bondIds.length; i++) {
                const tokenType = result.tokenTypes[i];
                const isAVAX = tokenType === TOKEN_TYPES.AVAX;

                bonds.push({
                    bondId: result.bondIds[i].toString(),
                    principalAmount: isAVAX
                        ? ethers.formatEther(result.principalAmounts[i])
                        : ethers.formatUnits(result.principalAmounts[i], 6),
                    currentValue: isAVAX
                        ? ethers.formatEther(result.currentValues[i])
                        : ethers.formatUnits(result.currentValues[i], 6),
                    yieldEarned: isAVAX
                        ? ethers.formatEther(result.yieldEarned[i])
                        : ethers.formatUnits(result.yieldEarned[i], 6),
                    maturityTime: new Date(Number(result.maturityTimes[i]) * 1000),
                    isActive: result.activeStatus[i],
                    tokenType: isAVAX ? 'AVAX' : 'USDC',
                    tokenSymbol: isAVAX ? 'AVAX' : 'USDC'
                });
            }

            return bonds;

        } catch (error: any) {
            console.error("Failed to get donor bonds:", error);
            throw new Error(`Failed to retrieve bonds: ${error.message}`);
        }
    }

    /**
     * Redeem a matured bond (works for both AVAX and USDC)
     * @param bondId - ID of the bond to redeem
     * @returns Transaction result
     */
    async redeemBond(bondId: string | number): Promise<any> {
        try {
            if (!this.contract) throw new Error("Contract not initialized");

            const tx = await this.contract.redeemBond(bondId);
            const receipt = await tx.wait();

            return {
                success: true,
                transactionHash: receipt.hash,
                bondId: bondId.toString()
            };

        } catch (error: any) {
            console.error("Bond redemption failed:", error);
            throw new Error(`Failed to redeem bond: ${error.message}`);
        }
    }

    /**
     * Emergency withdraw from a bond (with penalty)
     * @param bondId - ID of the bond to withdraw from
     * @returns Transaction result
     */
    async emergencyWithdraw(bondId: string | number): Promise<any> {
        try {
            if (!this.contract) throw new Error("Contract not initialized");

            const tx = await this.contract.emergencyWithdraw(bondId);
            const receipt = await tx.wait();

            return {
                success: true,
                transactionHash: receipt.hash,
                bondId: bondId.toString(),
                note: "Emergency withdrawal completed with 50% yield penalty"
            };

        } catch (error: any) {
            console.error("Emergency withdrawal failed:", error);
            throw new Error(`Failed to emergency withdraw: ${error.message}`);
        }
    }

    // =========================================================================
    // POOL AND METRICS
    // =========================================================================

    /**
     * Get current pool balances for both AVAX and USDC
     * @returns Pool balance information
     */
    async getPoolBalances(): Promise<any> {
        try {
            if (!this.contract) throw new Error("Contract not initialized");

            const result = await this.contract.getPoolBalances();

            return {
                avax: {
                    balance: ethers.formatEther(result.avaxBalance),
                    yieldReserve: ethers.formatEther(result.avaxYield)
                },
                usdc: {
                    balance: ethers.formatUnits(result.usdcBalance, 6),
                    yieldReserve: ethers.formatUnits(result.usdcYield, 6)
                },
                totalValue: {
                    avax: ethers.formatEther(result.avaxBalance + result.avaxYield),
                    usdc: ethers.formatUnits(result.usdcBalance + result.usdcYield, 6)
                }
            };

        } catch (error: any) {
            console.error("Failed to get pool balances:", error);
            throw new Error(`Failed to get pool balances: ${error.message}`);
        }
    }

    /**
     * Get comprehensive impact metrics for both tokens
     * @returns Impact metrics
     */
    async getImpactMetrics(): Promise<any> {
        try {
            if (!this.contract) throw new Error("Contract not initialized");

            const result = await this.contract.getImpactMetrics();

            return {
                totalBonds: result.totalBonds.toString(),
                avax: {
                    totalValue: ethers.formatEther(result.totalAVAXValue),
                    totalYield: ethers.formatEther(result.totalAVAXYield),
                    totalRelief: ethers.formatEther(result.totalAVAXRelief)
                },
                usdc: {
                    totalValue: ethers.formatUnits(result.totalUSDCValue, 6),
                    totalYield: ethers.formatUnits(result.totalUSDCYield, 6),
                    totalRelief: ethers.formatUnits(result.totalUSDCRelief, 6)
                },
                disastersHelped: result.disastersHelped.toString(),
                averageResponseTime: result.avgResponseTimeSec.toString() + " seconds",
                currentAPY: (Number(result.currentAPYBasisPoints) / 100).toFixed(2) + "%",
                activeBonds: result.activeBondCount.toString()
            };

        } catch (error: any) {
            console.error("Failed to get impact metrics:", error);
            throw new Error(`Failed to get impact metrics: ${error.message}`);
        }
    }

    // =========================================================================
    // YIELD OPERATIONS
    // =========================================================================

    /**
     * Generate yield on AVAX holdings (Treasury function)
     * @returns Transaction result
     */
    async generateAVAXYield(): Promise<any> {
        try {
            if (!this.contract) throw new Error("Contract not initialized");

            const tx = await this.contract.generateAVAXYield();
            const receipt = await tx.wait();

            return {
                success: true,
                transactionHash: receipt.hash,
                type: 'yield_generation'
            };

        } catch (error: any) {
            console.error("AVAX yield generation failed:", error);
            throw new Error(`Failed to generate AVAX yield: ${error.message}`);
        }
    }

    // =========================================================================
    // UTILITY FUNCTIONS
    // =========================================================================

    /**
     * Check if user has sufficient AVAX balance for operation
     * @param requiredAVAX - Required AVAX amount
     * @param userAddress - User's wallet address
     * @returns Whether user has sufficient balance
     */
    async checkAVAXBalance(requiredAVAX: number | string, userAddress: string): Promise<boolean> {
        try {
            const balance = await this.provider.getBalance(userAddress);
            const balanceInAVAX = parseFloat(ethers.formatEther(balance));
            const required = parseFloat(requiredAVAX.toString());

            // Keep 0.01 AVAX for gas fees
            return balanceInAVAX >= (required + 0.01);

        } catch (error) {
            console.error("Failed to check AVAX balance:", error);
            return false;
        }
    }

    /**
     * Estimate gas cost for AVAX operations
     * @param operation - Operation type (bond, donation, etc.)
     * @param avaxAmount - AVAX amount for the operation
     * @returns Gas estimation
     */
    async estimateGas(operation: string, avaxAmount: number = 0): Promise<any> {
        try {
            if (!this.contract) throw new Error("Contract not initialized");

            let gasEstimate;
            const avaxValue = avaxAmount > 0 ? ethers.parseEther(avaxAmount.toString()) : BigInt(0);

            switch (operation) {
                case 'bond':
                    gasEstimate = await this.contract.issueAVAXBond.estimateGas(12, "Individual", {
                        value: avaxValue
                    });
                    break;
                case 'donation':
                    gasEstimate = await this.contract.donateAVAX.estimateGas({
                        value: avaxValue
                    });
                    break;
                default:
                    throw new Error("Unknown operation type");
            }

            const feeData = await this.provider.getFeeData();
            const gasPrice = feeData.gasPrice;
            const gasCost = BigInt(gasEstimate) * (gasPrice || 0n);

            return {
                gasLimit: gasEstimate.toString(),
                gasPrice: ethers.formatUnits(gasPrice || 0n, 'gwei') + " gwei",
                gasCostAVAX: ethers.formatEther(gasCost),
                totalCostAVAX: ethers.formatEther(gasCost + BigInt(avaxValue.toString()))
            };

        } catch (error) {
            console.error("Gas estimation failed:", error);
            return {
                gasLimit: "200000", // Conservative estimate
                gasPrice: "25 gwei",
                gasCostAVAX: "0.005",
                totalCostAVAX: (0.005 + avaxAmount).toString()
            };
        }
    }
}

// Export utility functions and classes
export default AVAXDisasterReliefService;

// Helper function to format AVAX amounts
export const formatAVAX = (amount: string | number, decimals: number = 4): string => {
    return parseFloat(amount.toString()).toFixed(decimals);
};

// Helper function to validate AVAX amount
export const validateAVAXAmount = (amount: string | number, operation: string = 'bond'): { valid: boolean; error?: string } => {
    const numAmount = parseFloat(amount.toString());

    if (isNaN(numAmount) || numAmount <= 0) {
        return { valid: false, error: "Amount must be a positive number" };
    }

    if (operation === 'bond' && numAmount < 0.1) {
        return { valid: false, error: "Minimum bond amount is 0.1 AVAX" };
    }

    if (numAmount > 1000) {
        return { valid: false, error: "Maximum amount is 1000 AVAX per transaction" };
    }

    return { valid: true };
};

// Helper function to calculate bond maturity date
export const calculateMaturityDate = (months: number): Date => {
    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + months);
    return maturityDate;
};

// Helper function to calculate estimated yield
export const calculateEstimatedYield = (avaxAmount: string | number, months: number, apyPercent: number = 4.2): string => {
    const yearlyYield = (parseFloat(avaxAmount.toString()) * apyPercent) / 100;
    const periodYield = (yearlyYield * months) / 12;
    return periodYield.toFixed(4);
};
