'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { FileText, CheckCircle, AlertTriangle, Activity, BarChart3, MapPin } from 'lucide-react';
import { RoleGuard } from '@/components/auth/RoleGuard';

export default function AgencyDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedZone, setSelectedZone] = useState<any>(null);
    const [zones, setZones] = useState([
        { id: 1, name: "Central Coast Flood Zone", type: "Flood", requestedBy: "0x88...21", date: "2026-01-16", status: "pending", budget: "500,000 USDC", docs: "flood_assessment_v1.pdf" },
        { id: 2, name: "Desert Drought Relief", type: "Drought", requestedBy: "0x42...9a", date: "2026-01-15", status: "sanctioned", budget: "1,200,000 USDC", docs: "drought_plan.pdf" },
    ]);

    const handleSanction = (id: number) => {
        setZones(zones.map(z => z.id === id ? { ...z, status: "sanctioned" } : z));
        setSelectedZone(null);
    };

    return (
        <RoleGuard allowedRoles={['agency']}>
            <div className="container mx-auto p-4 md:p-8 space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Agency Oversight Portal</h1>
                        <p className="text-muted-foreground">Monitor aid distribution, audit flows, and sanction disaster zones.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant={activeTab === 'overview' ? 'default' : 'outline'} onClick={() => setActiveTab('overview')}>
                            <Activity className="h-4 w-4 mr-2" /> Overview
                        </Button>
                        <Button variant={activeTab === 'zones' ? 'default' : 'outline'} onClick={() => setActiveTab('zones')}>
                            <MapPin className="h-4 w-4 mr-2" /> Zones
                        </Button>
                        <Button variant={activeTab === 'audit' ? 'default' : 'outline'} onClick={() => setActiveTab('audit')}>
                            <FileText className="h-4 w-4 mr-2" /> Audit Logs
                        </Button>
                    </div>
                </div>

                {/* Main Content Area */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard icon={Activity} label="Active Zones" value="6" />
                            <StatCard icon={CheckCircle} label="Beneficiaries Verified" value="4,210" />
                            <StatCard icon={BarChart3} label="Total Aid Audited" value="$12.4M" />
                            <StatCard icon={AlertTriangle} label="Flagged Tx" value="2" theme="red" />
                        </div>

                        {/* Recent Alerts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="p-0 overflow-hidden">
                                <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-orange-500" /> Pending Approvals
                                    </h3>
                                    <Button variant="link" size="sm" onClick={() => setActiveTab('zones')}>View All</Button>
                                </div>
                                <div className="divide-y">
                                    {zones.filter(z => z.status === 'pending').map(zone => (
                                        <div key={zone.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50">
                                            <div>
                                                <p className="font-medium text-sm">{zone.name}</p>
                                                <p className="text-xs text-muted-foreground">{zone.type} • {zone.budget}</p>
                                            </div>
                                            <Button size="sm" onClick={() => setSelectedZone(zone)}>Review</Button>
                                        </div>
                                    ))}
                                    {zones.filter(z => z.status === 'pending').length === 0 && (
                                        <div className="p-8 text-center text-muted-foreground text-sm">No pending approvals.</div>
                                    )}
                                </div>
                            </Card>

                            <Card className="p-0 overflow-hidden">
                                <div className="p-4 border-b bg-gray-50">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-blue-500" /> Live Audit Stream
                                    </h3>
                                </div>
                                <div className="divide-y">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="p-4 flex items-start gap-3 text-sm">
                                            <div className="mt-1 h-2 w-2 rounded-full bg-green-500 shrink-0" />
                                            <div>
                                                <p className="font-medium">Voucher Redeemed - Food Kit</p>
                                                <p className="text-xs text-muted-foreground">Vendor: FreshMart (0x9a...22) • 50 USDC</p>
                                                <p className="text-[10px] text-muted-foreground mt-0.5">Tx: 0x82...1a • 2 mins ago</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'zones' && (
                    <Card>
                        <div className="p-4 border-b">
                            <h3 className="font-semibold">Disaster Zone Management</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 border-b">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">Zone Name</th>
                                        <th className="px-6 py-3 font-medium">Type</th>
                                        <th className="px-6 py-3 font-medium">Requested By</th>
                                        <th className="px-6 py-3 font-medium">Budget</th>
                                        <th className="px-6 py-3 font-medium">Status</th>
                                        <th className="px-6 py-3 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {zones.map((zone) => (
                                        <tr key={zone.id} className="hover:bg-gray-50/50">
                                            <td className="px-6 py-4 font-medium">{zone.name}</td>
                                            <td className="px-6 py-4">{zone.type}</td>
                                            <td className="px-6 py-4 font-mono text-xs">{zone.requestedBy}</td>
                                            <td className="px-6 py-4">{zone.budget}</td>
                                            <td className="px-6 py-4">
                                                <Badge
                                                    variant={zone.status === 'sanctioned' ? 'default' : 'outline'}
                                                    className={zone.status === 'sanctioned' ? 'bg-green-600' : 'bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200'}
                                                >
                                                    {zone.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {zone.status === 'pending' ? (
                                                    <Button size="sm" onClick={() => setSelectedZone(zone)}>Review</Button>
                                                ) : (
                                                    <Button size="sm" variant="ghost" disabled>Approved</Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}

                {activeTab === 'audit' && (
                    <Card>
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="font-semibold">Financial Audit Log</h3>
                            <Button size="sm" variant="outline"><FileText className="h-4 w-4 mr-2" /> Download CSV</Button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 border-b">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">Timestamp</th>
                                        <th className="px-6 py-3 font-medium">Event Type</th>
                                        <th className="px-6 py-3 font-medium">Executor</th>
                                        <th className="px-6 py-3 font-medium">Zone</th>
                                        <th className="px-6 py-3 font-medium text-right">Amount (USDC)</th>
                                        <th className="px-6 py-3 font-medium text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <tr key={i} className="hover:bg-gray-50/50">
                                            <td className="px-6 py-4 text-muted-foreground">2026-01-16 14:0{i}</td>
                                            <td className="px-6 py-4 font-medium">
                                                {i % 3 === 0 ? "Zone Allocation" : "Voucher Redeemed"}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs text-blue-600">0x71...9a</td>
                                            <td className="px-6 py-4">Central Coast</td>
                                            <td className="px-6 py-4 text-right font-mono">
                                                {i % 3 === 0 ? "+500,000.00" : "-50.00"}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Badge
                                                    variant="outline"
                                                    className="bg-green-50 text-green-700 border-green-200"
                                                >
                                                    Confirmed
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}
            </div>

            {/* Zone Review Dialog */}
            <Dialog open={!!selectedZone} onOpenChange={(open) => !open && setSelectedZone(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Zone Sanction Review</DialogTitle>
                        <DialogDescription>
                            Review the filed documents and assessment reports before unlocking funds.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedZone && (
                        <div className="space-y-6 my-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-muted/40 rounded-lg space-y-1">
                                    <span className="text-xs text-muted-foreground uppercase font-semibold">Zone Name</span>
                                    <p className="font-medium">{selectedZone.name}</p>
                                </div>
                                <div className="p-4 bg-muted/40 rounded-lg space-y-1">
                                    <span className="text-xs text-muted-foreground uppercase font-semibold">Requested Budget</span>
                                    <p className="font-medium">{selectedZone.budget}</p>
                                </div>
                                <div className="p-4 bg-muted/40 rounded-lg space-y-1">
                                    <span className="text-xs text-muted-foreground uppercase font-semibold">Admin</span>
                                    <p className="font-mono text-sm">{selectedZone.requestedBy}</p>
                                </div>
                                <div className="p-4 bg-muted/40 rounded-lg space-y-1">
                                    <span className="text-xs text-muted-foreground uppercase font-semibold">Disaster Type</span>
                                    <p className="font-medium">{selectedZone.type}</p>
                                </div>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                    <FileText className="h-4 w-4" /> Attached Documents
                                </h4>
                                <div className="flex items-center justify-between p-3 bg-blue-50/50 border border-blue-100 rounded-md">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 bg-white border rounded flex items-center justify-center text-red-500">
                                            <span className="text-[10px] font-bold">PDF</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-blue-900">{selectedZone.docs}</p>
                                            <p className="text-xs text-blue-700">2.4 MB • Verified Signature</p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="ghost">View</Button>
                                </div>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800 flex gap-3">
                                <AlertTriangle className="h-5 w-5 shrink-0" />
                                <p>Sanctioning this zone will <strong>immediately</strong> unlock the Treasury Smart Contract for this Disaster ID. This action is irreversible on-chain.</p>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setSelectedZone(null)}>Cancel Review</Button>
                        <Button
                            className="bg-green-600 hover:bg-green-700 gap-2"
                            onClick={() => handleSanction(selectedZone.id)}
                        >
                            <CheckCircle className="h-4 w-4" /> Sanction & Unlock Funds
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </RoleGuard>
    );
}

interface StatCardProps {
    icon: any;
    label: string;
    value: string;
    theme?: 'blue' | 'red';
}

function StatCard({ icon: Icon, label, value, theme = 'blue' }: StatCardProps) {
    return (
        <Card>
            <CardContent className="p-6 flex flex-col gap-2">
                <div className={`flex items-center gap-2 text-sm font-medium ${theme === 'red' ? 'text-red-500' : 'text-muted-foreground'}`}>
                    <Icon className="h-4 w-4" />
                    {label}
                </div>
                <h2 className="text-3xl font-bold">{value}</h2>
            </CardContent>
        </Card>
    )
}
