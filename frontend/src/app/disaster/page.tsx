'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertTriangle,
    MapPin,
    Calendar,
    Users,
    TrendingUp,
    ArrowRight,
    Search,
    Filter
} from 'lucide-react';
import Image from 'next/image';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import RoleGuard from '@/components/Auth/RoleGuard';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import LoadingSpinner from '@/components/UI/LoadingSpinner';

// Mock Data
const MOCK_DISASTERS = [
    {
        id: '1',
        title: 'Turkey Earthquake Relief',
        location: 'Kahramanmaraş, Turkey',
        type: 'Earthquake',
        severity: 'Critical',
        affected: 1500000,
        raised: 2500000,
        target: 5000000,
        imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        date: '2024-02-06',
        description: 'Providing emergency shelter, food, and medical supplies to earthquake victims.'
    },
    {
        id: '2',
        title: 'Pakistan Flood Response',
        location: 'Sindh, Pakistan',
        type: 'Flood',
        severity: 'High',
        affected: 500000,
        raised: 800000,
        target: 2000000,
        imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
        date: '2023-08-15',
        description: 'Clean water and sanitation initiatives for flood-affected regions.'
    },
    {
        id: '3',
        title: 'Wildfire Recovery Fund',
        location: 'Maui, Hawaii',
        type: 'Wildfire',
        severity: 'High',
        affected: 12000,
        raised: 1200000,
        target: 1500000,
        imageUrl: 'https://images.unsplash.com/photo-1602989981841-f3513a8f6d89?auto=format&fit=crop&w=800&q=80',
        date: '2023-08-08',
        description: 'Rebuilding homes and supporting displaced families.'
    }
];

export default function DisasterPage() {
    const [disasters, setDisasters] = useState(MOCK_DISASTERS);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        // Simulate fetch
        setTimeout(() => setLoading(false), 800);
    }, []);

    const filteredDisasters = disasters.filter(d =>
        filter === 'all' || d.type.toLowerCase() === filter.toLowerCase()
    );

    if (loading) {
        return (
            <RoleGuard>
                <DashboardLayout>
                    <div className="flex items-center justify-center min-h-screen">
                        <LoadingSpinner size="lg" aria-label="Loading disasters..." />
                    </div>
                </DashboardLayout>
            </RoleGuard>
        );
    }

    return (
        <RoleGuard title="Relief Missions" subtitle="View and support active disaster relief efforts.">
            <DashboardLayout fullWidth={true}>
                <div className="min-h-screen bg-gray-50/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                        {/* Header */}
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl font-bold text-gray-900 mb-4 tracking-tight"
                            >
                                Active Relief Missions
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-lg text-gray-600"
                            >
                                Direct aid to verified disaster zones. Track your impact in real-time.
                            </motion.p>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search by location or type..."
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                />
                            </div>
                            <div className="flex gap-2 overflows-x-auto pb-2 md:pb-0">
                                {['All', 'Earthquake', 'Flood', 'Wildfire', 'Conflict'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setFilter(type.toLowerCase())}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === type.toLowerCase() || (filter === 'all' && type === 'All')
                                            ? 'bg-gray-900 text-white shadow-md'
                                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredDisasters.map((disaster, index) => (
                                <motion.div
                                    key={disaster.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="h-full hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                                        <div className="relative h-48 overflow-hidden">
                                            <Image
                                                src={disaster.imageUrl}
                                                alt={disaster.title}
                                                fill
                                                className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute top-4 left-4 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center">
                                                <AlertTriangle className="w-3 h-3 mr-1" />
                                                {disaster.severity}
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{disaster.title}</h3>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                                                        {disaster.location}
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                                                {disaster.description}
                                            </p>

                                            <div className="space-y-4">
                                                <div>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="font-semibold text-gray-900">${(disaster.raised / 1000).toFixed(1)}k Raised</span>
                                                        <span className="text-gray-500">of ${(disaster.target / 1000).toFixed(1)}k</span>
                                                    </div>
                                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                                        <div
                                                            className="bg-green-500 h-2 rounded-full"
                                                            style={{ width: `${(disaster.raised / disaster.target) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-100">
                                                    <div>
                                                        <div className="text-xs text-gray-400 uppercase tracking-wider">Affected</div>
                                                        <div className="font-bold text-gray-900 flex items-center">
                                                            <Users className="w-4 h-4 mr-1 text-blue-500" />
                                                            {(disaster.affected / 1000).toFixed(1)}k
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-400 uppercase tracking-wider">Days Active</div>
                                                        <div className="font-bold text-gray-900 flex items-center">
                                                            <Calendar className="w-4 h-4 mr-1 text-orange-500" />
                                                            45
                                                        </div>
                                                    </div>
                                                </div>

                                                <Button className="w-full justify-center group-hover:bg-green-600 transition-colors">
                                                    Donate Now
                                                    <ArrowRight className="w-4 h-4 ml-2" />
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </RoleGuard>
    );
}
