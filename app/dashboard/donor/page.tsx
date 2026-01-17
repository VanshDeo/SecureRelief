'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useUSDCBalance, useDonate } from '@/lib/web3/hooks';
import { useAccount } from 'wagmi';
import { Heart, TrendingUp, Users, DollarSign, History, Loader2, Target, ShieldCheck, ShoppingBag, Pill, Home, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AidMap } from '@/components/map/AidMap';


const activeCampaigns = [
    { id: 1, title: "Odisha Cyclone Relief", goal: 1000000, raised: 800000, image: "https://images.unsplash.com/photo-1594817812921-6c2e3612d4d8?q=80&w=1000", location: "Odisha, India", beneficiaries: 45000 },
    { id: 2, title: "Himachal Flood Response", goal: 500000, raised: 225000, image: "https://images.unsplash.com/photo-1626082490710-d02167d40a02?q=80&w=1000", location: "Himachal Pradesh, India", beneficiaries: 12200 }
];

const donationHistory = [
    { id: "tx_01", date: "2024-01-15", amount: 50, campaign: "Odisha Cyclone Relief", category: "Unrestricted", status: "Redeemed", impact: "Food Voucher #8821" },
    { id: "tx_02", date: "2024-01-10", amount: 100, campaign: "General Treasury", category: "Medical", status: "Allocated", impact: "Pending Redemption" },
    { id: "tx_03", date: "2023-12-28", amount: 250, campaign: "Himachal Flood Response", category: "Shelter", status: "Redeemed", impact: "Tent Kit #449" },
];

