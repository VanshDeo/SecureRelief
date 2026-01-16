import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import AVAXDisasterReliefService, {
    validateAVAXAmount,
    calculateMaturityDate,
    calculateEstimatedYield,
    formatAVAX
} from '../../services/avaxService';

const AVAXBondCreator = ({ contractAddress, signer, onBondCreated }) => {
    const [formData, setFormData] = useState({
        avaxAmount: '',
        maturityMonths: 12,
        donorType: 'Individual'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [gasEstimate, setGasEstimate] = useState(null);
    const [userBalance, setUserBalance] = useState('0');
    const [avaxService, setAvaxService] = useState<AVAXDisasterReliefService | null>(null);

    // Initialize AVAX service
    useEffect(() => {
        if (contractAddress && signer) {
            const service = new AVAXDisasterReliefService(contractAddress, signer.provider);
            service.init(signer).then(() => {
                setAvaxService(service);
            });
        }
    }, [contractAddress, signer]);

    // Get user's AVAX balance
    useEffect(() => {
        const getUserBalance = async () => {
            if (signer) {
                try {
                    const address = await signer.getAddress();
                    const balance = await signer.provider.getBalance(address);
                    setUserBalance(ethers.formatEther(balance));
                } catch (error) {
                    console.error('Failed to get balance:', error);
                }
            }
        };

        getUserBalance();

        // Update balance every 10 seconds
        const interval = setInterval(getUserBalance, 10000);
        return () => clearInterval(interval);
    }, [signer]);

    // Estimate gas when amount changes
    useEffect(() => {
        const estimateGas = async () => {
            if (avaxService && formData.avaxAmount && parseFloat(formData.avaxAmount) > 0) {
                try {
                    const estimate = await avaxService.estimateGas('bond', parseFloat(formData.avaxAmount));
                    setGasEstimate(estimate);
                } catch (error) {
                    console.error('Gas estimation failed:', error);
                    setGasEstimate(null);
                }
            } else {
                setGasEstimate(null);
            }
        };

        const debounceTimer = setTimeout(estimateGas, 500);
        return () => clearTimeout(debounceTimer);
    }, [formData.avaxAmount, avaxService]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!avaxService) {
            setError('Service not initialized. Please try again.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Validate amount
            const validation = validateAVAXAmount(formData.avaxAmount, 'bond');
            if (!validation.valid) {
                setError(validation.error);
                setLoading(false);
                return;
            }

            // Check user balance
            const hasBalance = await avaxService.checkAVAXBalance(
                formData.avaxAmount,
                await signer.getAddress()
            );

            if (!hasBalance) {
                setError('Insufficient AVAX balance (including gas fees)');
                setLoading(false);
                return;
            }

            // Create AVAX bond
            const result = await avaxService.createAVAXBond(
                parseFloat(formData.avaxAmount),
                parseInt(formData.maturityMonths as any) as any,
                formData.donorType
            );

            setSuccess(
                `AVAX Bond created successfully! ` +
                `Bond ID: ${result.bondId}, ` +
                `Transaction: ${result.transactionHash.slice(0, 10)}...`
            );

            // Reset form
            setFormData({
                avaxAmount: '',
                maturityMonths: 12,
                donorType: 'Individual'
            });

            // Notify parent component
            if (onBondCreated) {
                onBondCreated(result);
            }

        } catch (error) {
            console.error('Bond creation failed:', error);
            setError(error.message || 'Failed to create AVAX bond');
        } finally {
            setLoading(false);
        }
    };

    const estimatedYield = formData.avaxAmount ?
        calculateEstimatedYield(formData.avaxAmount, parseInt(formData.maturityMonths as any)) : '0';

    const maturityDate = calculateMaturityDate(parseInt(formData.maturityMonths as any) as any);

    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                    🚀 Create AVAX Bond
                </h3>
                <p className="text-sm text-gray-600">
                    Use your AVAX tokens to create disaster relief bonds that earn yield
                </p>
            </div>

            {/* User Balance Display */}
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Your AVAX Balance:</span>
                    <span className="text-lg font-bold text-blue-600">
                        {formatAVAX(userBalance)} AVAX
                    </span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* AVAX Amount Input */}
                <div>
                    <label htmlFor="avaxAmount" className="block text-sm font-medium text-gray-700 mb-1">
                        AVAX Amount
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            id="avaxAmount"
                            name="avaxAmount"
                            value={formData.avaxAmount}
                            onChange={handleInputChange}
                            placeholder="0.1"
                            min="0.1"
                            max="1000"
                            step="0.1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        />
                        <span className="absolute right-3 top-2 text-gray-500 text-sm">AVAX</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Minimum: 0.1 AVAX (~$3)</p>
                </div>

                {/* Maturity Period */}
                <div>
                    <label htmlFor="maturityMonths" className="block text-sm font-medium text-gray-700 mb-1">
                        Maturity Period
                    </label>
                    <select
                        id="maturityMonths"
                        name="maturityMonths"
                        value={formData.maturityMonths}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    >
                        <option value={6}>6 months</option>
                        <option value={12}>12 months</option>
                        <option value={18}>18 months</option>
                        <option value={24}>24 months</option>
                        <option value={36}>36 months</option>
                        <option value={48}>48 months</option>
                        <option value={60}>60 months</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                        Maturity Date: {maturityDate.toLocaleDateString()}
                    </p>
                </div>

                {/* Donor Type */}
                <div>
                    <label htmlFor="donorType" className="block text-sm font-medium text-gray-700 mb-1">
                        Donor Type
                    </label>
                    <select
                        id="donorType"
                        name="donorType"
                        value={formData.donorType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    >
                        <option value="Individual">Individual</option>
                        <option value="Corporate">Corporate</option>
                        <option value="ESG Fund">ESG Fund</option>
                        <option value="Foundation">Foundation</option>
                        <option value="Government">Government</option>
                    </select>
                </div>

                {/* Bond Preview */}
                {formData.avaxAmount && (
                    <div className="bg-green-50 p-3 rounded-lg space-y-2">
                        <h4 className="font-medium text-green-800">Bond Preview</h4>
                        <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                                <span>Principal:</span>
                                <span className="font-medium">{formData.avaxAmount} AVAX</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Estimated Yield (4.2% APY):</span>
                                <span className="font-medium text-green-600">+{estimatedYield} AVAX</span>
                            </div>
                            <div className="flex justify-between border-t pt-1">
                                <span>Estimated Total:</span>
                                <span className="font-bold text-green-700">
                                    {formatAVAX(parseFloat(formData.avaxAmount) + parseFloat(estimatedYield))} AVAX
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Gas Estimate */}
                {gasEstimate && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="font-medium text-gray-700 text-sm">Transaction Cost</h4>
                        <div className="text-xs space-y-1 mt-1">
                            <div className="flex justify-between">
                                <span>Gas Fee:</span>
                                <span>{gasEstimate.gasCostAVAX} AVAX</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Total Cost:</span>
                                <span className="font-medium">{gasEstimate.totalCostAVAX} AVAX</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                        {success}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading || !formData.avaxAmount || parseFloat(formData.avaxAmount) < 0.1}
                    className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${loading || !formData.avaxAmount || parseFloat(formData.avaxAmount) < 0.1
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating Bond...
                        </span>
                    ) : (
                        `Create AVAX Bond (${formData.avaxAmount || '0'} AVAX)`
                    )}
                </button>
            </form>

            {/* Info Section */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Why AVAX Bonds?</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Higher yield: 4.2% APY vs 3.2% for USDC</li>
                    <li>• Lower minimum: 0.1 AVAX vs 100 USDC</li>
                    <li>• Native Avalanche token - lower fees</li>
                    <li>• Immediate disaster relief availability</li>
                    <li>• Transparent yield generation</li>
                </ul>
            </div>
        </div>
    );
};

export default AVAXBondCreator;
