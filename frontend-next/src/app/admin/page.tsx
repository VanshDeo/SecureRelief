'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin,
    Settings,
    BarChart3,
    Activity,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Plus,
    Download,
    Users
} from 'lucide-react';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import RealTimeStats from '@/components/Charts/RealTimeStats';
import DonationChart from '@/components/Charts/DonationChart';
import ImpactMetrics from '@/components/Charts/ImpactMetrics';
import GeographicDistribution from '@/components/Charts/GeographicDistribution';
import RealTimeMonitor from '@/components/DisasterRelief/RealTimeMonitor';
import ContractEventMonitor from '@/components/DisasterRelief/ContractEventMonitor';
import NewDisasterZone from '../../components/Admin/NewDisasterZone';
import DisasterZoneCard from '../../components/Admin/DisasterZoneCard';
import VendorManagement from '../../components/Admin/VendorManagement';
import SystemSettings from '../../components/Admin/SystemSettings';
import { useWeb3Store } from '@/store/web3Store';
import Layout from '@/components/Layout/Layout';

import GuestWelcome from '@/components/Auth/GuestWelcome';

interface Alert {
    id: number;
    type: 'warning' | 'error' | 'info';
    title: string;
    message: string;
    timestamp: Date;
}

interface DisasterZone {
    id: number;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    radiusKm: number;
    status: string;
    disasterType: string;
    severity: string;
    urgencyLevel: string;
    funding: number;
    createdAt: Date;
    estimatedAffected: number;
}

