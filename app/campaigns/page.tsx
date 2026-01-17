'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { AlertCircle, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAccount, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

// Expanded Mock Data
const allCampaigns = [
    {
        id: 1,
        title: "Turkey Earthquake",
        description: "Providing emergency shelter, heaters, and medical supplies to displaced families.",
        funded: 80,
        raised: "$800k",
        goal: "$1M",
        urgent: true,
        category: "Disaster Relief",
        location: "Turkey & Syria",
        image: "https://images.unsplash.com/photo-1631580971032-159c403d9b43?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Flood Response",
        description: "Delivering food parcels, clean water kits, and hygiene essentials to flood-stricken regions.",
        funded: 45,
        raised: "$225k",
        goal: "$500k",
        urgent: false,
        category: "Flood Relief",
        location: "Pakistan",
        image: "https://images.unsplash.com/photo-1547690623-1d54bd84323e?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Wildfire Recovery",
        description: "Rebuilding homes, restoring infrastructure, and supporting firefighters on the front lines.",
        funded: 60,
        raised: "$1.2M",
        goal: "$2M",
        urgent: false,
        category: "Reconstruction",
        location: "California, USA",
        image: "https://images.unsplash.com/photo-1602989981881-817e79c2982d?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: 4,
        title: "Clean Water Initiative",
        description: "Installing solar-powered water pumps and filtration systems in drought-affected villages.",
        funded: 25,
        raised: "$50k",
        goal: "$200k",
        urgent: false,
        category: "Development",
        location: "Kenya",
        image: "https://images.unsplash.com/photo-1574482620926-4d7bb63025de?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: 5,
        title: "Medical Aid for Conflict Zones",
        description: "Supplying field hospitals with critical surgical equipment and medicines.",
        funded: 92,
        raised: "$460k",
        goal: "$500k",
        urgent: true,
        category: "Medical Aid",
        location: "Ukraine",
        image: "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1000&auto=format&fit=crop"
    },
    {
        id: 6,
        title: "Education Restoration",
        description: "Rebuilding schools and providing learning materials for children affected by crises.",
        funded: 15,
        raised: "$15k",
        goal: "$100k",
        urgent: false,
        category: "Education",
        location: "Afghanistan",
        image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1000&auto=format&fit=crop"
    }
];

export default function CampaignsPage() {
    const { isConnected } = useAccount();
    const { connect, connectors } = useConnect();

    const router = useRouter();

    const handleLogin = () => {
        router.push('/login');
    };

    const [searchTerm, setSearchTerm] = useState("");

    const filteredCampaigns = allCampaigns.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50/50 py-12">
            <div className="container mx-auto px-4 md:px-6">

                {/* Header */}
                <div className="mb-12 text-center max-w-2xl mx-auto">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Active Operations</h1>
                    <p className="text-lg text-muted-foreground">
                        Transparent, direct, and immediate aid. Choose a cause and track every cent on the blockchain.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search causes, regions..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                            <Filter className="h-4 w-4" /> Filters
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setSearchTerm("")}>
                            Clear
                        </Button>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCampaigns.map((campaign, i) => (
                        <motion.div
                            key={campaign.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05, duration: 0.4 }}
                        >
                            <Card className="h-full flex flex-col overflow-hidden group hover:shadow-xl transition-all duration-300 border-border/50 bg-card">
                                <div className="aspect-video relative overflow-hidden">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                        style={{ backgroundImage: `url(${campaign.image})` }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />

                                    <div className="absolute top-4 left-4 flex gap-2">
                                        {campaign.urgent && (
                                            <Badge variant="destructive" className="gap-1 animate-pulse shadow-lg">
                                                <AlertCircle className="h-3 w-3" /> URGENT
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="absolute bottom-4 left-4 text-white">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase font-bold tracking-wider opacity-75 mb-1">{campaign.category}</span>
                                            <span className="text-xs font-semibold flex items-center gap-1">
                                                {campaign.location}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <CardHeader className="pb-3 flex-1">
                                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{campaign.title}</CardTitle>
                                    <p className="text-muted-foreground text-sm mt-2 line-clamp-3">
                                        {campaign.description}
                                    </p>
                                </CardHeader>

                                <CardContent className="space-y-4 pb-2">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm font-medium">
                                            <span className={campaign.funded >= 80 ? "text-primary" : "text-foreground"}>
                                                {campaign.funded}% Funded
                                            </span>
                                            <span className="text-muted-foreground">{campaign.raised} / {campaign.goal}</span>
                                        </div>
                                        <Progress value={campaign.funded} className="h-2" />
                                    </div>
                                </CardContent>

                                <CardFooter className="pt-4 pb-6">
                                    {isConnected ? (
                                        <Link href="/impact/hurricane-delta" className="w-full">
                                            <Button className="w-full shadow-lg shadow-primary/20">
                                                Donate Now
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Button className="w-full shadow-lg shadow-primary/20" onClick={handleLogin}>
                                            Donate Now
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {filteredCampaigns.length === 0 && (
                    <div className="text-center py-24 text-muted-foreground">
                        <p>No active campaigns found matching your search.</p>
                        <Button variant="link" onClick={() => setSearchTerm("")}>Clear Search</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
