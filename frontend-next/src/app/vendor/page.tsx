'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Store,
    CreditCard,
    BarChart3,
    QrCode,
    Camera,
    Upload,
    CheckCircle,
    MapPin,
    Star,
    AlertCircle
} from 'lucide-react';
import { useWeb3Store } from '@/store/web3Store';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Modal from '@/components/UI/Modal';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { toast } from 'react-hot-toast';
import Layout from '@/components/Layout/Layout'; // Retaining for type compatibility if needed, though mostly using DashboardLayout now
import RoleGuard from '@/components/Auth/RoleGuard';
import DashboardLayout from '@/components/Layout/DashboardLayout';

interface VendorProfile {
    name: string;
    location: string;
    verified: boolean;
    rating: number;
    totalTransactions: number;
    totalEarnings: number;
    joinedDate: string;
    categories: string[];
    reputation: number;
}

interface Transaction {
    id: string;
    date: string;
    victim: string;
    amount: number;
    category: string;
    status: string;
    proofSubmitted: boolean;
    items: string[];
}

interface PendingPayment {
    id: string;
    voucherCode: string;
    victim: string;
    amount: number;
    category: string;
    requestedItems: string[];
    urgency: string;
}

const TabButton = ({ tab, active, onClick }: { tab: { id: string, name: string, icon: React.ElementType }, active: boolean, onClick: (id: string) => void }) => (
    <Button
        variant={active ? 'primary' : 'outline'}
        onClick={() => onClick(tab.id)}
        className="flex items-center space-x-2"
    >
        {tab.icon && React.createElement(tab.icon, { className: 'w-4 h-4' })}
        <span>{tab.name}</span>
    </Button>
);

const AlertCard = ({ alert }: { alert: { type: string, title: string, message: string, timestamp: Date, id: number } }) => (
    <Card className="p-4 flex items-start space-x-3 bg-white shadow-sm">
        <AlertCircle className={`w-5 h-5 ${alert.type === 'error' ? 'text-red-500' : 'text-yellow-500'} flex-shrink-0`} />
        <div>
            <h4 className="font-semibold text-gray-900">{alert.title}</h4>
            <p className="text-sm text-gray-600">{alert.message}</p>
            <p className="text-xs text-gray-500 mt-1">{new Date(alert.timestamp).toLocaleString()}</p>
        </div>
    </Card>
);