const AdminDashboard = () => {
    const { isConnected, userRole } = useWeb3Store();
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [showNewDisasterModal, setShowNewDisasterModal] = useState(false);
    const [disasterZones, setDisasterZones] = useState<DisasterZone[]>([]);

    interface NewZoneResult {
        zoneData?: DisasterZone;
        success: boolean;
        error?: string;
    }

    // Handle new disaster zone creation
    const handleNewZoneCreated = (result: NewZoneResult) => {
        const zoneData = result.zoneData;
        if (zoneData) {
            setDisasterZones(prev => [...prev, {
                ...zoneData,
                id: zoneData.id || Date.now(),
                createdAt: zoneData.createdAt || new Date()
            } as DisasterZone]);
        }
        setShowNewDisasterModal(false);
    };

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            setLoading(false);
            // Mock alerts
            setAlerts([
                {
                    id: 1,
                    type: 'warning',
                    title: 'High Transaction Volume',
                    message: 'Turkey Earthquake relief is experiencing unusually high donation volume',
                    timestamp: new Date(Date.now() - 300000)
                },
                {
                    id: 2,
                    type: 'info',
                    title: 'New Vendor Pending',
                    message: '3 vendors awaiting verification for Kerala Flood relief',
                    timestamp: new Date(Date.now() - 600000)
                }
            ]);

            // Mock disaster zones for demonstration
            setDisasterZones([
                {
                    id: 1,
                    name: 'Turkey Earthquake 2024',
                    description: 'Major earthquake relief operations in southeastern Turkey',
                    latitude: 37.0662,
                    longitude: 37.3833,
                    radiusKm: 100,
                    status: 'active',
                    disasterType: 'Earthquake',
                    severity: 'critical',
                    urgencyLevel: 'emergency',
                    funding: 50000,
                    createdAt: new Date(Date.now() - 86400000 * 5), // 5 days ago
                    estimatedAffected: 50000
                },
                {
                    id: 2,
                    name: 'Kerala Flood Relief',
                    description: 'Monsoon flood relief operations in Kerala state',
                    latitude: 10.8505,
                    longitude: 76.2711,
                    radiusKm: 150,
                    status: 'active',
                    disasterType: 'Flood',
                    severity: 'high',
                    urgencyLevel: 'high',
                    funding: 25000,
                    createdAt: new Date(Date.now() - 86400000 * 12), // 12 days ago
                    estimatedAffected: 25000
                }
            ]);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const tabs = [
        { id: 'overview', name: 'Overview', icon: BarChart3 },
        { id: 'analytics', name: 'Analytics', icon: TrendingUp },
        { id: 'monitoring', name: 'Live Monitor', icon: Activity },
        { id: 'disasters', name: 'Disasters', icon: MapPin },
        { id: 'vendors', name: 'Vendors', icon: Users },
        { id: 'settings', name: 'Settings', icon: Settings }
    ];

    const TabButton = ({ tab, active, onClick }: { tab: { id: string, name: string, icon: any }, active: boolean, onClick: (id: string) => void }) => {
        const Icon = tab.icon;
        return (
            <button
                onClick={() => onClick(tab.id)}
                className={`flex items-center px-6 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all duration-300 ${active
                    ? 'bg-avalanche-500 text-white shadow-lg shadow-avalanche-200'
                    : 'text-gray-400 hover:text-gray-900 hover:bg-white hover:shadow-sm'
                    }`}
            >
                <Icon className="w-4 h-4 mr-2" />
                {tab.name}
            </button>
        );
    };

    const AlertCard = ({ alert }: { alert: Alert }) => (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-4 rounded-2xl border ${alert.type === 'warning'
                ? 'bg-yellow-50 border-yellow-100 shadow-sm'
                : alert.type === 'error'
                    ? 'bg-red-50 border-red-100 shadow-sm'
                    : 'bg-blue-50 border-blue-100 shadow-sm'
                }`}
        >
            <div className="flex items-start">
                <div className={`p-1 rounded-full mr-3 ${alert.type === 'warning'
                    ? 'bg-yellow-100'
                    : alert.type === 'error'
                        ? 'bg-red-100'
                        : 'bg-blue-100'
                    }`}>
                    {alert.type === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    ) : alert.type === 'error' ? (
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                    ) : (
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                    )}
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">{alert.title}</h4>
                        <span className="text-[9px] font-bold text-gray-400">{alert.timestamp.toLocaleTimeString()}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 font-medium leading-relaxed">{alert.message}</p>
                </div>
            </div>
        </motion.div>
    );

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-screen">
                    <LoadingSpinner size="lg" aria-label="Loading admin dashboard..." />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen">
                <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="mb-1 text-4xl font-black text-gray-900 tracking-tight">
                                    Admin Dashboard
                                </h1>
                                <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">
                                    Global Network Monitoring & Response
                                </p>
                            </div>

                            <div className="flex items-center space-x-4">
                                <Button variant="outline">
                                    <Download className="w-4 h-4 mr-2" />
                                    Export Report
                                </Button>
                                <Button
                                    onClick={() => setShowNewDisasterModal(true)}
                                    disabled={!isConnected || userRole !== 'admin'}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    New Disaster
                                </Button>
                            </div>
                        </div>

                        {/* Alerts */}
                        {alerts.length > 0 && (
                            <div className="mt-6 space-y-3">
                                <h3 className="text-sm font-medium text-gray-900">Recent Alerts</h3>
                                {alerts.map((alert) => (
                                    <AlertCard key={alert.id} alert={alert} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Navigation Tabs */}
                    <div className="mb-8">
                        <div className="flex space-x-2 overflow-x-auto">
                            {tabs.map((tab) => (
                                <TabButton
                                    key={tab.id}
                                    tab={tab}
                                    active={activeTab === tab.id}
                                    onClick={setActiveTab}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Access Control Check */}
                    {!isConnected && (
                        <GuestWelcome
                            title="Admin Management Console"
                            subtitle="Connect your administrative wallet to manage disaster zones, verify vendors, and monitor system performance."
                        />
                    )}

                    {isConnected && userRole !== 'admin' && (
                        <GuestWelcome
                            title="Admin Access Required"
                            subtitle="This portal is reserved for system administrators. Your current role is not authorized for these features."
                            roleSpecific={`Your current role: ${userRole}`}
                        />
                    )}

                    {isConnected && userRole === 'admin' && (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {activeTab === 'overview' && (
                                    <div className="space-y-8">
                                        <RealTimeStats />
                                        <DonationChart />
                                        <ImpactMetrics />
                                        <GeographicDistribution />
                                        <ContractEventMonitor />
                                    </div>
                                )}

                                {activeTab === 'analytics' && (
                                    <div className="space-y-8">
                                        <ImpactMetrics />
                                        <DonationChart />
                                    </div>
                                )}

                                {activeTab === 'monitoring' && (
                                    <RealTimeMonitor />
                                )}

                                {activeTab === 'disasters' && (
                                    <div className="space-y-6">
                                        {/* Header with Create Button */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-900">Disaster Zones</h2>
                                                <p className="text-gray-600">Manage active disaster relief zones</p>
                                            </div>
                                            <Button
                                                onClick={() => setShowNewDisasterModal(true)}
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                Create New Zone
                                            </Button>
                                        </div>

                                        {/* Disaster Zones List */}
                                        {disasterZones.length === 0 ? (
                                            <Card>
                                                <div className="p-12 text-center">
                                                    <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                        No Disaster Zones Yet
                                                    </h3>
                                                    <p className="text-gray-600 mb-6">
                                                        Create your first disaster zone to start managing relief operations.
                                                    </p>
                                                    <Button
                                                        onClick={() => setShowNewDisasterModal(true)}
                                                    >
                                                        <Plus className="w-4 h-4 mr-2" />
                                                        Create First Zone
                                                    </Button>
                                                </div>
                                            </Card>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {disasterZones.map((zone) => (
                                                    <DisasterZoneCard
                                                        key={zone.id}
                                                        zone={zone}
                                                        onEdit={(zone) => {
                                                            console.log('Edit zone:', zone)
                                                        }}
                                                        onViewDetails={(zone) => {
                                                            console.log('View details:', zone)
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'vendors' && (
                                    <VendorManagement />
                                )}

                                {activeTab === 'settings' && (
                                    <SystemSettings />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>

                {/* New Disaster Zone Modal */}
                <NewDisasterZone
                    isOpen={showNewDisasterModal}
                    onClose={() => setShowNewDisasterModal(false)}
                    onSuccess={handleNewZoneCreated}
                />
            </div>
        </Layout>
    );
};

export default AdminDashboard;
