'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wallet,
    TrendingUp,
    BarChart3,
    Shield,
    AlertTriangle,
    Download,
    Bell,
    RefreshCw,
    Eye,
    EyeOff
} from 'lucide-react';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import Modal from '@/components/UI/Modal';
import ESGBondManager from '@/components/Treasury/ESGBondManager';
import TreasuryAnalytics from '@/components/Treasury/TreasuryAnalytics';
import CashFlowManager from '@/components/Treasury/CashFlowManager';
import RiskAssessment from '@/components/Treasury/RiskAssessment';
import { toast } from 'react-hot-toast';
import Layout from '@/components/Layout/Layout';
import RoleGuard from '@/components/Auth/RoleGuard';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useWeb3Store } from '@/store/web3Store';

const TreasuryDashboard = () => {
    const { isConnected, userRole } = useWeb3Store();
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(false);
    const [treasuryData, setTreasuryData] = useState<any>(null);
    const [showBalances, setShowBalances] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);

    // Initialize treasury data
    useEffect(() => {
        setTreasuryData({
            overview: {
                totalAssets: 125750000,
                liquidAssets: 45200000,
                investedAssets: 80550000,
                totalLiabilities: 34200000,
                netWorth: 91550000,
                cashPosition: 28500000,
                monthlyBurn: 3200000,
                runway: 8.9 // months
            },
            alerts: [
                {
                    id: 1,
                    type: 'warning',
                    title: 'Low Cash Reserves',
                    message: 'Cash reserves below 3-month threshold',
                    priority: 'high',
                    timestamp: '2024-08-15T10:30:00Z'
                },
                {
                    id: 2,
                    type: 'info',
                    title: 'Bond Maturity',
                    message: 'Emergency Response Bond maturing in 30 days',
                    priority: 'medium',
                    timestamp: '2024-08-15T09:15:00Z'
                },
                {
                    id: 3,
                    type: 'success',
                    title: 'Investment Performance',
                    message: 'Climate bonds yielding above target',
                    priority: 'low',
                    timestamp: '2024-08-15T08:45:00Z'
                }
            ],
            performance: {
                monthlyReturn: 2.3,
                quarterlyReturn: 7.8,
                yearlyReturn: 12.4,
                volatility: 8.2,
                sharpeRatio: 1.52,
                maxDrawdown: -4.1
            },
            allocations: {
                bonds: 45,
                cash: 25,
                realEstate: 15,
                equity: 10,
                alternatives: 5
            },
            recentTransactions: [
                {
                    id: 'TXN-001',
                    type: 'bond_purchase',
                    amount: 5000000,
                    description: 'Climate Resilience Bond Series A',
                    date: '2024-08-14',
                    status: 'completed'
                },
                {
                    id: 'TXN-002',
                    type: 'disbursement',
                    amount: -2500000,
                    description: 'Hurricane Relief Fund Distribution',
                    date: '2024-08-13',
                    status: 'completed'
                }
            ]
        });

        setNotifications([
            { id: 1, message: 'Monthly treasury report ready', read: false },
            { id: 2, message: 'ESG compliance score updated', read: false }
        ]);
    }, []);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'cashflow', label: 'Cash Flow', icon: TrendingUp },
        { id: 'bonds', label: 'ESG Bonds', icon: Shield },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'risk', label: 'Risk Assessment', icon: AlertTriangle }
    ];

    const refreshData = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            toast.success('Treasury data refreshed');
        } catch (error) {
            toast.error('Failed to refresh data');
        } finally {
            setLoading(false);
        }
    };

    const exportReport = () => {
        toast.success('Treasury report exported');
    };

    const formatCurrency = (amount: number) => {
        if (!showBalances) return '••••••••';
        if (Math.abs(amount) >= 1000000) {
            return `$${(amount / 1000000).toFixed(1)}M`;
        }
        return `$${amount.toLocaleString()}`;
    };

    const renderOverview = () => {
        if (!treasuryData) return <LoadingSpinner aria-label="Loading treasury data" />;

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Assets</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(treasuryData.overview.totalAssets)}
                                </p>
                                <p className="text-sm text-green-600 flex items-center mt-1">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    +{treasuryData.performance.monthlyReturn}%
                                </p>
                            </div>
                            <div className="p-3 bg-red-100 rounded-full">
                                <Wallet className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Net Worth</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(treasuryData.overview.netWorth)}
                                </p>
                                <p className="text-sm text-blue-600">Assets - Liabilities</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <TrendingUp className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Runway</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {treasuryData.overview.runway} months
                                </p>
                                <p className="text-sm text-orange-600">At current burn</p>
                            </div>
                            <div className="p-3 bg-orange-100 rounded-full">
                                <AlertTriangle className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Asset Allocation</h3>
                        <div className="space-y-4">
                            {Object.entries(treasuryData.allocations).map(([asset, percentage]: [string, any]) => (
                                <div key={asset}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium text-gray-700 capitalize">
                                            {asset}
                                        </span>
                                        <span className="text-sm text-gray-500">{percentage}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className="bg-red-600 h-2 rounded-full"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg text-center">
                                <p className="text-2xl font-bold text-green-600">{treasuryData.performance.yearlyReturn}%</p>
                                <p className="text-xs text-gray-500">Annual Return</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg text-center">
                                <p className="text-2xl font-bold text-blue-600">{treasuryData.performance.sharpeRatio}</p>
                                <p className="text-xs text-gray-500">Sharpe Ratio</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        );
    };

    return (
        <RoleGuard requiredRole="admin" title="Treasury Management Portal" subtitle="Connect your treasury wallet to manage relief funds, ESG bonds, and financial analytics.">
            <DashboardLayout fullWidth={true}>
                <div className="min-h-screen">
                    <div className="max-w-7xl mx-auto p-6">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Treasury Management</h1>
                                <p className="text-gray-600">Comprehensive financial oversight and asset management</p>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Button
                                    onClick={() => setShowBalances(!showBalances)}
                                    variant="outline"
                                    size="sm"
                                >
                                    {showBalances ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </Button>
                                <Button
                                    onClick={refreshData}
                                    variant="outline"
                                    size="sm"
                                    disabled={loading}
                                >
                                    {loading ? <LoadingSpinner size="sm" aria-label="Refreshing data" /> : <RefreshCw className="w-4 h-4" />}
                                </Button>
                                <Button onClick={exportReport}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Export
                                </Button>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="flex flex-wrap gap-2 mb-8 bg-gray-100 p-1 rounded-xl">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all ${activeTab === tab.id
                                        ? 'bg-white text-red-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === 'overview' && renderOverview()}
                                {activeTab === 'cashflow' && <CashFlowManager />}
                                {activeTab === 'bonds' && <ESGBondManager />}
                                {activeTab === 'analytics' && <TreasuryAnalytics />}
                                {activeTab === 'risk' && <RiskAssessment />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </DashboardLayout>
        </RoleGuard>
    );
};

export default TreasuryDashboard;
