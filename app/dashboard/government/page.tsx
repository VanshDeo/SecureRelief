'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FileText, CheckCircle, AlertTriangle, Activity, BarChart3 } from 'lucide-react';
import { RoleGuard } from '@/components/auth/RoleGuard';

export default function GovernmentDashboard() {
    const [isSanctioned, setIsSanctioned] = useState(false);

    return (
        <RoleGuard allowedRoles={['government']}>
            <div className="container mx-auto p-4 md:p-8 space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Government Oversight Portal</h1>
                        <p className="text-muted-foreground">Monitor aid distribution and sanction disaster zones.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <FileText className="h-4 w-4 mr-2" /> Export Audit Log
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard icon={Activity} label="Active Zones" value="6" />
                    <StatCard icon={CheckCircle} label="Beneficiaries Verified" value="4,210" />
                    <StatCard icon={BarChart3} label="Total Aid Audited" value="$12.4M" />
                    <StatCard icon={AlertTriangle} label="Flagged Tx" value="2" theme="red" />
                </div>

                {/* Sanction Zone */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Pending Zone Approvals</h2>
                    <div className="space-y-4">
                        {!isSanctioned ? (
                            <div className="p-6 border bg-white rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                        <AlertTriangle className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Central Coast Flood Zone</h3>
                                        <p className="text-muted-foreground text-sm">Requested by: Disaster Relief Admin (0x88...21)</p>
                                        <p className="text-xs text-muted-foreground mt-1">Submitted: 2 hours ago</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 w-full md:w-auto">
                                    <Button variant="outline" className="flex-1 md:flex-none">
                                        <FileText className="h-4 w-4 mr-2" /> Review Docs
                                    </Button>
                                    <Button
                                        className="flex-1 md:flex-none bg-green-600 hover:bg-green-700"
                                        onClick={() => setIsSanctioned(true)}
                                    >
                                        <CheckCircle className="h-4 w-4 mr-2" /> Sanction Zone
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-6 bg-green-50 border border-green-200 rounded-xl flex items-center gap-4 text-green-800">
                                <CheckCircle className="h-6 w-6" />
                                <div>
                                    <h3 className="font-bold">Zone Sanctioned Successfully</h3>
                                    <p className="text-sm">Funds have been unlocked for Central Coast Flood Zone.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Audit Log Placeholder */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Recent Audit Logs</h2>
                    <div className="border rounded-xl bg-white overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 font-medium text-gray-500">Timestamp</th>
                                    <th className="px-6 py-3 font-medium text-gray-500">Event</th>
                                    <th className="px-6 py-3 font-medium text-gray-500">Executor</th>
                                    <th className="px-6 py-3 font-medium text-gray-500 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {[1, 2, 3, 4].map((i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="px-6 py-3 text-muted-foreground">2026-01-16 14:0{i}</td>
                                        <td className="px-6 py-3 font-medium">Voucher Redeemed</td>
                                        <td className="px-6 py-3 font-mono text-xs">0x71...9a</td>
                                        <td className="px-6 py-3 text-right">$50.00 USDC</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </RoleGuard>
    );
}

function StatCard({ icon: Icon, label, value, theme = 'blue' }: any) {
    return (
        <div className="p-6 bg-white border rounded-xl shadow-sm flex flex-col gap-2">
            <div className={`flex items-center gap-2 text-sm font-medium ${theme === 'red' ? 'text-red-500' : 'text-muted-foreground'}`}>
                <Icon className="h-4 w-4" />
                {label}
            </div>
            <h2 className="text-3xl font-bold">{value}</h2>
        </div>
    )
}
