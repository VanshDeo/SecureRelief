'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
    Heart,
    MapPin,
    CreditCard,
    User,
    Phone,
    FileText,
    CheckCircle,
    Clock,
    Shield,
    Navigation,
    AlertTriangle,
    MessageSquare,
    CheckCircle2,
    Building2,
    TrendingUp,
    Activity
} from 'lucide-react';
import { useWeb3Store } from '@/store/web3Store';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Modal from '@/components/UI/Modal';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import Layout from '@/components/Layout/Layout';
import RoleGuard from '@/components/Auth/RoleGuard';
import DashboardLayout from '@/components/Layout/DashboardLayout';

interface VictimProfile {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    familySize: number;
    registrationDate: string;
    verificationStatus: string;
    totalAidReceived: number;
    applications: number;
    activeVouchers: number;
    emergencyContact: string;
    medicalConditions: string;
    specialNeeds: string;
    riskLevel: string;
    currentLocation: { lat: number, lng: number } | null;
}

interface Voucher {
    id: string;
    type: string;
    amount: number;
    status: string;
    expiresAt: string;
    issuedAt: string;
    description: string;
    requestId: string;
    qrCode: string;
    usageInstructions: string;
}

interface Application {
    id: string;
    type: string;
    status: string;
    submittedAt: string;
    amount: number;
    description: string;
    urgency: string;
    category: string;
}

interface Vendor {
    id: string;
    name: string;
    type: string;
    distance: number;
    address: string;
    phone: string;
    hours: string;
    acceptsVouchers: boolean;
    rating: number;
    services: string[];
}

interface EmergencyContact {
    name: string;
    number: string;
    type: string;
}

interface RequestHistoryItem {
    id: string;
    date: string;
    type: string;
    status: string;
    amount: number;
}

interface VictimDocument {
    id: string;
    name: string;
    url: string;
    type: string;
}

interface FamilyMember {
    id: string;
    name: string;
    relation: string;
    age: number;
}

