'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield,
    BarChart3,
    AlertTriangle,
    CheckCircle2,
    FileText,
    DollarSign,
    MapPin,
    Zap
} from 'lucide-react';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Modal from '@/components/UI/Modal';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { toast } from 'react-hot-toast';
import Layout from '@/components/Layout/Layout';
import { useWeb3Store } from '@/store/web3Store';

import GuestWelcome from '@/components/Auth/GuestWelcome';

const GovernmentDashboard = () => {
    const { isConnected, userRole } = useWeb3Store();
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(false);
    const [showBulkPayoutModal, setShowBulkPayoutModal] = useState(false);
    const [showDisasterModal, setShowDisasterModal] = useState(false);
    const [pendingPayouts, setPendingPayouts] = useState<any[]>([]);
    const [disasters, setDisasters] = useState<any[]>([]);
    const [vendors, setVendors] = useState<any[]>([]);

    // Bulk payout state
    const [bulkPayoutData, setBulkPayoutData] = useState<any>({
        disasterId: '',
        totalAmount: '',
        payoutType: 'vendor_reimbursement',
        description: '',
        recipients: []
    });

    // Disaster creation state
    const [disasterData, setDisasterData] = useState<any>({
        name: '',
        type: 'flood',
        location: '',
        severity: 'medium',
        description: '',
        estimatedAffected: '',
        budget: ''
    });

    // Mock data
    useEffect(() => {
        // Mock pending payouts
        setPendingPayouts([
            {
                id: 'PAYOUT-001',
                type: 'vendor_reimbursement',
                vendor: 'Relief Supply Co.',
                amount: 15750.00,
                transactions: 23,
                submittedAt: '2024-08-10',
                status: 'pending',
                disaster: 'Hurricane Florence',
                priority: 'high'
            },
            {
                id: 'PAYOUT-002',
                type: 'emergency_fund',
                vendor: 'Medical Aid Partners',
                amount: 8420.50,
                transactions: 12,
                submittedAt: '2024-08-09',
                status: 'pending',
                disaster: 'California Earthquake',
                priority: 'medium'
            },
            {
                id: 'PAYOUT-003',
                type: 'bulk_voucher',
                vendor: 'Food Relief Network',
                amount: 22350.00,
                transactions: 45,
                submittedAt: '2024-08-08',
                status: 'approved',
                disaster: 'Texas Tornado',
                priority: 'high'
            }
        ]);

        // Mock disasters
        setDisasters([
            {
                id: 'DIS-001',
                name: 'Hurricane Florence',
                type: 'hurricane',
                location: 'North Carolina',
                severity: 'high',
                status: 'active',
                affectedPeople: 45000,
                budgetAllocated: 2500000,
                budgetUsed: 1850000,
                createdAt: '2024-08-05',
                endDate: null
            },
            {
                id: 'DIS-002',
                name: 'California Earthquake',
                type: 'earthquake',
                location: 'Los Angeles, CA',
                severity: 'medium',
                status: 'active',
                affectedPeople: 12000,
                budgetAllocated: 800000,
                budgetUsed: 320000,
                createdAt: '2024-08-07',
                endDate: null
            },
            {
                id: 'DIS-003',
                name: 'Texas Tornado',
                type: 'tornado',
                location: 'Dallas, TX',
                severity: 'high',
                status: 'resolved',
                affectedPeople: 8500,
                budgetAllocated: 1200000,
                budgetUsed: 1150000,
                createdAt: '2024-07-20',
                endDate: '2024-08-01'
            }
        ]);

        // Mock vendors
        setVendors([
            { id: 'VEN-001', name: 'Relief Supply Co.', verified: true, totalTransactions: 156 },
            { id: 'VEN-002', name: 'Medical Aid Partners', verified: true, totalTransactions: 89 },
            { id: 'VEN-003', name: 'Food Relief Network', verified: true, totalTransactions: 203 }
        ]);
    }, []);

    const handleBulkPayout = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simulate bulk payout processing
            await new Promise(resolve => setTimeout(resolve, 3000));

            setPendingPayouts(prev => prev.map(payout =>
                payout.id === bulkPayoutData.payoutId ? { ...payout, status: 'processed' } : payout
            ));

            setBulkPayoutData({
                disasterId: '',
                totalAmount: '',
                payoutType: 'vendor_reimbursement',
                description: '',
                recipients: []
            });

            setShowBulkPayoutModal(false);
            toast.success('Bulk payout processed successfully!');

        } catch (error) {
            toast.error('Payout processing failed');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateDisaster = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simulate disaster creation
            await new Promise(resolve => setTimeout(resolve, 2000));

            const newDisaster = {
                id: `DIS-${Date.now()}`,
                ...disasterData,
                status: 'active',
                affectedPeople: parseInt(disasterData.estimatedAffected),
                budgetAllocated: parseFloat(disasterData.budget),
                budgetUsed: 0,
                createdAt: new Date().toISOString().split('T')[0],
                endDate: null
            };

            setDisasters(prev => [newDisaster, ...prev]);

            setDisasterData({
                name: '',
                type: 'flood',
                location: '',
                severity: 'medium',
                description: '',
                estimatedAffected: '',
                budget: ''
            });

            setShowDisasterModal(false);
            toast.success('Disaster declaration created successfully!');

        } catch (error) {
            toast.error('Disaster creation failed');
        } finally {
            setLoading(false);
        }
    };

    if (!isConnected || userRole !== 'admin') {
        return (
            <Layout>
                <GuestWelcome
                    title="Government Oversight Dashboard"
                    subtitle="Connect your government authority wallet to manage disaster declarations and oversee relief distribution."
                    roleSpecific={userRole && userRole !== 'admin' ? `Access Denied: Your current role is ${userRole}. Government authority required.` : null}
                />
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="p-6 mx-auto max-w-7xl">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="mb-2 text-3xl font-bold text-gray-900">Government Portal</h1>
                            <p className="text-gray-600">
                                Regulatory oversight and disaster management coordination
                            </p>
                        </div>
                        <div className="flex space-x-4">
                            <Button
                                onClick={() => setShowBulkPayoutModal(true)}
                            >
                                <DollarSign className="w-4 h-4 mr-2" />
                                Bulk Payout
                            </Button>
                            <Button
                                onClick={() => setShowDisasterModal(true)}
                                variant="danger"
                            >
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                Declare Disaster
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4">
                    <Card className="p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <AlertTriangle className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Active Disasters</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {disasters.filter(d => d.status === 'active').length}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-full">
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Verified Vendors</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {vendors.filter(v => v.verified).length}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <FileText className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Pending Payouts</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {pendingPayouts.filter(p => p.status === 'pending').length}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 rounded-full">
                                <BarChart3 className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Aid Distributed</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ${disasters.reduce((sum, d) => sum + d.budgetUsed, 0).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Tab Navigation */}
                <div className="mb-6 border-b border-gray-200">
                    <nav className="flex -mb-px space-x-8">
                        {[
                            { id: 'overview', label: 'Overview', icon: BarChart3 },
                            { id: 'disasters', label: 'Disaster Management', icon: AlertTriangle },
                            { id: 'payouts', label: 'Payout Management', icon: DollarSign },
                            { id: 'vendors', label: 'Vendor Oversight', icon: Shield }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === tab.id
                                    ? 'border-red-500 text-red-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4 mr-2" />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 gap-8 lg:grid-cols-2"
                        >
                            <Card className="p-6">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">Recent Activity</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center p-3 space-x-4 rounded-lg bg-red-50">
                                        <AlertTriangle className="w-5 h-5 text-red-500" />
                                        <div>
                                            <p className="font-medium text-gray-900">Hurricane Florence declared</p>
                                            <p className="text-sm text-gray-600">$2.5M budget allocated • 2 hours ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center p-3 space-x-4 rounded-lg bg-green-50">
                                        <DollarSign className="w-5 h-5 text-green-500" />
                                        <div>
                                            <p className="font-medium text-gray-900">Bulk payout processed</p>
                                            <p className="text-sm text-gray-600">$45,850 to 12 vendors • 4 hours ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center p-3 space-x-4 rounded-lg bg-blue-50">
                                        <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                        <div>
                                            <p className="font-medium text-gray-900">New vendor verified</p>
                                            <p className="text-sm text-gray-600">Emergency Food Network approved • 6 hours ago</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">Critical Alerts</h3>
                                <div className="space-y-4">
                                    <div className="p-4 border-l-4 border-red-500 bg-red-50">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium text-red-800">High Priority Payout Pending</p>
                                                <p className="text-sm text-red-600">Relief Supply Co. - $15,750</p>
                                            </div>
                                            <Button size="sm">
                                                Review
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium text-yellow-800">Budget Threshold Reached</p>
                                                <p className="text-sm text-yellow-600">California Earthquake - 90% budget used</p>
                                            </div>
                                            <Button size="sm" variant="outline">
                                                View
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {activeTab === 'disasters' && (
                        <motion.div
                            key="disasters"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">Active Disasters</h3>
                                    <Button onClick={() => setShowDisasterModal(true)}>
                                        <AlertTriangle className="w-4 h-4 mr-2" />
                                        Declare New Disaster
                                    </Button>
                                </div>

                                <div className="space-y-6">
                                    {disasters.map(disaster => (
                                        <div key={disaster.id} className="p-6 border border-gray-200 rounded-lg">
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <div className="flex items-center space-x-2">
                                                        <h4 className="text-lg font-semibold text-gray-900">{disaster.name}</h4>
                                                        <span className={`px-2 py-1 text-xs rounded-full ${disaster.status === 'active' ? 'bg-red-100 text-red-700' :
                                                            disaster.status === 'resolved' ? 'bg-green-100 text-green-700' :
                                                                'bg-gray-100 text-gray-700'
                                                            }`}>
                                                            {disaster.status}
                                                        </span>
                                                    </div>
                                                    <p className="flex items-center text-gray-600">
                                                        <MapPin className="w-4 h-4 mr-1" />
                                                        {disaster.location} • {disaster.type}
                                                    </p>
                                                </div>
                                                <Button variant="outline" size="sm">
                                                    Manage
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                                <div>
                                                    <p className="text-sm text-gray-600">Affected People</p>
                                                    <p className="text-lg font-semibold text-gray-900">
                                                        {disaster.affectedPeople.toLocaleString()}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Budget Allocated</p>
                                                    <p className="text-lg font-semibold text-gray-900">
                                                        ${disaster.budgetAllocated.toLocaleString()}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Budget Used</p>
                                                    <p className="text-lg font-semibold text-gray-900">
                                                        ${disaster.budgetUsed.toLocaleString()}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Usage %</p>
                                                    <div className="flex items-center">
                                                        <div className="flex-1 h-2 mr-2 bg-gray-200 rounded-full">
                                                            <div
                                                                className="h-2 bg-red-600 rounded-full"
                                                                style={{ width: `${(disaster.budgetUsed / disaster.budgetAllocated) * 100}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-sm font-medium">
                                                            {Math.round((disaster.budgetUsed / disaster.budgetAllocated) * 100)}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {activeTab === 'payouts' && (
                        <motion.div
                            key="payouts"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">Payout Management</h3>
                                    <Button
                                        onClick={() => setShowBulkPayoutModal(true)}
                                    >
                                        <Zap className="w-4 h-4 mr-2" />
                                        Bulk Process
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {pendingPayouts.map(payout => (
                                        <div key={payout.id} className="p-4 border border-gray-200 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center mb-2 space-x-2">
                                                        <h4 className="font-medium text-gray-900">{payout.id}</h4>
                                                        <span className={`px-2 py-1 text-xs rounded-full ${payout.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                                                            }`}>
                                                            {payout.status}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-4">
                                                        <div>
                                                            <p className="text-gray-600">Amount</p>
                                                            <p className="font-medium">${payout.amount.toLocaleString()}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-600">Vendor</p>
                                                            <p className="font-medium">{payout.vendor}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button size="sm" variant="outline">Review</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Modal Placeholders */}
                <Modal
                    isOpen={showBulkPayoutModal}
                    onClose={() => setShowBulkPayoutModal(false)}
                    title="Process Bulk Payout"
                >
                    <form onSubmit={handleBulkPayout} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Amount</label>
                            <input type="number" className="w-full mt-1 border rounded-md p-2" required />
                        </div>
                        <Button type="submit" loading={loading} className="w-full">Submit Payout</Button>
                    </form>
                </Modal>

                <Modal
                    isOpen={showDisasterModal}
                    onClose={() => setShowDisasterModal(false)}
                    title="Declare New Disaster"
                >
                    <form onSubmit={handleCreateDisaster} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Disaster Name</label>
                            <input type="text" className="w-full mt-1 border rounded-md p-2" required />
                        </div>
                        <Button type="submit" loading={loading} className="w-full">Declare</Button>
                    </form>
                </Modal>
            </div>
        </Layout>
    );
};

export default GovernmentDashboard;