export default function DonorDashboard() {
    const { address } = useAccount();
    const { data: balance, isLoading: isBalanceLoading } = useUSDCBalance(address);
    const { donate, isPending, isConfirming, isConfirmed, hash } = useDonate();

    const [selectedAmount, setSelectedAmount] = useState<string>("50");
    const [selectedCategory, setSelectedCategory] = useState<string>("general");
    const [customAmount, setCustomAmount] = useState<string>("");

    const handleDonate = (zoneId: string) => {
        const amount = customAmount ? customAmount : selectedAmount;
        donate(zoneId, amount); // Passed category would go here in real implementation
    };

    return (
        <RoleGuard allowedRoles={['donor']}>
            <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-background to-background p-4 md:p-8 space-y-8">
                <div className="container mx-auto space-y-6">

                    {/* Header & Balance */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-primary">Donor Portal</h1>
                            <p className="text-muted-foreground">Make an impact with transparent, trackable donations.</p>
                        </div>
                        <Card className="w-full md:w-auto border-blue-100 shadow-sm">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <DollarSign className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Your Balance</p>
                                    <p className="text-xl font-bold tracking-tight font-mono">
                                        {isBalanceLoading ? <Loader2 className="h-4 w-4 animate-spin" /> :
                                            balance ? `${(Number(balance) / 1000000).toLocaleString()} USDC` : '0 USDC'}
                                    </p>
                                </div>
                                <Button size="sm" variant="outline" className="ml-4 h-8 text-xs">Top Up</Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <Card className="h-full hover:shadow-md transition-all border-l-4 border-l-primary">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Impact</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">$400.00</div>
                                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                        <TrendingUp className="h-3 w-3 text-green-500" /> Lifetime contributions
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <Card className="h-full hover:shadow-md transition-all border-l-4 border-l-blue-500">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Lives Touched</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">12</div>
                                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                        <Users className="h-3 w-3 text-blue-500" /> Beneficiaries supported
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <Card className="h-full hover:shadow-md transition-all border-l-4 border-l-purple-500">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Zones</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">3</div>
                                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                        <Globe className="h-3 w-3 text-purple-500" /> Regions funded
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Live Impact Map */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <AidMap />
                    </motion.div>

                    <Tabs defaultValue="campaigns" className="space-y-6">
                        <TabsList className="bg-white border">
                            <TabsTrigger value="campaigns">Active Campaigns</TabsTrigger>
                            <TabsTrigger value="treasury">General Treasury</TabsTrigger>
                            <TabsTrigger value="history">Your Impact & History</TabsTrigger>
                        </TabsList>

                        {/* Active Campaigns Tab */}
                        <TabsContent value="campaigns" className="space-y-6">
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                {activeCampaigns.map((campaign, i) => (
                                    <motion.div
                                        key={campaign.id}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <Card className="overflow-hidden h-full flex flex-col md:flex-row shadow-sm hover:shadow-md transition-shadow">
                                            <div className="w-full md:w-48 h-48 md:h-auto shrink-0 bg-cover bg-center" style={{ backgroundImage: `url(${campaign.image})` }} />
                                            <div className="flex-1 flex flex-col">
                                                <CardHeader className="pb-3">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <CardTitle className="text-lg font-bold">{campaign.title}</CardTitle>
                                                            <CardDescription className="flex items-center gap-1 mt-1">
                                                                <Globe className="h-3 w-3" /> {campaign.location}
                                                            </CardDescription>
                                                        </div>
                                                        <Badge variant="secondary" className="bg-primary/10 text-primary">Verified Zone</Badge>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="flex-1 space-y-4">
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-sm font-medium">
                                                            <span>${campaign.raised.toLocaleString()} raised</span>
                                                            <span className="text-muted-foreground">${campaign.goal.toLocaleString()} goal</span>
                                                        </div>
                                                        <Progress value={(campaign.raised / campaign.goal) * 100} className="h-2" />
                                                    </div>

                                                    {/* Donation Controls */}
                                                    <div className="bg-gray-50 p-3 rounded-lg border space-y-3">
                                                        <div className="flex gap-2">
                                                            <div className="flex-1">
                                                                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Amount (USDC)</label>
                                                                <div className="flex gap-2">
                                                                    {['50', '100'].map((amt) => (
                                                                        <Button
                                                                            key={amt}
                                                                            variant={selectedAmount === amt ? "default" : "outline"}
                                                                            size="sm"
                                                                            onClick={() => setSelectedAmount(amt)}
                                                                            className="flex-1 h-8 text-xs"
                                                                        >
                                                                            ${amt}
                                                                        </Button>
                                                                    ))}
                                                                    <div className="relative flex-1">
                                                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                                                                        <input
                                                                            type="number"
                                                                            placeholder="Custom"
                                                                            className="w-full h-8 pl-4 pr-2 text-xs border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                                                                            value={customAmount}
                                                                            onChange={(e) => {
                                                                                setCustomAmount(e.target.value);
                                                                                setSelectedAmount("");
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="w-[140px]">
                                                                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Restriction</label>
                                                                <Select defaultValue="general" onValueChange={setSelectedCategory}>
                                                                    <SelectTrigger className="h-8 text-xs">
                                                                        <SelectValue placeholder="Category" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="general">Unrestricted</SelectItem>
                                                                        <SelectItem value="food">Food & Water</SelectItem>
                                                                        <SelectItem value="medical">Medical Aid</SelectItem>
                                                                        <SelectItem value="shelter">Shelter</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                                <CardFooter className="pt-2">
                                                    <Button
                                                        className="w-full shadow-lg shadow-primary/20"
                                                        onClick={() => handleDonate(campaign.id.toString())}
                                                        disabled={isPending || isConfirming}
                                                    >
                                                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Heart className="mr-2 h-4 w-4 text-red-200 fill-red-200" />}
                                                        {isPending ? 'Processing...' : 'Donate Now'}
                                                    </Button>
                                                </CardFooter>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </TabsContent>

                        {/* Treasury Tab */}
                        <TabsContent value="treasury">
                            <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0 shadow-xl overflow-hidden relative">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                                <div className="absolute top-0 right-0 p-8 opacity-20"><ShieldCheck className="h-48 w-48" /></div>
                                <CardHeader>
                                    <CardTitle className="text-2xl">SecureRelief General Fund</CardTitle>
                                    <CardDescription className="text-blue-100 max-w-lg">
                                        Don't know where to give? Contribute to the general treasury.
                                        We automatically allocate funds to the highest urgency zones based on Oracle data.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6 relative z-10">
                                    <div className="flex gap-4">
                                        <div className="space-y-1">
                                            <p className="text-blue-100 text-sm font-medium">Treasury Balance</p>
                                            <p className="text-4xl font-bold font-mono">$2,400,120.00</p>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                                        <div className="flex gap-4 items-end">
                                            <div className="flex-1 space-y-2">
                                                <label className="text-sm font-medium text-blue-50">Contribution Amount (USDC)</label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300" />
                                                    <input
                                                        type="number"
                                                        className="w-full h-12 pl-10 pr-4 bg-black/20 border border-white/10 rounded-lg text-lg font-mono placeholder:text-blue-300/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                            </div>
                                            <Button size="lg" className="h-12 bg-white text-blue-600 hover:bg-blue-50 font-bold px-8">
                                                Deposit to Treasury
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* History Tab */}
                        <TabsContent value="history">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Donation Traceability</CardTitle>
                                    <CardDescription>Track the journey of your funds from donation to impact.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="rounded-md border overflow-hidden">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-semibold">
                                                <tr>
                                                    <th className="px-4 py-3">Date</th>
                                                    <th className="px-4 py-3">Campaign / Zone</th>
                                                    <th className="px-4 py-3">Restriction</th>
                                                    <th className="px-4 py-3 text-right">Amount</th>
                                                    <th className="px-4 py-3">Status</th>
                                                    <th className="px-4 py-3">Trace Impact</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {donationHistory.map((tx) => (
                                                    <tr key={tx.id} className="hover:bg-muted/50 transition-colors">
                                                        <td className="px-4 py-3 font-mono text-xs">{tx.date}</td>
                                                        <td className="px-4 py-3 font-medium">{tx.campaign}</td>
                                                        <td className="px-4 py-3">
                                                            <Badge variant="outline" className="text-xs font-normal">
                                                                {tx.category === 'Medical' && <Pill className="h-3 w-3 mr-1" />}
                                                                {tx.category === 'Food' && <ShoppingBag className="h-3 w-3 mr-1" />}
                                                                {tx.category === 'Shelter' && <Home className="h-3 w-3 mr-1" />}
                                                                {tx.category}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-4 py-3 text-right font-mono font-bold">${tx.amount.toFixed(2)}</td>
                                                        <td className="px-4 py-3">
                                                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${tx.status === 'Redeemed' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                                                                }`}>
                                                                <span className={`h-1.5 w-1.5 rounded-full ${tx.status === 'Redeemed' ? 'bg-green-500' : 'bg-blue-500'}`} />
                                                                {tx.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-xs text-muted-foreground">
                                                            {tx.impact}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Pending TX Toast */}
                    <AnimatePresence>
                        {hash && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="fixed bottom-6 right-6 p-4 bg-white border border-green-200 rounded-xl shadow-2xl z-50 max-w-sm"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-green-100 text-green-600 rounded-full">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Donation Successful!</h4>
                                        <p className="text-sm text-gray-500 mt-1">Your funds have been securely transferred to the relief treasury.</p>
                                        <div className="mt-3 p-2 bg-gray-50 rounded text-xs font-mono break-all border">
                                            {hash}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </RoleGuard>
    );
}
