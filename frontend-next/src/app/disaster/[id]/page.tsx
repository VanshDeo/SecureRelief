'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { MapPin, Calendar, TrendingUp, AlertTriangle, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout/Layout';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';

const DisasterDetails = () => {
    const params = useParams();
    const id = params.id;

    // Mock disaster data
    const disaster = {
        id,
        name: 'Hurricane Helene Relief',
        location: 'Southeastern United States',
        date: 'August 15, 2024',
        status: 'Active',
        totalFunding: '$1.2M',
        targetFunding: '$2.0M',
        victimsReached: 1250,
        vendorsActive: 45,
        description: 'Relief efforts for communities affected by Hurricane Helene. Providing food, water, medical supplies, and temporary shelter to displaced families.',
        milestones: [
            { date: 'Aug 15', event: 'Disaster Declared' },
            { date: 'Aug 16', event: 'Relief Funds Authorized' },
            { date: 'Aug 17', event: 'First Shipment of Supplies Arrived' }
        ]
    };

    return (
        <Layout>
            <div className="min-h-screen">
                <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex p-4 mb-6 bg-red-100 rounded-full">
                            <AlertTriangle className="w-12 h-12 text-red-600" />
                        </div>
                        <h1 className="mb-4 text-4xl font-extrabold text-gray-900 tracking-tight">
                            {disaster.name}
                        </h1>
                        <div className="flex items-center justify-center space-x-4 text-gray-600">
                            <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1 text-red-500" />
                                {disaster.location}
                            </span>
                            <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1 text-blue-500" />
                                {disaster.date}
                            </span>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <Card className="p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Overview</h3>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    {disaster.description}
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <p className="text-sm text-gray-500 mb-1">Total Funding</p>
                                        <p className="text-xl font-bold text-gray-900">{disaster.totalFunding}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <p className="text-sm text-gray-500 mb-1">Victims Reached</p>
                                        <p className="text-xl font-bold text-gray-900">{disaster.victimsReached}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <p className="text-sm text-gray-500 mb-1">Vendors Active</p>
                                        <p className="text-xl font-bold text-gray-900">{disaster.vendorsActive}</p>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Timeline & Updates</h3>
                                <div className="space-y-6">
                                    {disaster.milestones.map((m, i) => (
                                        <div key={i} className="flex items-start">
                                            <div className="flex flex-col items-center mr-4">
                                                <div className="w-3 h-3 bg-red-500 rounded-full mt-1.5" />
                                                {i < disaster.milestones.length - 1 && <div className="w-0.5 h-12 bg-gray-200 mt-1" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{m.date}</p>
                                                <p className="text-gray-600">{m.event}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>

                        <div className="space-y-8">
                            <Card className="p-8 border-t-4 border-green-500">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">Take Action</h3>
                                <div className="space-y-4">
                                    <Button className="w-full">Donate to this Relief</Button>
                                    <Button variant="outline" className="w-full">Apply for Aid</Button>
                                </div>
                            </Card>

                            <Card className="p-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">Transparency</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center text-sm">
                                        <Shield className="w-4 h-4 mr-2 text-blue-500" />
                                        <span>Smart Contract Verified</span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                                        <span>Open Distribution Log</span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default DisasterDetails;
