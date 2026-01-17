'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/Dialog';
import { Plus, ShieldAlert, Users, Wallet, Activity, MoreHorizontal, Search, FileCog, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { AidMap } from '@/components/map/AidMap';
import { useAuth } from '@/context/AuthContext';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PREDEFINED_LOCATIONS = [
    { name: "Mumbai, India", lat: 19.0760, lng: 72.8777 },
    { name: "New York, USA", lat: 40.7128, lng: -74.0060 },
    { name: "London, UK", lat: 51.5074, lng: -0.1278 },
    { name: "Tokyo, Japan", lat: 35.6762, lng: 139.6503 },
    { name: "Sydney, Australia", lat: -33.8688, lng: 151.2093 },
    { name: "Istanbul, Turkey", lat: 41.0082, lng: 28.9784 },
    { name: "Jakarta, Indonesia", lat: -6.2088, lng: 106.8456 },
    { name: "Mexico City, Mexico", lat: 19.4326, lng: -99.1332 },
    { name: "Sao Paulo, Brazil", lat: -23.5505, lng: -46.6333 },
    { name: "Cairo, Egypt", lat: 30.0444, lng: 31.2357 }
];

export default function AdminDashboard() {
    const { logout } = useAuth();
    const [zones, setZones] = useState<any[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // New Zone Form State
    const [newZone, setNewZone] = useState({
        name: '',
        location: '',
        budget: '',
        latitude: 22.5937,
        longitude: 78.9629,
        radius: 50000, // Default 50km
        type: 'Flood'
    });

    const fetchZones = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch('/api/admin/zones', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setZones(data);
            }
        } catch (error) {
            console.error('Failed to fetch zones:', error);
        }
    };

    useEffect(() => {
        fetchZones();
    }, []);

    const handleCreateZone = async () => {
        setIsLoading(true);

        try {
            const token = localStorage.getItem('accessToken');
            console.log('Deploying zone with token:', token ? 'Token exists' : 'No token found');

            const res = await fetch('/api/admin/zones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: newZone.name,
                    location: newZone.location,
                    budget: Number(newZone.budget),
                    latitude: newZone.latitude,
                    longitude: newZone.longitude,
                    radius: newZone.radius,
                    type: newZone.type
                })
            });
            console.log('Deploy response status:', res.status);

            if (res.ok) {
                await fetchZones();
                setIsCreateModalOpen(false);
                setNewZone({
                    name: '', location: '', budget: '',
                    latitude: 22.5937, longitude: 78.9629,
                    radius: 50000, type: 'Flood'
                });
            } else {
                const errData = await res.json();
                console.error('Backend returned error:', errData);
                alert(`Failed to deploy zone: ${errData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Failed to create zone:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLocationSelect = (lat: number, lng: number) => {
        setNewZone(prev => ({ ...prev, latitude: lat, longitude: lng }));
    };

    return (
        <>
            {/* <RoleGuard allowedRoles={['admin']}> */}
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
                    <StatCard icon={ShieldAlert} label="Active Zones" value={zones.filter(z => z.status === 'Active' || z.status === 'Critical' || z.status === 'ACTIVE' || z.status === 'CRITICAL').length.toString()} sub="Currently operational" />
                    <StatCard icon={Users} label="Total Beneficiaries" value="16,550" sub="Verified across all zones" />
                    <StatCard icon={Activity} label="System Health" value="98.9%" sub="All oracles online" theme="green" />
                </div>

                {/* Global Presence Map */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <AidMap zones={zones} />
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
                                <div className="divide-y max-h-[400px] overflow-y-auto">
                                    {zones.length === 0 ? (
                                        <div className="p-4 text-center text-sm text-muted-foreground">No active zones found.</div>
                                    ) : zones.map((zone) => (
                                        <div key={zone.id} className="grid grid-cols-6 p-4 items-center gap-4 hover:bg-muted/50 transition-colors text-sm">
                                            <div className="col-span-2">
                                                <div className="font-medium">{zone.name}</div>
                                                <div className="text-xs text-muted-foreground">{zone.location}</div>
                                            </div>
                                            <div>
                                                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${(zone.status === 'Active' || zone.status === 'ACTIVE') ? 'bg-green-50 text-green-700 ring-green-600/20' :
                                                    (zone.status === 'Critical' || zone.status === 'CRITICAL') ? 'bg-red-50 text-red-700 ring-red-600/20' :
                                                        'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
                                                    }`}>
                                                    {zone.status}
                                                </span>
                                            </div>
                                            <div className="text-right font-mono">${Number(zone.budget).toLocaleString()}</div>
                                            <div className="text-right font-mono text-muted-foreground">${Number(zone.allocated).toLocaleString()}</div>
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
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create New Disaster Zone</DialogTitle>
                            <DialogDescription>Initialize a new relief effort on-chain. Select the affected area on the map.</DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                            {/* Map Selector */}
                            <div className="space-y-2">
                                <Label>Select Affected Area</Label>
                                <div className="h-[300px] rounded-md overflow-hidden border">
                                    <AidMap
                                        isSelectionMode={true}
                                        onLocationSelect={handleLocationSelect}
                                        selectedLocation={{ lat: newZone.latitude, lng: newZone.longitude }}
                                        selectionRadius={newZone.radius}
                                        zones={zones} // Context: show existing zones too
                                    />
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">
                                    <MapPin className="h-4 w-4" />
                                    <span>Selected Coords: {newZone.latitude.toFixed(4)}, {newZone.longitude.toFixed(4)}</span>
                                    <span className="text-xs text-primary">(Click map to update)</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Zone Name</Label>
                                    <Input
                                        placeholder="e.g. 'Pacific Cyclone Relief'"
                                        value={newZone.name}
                                        onChange={e => setNewZone({ ...newZone, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Location Name</Label>
                                        <Select
                                            value={newZone.location}
                                            onValueChange={(val) => {
                                                const selected = PREDEFINED_LOCATIONS.find(l => l.name === val);
                                                if (selected) {
                                                    setNewZone(prev => ({
                                                        ...prev,
                                                        location: val,
                                                        latitude: selected.lat,
                                                        longitude: selected.lng
                                                    }));
                                                } else {
                                                    setNewZone(prev => ({ ...prev, location: val }));
                                                }
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select location" />
                                            </SelectTrigger>
                                            <SelectContent className="z-[99999]">
                                                {PREDEFINED_LOCATIONS.map((loc) => (
                                                    <SelectItem key={loc.name} value={loc.name}>{loc.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Disaster Type</Label>
                                        <Select
                                            onValueChange={(val) => setNewZone({ ...newZone, type: val })}
                                            defaultValue={newZone.type}
                                            value={newZone.type}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent className="z-[99999]">
                                                <SelectItem value="Flood">Flood</SelectItem>
                                                <SelectItem value="Earthquake">Earthquake</SelectItem>
                                                <SelectItem value="Cyclone">Cyclone</SelectItem>
                                                <SelectItem value="Drought">Drought</SelectItem>
                                                <SelectItem value="Wildfire">Wildfire</SelectItem>
                                                <SelectItem value="Tsunami">Tsunami</SelectItem>
                                                <SelectItem value="Landslide">Landslide</SelectItem>
                                                <SelectItem value="General">General</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Initial Budget (USDC)</Label>
                                        <Input
                                            type="number"
                                            placeholder="100000"
                                            value={newZone.budget}
                                            onChange={e => setNewZone({ ...newZone, budget: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Affected Radius ({Math.round(newZone.radius / 1000)} km)</Label>
                                        <div className="pt-2">
                                            <Slider
                                                defaultValue={[newZone.radius]}
                                                max={500000}
                                                step={1000}
                                                onValueChange={(val) => setNewZone({ ...newZone, radius: val[0] })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end pt-4">
                                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                                <Button onClick={handleCreateZone} disabled={isLoading}>
                                    {isLoading ? 'Deploying...' : 'Deploy Zone'}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            {/* </RoleGuard> */}
        </>
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
