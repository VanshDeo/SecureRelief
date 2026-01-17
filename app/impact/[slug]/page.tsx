'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { Share2, Heart, CheckCircle2 } from 'lucide-react';
import { FundsChart } from '@/components/dashboard/FundsChart';
import { AllocationChart } from '@/components/dashboard/AllocationChart';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { ImpactMetrics } from '@/components/dashboard/ImpactMetrics';
import Link from 'next/link';
import { AidMap } from '@/components/map/AidMap';

export default function ImpactDashboard() {
    return (
        <div className="container mx-auto px-4 md:px-6 py-8 space-y-8">

            {/* Header */}
            <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <span>Campaigns</span>
                    <span>&gt;</span>
                    <span className="text-primary">Odisha Cyclone</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Odisha Cyclone Relief Fund</h1>
                        <p className="text-muted-foreground">Transparency Dashboard & Live Impact Tracking</p>
                    </div>
                    <Badge variant="success" className="w-fit gap-1 text-sm py-1 px-3">
                        <CheckCircle2 className="h-4 w-4" /> Verified Non-Profit
                    </Badge>
                </div>
            </div>

            {/* Top Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Total Raised Main Card */}
                <Card className="col-span-1 lg:col-span-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border-primary/20">
                    <CardContent className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Total Raised</p>
                                <h2 className="text-5xl font-bold mt-2">$4,200,000</h2>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-muted-foreground">Goal: <span className="text-foreground font-bold">$5,000,000</span></p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Progress value={84} className="h-4" />
                                <div className="flex justify-between text-sm">
                                    <span className="font-semibold text-primary">84% funded</span>
                                    <span className="text-muted-foreground">24 days left</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Link href="/login" className="flex-1">
                                    <Button size="lg" className="w-full text-base gap-2 shadow-lg shadow-primary/25">
                                        <Heart className="h-5 w-5 fill-current" /> Donate Now
                                    </Button>
                                </Link>
                                <Button variant="outline" size="lg" className="gap-2">
                                    <Share2 className="h-5 w-5" /> Share
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Impact Sidebar */}
                <div className="col-span-1">
                    <ImpactMetrics />
                </div>
            </div>

            {/* Analytics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <FundsChart />
                <div className="col-span-1">
                    <AllocationChart />
                </div>
            </div>

            {/* Map Placeholder */}
            {/* Live Impact Map */}
            <div className="rounded-xl overflow-hidden shadow-lg">
                <AidMap />
            </div>

            {/* Bottom Feeds */}
            <ActivityFeed />

        </div>
    );
}
