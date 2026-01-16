'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Shield,
    CreditCard,
    Edit2,
    Save,
    Camera,
    History
} from 'lucide-react';
import Image from 'next/image';
import { useWeb3Store } from '@/store/web3Store';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { toast } from 'react-hot-toast';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import RoleGuard from '@/components/Auth/RoleGuard';

const ProfilePage = () => {
    const { isConnected, account, userRole, usdcBalance, setUserRole } = useWeb3Store();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Mock profile data state
    const [profileData, setProfileData] = useState({
        displayName: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, USA',
        bio: 'Disaster relief coordinator and frequent donor.',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    });

    const handleSave = async () => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setIsEditing(false);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <RoleGuard title="User Profile" subtitle="Connect your wallet to view and manage your profile settings.">
            <DashboardLayout fullWidth={true}>
                <div className="min-h-screen">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                            <p className="text-gray-600">Manage your personal information and account settings</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column - Profile Card */}
                            <div className="lg:col-span-1">
                                <Card className="p-6 text-center">
                                    <div className="relative inline-block mb-4">
                                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto">
                                            <Image
                                                src={profileData.avatar}
                                                alt="Profile"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        {isEditing && (
                                            <button className="absolute bottom-0 right-0 p-2 bg-red-600 rounded-full text-white shadow-lg hover:bg-red-700 transition-colors">
                                                <Camera className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    <h2 className="text-xl font-bold text-gray-900 mb-1">{profileData.displayName}</h2>
                                    <p className="text-sm text-gray-500 mb-4">{userRole ? userRole.toUpperCase() : 'USER'}</p>

                                    <div className="flex justify-center mb-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${isConnected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {isConnected ? 'Wallet Connected' : 'Wallet Disconnected'}
                                        </span>
                                    </div>

                                    <div className="border-t border-gray-100 pt-4 text-left">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-600">Wallet Balance</span>
                                            <span className="font-bold text-gray-900">${parseFloat(usdcBalance).toLocaleString()} USDC</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Account Status</span>
                                            <span className="text-green-600 font-medium text-sm flex items-center">
                                                <Shield className="w-3 h-3 mr-1" /> Verified
                                            </span>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-6 mt-6">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                                        <History className="w-5 h-5 mr-2 text-gray-500" />
                                        Recent Activity
                                    </h3>
                                    <div className="space-y-4">
                                        {[1, 2, 3].map((_, i) => (
                                            <div key={i} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Profile Updated</p>
                                                    <p className="text-xs text-gray-500">2 hours ago</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>

                            {/* Right Column - Details Form */}
                            <div className="lg:col-span-2">
                                <Card className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                                        <Button
                                            variant={isEditing ? 'primary' : 'outline'}
                                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                            loading={loading}
                                            icon={isEditing ? Save : Edit2}
                                        >
                                            {isEditing ? 'Save Changes' : 'Edit Profile'}
                                        </Button>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Full Name
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <User className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        readOnly={!isEditing}
                                                        value={profileData.displayName}
                                                        onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                                                        className={`block w-full pl-10 pr-3 py-2 border rounded-lg sm:text-sm transition-colors ${isEditing
                                                            ? 'border-gray-300 focus:ring-green-500 focus:border-green-500 bg-white'
                                                            : 'border-transparent bg-gray-50 text-gray-900'
                                                            }`}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Email Address
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Mail className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="email"
                                                        readOnly={!isEditing}
                                                        value={profileData.email}
                                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                        className={`block w-full pl-10 pr-3 py-2 border rounded-lg sm:text-sm transition-colors ${isEditing
                                                            ? 'border-gray-300 focus:ring-green-500 focus:border-green-500 bg-white'
                                                            : 'border-transparent bg-gray-50 text-gray-900'
                                                            }`}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Phone Number
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Phone className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="tel"
                                                        readOnly={!isEditing}
                                                        value={profileData.phone}
                                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                        className={`block w-full pl-10 pr-3 py-2 border rounded-lg sm:text-sm transition-colors ${isEditing
                                                            ? 'border-gray-300 focus:ring-green-500 focus:border-green-500 bg-white'
                                                            : 'border-transparent bg-gray-50 text-gray-900'
                                                            }`}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Location
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <MapPin className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        readOnly={!isEditing}
                                                        value={profileData.location}
                                                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                                        className={`block w-full pl-10 pr-3 py-2 border rounded-lg sm:text-sm transition-colors ${isEditing
                                                            ? 'border-gray-300 focus:ring-green-500 focus:border-green-500 bg-white'
                                                            : 'border-transparent bg-gray-50 text-gray-900'
                                                            }`}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Bio
                                            </label>
                                            <textarea
                                                rows={4}
                                                readOnly={!isEditing}
                                                value={profileData.bio}
                                                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                                className={`block w-full px-3 py-2 border rounded-lg sm:text-sm transition-colors ${isEditing
                                                    ? 'border-gray-300 focus:ring-green-500 focus:border-green-500 bg-white'
                                                    : 'border-transparent bg-gray-50 text-gray-900'
                                                    }`}
                                            />
                                        </div>

                                        <div className="pt-6 border-t border-gray-100">
                                            <h4 className="text-sm font-medium text-gray-900 mb-4">Connected Wallet</h4>
                                            <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                <CreditCard className="w-5 h-5 text-gray-500 mr-3" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">MetaMask</p>
                                                    <p className="text-xs text-gray-500 font-mono">{account || 'Not connected'}</p>
                                                </div>
                                                {isConnected && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Role Switcher (Dev Tool) */}
                                        <div className="mt-8 pt-8 border-t border-gray-100">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Management (Dev Tool)</h3>
                                            <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
                                                <p className="text-sm text-orange-700 mb-4">
                                                    Use this tool to switch roles and verify different dashboard views.
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {['Admin', 'Government', 'Treasury', 'Oracle', 'Vendor', 'Victim', 'Donor'].map((role) => (
                                                        <Button
                                                            key={role}
                                                            variant={userRole === role.toLowerCase() ? 'primary' : 'outline'}
                                                            size="sm"
                                                            onClick={() => setUserRole(role.toLowerCase())}
                                                            className="capitalize"
                                                        >
                                                            {role}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </RoleGuard>
    );
};

export default ProfilePage;
