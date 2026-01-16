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
    Zap,
    Calendar,
    Clock,
    Users,
    Activity
} from 'lucide-react';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Modal from '@/components/UI/Modal';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { toast } from 'react-hot-toast';
import Layout from '@/components/Layout/Layout';
import RoleGuard from '@/components/Auth/RoleGuard';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useWeb3Store } from '@/store/web3Store';

interface Payout {
    id: string;
    type: string;
    program: string;
    vendor: string;
    amount: number;
    transactions: number;
    deadline: string;
    submittedAt: string;
    status: string;
    disaster: string;
    priority: string;
}

interface ActiveDisaster {
    id: string;
    name: string;
    type: string;
    location: string;
    severity: string;
    status: string;
    affectedPeople: number;
    affectedPopulation: number;
    budget: number;
    spent: number;
    declaredAt: string;
    endDate: string | null;
}

interface Vendor {
    id: string;
    name: string;
    verified: boolean;
    totalTransactions: number;
}

interface DisasterFormData {
    name: string;
    type: string;
    location: string;
    severity: string;
    description: string;
    estimatedAffected: string;
    budget: string;
}

interface BulkPayoutData {
    disasterId: string;
    totalAmount: string;
    payoutType: string;
    description: string;
    recipients: string[];
}

const GovernmentDashboard = () => {
    const { isConnected, userRole } = useWeb3Store();
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(false);
    const [showBulkPayoutModal, setShowBulkPayoutModal] = useState(false);
    const [showDisasterModal, setShowDisasterModal] = useState(false);
    const [pendingPayouts, setPendingPayouts] = useState<Payout[]>([]);
    const [activeDisasters, setActiveDisasters] = useState<ActiveDisaster[]>([]); // Renamed to match usage in template
    const [vendors, setVendors] = useState<Vendor[]>([]);

    // Bulk payout state
    const [bulkPayoutData, setBulkPayoutData] = useState<BulkPayoutData>({
        disasterId: '',
        totalAmount: '',
        payoutType: 'vendor_reimbursement',
        description: '',
        recipients: []
    });

    // Disaster creation state
    const [disasterData, setDisasterData] = useState<DisasterFormData>({
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
                program: 'Critical Vendor Reimbursement', // Mapped 'program' for display
                vendor: 'Relief Supply Co.',
                amount: 15750.00,
                transactions: 23,
                deadline: '2024-08-30', // Added deadline
                submittedAt: '2024-08-10',
                status: 'pending',
                disaster: 'Hurricane Florence',
                priority: 'high'
            },
            {
                id: 'PAYOUT-002',
                type: 'emergency_fund',
                program: 'Medical Emergency Fund',
                vendor: 'Medical Aid Partners',
                amount: 8420.50,
                transactions: 12,
                deadline: '2024-08-25',
                submittedAt: '2024-08-09',
                status: 'pending',
                disaster: 'California Earthquake',
                priority: 'medium'
            }
        ]);

        // Mock disasters
        setActiveDisasters([
            {
                id: 'DIS-001',
                name: 'Hurricane Florence',
                type: 'hurricane',
                location: 'North Carolina',
                severity: 'high',
                status: 'active',
                affectedPeople: 45000,
                affectedPopulation: 45000, // Mapped
                budget: 2500000, // Mapped
                spent: 1850000, // Mapped
                declaredAt: '2024-08-05', // Mapped
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
                affectedPopulation: 12000,
                budget: 800000,
                spent: 320000,
                declaredAt: '2024-08-07',
                endDate: null
            }
        ]);

        // Mock vendors
        setVendors([
            { id: 'VEN-001', name: 'Relief Supply Co.', verified: true, totalTransactions: 156 },
            { id: 'VEN-002', name: 'Medical Aid Partners', verified: true, totalTransactions: 89 },
            { id: 'VEN-003', name: 'Food Relief Network', verified: true, totalTransactions: 203 }
        ]);
    }, []);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'disasters', label: 'Active Zones', icon: AlertTriangle },
        { id: 'payouts', label: 'Payouts', icon: DollarSign },
        { id: 'monitoring', label: 'Monitoring', icon: Activity },
    ];

    const handleSubmitDisaster = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle logic
        setShowDisasterModal(false);
        toast.success('Disaster declared successfully');
    };

    return (
        <RoleGuard requiredRole="government" title="Government Portal" subtitle="Connect government credentials to manage relief allocations and verify disasters.">
            <DashboardLayout>
                <div className="min-h-screen">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Government Dashboard</h1>
                                <p className="text-gray-600">Disaster management and fund allocation portal</p>
                            </div>
                            <div className="flex space-x-4">
                                <div className="hidden md:flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                                    <Shield className="w-5 h-5 mr-2" />
                                    <span className="font-medium">Official Verification Node</span>
                                </div>
                                <Button color="red" onClick={() => setShowDisasterModal(true)}>
                                    <AlertTriangle className="w-4 h-4 mr-2" />
                                    Declare Disaster
                                </Button>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <Card className="p-6 border-l-4 border-red-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Active Zones</p>
                                        <p className="text-2xl font-bold text-gray-900">{activeDisasters.length}</p>
                                    </div>
                                    <div className="p-3 bg-red-100 rounded-full">
                                        <AlertTriangle className="w-6 h-6 text-red-600" />
                                    </div>
                                </div>
                            </Card>
                            <Card className="p-6 border-l-4 border-green-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Available Funds</p>
                                        <p className="text-2xl font-bold text-gray-900">$2.5M</p>
                                    </div>
                                    <div className="p-3 bg-green-100 rounded-full">
                                        <DollarSign className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                            </Card>
                            <Card className="p-6 border-l-4 border-blue-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Verified Vendors</p>
                                        <p className="text-2xl font-bold text-gray-900">{vendors.length}</p>
                                    </div>
                                    <div className="p-3 bg-blue-100 rounded-full">
                                        <Users className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                            </Card>
                            <Card className="p-6 border-l-4 border-purple-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Pending Actions</p>
                                        <p className="text-2xl font-bold text-gray-900">{pendingPayouts.length}</p>
                                    </div>
                                    <div className="p-3 bg-purple-100 rounded-full">
                                        <FileText className="w-6 h-6 text-purple-600" />
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Navigation */}
                        <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-8 w-fit">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4 mr-2" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Content Area */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === 'overview' && (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <Card className="p-6">
                                            <h3 className="text-lg font-bold text-gray-900 mb-4">Urgent Actions</h3>
                                            <div className="space-y-4">
                                                {pendingPayouts.map(payout => (
                                                    <div key={payout.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                                        <div className="flex items-center">
                                                            <div className="p-2 bg-yellow-100 rounded-lg mr-4">
                                                                <Clock className="w-5 h-5 text-yellow-600" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">{payout.program}</p>
                                                                <p className="text-sm text-gray-500">Due: {new Date(payout.deadline).toLocaleDateString()}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold text-gray-900">${payout.amount.toLocaleString()}</p>
                                                            <Button size="sm" className="mt-1">Approve</Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Card>
                                        <Card className="p-6">
                                            <h3 className="text-lg font-bold text-gray-900 mb-4">Resource Allocation</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="font-medium">Emergency Fund</span>
                                                        <span className="text-gray-500">45% Used</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="font-medium">Reconstruction</span>
                                                        <span className="text-gray-500">12% Used</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="font-medium">Medical Support</span>
                                                        <span className="text-gray-500">78% Used</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                )}

                                {activeTab === 'disasters' && (
                                    <div className="space-y-6">
                                        {activeDisasters.map(disaster => (
                                            <Card key={disaster.id} className="p-6">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center mb-2">
                                                            <h3 className="text-xl font-bold text-gray-900 mr-3">{disaster.name}</h3>
                                                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold uppercase">{disaster.severity}</span>
                                                        </div>
                                                        <div className="flex items-center text-gray-500 text-sm mb-4">
                                                            <MapPin className="w-4 h-4 mr-1" />
                                                            {disaster.location}
                                                            <span className="mx-2">•</span>
                                                            <Calendar className="w-4 h-4 mr-1 ml-1" />
                                                            {new Date(disaster.declaredAt).toLocaleDateString()}
                                                        </div>
                                                        <div className="flex items-center space-x-6 text-sm">
                                                            <div>
                                                                <span className="text-gray-500">Budget:</span>
                                                                <span className="font-medium ml-1">${disaster.budget.toLocaleString()}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-500">Spent:</span>
                                                                <span className="font-medium ml-1">${disaster.spent.toLocaleString()}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-500">Affected:</span>
                                                                <span className="font-medium ml-1">{disaster.affectedPopulation.toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <Button variant="outline">View Reports</Button>
                                                        <Button>Manage Funds</Button>
                                                    </div>
                                                </div>
                                                <div className="mt-4 pt-4 border-t border-gray-100">
                                                    <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
                                                        <div
                                                            className="bg-blue-600 h-2 rounded-full"
                                                            style={{ width: `${(disaster.spent / disaster.budget) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                    <div className="flex justify-end text-xs text-gray-500">
                                                        {Math.round((disaster.spent / disaster.budget) * 100)}% of budget utilized
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'payouts' && (
                                    <div className="space-y-6">
                                        <Card className="p-6">
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="font-bold text-gray-900">Quick Payout</h3>
                                                <Button variant="outline" size="sm">History</Button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Program / NGO</label>
                                                    <select className="w-full border rounded-lg p-2 bg-white">
                                                        <option>Red Cross Emergency Fund</option>
                                                        <option>Local Relief Housing</option>
                                                        <option>Medical Supplies Corp</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USDC)</label>
                                                    <input type="number" className="w-full border rounded-lg p-2" placeholder="0.00" />
                                                </div>
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Authorization Note</label>
                                                <textarea className="w-full border rounded-lg p-2 h-20" placeholder="Reason for payout..." />
                                            </div>
                                            <Button className="w-full md:w-auto">Process Payout</Button>
                                        </Card>
                                    </div>
                                )}

                                {activeTab === 'monitoring' && (
                                    <Card className="p-6">
                                        <div className="text-center py-12">
                                            <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900">Real-time Monitoring</h3>
                                            <p className="text-gray-500">Connect to Oracle Node for live datastreams.</p>
                                            <Button variant="outline" className="mt-4">Connect Node</Button>
                                        </div>
                                    </Card>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Modals */}
                    <Modal isOpen={showDisasterModal} onClose={() => setShowDisasterModal(false)} title="Declare State of Emergency">
                        <form onSubmit={handleSubmitDisaster} className="space-y-4">
                            <p className="text-sm text-gray-500">
                                This action will trigger smart contract emergency protocols and unlock contingency funds.
                                Multi-sig verification may be required.
                            </p>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Disaster Name</label>
                                <input type="text" className="w-full border rounded-lg p-2" placeholder="e.g. Coastal Flood Zone A" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Initial Budget Allocation (USDC)</label>
                                <input type="number" className="w-full border rounded-lg p-2" placeholder="500000" required />
                            </div>
                            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">Submit Declaration</Button>
                        </form>
                    </Modal>
                </div>
            </DashboardLayout>
        </RoleGuard>
    );
};

export default GovernmentDashboard;
