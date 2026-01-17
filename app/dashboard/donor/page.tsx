'use client';

import React, { useState } from 'react';
import { FundsChart } from '@/components/dashboard/FundsChart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useUSDCBalance, useDonate } from '@/lib/web3/hooks';
import { useAccount } from 'wagmi';
import { Heart, TrendingUp, Users, ArrowRight, Activity, DollarSign, History, Loader2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RoleGuard } from '@/components/auth/RoleGuard';

const activeCampaigns = [
    { id: 1, title: "Turkey Earthquake Reflief", goal: 1000000, raised: 800000, image: "https://images.unsplash.com/photo-1631580971032-159c403d9b43?q=80&w=1000" },
    { id: 2, title: "Flood Response Fund", goal: 500000, raised: 225000, image: "https://images.unsplash.com/photo-1547690623-1d54bd84323e?q=80&w=1000" }
];

export default function DonorDashboard() {
    const { address } = useAccount();
    const { data: balance, isLoading: isBalanceLoading } = useUSDCBalance(address);
    const { donate, isPending, isConfirming, isConfirmed, hash } = useDonate();

    // State to track which campaign is being donated to
    const [selectedAmount, setSelectedAmount] = useState<string>("50");

    const handleDonate = (zoneId: number) => {
        donate(zoneId.toString(), selectedAmount);
    };

    return (
        <RoleGuard allowedRoles={['donor']}>
            <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-background to-background p-4 md:p-8 space-y-8">
                <div className="container mx-auto space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="animate-enter">
                            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Donor Overview</h1>
                            <p className="text-muted-foreground">Track your global impact and contributions.</p>
                        </div>
                        {/* Wallet Balance Card */}
                        <Card className="w-full md:w-auto glass-card border-primary/10">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-primary shadow-sm">
                                    <DollarSign className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Wallet Balance</p>
                                    <p className="text-xl font-bold tracking-tight">
                                        {isBalanceLoading ? <Loader2 className="h-4 w-4 animate-spin" /> :
                                            balance ? `${(Number(balance) / 1000000).toLocaleString()} USDC` : '0 USDC'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="glass-card hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">$1,250.00</div>
                                <p className="text-xs text-muted-foreground font-medium text-green-600">+20.1% from last month</p>
                            </CardContent>
                        </Card>
                        <Card className="glass-card hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">Campaigns Supported</CardTitle>
                                <History className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">4</div>
                                <p className="text-xs text-muted-foreground">Active in 2 regions</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Donation Area */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Active Campaigns</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {activeCampaigns.map((campaign, i) => (
                                <motion.div
                                    key={campaign.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ y: -4 }}
                                >
                                    <Card className="overflow-hidden h-full flex flex-col glass-card border-0 shadow-lg ring-1 ring-black/5">
                                        <div className="h-56 bg-cover bg-center relative group" style={{ backgroundImage: `url(${campaign.image})` }}>
                                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                                            <div className="absolute top-4 left-4">
                                                <Badge className="glass bg-white/20 hover:bg-white/30 text-white border-white/40">Urgent Relief</Badge>
                                            </div>
                                        </div>

                                        <CardHeader>
                                            <CardTitle className="text-xl">{campaign.title}</CardTitle>
                                        </CardHeader>

                                        <CardContent className="flex-1 space-y-6">
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm font-medium">
                                                    <span>Progress</span>
                                                    <span className="text-primary">{Math.round((campaign.raised / campaign.goal) * 100)}%</span>
                                                </div>
                                                <Progress value={(campaign.raised / campaign.goal) * 100} className="h-2" />
                                                <div className="flex justify-between text-xs text-muted-foreground">
                                                    <span>${campaign.raised.toLocaleString()} raised</span>
                                                    <span>Goal: ${campaign.goal.toLocaleString()}</span>
                                                </div>
                                            </div>

                                            <div className="p-4 bg-muted/50 rounded-xl space-y-3">
                                                <label className="text-sm font-medium block">Select Amount (USDC)</label>
                                                <div className="flex gap-2">
                                                    {[10, 50, 100].map((amt) => (
                                                        <Button
                                                            key={amt}
                                                            variant={Number(selectedAmount) === amt ? "default" : "outline"}
                                                            size="sm"
                                                            onClick={() => setSelectedAmount(amt.toString())}
                                                            className={`flex-1 ${Number(selectedAmount) === amt ? 'shadow-lg shadow-primary/25' : 'bg-white'}`}
                                                        >
                                                            ${amt}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>
                                        </CardContent>

                                        <CardFooter className="pb-6 px-6">
                                            <Button
                                                className="w-full h-11 text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow"
                                                onClick={() => handleDonate(campaign.id)}
                                                disabled={isPending || isConfirming}
                                            >
                                                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                                {isPending ? 'Processing Donation...' : 'Donate Now'}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Success Message (Ephemeral) */}
                    <AnimatePresence>
                        {hash && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="fixed bottom-4 right-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 shadow-xl max-w-md z-50 glass-card"
                            >
                                <p className="font-bold flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                    Transaction Sent
                                </p>
                                <p className="text-xs break-all font-mono mt-1 opacity-80">{hash}</p>
                                {isConfirming && <p className="text-xs mt-2 text-green-600">Waiting for confirmation...</p>}
                                {isConfirmed && <p className="text-xs mt-2 font-bold text-green-700">Confirmed on-chain!</p>}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </RoleGuard>
    );
}
