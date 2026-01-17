'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAccount, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

const campaigns = [
  {
    id: 1,
    title: "Odisha Cyclone Relief",
    description: "Emergency evacuation, food supplies, and temporary shelter for families affected by Cyclone Dana.",
    funded: 84,
    raised: "$840k",
    goal: "$1M",
    urgent: true,
    category: "Disaster Relief",
    image: "https://images.unsplash.com/photo-1594817812921-6c2e3612d4d8?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Himachal Flood Response",
    description: "Rebuilding bridges, supplying clean water, and medical aid to isolated mountain villages.",
    funded: 45,
    raised: "$225k",
    goal: "$500k",
    urgent: true,
    category: "Flood Relief",
    image: "https://images.unsplash.com/photo-1626082490710-d02167d40a02?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Wayanad Landslide Recovery",
    description: "Long-term housing construction and livelihood restoration for displaced tea plantation workers.",
    funded: 60,
    raised: "$1.2M",
    goal: "$2M",
    urgent: false,
    category: "Reconstruction",
    image: "https://images.unsplash.com/photo-1546874177-9be7a5bb5412?q=80&w=1000&auto=format&fit=crop"
  }
];

import { useRouter } from 'next/navigation';

export function Campaigns() {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <section id="campaigns" className="py-24 container mx-auto px-4 md:px-6">
      <div className="flex flex-wrap items-center justify-between mb-12 gap-4">
        <div>
          <Badge variant="secondary" className="mb-2 text-primary bg-primary/10 hover:bg-primary/20">Active Operations</Badge>
          <h2 className="text-3xl font-bold tracking-tight">Active Relief Campaigns</h2>
          <p className="text-muted-foreground mt-2 max-w-xl">Support urgent on-ground operations directly ensuring funds reach those in need.</p>
        </div>
        <Link href="/campaigns">
          <Button variant="ghost" className="gap-2">
            View All Campaigns <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {campaigns.map((campaign, i) => (
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-border/50 bg-card">
              <div className="aspect-video relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${campaign.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />

                <div className="absolute top-4 left-4 flex gap-2">
                  {campaign.urgent && (
                    <Badge variant="destructive" className="gap-1 animate-pulse">
                      <AlertCircle className="h-3 w-3" /> URGENT
                    </Badge>
                  )}
                </div>

                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-xs font-medium opacity-90">{campaign.category}</p>
                </div>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{campaign.title}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {campaign.description}
                </p>

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

              <CardFooter className="pt-0 pb-6">
                {isConnected ? (
                  <Link href="/impact/hurricane-delta" className="w-full">
                    <Button className="w-full">
                      Donate
                    </Button>
                  </Link>
                ) : (
                  <Button className="w-full" onClick={handleLogin}>
                    Donate
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
