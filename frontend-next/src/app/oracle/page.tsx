'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Database,
    CheckCircle2,
    AlertCircle,
    TrendingUp,
    Eye,
    Zap,
    Clock,
    Shield,
    BarChart3,
    Search,
    Settings,
    Wifi,
    WifiOff,
    Bell,
    Filter,
    Download,
    Upload,
    Activity
} from 'lucide-react';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Modal from '@/components/UI/Modal';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { useWeb3Store } from '@/store/web3Store';
import Layout from '@/components/Layout/Layout';
import RoleGuard from '@/components/Auth/RoleGuard';
import DashboardLayout from '@/components/Layout/DashboardLayout';

const OracleDashboard = () => {
    const { isConnected, account, userRole } = useWeb3Store();
    const [activeTab, setActiveTab] = useState('verification');
    const [loading, setLoading] = useState(false);
    const [showPriceModal, setShowPriceModal] = useState(false);
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [verificationQueue, setVerificationQueue] = useState<any[]>([]);
    const [priceFeeds, setPriceFeeds] = useState<any[]>([]);
    const [dataSources, setDataSources] = useState<any[]>([]);
    const [oracleStats, setOracleStats] = useState<any>({});

    // Price update state
    const [priceUpdate, setPriceUpdate] = useState<any>({
        commodity: '',
        price: '',
        source: '',
        confidence: 95
    });

    // Configuration state
    const [oracleConfig, setOracleConfig] = useState<any>({
        updateFrequency: 300,
        confidenceThreshold: 90,
        autoValidation: true,
        alertsEnabled: true
    });

    // Mock data
    useEffect(() => {
        // Mock verification queue
        setVerificationQueue([
            {
                id: 'VER-001',
                type: 'disaster_assessment',
                title: 'Hurricane Impact Assessment',
                location: 'Florida Keys',
                source: 'NOAA Weather Service',
                priority: 'high',
                confidence: 94,
                sourcesVerified: 3,
                totalSources: 3,
                submittedAt: '2024-08-10T10:30:00Z',
                status: 'pending'
            },
            {
                id: 'VER-002',
                type: 'price_update',
                title: 'Supply Price Update',
                item: 'Emergency Food Rations',
                source: 'Multiple vendors',
                priority: 'medium',
                confidence: 87,
                avgPrice: 12.50,
                priceChange: 5,
                submittedAt: '2024-08-10T09:15:00Z',
                status: 'pending'
            }
        ]);

        // Mock price feeds
        setPriceFeeds([
            {
                id: 'FEED-001',
                commodity: 'Emergency Food Rations',
                currentPrice: 12.50,
                lastUpdate: '2 minutes ago',
                change24h: 5.2,
                status: 'active',
                sources: 5,
                reliability: 98
            },
            {
                id: 'FEED-002',
                commodity: 'Medical Supplies Kit',
                currentPrice: 45.75,
                lastUpdate: '5 minutes ago',
                change24h: -2.1,
                status: 'active',
                sources: 8,
                reliability: 96
            }
        ]);

        // Mock data sources
        const sources = [
            {
                id: 'SRC-001',
                name: 'NOAA Weather Service',
                type: 'weather',
                status: 'online',
                uptime: 99.8,
                lastPing: '30 seconds ago',
                reliability: 98,
                dataPoints: 1547
            },
            {
                id: 'SRC-002',
                name: 'USGS Earthquake Monitor',
                type: 'geological',
                status: 'online',
                uptime: 99.5,
                lastPing: '1 minute ago',
                reliability: 97,
                dataPoints: 892
            }
        ];
        setDataSources(sources);

        // Mock oracle stats
        setOracleStats({
            dataPointsVerified: 1247,
            todayIncrease: 23,
            priceUpdates: 89,
            lastUpdateMinutes: 2,
            pendingValidations: 12,
            networkUptime: 99.8,
            totalSources: sources.length,
            activeSources: sources.filter(s => s.status === 'online').length
        });
    }, []);

    const handleVerification = async (verificationId: string, action: string) => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setVerificationQueue(prev => prev.map(item =>
                item.id === verificationId
                    ? { ...item, status: action === 'approve' ? 'verified' : 'rejected' }
                    : item
            ));
            toast.success(`Verification ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
        } catch (error) {
            toast.error('Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePriceUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            const newFeed = {
                id: `FEED-${Date.now()}`,
                commodity: priceUpdate.commodity,
                currentPrice: parseFloat(priceUpdate.price),
                lastUpdate: 'Just now',
                change24h: 0,
                status: 'active',
                sources: 1,
                reliability: priceUpdate.confidence
            };
            setPriceFeeds(prev => [newFeed, ...prev]);
            setPriceUpdate({ commodity: '', price: '', source: '', confidence: 95 });
            setShowPriceModal(false);
            toast.success('Price feed updated successfully!');
        } catch (error) {
            toast.error('Price update failed');
        } finally {
            setLoading(false);
        }
    };

    const handleConfigUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setShowConfigModal(false);
            toast.success('Oracle configuration updated!');
        } catch (error) {
            toast.error('Configuration update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <RoleGuard requiredRole="admin" title="Oracle Verification Portal" subtitle="Connect your oracle wallet to verify aid proofs, manage price feeds, and ensure network integrity.">
            <DashboardLayout fullWidth={true}>
                <div className="min-h-screen">
                    <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Oracle Dashboard</h1>
                                <p className="text-gray-600">Data verification and price oracle management</p>
                            </div>
                            <div className="flex space-x-4">
                                <Button onClick={() => setShowPriceModal(true)}>
                                    <TrendingUp className="w-4 h-4 mr-2" />
                                    Update Price
                                </Button>
                                <Button variant="outline" onClick={() => setShowConfigModal(true)}>
                                    <Settings className="w-4 h-4 mr-2" />
                                    Configure
                                </Button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <Card className="p-6">
                                <div className="flex items-center">
                                    <div className="p-3 bg-green-100 rounded-full">
                                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Verified Points</p>
                                        <p className="text-2xl font-bold text-gray-900">{oracleStats.dataPointsVerified}</p>
                                    </div>
                                </div>
                            </Card>
                            <Card className="p-6">
                                <div className="flex items-center">
                                    <div className="p-3 bg-blue-100 rounded-full">
                                        <TrendingUp className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Price Updates</p>
                                        <p className="text-2xl font-bold text-gray-900">{oracleStats.priceUpdates}</p>
                                    </div>
                                </div>
                            </Card>
                            <Card className="p-6">
                                <div className="flex items-center">
                                    <div className="p-3 bg-yellow-100 rounded-full">
                                        <AlertCircle className="w-6 h-6 text-yellow-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Pending</p>
                                        <p className="text-2xl font-bold text-gray-900">{oracleStats.pendingValidations}</p>
                                    </div>
                                </div>
                            </Card>
                            <Card className="p-6">
                                <div className="flex items-center">
                                    <div className="p-3 bg-purple-100 rounded-full">
                                        <Zap className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-500">Uptime</p>
                                        <p className="text-2xl font-bold text-gray-900">{oracleStats.networkUptime}%</p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Tabs */}
                        <div className="mb-6 border-b border-gray-200">
                            <nav className="flex -mb-px space-x-8">
                                {[
                                    { id: 'verification', label: 'Verification', icon: Database },
                                    { id: 'pricing', label: 'Price Feeds', icon: TrendingUp },
                                    { id: 'sources', label: 'Sources', icon: Wifi },
                                    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
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
                            {activeTab === 'verification' && (
                                <motion.div
                                    key="verification"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                                >
                                    <div className="lg:col-span-2 space-y-4">
                                        {verificationQueue.map(item => (
                                            <Card key={item.id} className="p-6">
                                                <div className="flex justify-between mb-4">
                                                    <div>
                                                        <h4 className="font-bold text-gray-900">{item.title}</h4>
                                                        <p className="text-sm text-gray-500">{item.source}</p>
                                                    </div>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${item.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                                        }`}>
                                                        {item.priority}
                                                    </span>
                                                </div>
                                                <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                                                    <p className="text-sm text-gray-700">Confidence: {item.confidence}%</p>
                                                    <p className="text-sm text-gray-700">Status: {item.status}</p>
                                                </div>
                                                {item.status === 'pending' && (
                                                    <div className="flex gap-2">
                                                        <Button size="sm" className="flex-1" onClick={() => handleVerification(item.id, 'approve')}>Verify</Button>
                                                        <Button size="sm" variant="outline" className="flex-1">Request Info</Button>
                                                    </div>
                                                )}
                                            </Card>
                                        ))}
                                    </div>
                                    <div className="space-y-4">
                                        <Card className="p-6">
                                            <h3 className="font-bold mb-4">Quick Tools</h3>
                                            <div className="space-y-2">
                                                <Button variant="outline" className="w-full justify-start">
                                                    <Activity className="w-4 h-4 mr-2" /> Monitor Feed
                                                </Button>
                                                <Button variant="outline" className="w-full justify-start">
                                                    <Shield className="w-4 h-4 mr-2" /> Security Scan
                                                </Button>
                                            </div>
                                        </Card>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'pricing' && (
                                <motion.div
                                    key="pricing"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                >
                                    {priceFeeds.map(feed => (
                                        <Card key={feed.id} className="p-6">
                                            <div className="flex justify-between mb-4">
                                                <h4 className="font-bold text-gray-900">{feed.commodity}</h4>
                                                <span className="text-xs text-green-600 font-medium">ACTIVE</span>
                                            </div>
                                            <div className="text-2xl font-bold mb-2">${feed.currentPrice}</div>
                                            <div className="text-sm text-gray-500 mb-6">Last update: {feed.lastUpdate}</div>
                                            <Button variant="outline" className="w-full">Update Feed</Button>
                                        </Card>
                                    ))}
                                </motion.div>
                            )}

                            {activeTab === 'sources' && (
                                <motion.div
                                    key="sources"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-4"
                                >
                                    {dataSources.map(source => (
                                        <Card key={source.id} className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                                                        <Wifi className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900">{source.name}</h4>
                                                        <p className="text-sm text-gray-500">{source.type}</p>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-medium text-green-600">{source.status}</span>
                                            </div>
                                        </Card>
                                    ))}
                                </motion.div>
                            )}

                            {activeTab === 'analytics' && (
                                <motion.div
                                    key="analytics"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="py-12 text-center"
                                >
                                    <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                    <p className="text-gray-500">Advanced analytics coming soon...</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Price Update Modal */}
                    <Modal isOpen={showPriceModal} onClose={() => setShowPriceModal(false)} title="Update Price Feed">
                        <form onSubmit={handlePriceUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Commodity</label>
                                <input
                                    type="text"
                                    value={priceUpdate.commodity}
                                    onChange={e => setPriceUpdate({ ...priceUpdate, commodity: e.target.value })}
                                    className="w-full p-2 border rounded bg-white text-gray-900"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Price ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={priceUpdate.price}
                                    onChange={e => setPriceUpdate({ ...priceUpdate, price: e.target.value })}
                                    className="w-full p-2 border rounded bg-white text-gray-900"
                                    required
                                />
                            </div>
                            <Button type="submit" loading={loading} className="w-full">Update Price</Button>
                        </form>
                    </Modal>

                    {/* Config Modal */}
                    <Modal isOpen={showConfigModal} onClose={() => setShowConfigModal(false)} title="Oracle Configuration">
                        <form onSubmit={handleConfigUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Update Frequency (sec)</label>
                                <input
                                    type="number"
                                    value={oracleConfig.updateFrequency}
                                    onChange={e => setOracleConfig({ ...oracleConfig, updateFrequency: e.target.value })}
                                    className="w-full p-2 border rounded bg-white text-gray-900"
                                />
                            </div>
                            <Button type="submit" loading={loading} className="w-full">Save Config</Button>
                        </form>
                    </Modal>
                </div>
            </DashboardLayout>
        </RoleGuard>
    );
};

export default OracleDashboard;