const VictimPortal = () => {
    const { isConnected, account } = useWeb3Store();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(false);
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [showAidRequestModal, setShowAidRequestModal] = useState(false);
    const [showEmergencyModal, setShowEmergencyModal] = useState(false);
    const [profile, setProfile] = useState<VictimProfile | null>(null);
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [nearbyVendors, setNearbyVendors] = useState<Vendor[]>([]);
    const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
    const [requestHistory, setRequestHistory] = useState<RequestHistoryItem[]>([]);

    // Registration form state
    const [registrationData, setRegistrationData] = useState({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        familySize: '',
        disasterType: '',
        urgency: 'medium',
        description: '',
        documents: [] as VictimDocument[],
        emergencyContact: '',
        medicalConditions: '',
        specialNeeds: '',
        currentLocation: null as { lat: number, lng: number } | null
    });

    // Aid request state
    const [aidRequest, setAidRequest] = useState({
        requestType: 'immediate',
        category: 'food',
        subCategory: '',
        amount: '',
        description: '',
        urgency: 'medium',
        preferredVendor: '',
        deliveryMethod: 'pickup',
        deliveryAddress: '',
        requestDate: '',
        recurringSchedule: '',
        documents: [] as VictimDocument[],
        photos: [] as VictimDocument[],
        location: null as { lat: number, lng: number } | null,
        familyMembers: [] as FamilyMember[],
        medicalNeeds: '',
        accessibilityNeeds: '',
        alternateContact: '',
        previousRequestId: ''
    });

    const [locationLoading, setLocationLoading] = useState(false);

    // Mock victim profile and data
    useEffect(() => {
        if (isConnected) {
            // Mock profile if already exists
            const isRegistered = localStorage.getItem(`victim_${account}`);

            if (isRegistered || account) {
                setProfile({
                    fullName: 'Sarah Johnson',
                    phone: '+1 (555) 123-4567',
                    email: 'sarah.johnson@email.com',
                    address: '123 Relief Street, Austin, TX 78701',
                    familySize: 4,
                    registrationDate: '2024-08-01',
                    verificationStatus: 'verified',
                    totalAidReceived: 1250.50,
                    applications: 5,
                    activeVouchers: 2,
                    emergencyContact: '+1 (555) 987-6543',
                    medicalConditions: 'Diabetes, Hypertension',
                    specialNeeds: 'Wheelchair accessible',
                    riskLevel: 'medium',
                    currentLocation: { lat: 30.2672, lng: -97.7431 }
                });

                setVouchers([
                    {
                        id: 'VCH-2024-001',
                        type: 'food',
                        amount: 150.00,
                        status: 'active',
                        expiresAt: '2024-08-20',
                        issuedAt: '2024-08-10',
                        description: 'Emergency food assistance for family of 4',
                        requestId: 'REQ-2024-015',
                        qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI0Y3RjhGQSIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzM3NDE1MSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UVIgQ29kZTwvdGV4dD48L3N2Zz4=',
                        usageInstructions: 'Present QR code at checkout. Valid for food and water only.'
                    },
                    {
                        id: 'VCH-2024-002',
                        type: 'medical',
                        amount: 100.00,
                        status: 'active',
                        expiresAt: '2024-08-25',
                        issuedAt: '2024-08-08',
                        description: 'Medical supplies voucher - prescription medications',
                        requestId: 'REQ-2024-012',
                        qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI0Y3RjhGQSIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzM3NDE1MSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UVIgQ29kZTwvdGV4dD48L3N2Zz4=',
                        usageInstructions: 'Present with prescription. May require ID verification.'
                    }
                ]);

                setApplications([
                    {
                        id: 'REQ-2024-015',
                        type: 'Emergency Food Assistance',
                        status: 'approved',
                        submittedAt: '2024-08-08',
                        amount: 150.00,
                        description: 'Family of 4 affected by flood damage',
                        urgency: 'high',
                        category: 'food'
                    },
                    {
                        id: 'REQ-2024-018',
                        type: 'Housing Assistance',
                        status: 'under_review',
                        submittedAt: '2024-08-10',
                        amount: 500.00,
                        description: 'Temporary housing due to severe home damage',
                        urgency: 'high',
                        category: 'shelter'
                    }
                ]);

                setNearbyVendors([
                    {
                        id: 'VND-001',
                        name: 'Austin Community Food Bank',
                        type: 'food',
                        distance: 0.8,
                        address: '2516 S Pleasant Valley Rd, Austin, TX',
                        phone: '(512) 282-2111',
                        hours: 'Mon-Fri 8AM-5PM',
                        acceptsVouchers: true,
                        rating: 4.8,
                        services: ['Food Distribution', 'Mobile Pantry', 'Hot Meals']
                    }
                ]);

                setEmergencyContacts([
                    { name: 'Emergency Services', number: '911', type: 'emergency' },
                    { name: 'Red Cross Austin', number: '(512) 928-4271', type: 'relief' },
                    { name: 'Crisis Text Line', number: 'Text HOME to 741741', type: 'mental_health' }
                ]);

                setRequestHistory([
                    { id: 'REQ-2024-015', date: '2024-08-08', type: 'Food', status: 'completed', amount: 150 },
                    { id: 'REQ-2024-012', date: '2024-08-06', type: 'Medical', status: 'completed', amount: 100 }
                ]);
            }
        }
    }, [isConnected, account]);

    const getCurrentLocation = async () => {
        setLocationLoading(true);
        try {
            if (!navigator.geolocation) {
                throw new Error('Geolocation is not supported');
            }
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            const location = { lat: position.coords.latitude, lng: position.coords.longitude };
            toast.success('Location obtained successfully');
            return location;
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Unknown error';
            toast.error('Unable to get location: ' + msg);
            return null;
        } finally {
            setLocationLoading(false);
        }
    };

    const handleAidRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            const requestId = `REQ-${Date.now()}`;
            const newApplication = {
                id: requestId,
                type: `${aidRequest.category} assistance`,
                status: 'pending',
                submittedAt: new Date().toISOString().split('T')[0],
                amount: parseFloat(aidRequest.amount),
                description: aidRequest.description,
                urgency: aidRequest.urgency,
                category: aidRequest.category
            };
            setApplications(prev => [newApplication, ...prev]);
            setShowAidRequestModal(false);
            toast.success('Aid request submitted successfully!');
        } catch (error) {
            toast.error('Request submission failed');
        } finally {
            setLoading(false);
        }
    };

    const handleEmergencyRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success('🚨 Emergency request dispatched! Response teams notified.');
            setShowEmergencyModal(false);
        } catch (error) {
            toast.error('Emergency request failed');
        } finally {
            setLoading(false);
        }
    };

    const handleRegistration = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            const newProfile: VictimProfile = {
                fullName: registrationData.fullName,
                phone: registrationData.phone,
                email: registrationData.email,
                address: registrationData.address,
                familySize: parseInt(registrationData.familySize) || 1,
                registrationDate: new Date().toISOString().split('T')[0],
                verificationStatus: 'pending',
                totalAidReceived: 0,
                applications: 0,
                activeVouchers: 0,
                emergencyContact: registrationData.emergencyContact,
                medicalConditions: registrationData.medicalConditions,
                specialNeeds: registrationData.specialNeeds,
                riskLevel: registrationData.urgency || 'medium',
                currentLocation: registrationData.currentLocation
            };
            localStorage.setItem(`victim_${account}`, JSON.stringify(newProfile));
            setProfile(newProfile);
            setShowRegistrationModal(false);
            toast.success('Registration submitted successfully!');
        } catch (error) {
            toast.error('Registration failed');
        } finally {
            setLoading(false);
        }
    };

    // If not connected, RoleGuard (added below) wraps this, so this check will technically be redundant but we can keep it for double safety if we weren't using RoleGuard.
    // However, we want to replace the manual pattern with RoleGuard for consistency.
    // Note: Victim portal is a bit unique - it might allow access to anyone to *register*, so role check 'victim' might be too strict if they are new.
    // But RoleGuard 'victim' implies they MUST have that role.
    // The previous code showed "Registration Required" if connected but no profile.
    // We should probably use RoleGuard with requiredRole="victim" but if the user is just a 'user' (connected but no specific role), they can't see this page?
    // Actually, 'victim' role is assigned AFTER registration.
    // So for Victim portal, we might just want `checkConnection` but not strict `victim` role if they need to register here.
    // HOWEVER, typical flow: Register Page -> assign role -> Redirect to Dashboard.
    // So if they are here, they should have the role.
    // If they don't have the role, RoleGuard shows "Access Denied".
    // Let's assume registration happens elsewhere (like /register) or RoleGuard handles redirection.
    // Looking at `register/page.tsx`, it handles role assignment.
    // So strict `victim` role check is correct here.

    return (
        <RoleGuard requiredRole="victim" title="Victim Assistance Portal" subtitle="Access disaster relief assistance and manage your aid.">
            <DashboardLayout fullWidth={true}>
                <div className="min-h-screen">
                    <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
                        {/* Header */}
                        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Victim Portal</h1>
                                <p className="text-gray-600">Access disaster relief assistance and manage your aid</p>
                            </div>
                            <div className="flex space-x-4">
                                <Button
                                    onClick={() => setShowEmergencyModal(true)}
                                    variant="danger"
                                    icon={AlertTriangle}
                                >
                                    Emergency
                                </Button>
                                <Button
                                    onClick={() => setShowAidRequestModal(true)}
                                    icon={Heart}
                                >
                                    Request Aid
                                </Button>
                            </div>
                        </div>

                        {/* Profile Overview */}
                        {profile && (
                            <Card className="p-6 mb-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-red-100 rounded-full">
                                            <User className="w-8 h-8 text-red-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                                {profile.fullName}
                                                <CheckCircle className="w-5 h-5 ml-2 text-green-500" />
                                            </h2>
                                            <p className="text-gray-500 text-sm">{profile.address}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-8 text-center">
                                        <div>
                                            <p className="text-2xl font-bold text-gray-900">{profile.applications}</p>
                                            <p className="text-xs text-gray-500">Applications</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-green-600">${profile.totalAidReceived}</p>
                                            <p className="text-xs text-gray-500">Aid Received</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-blue-600">{profile.activeVouchers}</p>
                                            <p className="text-xs text-gray-500">Vouchers</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* Tab Navigation */}
                        <div className="mb-6 border-b border-gray-200">
                            <nav className="flex -mb-px space-x-8">
                                {[
                                    { id: 'dashboard', label: 'Dashboard', icon: Heart },
                                    { id: 'vouchers', label: 'Vouchers', icon: CreditCard },
                                    { id: 'applications', label: 'Applications', icon: FileText },
                                    { id: 'nearby', label: 'Nearby Help', icon: MapPin },
                                    { id: 'emergency', label: 'Emergency', icon: AlertTriangle }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === tab.id
                                            ? 'border-red-500 text-red-600'
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
                            {activeTab === 'dashboard' && (
                                <motion.div
                                    key="dashboard"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                >
                                    <Card className="p-6">
                                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                                            <Activity className="w-5 h-5 mr-1 text-red-500" /> Recent Activity
                                        </h3>
                                        <div className="space-y-4">
                                            {applications.length > 0 ? applications.map(app => (
                                                <div key={app.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{app.type}</p>
                                                        <p className="text-xs text-gray-500">{app.submittedAt}</p>
                                                    </div>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${app.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                        app.status === 'under_review' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {app.status.replace('_', ' ')}
                                                    </span>
                                                </div>
                                            )) : (
                                                <div className="text-center py-8 text-gray-500">No recent activity</div>
                                            )}
                                        </div>
                                    </Card>

                                    <Card className="p-6">
                                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                                            <TrendingUp className="w-5 h-5 mr-1 text-green-500" /> Aid Statistics
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-blue-50 rounded-lg text-center">
                                                <p className="text-2xl font-bold text-blue-600">{requestHistory.length}</p>
                                                <p className="text-xs text-blue-700 font-medium">Total Requests</p>
                                            </div>
                                            <div className="p-4 bg-green-50 rounded-lg text-center">
                                                <p className="text-2xl font-bold text-green-600">${profile?.totalAidReceived || 0}</p>
                                                <p className="text-xs text-green-700 font-medium">Total Value</p>
                                            </div>
                                        </div>
                                        <div className="mt-6 p-4 border border-gray-100 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-2">Verification Progress</p>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">Level 3 Verification Complete</p>
                                        </div>
                                    </Card>
                                </motion.div>
                            )}

                            {activeTab === 'vouchers' && (
                                <motion.div
                                    key="vouchers"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                >
                                    {vouchers.map(voucher => (
                                        <Card key={voucher.id} className="p-6 border-t-4 border-red-500 shadow-md">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="font-bold text-gray-900">{voucher.id}</h4>
                                                    <p className="text-xs text-gray-500 mt-1 uppercase font-semibold">{voucher.type} Assistance</p>
                                                </div>
                                                <span className="px-2 py-1 bg-green-100 text-green-800 text-[10px] font-bold rounded-full">ACTIVE</span>
                                            </div>
                                            <div className="text-center mb-6">
                                                <p className="text-4xl font-black text-gray-900">${voucher.amount}</p>
                                                <p className="text-xs text-gray-400 mt-1">Available Balance</p>
                                            </div>
                                            <div className="bg-white p-3 border rounded-xl mb-4">
                                                <img src={voucher.qrCode} alt="QR" className="w-32 h-32 mx-auto" />
                                            </div>
                                            <div className="space-y-2">
                                                <Button variant="primary" className="w-full text-sm">Download Receipt</Button>
                                                <p className="text-[10px] text-gray-400 text-center uppercase tracking-tighter">Valid until {voucher.expiresAt}</p>
                                            </div>
                                        </Card>
                                    ))}
                                </motion.div>
                            )}

                            {activeTab === 'applications' && (
                                <motion.div
                                    key="applications"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-4"
                                >
                                    {applications.map(app => (
                                        <Card key={app.id} className="p-5 hover:border-red-200 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <div className="flex space-x-4">
                                                    <div className="p-3 bg-gray-50 rounded-lg">
                                                        <FileText className="w-6 h-6 text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900">{app.id}</h4>
                                                        <p className="text-sm font-medium text-gray-700">{app.type}</p>
                                                        <p className="text-xs text-gray-500 mt-1">{app.description}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-gray-900">${app.amount}</p>
                                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${app.status === 'approved' ? 'text-green-600' : 'text-blue-600'
                                                        }`}>{app.status.replace('_', ' ')}</span>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </motion.div>
                            )}

                            {activeTab === 'nearby' && (
                                <motion.div
                                    key="nearby"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                >
                                    <Card className="p-4 bg-blue-50 border-blue-100 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Navigation className="w-5 h-5 text-blue-600 mr-3" />
                                            <p className="text-sm text-blue-900 font-medium">Auto-detecting resources based on your location</p>
                                        </div>
                                        <Button size="sm" variant="outline" onClick={getCurrentLocation} loading={locationLoading}>Update Location</Button>
                                    </Card>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {nearbyVendors.map(vendor => (
                                            <Card key={vendor.id} className="p-6">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="p-2 bg-red-100 rounded-full text-red-600">
                                                        <Building2 className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900">{vendor.name}</h4>
                                                        <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded uppercase">{vendor.type}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2 mb-6">
                                                    <p className="text-xs text-gray-600 flex items-center">
                                                        <MapPin className="w-3 h-3 mr-2" /> {vendor.address}
                                                    </p>
                                                    <p className="text-xs text-gray-600 flex items-center">
                                                        <Phone className="w-3 h-3 mr-2" /> {vendor.phone}
                                                    </p>
                                                    <p className="text-xs text-gray-600 flex items-center">
                                                        <Clock className="w-3 h-3 mr-2" /> {vendor.hours}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button size="sm" className="flex-1">Call</Button>
                                                    <Button size="sm" variant="outline" className="flex-1">Directions</Button>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'emergency' && (
                                <motion.div
                                    key="emergency"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                >
                                    <Card className="p-8 bg-red-600 text-white border-0 shadow-xl overflow-hidden relative">
                                        <div className="relative z-10">
                                            <div className="flex items-center mb-4">
                                                <AlertTriangle className="w-8 h-8 mr-3 animate-pulse" />
                                                <h3 className="text-2xl font-black uppercase tracking-tighter">Emergency Hub</h3>
                                            </div>
                                            <p className="text-red-100 mb-8 max-w-xl">
                                                If you are in immediate danger, call <strong>911</strong> immediately. This portal dispatch notifies
                                                local relief teams and updates your status on the blockchain for priority response.
                                            </p>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                {emergencyContacts.map((c, i) => (
                                                    <a key={i} href={`tel:${c.number}`} className="p-4 bg-red-700/50 hover:bg-red-700 transition-colors rounded-xl border border-red-500/50 block">
                                                        <p className="text-[10px] text-red-200 uppercase font-black mb-1">{c.name}</p>
                                                        <p className="text-lg font-bold">{c.number}</p>
                                                    </a>
                                                ))}
                                            </div>
                                            <div className="mt-8">
                                                <Button variant="outline" onClick={() => setShowEmergencyModal(true)} className="bg-white text-red-600 border-0 px-8 py-3 h-auto font-bold uppercase tracking-widest text-xs">
                                                    Dispatch Rescue Team
                                                </Button>
                                            </div>
                                        </div>
                                        <AlertTriangle className="absolute top-0 right-0 w-64 h-64 text-red-500 opacity-20 transform translate-x-1/4 -translate-y-1/4" />
                                    </Card>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Card className="p-6">
                                            <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                                                <Shield className="w-5 h-5 mr-2 text-blue-500" /> Safety Protocols
                                            </h4>
                                            <ul className="space-y-3 text-sm text-gray-600">
                                                <li className="flex items-start"><CheckCircle2 className="w-4 h-4 mr-2 text-green-500 mt-0.5" /> Stay away from downed lines</li>
                                                <li className="flex items-start"><CheckCircle2 className="w-4 h-4 mr-2 text-green-500 mt-0.5" /> Move to higher ground if flooding is reported</li>
                                                <li className="flex items-start"><CheckCircle2 className="w-4 h-4 mr-2 text-green-500 mt-0.5" /> Keep emergency documents in waterproof bags</li>
                                            </ul>
                                        </Card>
                                        <Card className="p-6">
                                            <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                                                <MessageSquare className="w-5 h-5 mr-2 text-purple-500" /> Crisis Support
                                            </h4>
                                            <p className="text-sm text-gray-600 mb-4">Chat with a licensed mental health professional specialized in disaster recovery.</p>
                                            <Button size="sm" variant="outline" className="w-full">Start Chat</Button>
                                        </Card>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Modals */}
                    <Modal isOpen={showAidRequestModal} onClose={() => setShowAidRequestModal(false)} title="Request Assistance">
                        <form onSubmit={handleAidRequest} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Emergency food for family of 4"
                                    className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                                    onChange={e => setAidRequest({ ...aidRequest, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Amount Needed ($)</label>
                                <input
                                    type="number"
                                    placeholder="100.00"
                                    className="w-full p-2 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                                    onChange={e => setAidRequest({ ...aidRequest, amount: e.target.value })}
                                    required
                                />
                            </div>
                            <Button type="submit" loading={loading} className="w-full">Submit Request</Button>
                        </form>
                    </Modal>

                    <Modal isOpen={showEmergencyModal} onClose={() => setShowEmergencyModal(false)} title="Report Emergency">
                        <form onSubmit={handleEmergencyRequest} className="space-y-4">
                            <textarea
                                placeholder="Emergency details..."
                                className="w-full p-2 border rounded bg-white text-gray-900"
                                rows={4}
                                required
                            />
                            <Button type="submit" loading={loading} variant="danger" className="w-full">Send Alert</Button>
                        </form>
                    </Modal>
                </div>
            </DashboardLayout>
        </RoleGuard>
    );
};

export default VictimPortal;