const VendorPortal = () => {
    const { isConnected, account, userRole } = useWeb3Store();
    const [activeTab, setActiveTab] = useState('payments');
    const [loading, setLoading] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showProofModal, setShowProofModal] = useState(false);
    const [vendorProfile, setVendorProfile] = useState<VendorProfile | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);

    // Payment processing state
    const [paymentData, setPaymentData] = useState({
        voucherCode: '',
        amount: '',
        description: '',
        category: 'food'
    });

    // Proof submission state
    const [proofData, setProofData] = useState({
        transactionId: '',
        images: [],
        description: '',
        location: ''
    });

    // Mock vendor profile data
    useEffect(() => {
        if (isConnected && userRole === 'vendor') {
            setVendorProfile({
                name: 'Relief Supply Co.',
                location: 'Austin, TX',
                verified: true,
                rating: 4.8,
                totalTransactions: 342,
                totalEarnings: 45670.25,
                joinedDate: '2024-01-15',
                categories: ['Food', 'Water', 'Medical', 'Shelter'],
                reputation: 95
            });

            // Mock transactions
            setTransactions([
                {
                    id: 'TX001',
                    date: '2024-08-10',
                    victim: '0x1234...5678',
                    amount: 125.50,
                    category: 'Food',
                    status: 'completed',
                    proofSubmitted: true,
                    items: ['Emergency Food Kit', 'Water Bottles']
                },
                {
                    id: 'TX002',
                    date: '2024-08-09',
                    victim: '0x2345...6789',
                    amount: 89.75,
                    category: 'Medical',
                    status: 'completed',
                    proofSubmitted: false,
                    items: ['First Aid Kit', 'Pain Medication']
                },
                {
                    id: 'TX003',
                    date: '2024-08-09',
                    victim: '0x3456...7890',
                    amount: 200.00,
                    category: 'Shelter',
                    status: 'pending',
                    proofSubmitted: false,
                    items: ['Emergency Tent', 'Sleeping Bag']
                }
            ]);

            // Mock pending payments
            setPendingPayments([
                {
                    id: 'P001',
                    voucherCode: 'VCH-2024-001',
                    victim: '0x4567...8901',
                    amount: 150.00,
                    category: 'food',
                    requestedItems: ['Food Kit', 'Water'],
                    urgency: 'high'
                },
                {
                    id: 'P002',
                    voucherCode: 'VCH-2024-002',
                    victim: '0x5678...9012',
                    amount: 75.00,
                    category: 'medical',
                    requestedItems: ['First Aid'],
                    urgency: 'medium'
                }
            ]);
        }
    }, [isConnected, userRole]);

    const handleProcessPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Add to transactions
            const newTransaction = {
                id: `TX${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                victim: paymentData.voucherCode,
                amount: parseFloat(paymentData.amount),
                category: paymentData.category,
                status: 'completed',
                proofSubmitted: false,
                items: [paymentData.description]
            };

            setTransactions(prev => [newTransaction, ...prev]);
            setPaymentData({ voucherCode: '', amount: '', description: '', category: 'food' });
            setShowPaymentModal(false);
            toast.success('Payment processed successfully!');

        } catch {
            toast.error('Payment processing failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitProof = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simulate proof submission
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Update transaction with proof
            setTransactions(prev =>
                prev.map(tx =>
                    tx.id === proofData.transactionId
                        ? { ...tx, proofSubmitted: true }
                        : tx
                )
            );

            setProofData({ transactionId: '', images: [], description: '', location: '' });
            setShowProofModal(false);
            toast.success('Proof of aid submitted successfully!');

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Proof submission failed';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <RoleGuard requiredRole="vendor" title="Vendor Management Portal" subtitle="Connect your wallet with vendor permissions to process payments and manage relief supplies.">
            <DashboardLayout fullWidth={true}>
                <div className="min-h-screen">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">Vendor Portal</h1>
                                    <p className="text-gray-600">Process payments and manage your relief operations</p>
                                </div>
                                <div className="flex space-x-4">
                                    <Button
                                        onClick={() => setShowPaymentModal(true)}
                                    >
                                        <CreditCard className="w-4 h-4 mr-2" />
                                        Process Payment
                                    </Button>
                                    <Button
                                        onClick={() => setShowProofModal(true)}
                                        variant="outline"
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        Submit Proof
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Vendor Profile Summary */}
                        {vendorProfile && (
                            <Card className="mb-8 p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-red-100 rounded-full">
                                            <Store className="w-8 h-8 text-red-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                                {vendorProfile.name}
                                                {vendorProfile.verified && (
                                                    <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
                                                )}
                                            </h2>
                                            <p className="text-gray-600 flex items-center">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                {vendorProfile.location}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-8 text-center">
                                        <div>
                                            <p className="text-2xl font-bold text-gray-900">{vendorProfile.totalTransactions}</p>
                                            <p className="text-sm text-gray-500">Transactions</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-red-600">${vendorProfile.totalEarnings.toLocaleString()}</p>
                                            <p className="text-sm text-gray-500">Earnings</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-yellow-600 flex items-center justify-center">
                                                {vendorProfile.rating}
                                                <Star className="w-4 h-4 ml-1 fill-current" />
                                            </p>
                                            <p className="text-sm text-gray-500">Rating</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* Tab Navigation */}
                        <div className="border-b border-gray-200 mb-6">
                            <nav className="-mb-px flex space-x-8">
                                {[
                                    { id: 'payments', label: 'Payments', icon: CreditCard },
                                    { id: 'transactions', label: 'History', icon: BarChart3 },
                                    { id: 'profile', label: 'Profile', icon: Store }
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
                            {activeTab === 'payments' && (
                                <motion.div
                                    key="payments"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-6"
                                >
                                    <Card className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Requests</h3>
                                        <div className="space-y-4">
                                            {pendingPayments.map(payment => (
                                                <div key={payment.id} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="flex items-center space-x-2">
                                                                <h4 className="font-medium text-gray-900">{payment.voucherCode}</h4>
                                                                <span className={`px-2 py-1 text-xs rounded-full ${payment.urgency === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                                    }`}>
                                                                    {payment.urgency}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-500 mt-1">Items: {payment.requestedItems.join(', ')}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-lg font-bold text-gray-900 mb-2">${payment.amount}</p>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => {
                                                                    setPaymentData({
                                                                        voucherCode: payment.voucherCode,
                                                                        amount: payment.amount.toString(),
                                                                        category: payment.category,
                                                                        description: payment.requestedItems.join(', ')
                                                                    });
                                                                    setShowPaymentModal(true);
                                                                }}
                                                            >
                                                                Process
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Card className="p-6 text-center border-2 border-dashed border-gray-200">
                                            <QrCode className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                                            <h4 className="font-medium text-gray-900 mb-2">Scan QR Code</h4>
                                            <p className="text-sm text-gray-500 mb-4">Quickly scan victim vouchers</p>
                                            <Button variant="outline">
                                                <Camera className="w-4 h-4 mr-2" />
                                                Scan
                                            </Button>
                                        </Card>
                                        <Card className="p-6 text-center border-2 border-dashed border-gray-200">
                                            <CreditCard className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                                            <h4 className="font-medium text-gray-900 mb-2">Manual Entry</h4>
                                            <p className="text-sm text-gray-500 mb-4">Enter voucher code manually</p>
                                            <Button
                                                variant="outline"
                                                onClick={() => setShowPaymentModal(true)}
                                            >
                                                Process Manual
                                            </Button>
                                        </Card>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'transactions' && (
                                <motion.div
                                    key="transactions"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <Card className="p-0 overflow-hidden">
                                        <div className="p-6 border-b border-gray-100">
                                            <h3 className="text-lg font-semibold text-gray-900">History</h3>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">TX ID</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proof</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {transactions.map(tx => (
                                                        <tr key={tx.id}>
                                                            <td className="px-6 py-4">
                                                                <div className="text-sm font-medium text-gray-900">{tx.id}</div>
                                                                <div className="text-xs text-gray-500">{tx.date}</div>
                                                            </td>
                                                            <td className="px-6 py-4 font-medium text-gray-900">${tx.amount}</td>
                                                            <td className="px-6 py-4">
                                                                {tx.proofSubmitted ? (
                                                                    <span className="flex items-center text-green-600 text-xs">
                                                                        <CheckCircle className="w-3 h-3 mr-1" /> Verified
                                                                    </span>
                                                                ) : (
                                                                    <span className="flex items-center text-yellow-600 text-xs">
                                                                        <AlertCircle className="w-3 h-3 mr-1" /> Pending
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <Button
                                                                    size="xs"
                                                                    variant="outline"
                                                                    onClick={() => {
                                                                        setProofData({ ...proofData, transactionId: tx.id });
                                                                        setShowProofModal(true);
                                                                    }}
                                                                    disabled={tx.proofSubmitted}
                                                                >
                                                                    {tx.proofSubmitted ? 'View' : 'Submit'}
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </Card>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Payment Modal */}
                        <Modal
                            isOpen={showPaymentModal}
                            onClose={() => setShowPaymentModal(false)}
                            title="Process Payment"
                        >
                            <form onSubmit={handleProcessPayment} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Voucher Code</label>
                                    <input
                                        type="text"
                                        value={paymentData.voucherCode}
                                        onChange={(e) => setPaymentData({ ...paymentData, voucherCode: e.target.value })}
                                        className="w-full mt-1 border rounded-md p-2 bg-white text-gray-900 border-gray-300"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Amount ($)</label>
                                    <input
                                        type="number"
                                        value={paymentData.amount}
                                        onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                                        className="w-full mt-1 border rounded-md p-2 bg-white text-gray-900 border-gray-300"
                                        required
                                    />
                                </div>
                                <Button type="submit" loading={loading} className="w-full">Process</Button>
                            </form>
                        </Modal>

                        {/* Proof Modal */}
                        <Modal
                            isOpen={showProofModal}
                            onClose={() => setShowProofModal(false)}
                            title="Submit Proof"
                        >
                            <form onSubmit={handleSubmitProof} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">TX ID</label>
                                    <input
                                        type="text"
                                        value={proofData.transactionId}
                                        className="w-full mt-1 border rounded-md p-2 bg-gray-50 text-gray-900 border-gray-300"
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        className="w-full mt-1 border rounded-md p-2 bg-white text-gray-900 border-gray-300"
                                        rows={3}
                                        required
                                    />
                                </div>
                                <Button type="submit" loading={loading} className="w-full">Submit</Button>
                            </form>
                        </Modal>
                    </div>
                </div>
            </DashboardLayout>
        </RoleGuard>
    );
};

export default VendorPortal;
