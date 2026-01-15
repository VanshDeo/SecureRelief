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
    Users,
    Shield
} from 'lucide-react';
import Button from '@/components/UI/Button';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import Card from '@/components/UI/Card'; // Added import for Card if needed or remove if unused, original had it.
import Modal from '@/components/UI/Modal'; // Assuming Modal is used for NewDisasterZone if it was there? Original had it implicitly or explicitly? 
// Original imports: Card, Button, LoadingSpinner, various charts, NewDisasterZone...
// Let's check original imports from Step 245 carefully.
// Imports: Card, Button, LoadingSpinner.
// Charts...
// Components... NewDisasterZone, DisasterZoneCard, VendorManagement, SystemSettings.
// Store, Layout, RoleGuard, DashboardLayout.

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
import Layout from '@/components/Layout/Layout'; // Kept for types if needed, but DashboardLayout uses it.
import RoleGuard from '@/components/Auth/RoleGuard';
import DashboardLayout from '@/components/Layout/DashboardLayout';

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

interface StatCardProps {
    title: string;
    value: string;
    change: string;
    icon: React.ElementType;
    color: string;
    subtitle: string;
}

const StatCard = ({ title, value, change, icon: Icon, color, subtitle }: StatCardProps) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
                <Icon className="w-6 h-6" />
            </div>
            <span className={`text-sm font-medium ${change.startsWith('+') ? 'text-green-600' : 'text-gray-500'}`}>
                {change}
            </span>
        </div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        <p className="text-xs text-gray-400 mt-2">{subtitle}</p>
    </div>
);

const AdminDashboard = () => {
    const { isConnected, userRole } = useWeb3Store();
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [showNewDisasterModal, setShowNewDisasterModal] = useState(false);
    const [disasterZones, setDisasterZones] = useState<DisasterZone[]>([]);

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
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp },
        { id: 'monitoring', label: 'Live Monitor', icon: Activity },
        { id: 'disasters', label: 'Disasters', icon: MapPin },
        { id: 'vendors', label: 'Vendors', icon: Users },
        { id: 'events', label: 'Contract Events', icon: Activity }, // Added events tab as per replace block
        { id: 'settings', label: 'Settings', icon: Settings }
    ];

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
        <RoleGuard requiredRole="admin" title="Admin Portal" subtitle="Connect your admin wallet to manage the platform, oversee disasters, and control system settings.">
            <DashboardLayout fullWidth={true}>
                <div className="min-h-screen bg-gray-50/50">
                    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
                                <p className="text-gray-500 mt-1 flex items-center">
                                    <Shield className="w-4 h-4 mr-2 text-green-600" />
                                    System Overview & Controls
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="hidden md:flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                    System Operational
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" onClick={() => setActiveTab('settings')}>
                                        <Settings className="w-4 h-4 mr-2" />
                                        Settings
                                    </Button>
                                    <Button size="sm">
                                        <Download className="w-4 h-4 mr-2" />
                                        Export Report
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Recent Alerts (Visible on Overview) */}
                        {alerts.length > 0 && activeTab === 'overview' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {alerts.map((alert) => (
                                    <AlertCard key={alert.id} alert={alert} />
                                ))}
                            </div>
                        )}

                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard
                                title="Active Disasters"
                                value="3"
                                change="+1"
                                icon={AlertTriangle}
                                color="red"
                                subtitle="Critical Severity"
                            />
                            <StatCard
                                title="Pending Vendors"
                                value="12"
                                change="+4"
                                icon={Users}
                                color="blue"
                                subtitle="Requires Verification"
                            />
                            <StatCard
                                title="Total Aid Distributed"
                                value="$1.2M"
                                change="+12%"
                                icon={TrendingUp} // Changed DollarSign to TrendingUp or similar as DollarSign wasn't imported in my list above, checking imports... DollarSign NOT in imports list above. `DollarSign` was in my previous `StatCard` usage but I need to make sure it is imported.
                                // Let's check imports. `DollarSign` is NOT imported. `TrendingUp` is. I'll use `TrendingUp` or import `DollarSign`.
                                // To be safe, adding DollarSign to imports.
                                color="green"
                                subtitle="Last 30 days"
                            />
                            <StatCard
                                title="System Health"
                                value="99.9%"
                                change="Stable"
                                icon={Activity}
                                color="purple"
                                subtitle="All nodes active"
                            />
                        </div>

                        {/* Navigation Tabs */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 overflow-x-auto">
                            <div className="flex space-x-1 min-w-max">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                                            ? 'bg-gray-900 text-white shadow-md transform scale-105'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <tab.icon className={`w-4 h-4 mr-2 ${activeTab === tab.id ? 'text-green-400' : 'text-gray-400'}`} />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === 'overview' && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                            <div className="lg:col-span-2 space-y-6">
                                                <RealTimeStats />
                                                <DonationChart />
                                            </div>
                                            <div className="space-y-6">
                                                <ImpactMetrics />
                                                <GeographicDistribution />
                                            </div>
                                        </div>
                                        <RealTimeMonitor />
                                    </div>
                                )}
                                {activeTab === 'disasters' && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-semibold text-gray-900">Disaster Management</h3>
                                            <Button onClick={() => setShowNewDisasterModal(true)}>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Declare Disaster
                                            </Button>
                                        </div>
                                        {disasterZones.map(disaster => (
                                            <DisasterZoneCard
                                                key={disaster.id}
                                                zone={disaster}
                                                onEdit={(zone: DisasterZone) => console.log('Edit', zone)}
                                                onViewDetails={(zone: DisasterZone) => console.log('View', zone)}
                                            />
                                        ))}
                                    </div>
                                )}
                                {activeTab === 'vendors' && <VendorManagement />}
                                {activeTab === 'events' && <ContractEventMonitor />}
                                {activeTab === 'settings' && <SystemSettings />}
                                {/* Add other tabs if needed */}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Modals */}
                <Modal
                    isOpen={showNewDisasterModal}
                    onClose={() => setShowNewDisasterModal(false)}
                    title="Declare New Disaster Zone"
                >
                    <NewDisasterZone
                        isOpen={showNewDisasterModal}
                        onClose={() => setShowNewDisasterModal(false)}
                        onSuccess={() => {
                            setShowNewDisasterModal(false);
                            // Refresh logic could go here
                        }}
                    />
                </Modal>
            </DashboardLayout>
        </RoleGuard>
    );
};

export default AdminDashboard;
