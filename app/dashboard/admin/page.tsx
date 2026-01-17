'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/Dialog';
import { Plus, ShieldAlert, Users, Wallet, Activity, MoreHorizontal, Search, FileCog } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { AidMap } from '@/components/map/AidMap';

// Mock Data
// Mock Data - Synced with AidMap for consistency
const MOCK_ZONES = [
    { id: 1, name: 'Odisha Cyclone Response', location: 'Odisha, India', budget: 1200000, allocated: 800000, status: 'Critical', beneficiaries: 45000 },
    { id: 2, name: 'Himachal Flood Relief', location: 'Himachal Pradesh', budget: 800000, allocated: 225000, status: 'Active', beneficiaries: 12200 },
    { id: 3, name: 'Wayanad Landslide Recovery', location: 'Kerala, India', budget: 450000, allocated: 150000, status: 'Active', beneficiaries: 5500 },
];

export default function AdminDashboard() {
    const [zones, setZones] = useState(MOCK_ZONES);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newZone, setNewZone] = useState({ name: '', location: '', budget: '' });

    const handleCreateZone = (e: React.FormEvent) => {
        e.preventDefault();
        const zone = {
            id: zones.length + 1,
            name: newZone.name,
            location: newZone.location,
            budget: Number(newZone.budget),
            allocated: 0,
            status: 'Pending',
            beneficiaries: 0
        };
        setZones([...zones, zone]);
        setIsCreateModalOpen(false);
        setNewZone({ name: '', location: '', budget: '' });
    };

    return (
        <RoleGuard allowedRoles={['admin']}>
            <div className="container mx-auto p-4 md:p-8 space-y-8 relative">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Admin Control Center</h1>
                        <p className="text-muted-foreground">Manage disaster zones, treasury allocations, and system oversight.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline"><FileCog className="mr-2 h-4 w-4" /> Audit Logs</Button>
                        <Button onClick={() => setIsCreateModalOpen(true)}><Plus className="mr-2 h-4 w-4" /> New Disaster Zone</Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard icon={Wallet} label="Total Treasury" value="$2.4M USDC" sub="Available for allocation" />
                    <StatCard icon={ShieldAlert} label="Active Zones" value={zones.filter(z => z.status === 'Active' || z.status === 'Critical').length.toString()} sub="Currently operational" />
                    <StatCard icon={Users} label="Total Beneficiaries" value="16,550" sub="Verified across all zones" />
                    <StatCard icon={Activity} label="System Health" value="98.9%" sub="All oracles online" theme="green" />
                </div>

                {/* Global Presence Map */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <AidMap />
                </motion.div>

                {/* Zones Management */}
                <Card>
                    <CardHeader>
                        <CardTitle>Disaster Zones</CardTitle>
                        <CardDescription>Monitor and manage active relief efforts.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1 max-w-sm">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input type="search" placeholder="Search zones..." className="pl-9" />
                                </div>
                            </div>

                            <div className="rounded-md border">
                                <div className="grid grid-cols-6 border-b bg-muted/50 p-3 text-xs font-semibold text-muted-foreground uppercase">
                                    <div className="col-span-2">Zone Name</div>
                                    <div>Status</div>
                                    <div className="text-right">Budget</div>
                                    <div className="text-right">Allocated</div>
                                    <div className="text-right">Actions</div>
                                </div>
                                <div className="divide-y">
                                    {zones.map((zone) => (
                                        <div key={zone.id} className="grid grid-cols-6 p-4 items-center gap-4 hover:bg-muted/50 transition-colors text-sm">
                                            <div className="col-span-2">
                                                <div className="font-medium">{zone.name}</div>
                                                <div className="text-xs text-muted-foreground">{zone.location}</div>
                                            </div>
                                            <div>
                                                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${zone.status === 'Active' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                                                    zone.status === 'Critical' ? 'bg-red-50 text-red-700 ring-red-600/20' :
                                                        'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
                                                    }`}>
                                                    {zone.status}
                                                </span>
                                            </div>
                                            <div className="text-right font-mono">${zone.budget.toLocaleString()}</div>
                                            <div className="text-right font-mono text-muted-foreground">${zone.allocated.toLocaleString()}</div>
                                            <div className="text-right">
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Disaster Zone</DialogTitle>
                            <DialogDescription>Initialize a new relief effort on-chain.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateZone} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Zone Name</label>
                                <Input
                                    placeholder="e.g. 'Pacific Cyclone Relief'"
                                    required
                                    value={newZone.name}
                                    onChange={e => setNewZone({ ...newZone, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Location / Region</label>
                                <Input
                                    placeholder="Region, Country"
                                    required
                                    value={newZone.location}
                                    onChange={e => setNewZone({ ...newZone, location: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Initial USDC Budget</label>
                                <Input
                                    type="number"
                                    placeholder="100000"
                                    required
                                    value={newZone.budget}
                                    onChange={e => setNewZone({ ...newZone, budget: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-3 justify-end pt-2">
                                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                                <Button type="submit">Deploy Zone</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </RoleGuard>
    )
}

interface StatCardProps {
    icon: any; // Lucide icon type is complex, keeping as any or simplified React.ElementType for now
    label: string;
    value: string;
    sub?: string;
    theme?: 'default' | 'green' | 'red';
}

function StatCard({ icon: Icon, label, value, sub, theme = "default" }: StatCardProps) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${theme === 'green' ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'}`}>
                        <Icon className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{label}</p>
                        <h3 className="text-2xl font-bold">{value}</h3>
                        <p className="text-xs text-muted-foreground">{sub}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
