'use client';

import React, { useState } from 'react';
import {
    Shield,
    Database,
    Bell,
    Globe,
    Settings,
    Save,
    RefreshCw,
    AlertCircle,
    Info
} from 'lucide-react';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import { toast } from 'react-hot-toast';

const SystemSettings = () => {
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        platformName: 'SecureRelief Network',
        feeRecipient: '0x1234...5678',
        emergencyThreshold: 1000000,
        donationGasLimit: 300000,
        autoVerificationEnabled: false,
        debugMode: true,
        notificationEmails: 'admin@securerelief.io',
        maintenanceMode: false
    });

    const handleSave = async () => {
        setSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSaving(false);
        toast.success('System settings updated successfully');
    };

    const handleReset = () => {
        if (confirm('Are you sure you want to reset settings to default?')) {
            toast.success('Settings reset to default');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">System Configuration</h2>
                    <p className="text-sm text-gray-600">Manage global platform parameters and security rules</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleReset}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reset
                    </Button>
                    <Button size="sm" onClick={handleSave} loading={saving}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* General Settings */}
                <Card className="p-6">
                    <div className="flex items-center mb-6">
                        <Settings className="w-5 h-5 text-gray-500 mr-2" />
                        <h3 className="font-semibold text-gray-900">General Information</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={settings.platformName}
                                onChange={e => setSettings({ ...settings, platformName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notification Emails</label>
                            <input
                                type="email"
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                value={settings.notificationEmails}
                                onChange={e => setSettings({ ...settings, notificationEmails: e.target.value })}
                            />
                            <p className="text-xs text-gray-500 mt-1">Comma-separated list of administrative emails.</p>
                        </div>
                    </div>
                </Card>

                {/* Blockchain Settings */}
                <Card className="p-6">
                    <div className="flex items-center mb-6">
                        <Globe className="w-5 h-5 text-blue-500 mr-2" />
                        <h3 className="font-semibold text-gray-900">Blockchain Configuration</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fee Recipient Address</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded-lg bg-gray-50 font-mono text-sm"
                                value={settings.feeRecipient}
                                readOnly
                            />
                            <p className="text-xs text-gray-500 mt-1">Managed via smart contract governance.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Default Gas Limit</label>
                                <input
                                    type="number"
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    value={settings.donationGasLimit}
                                    onChange={e => setSettings({ ...settings, donationGasLimit: parseInt(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Threshold</label>
                                <input
                                    type="number"
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    value={settings.emergencyThreshold}
                                    onChange={e => setSettings({ ...settings, emergencyThreshold: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Security and Features */}
                <Card className="p-6">
                    <div className="flex items-center mb-6">
                        <Shield className="w-5 h-5 text-green-500 mr-2" />
                        <h3 className="font-semibold text-gray-900">Security & Features</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <p className="text-sm font-medium text-gray-900">Auto-Verification</p>
                                <p className="text-xs text-gray-500">Enable AI-assisted vendor verification</p>
                            </div>
                            <button
                                className={`w-12 h-6 rounded-full transition-colors relative ${settings.autoVerificationEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
                                onClick={() => setSettings({ ...settings, autoVerificationEnabled: !settings.autoVerificationEnabled })}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.autoVerificationEnabled ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <p className="text-sm font-medium text-gray-900">Debug Mode</p>
                                <p className="text-xs text-gray-500">Enable advanced logging and dev tools</p>
                            </div>
                            <button
                                className={`w-12 h-6 rounded-full transition-colors relative ${settings.debugMode ? 'bg-blue-600' : 'bg-gray-300'}`}
                                onClick={() => setSettings({ ...settings, debugMode: !settings.debugMode })}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.debugMode ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>
                </Card>

                {/* System Status */}
                <Card className="p-6 border-red-100 bg-red-50/30">
                    <div className="flex items-center mb-6">
                        <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                        <h3 className="font-semibold text-gray-900">Danger Zone</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-white border border-red-100 rounded-lg">
                            <div>
                                <p className="text-sm font-medium text-gray-900 text-red-700">Maintenance Mode</p>
                                <p className="text-xs text-gray-500">Disconnect frontend from smart contracts</p>
                            </div>
                            <button
                                className={`w-12 h-6 rounded-full transition-colors relative ${settings.maintenanceMode ? 'bg-red-600' : 'bg-gray-300'}`}
                                onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.maintenanceMode ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                        <div className="p-3 rounded-lg border border-yellow-200 bg-yellow-50 flex items-start">
                            <Info className="w-4 h-4 text-yellow-600 mr-2 mt-0.5" />
                            <p className="text-xs text-yellow-700">
                                Enabling maintenance mode will prevent all users from interacting with the platform. Use with caution.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default SystemSettings;
