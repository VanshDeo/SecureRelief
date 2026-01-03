'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Wallet,
    User,
    Shield,
    Eye,
    EyeOff,
    AlertCircle,
    CheckCircle,
    Mail,
    Lock,
    Mountain,
    ArrowRight,
    UserPlus,
    Building,
    Heart
} from 'lucide-react';
import Button from '@/components/UI/Button';
import { useWeb3Store } from '@/store/web3Store';
import { useAuth } from '@/contexts/AuthContext';
import { showSuccess, handleError } from '@/utils/errorHandler';

const Register = () => {
    const router = useRouter();
    const { connectWallet, isConnected, account } = useWeb3Store();
    const { register, isAuthenticated } = useAuth();

    const [authMode, setAuthMode] = useState('traditional'); // 'wallet', 'traditional'
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'donor',
        organization: '',
        phone: '',
        terms: false
    });
    const [errors, setErrors] = useState<any>({});

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated || (isConnected && account)) {
            router.push('/');
        }
    }, [isConnected, account, isAuthenticated, router]);

    const handleWalletRegister = async () => {
        setIsLoading(true);
        try {
            await connectWallet();
            showSuccess('Wallet connected! Please complete your profile.');
            router.push('/profile-setup'); // Redirect to profile completion
        } catch (error) {
            handleError(error, {
                context: 'Wallet Registration',
                onAction: () => handleWalletRegister()
            });
        } finally {
            setIsLoading(false);
        }
    };

    const validateStep1 = () => {
        const newErrors: any = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors: any = {};
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!formData.terms) newErrors.terms = 'You must accept the terms and conditions';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (currentStep === 1 && validateStep1()) {
            setCurrentStep(2);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            setErrors({});
        }
    };

    const handleTraditionalRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep2()) return;

        setIsLoading(true);
        try {
            await register(formData);
            showSuccess('Account created successfully! Please check your email to verify your account.');
            router.push('/login');
        } catch (error) {
            handleError(error, { context: 'Registration' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = (e.target as any);
        const val = type === 'checkbox' ? (e.target as any).checked : value;
        setFormData(prev => ({
            ...prev,
            [name]: val
        }));
        if (errors[name]) {
            setErrors((prev: any) => ({ ...prev, [name]: '' }));
        }
    };

    const roleOptions = [
        {
            value: 'donor',
            label: 'Donor',
            description: 'Make donations and track impact',
            icon: Heart,
            requirements: 'Open to individuals and organizations'
        },
        {
            value: 'vendor',
            label: 'Vendor',
            description: 'Provide goods/services for disaster relief',
            icon: Building,
            requirements: 'Requires business verification'
        },
        {
            value: 'victim',
            label: 'Relief Recipient',
            description: 'Access aid and relief resources',
            icon: User,
            requirements: 'Identity verification required'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8"
                >
                    <div className="flex items-center justify-center mb-4">
                        <Mountain className="w-12 h-12 text-green-500 mr-2" />
                        <h1 className="text-2xl font-bold text-gray-900">Relief Network</h1>
                    </div>
                    <p className="text-gray-600">
                        Join the Avalanche Disaster Relief Network
                    </p>
                </motion.div>

                {/* Progress Indicator */}
                {authMode === 'traditional' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="mb-6"
                    >
                        <div className="flex items-center justify-center space-x-4">
                            <div className={`flex items-center ${currentStep >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 1 ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300'
                                    }`}>
                                    {currentStep > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
                                </div>
                                <span className="ml-2 text-sm font-medium">Profile</span>
                            </div>
                            <div className={`w-8 h-0.5 ${currentStep > 1 ? 'bg-green-600' : 'bg-gray-300'}`} />
                            <div className={`flex items-center ${currentStep >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= 2 ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300'
                                    }`}>
                                    2
                                </div>
                                <span className="ml-2 text-sm font-medium">Security</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Auth Mode Toggle */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-gray-100 p-1 rounded-lg mb-6"
                >
                    <div className="grid grid-cols-2 gap-1">
                        <button
                            onClick={() => setAuthMode('traditional')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${authMode === 'traditional'
                                ? 'bg-white text-green-700 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <UserPlus className="w-4 h-4 inline mr-2" />
                            Email Signup
                        </button>
                        <button
                            onClick={() => setAuthMode('wallet')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${authMode === 'wallet'
                                ? 'bg-white text-green-700 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Wallet className="w-4 h-4 inline mr-2" />
                            Web3 Wallet
                        </button>
                    </div>
                </motion.div>

                {/* Registration Forms */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-white rounded-xl shadow-lg p-6"
                >
                    <AnimatePresence mode="wait">
                        {authMode === 'wallet' ? (
                            /* Wallet Registration */
                            <motion.div
                                key="wallet"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="text-center">
                                    <Shield className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                        Web3 Registration
                                    </h2>
                                    <p className="text-gray-600 mb-6">
                                        Connect your wallet to create an account. You'll need to complete your profile after connection.
                                    </p>

                                    <Button
                                        onClick={handleWalletRegister}
                                        loading={isLoading}
                                        className="w-full mb-4"
                                    >
                                        <Wallet className="w-4 h-4 mr-2" />
                                        Connect Wallet & Register
                                    </Button>

                                    <div className="text-xs text-gray-500">
                                        <p>Supported wallets: MetaMask, Core Wallet</p>
                                        <p>Network: Avalanche Fuji Testnet</p>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            /* Traditional Registration */
                            <motion.div
                                key="traditional"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                    Create Account
                                </h2>

                                <form onSubmit={handleTraditionalRegister} className="space-y-4">
                                    {currentStep === 1 && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-4"
                                        >
                                            {/* Name Fields */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        First Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="firstName"
                                                        value={formData.firstName}
                                                        onChange={handleInputChange}
                                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                        placeholder="First name"
                                                    />
                                                    {errors.firstName && (
                                                        <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Last Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="lastName"
                                                        value={formData.lastName}
                                                        onChange={handleInputChange}
                                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                        placeholder="Last name"
                                                    />
                                                    {errors.lastName && (
                                                        <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Email Field */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Email Address
                                                </label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                        placeholder="Enter your email"
                                                    />
                                                </div>
                                                {errors.email && (
                                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                                        <AlertCircle className="w-4 h-4 mr-1" />
                                                        {errors.email}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Role Selection */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                                    Select Your Role
                                                </label>
                                                <div className="space-y-3">
                                                    {roleOptions.map((role) => {
                                                        const IconComponent = role.icon;
                                                        return (
                                                            <div key={role.value}>
                                                                <label className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                                                    <input
                                                                        type="radio"
                                                                        name="role"
                                                                        value={role.value}
                                                                        checked={formData.role === role.value}
                                                                        onChange={handleInputChange}
                                                                        className="mt-1 text-avalanche-600"
                                                                    />
                                                                    <div className="ml-3 flex-1">
                                                                        <div className="flex items-center">
                                                                            <IconComponent className="w-5 h-5 text-green-500 mr-2" />
                                                                            <span className="font-medium text-gray-900">{role.label}</span>
                                                                        </div>
                                                                        <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                                                                        <p className="text-xs text-gray-500 mt-1">{role.requirements}</p>
                                                                    </div>
                                                                </label>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Organization (for vendors) */}
                                            {formData.role === 'vendor' && (
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Organization Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="organization"
                                                        value={formData.organization}
                                                        onChange={handleInputChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                        placeholder="Your organization name"
                                                    />
                                                </div>
                                            )}

                                            <Button
                                                type="button"
                                                onClick={handleNext}
                                                className="w-full"
                                            >
                                                <ArrowRight className="w-4 h-4 mr-2" />
                                                Continue
                                            </Button>
                                        </motion.div>
                                    )}

                                    {currentStep === 2 && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-4"
                                        >
                                            {/* Password Fields */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Password
                                                </label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        name="password"
                                                        value={formData.password}
                                                        onChange={handleInputChange}
                                                        className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.password ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                        placeholder="Create a password"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                                    >
                                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                                {errors.password && (
                                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                                        <AlertCircle className="w-4 h-4 mr-1" />
                                                        {errors.password}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Confirm Password
                                                </label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                        name="confirmPassword"
                                                        value={formData.confirmPassword}
                                                        onChange={handleInputChange}
                                                        className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                        placeholder="Confirm your password"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                                    >
                                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                                {errors.confirmPassword && (
                                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                                        <AlertCircle className="w-4 h-4 mr-1" />
                                                        {errors.confirmPassword}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Phone Number */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Phone Number (Optional)
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                    placeholder="Your phone number"
                                                />
                                            </div>

                                            {/* Terms and Conditions */}
                                            <div>
                                                <label className="flex items-start">
                                                    <input
                                                        type="checkbox"
                                                        name="terms"
                                                        checked={formData.terms}
                                                        onChange={handleInputChange}
                                                        className="mt-1 text-green-600"
                                                    />
                                                    <span className="ml-3 text-sm text-gray-600">
                                                        I agree to the{' '}
                                                        <Link href="/terms" className="text-green-600 hover:text-green-700">
                                                            Terms of Service
                                                        </Link>
                                                        {' '}and{' '}
                                                        <Link href="/privacy" className="text-green-600 hover:text-green-700">
                                                            Privacy Policy
                                                        </Link>
                                                    </span>
                                                </label>
                                                {errors.terms && (
                                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                                        <AlertCircle className="w-4 h-4 mr-1" />
                                                        {errors.terms}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex space-x-3">
                                                <Button
                                                    type="button"
                                                    onClick={handleBack}
                                                    variant="outline"
                                                    className="flex-1"
                                                >
                                                    Back
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    loading={isLoading}
                                                    className="flex-1"
                                                >
                                                    <UserPlus className="w-4 h-4 mr-2" />
                                                    Create Account
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Login Link */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-6 text-center"
                >
                    <div className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link
                            href="/login"
                            className="text-green-600 hover:text-green-700 font-medium"
                        >
                            Sign in here
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
