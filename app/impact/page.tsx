'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { ImpactMetrics } from '@/components/dashboard/ImpactMetrics';
import { ArrowRight, Globe, TrendingUp, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { AidMap } from '@/components/map/AidMap';

export default function ImpactPage() {
    return (
        <div className="min-h-screen bg-gray-50/50 space-y-12 pb-12">

            {/* Hero Section */}
            <div className="bg-gray-900 text-white py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="max-w-3xl space-y-6">
                        <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20 backdrop-blur-sm">
                            Real-time Transparency
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                            Global Impact Tracker
                        </h1>
                        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl">
                            Track every dollar from donation to distribution. See how blockchain technology is revolutionizing aid delivery with 100% transparency.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-20 space-y-12 mt-8">

                {/* Stats removed as per request */}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Metrics & Map */}
                    <div className="lg:col-span-1 space-y-8">
                        <div>
                            <h2 className="text-xl font-bold mb-4">Resource
                                Allocation</h2>
                            <ImpactMetrics />
                        </div>


                        <Card className="overflow-hidden bg-slate-900 border-none text-white p-0">
                            <AidMap />
                        </Card>
                    </div>

                    {/* Right Column: Activity Feed */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">Live Field Updates</h2>
                            <Badge variant="outline" className="animate-pulse text-green-600 border-green-200 bg-green-50">
                                Live
                            </Badge>
                        </div>
                        <ActivityFeed />
                    </div>
                </div>

                {/* Featured Reports */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Campaign Impact Reports</h2>
                        <Link href="/campaigns">
                            <Button variant="ghost" className="gap-2">
                                View All Campaigns <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link href="/impact/hurricane-delta" className="group">
                            <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <Badge className="mb-2">Disaster Relief</Badge>
                                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">Hurricane Delta Response</h3>
                                            <p className="text-sm text-muted-foreground">Florida & Georgia Coast</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-2xl font-bold text-green-600">92%</span>
                                            <p className="text-xs text-muted-foreground">Efficiency Rating</p>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground mb-4">
                                        Deployed $4.2M in direct aid within 72 hours of landfall.
                                        Provided emergency shelter to 12,000 residents.
                                    </p>
                                    <div className="flex items-center gap-2 text-sm font-medium text-primary">
                                        View Full Report <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link href="/impact/turkey-earthquake" className="group">
                            <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <Badge variant="secondary" className="mb-2">Reconstruction</Badge>
                                            <h3 className="text-xl font-bold group-hover:text-orange-600 transition-colors">Turkey Earthquake Relief</h3>
                                            <p className="text-sm text-muted-foreground">Hatay Province</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-2xl font-bold text-green-600">88%</span>
                                            <p className="text-xs text-muted-foreground">Efficiency Rating</p>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground mb-4">
                                        Rebuilding 500+ homes and schools.
                                        Partnered with 12 local vendors for verified supply chain delivery.
                                    </p>
                                    <div className="flex items-center gap-2 text-sm font-medium text-orange-600">
                                        View Full Report <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
