'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Heart, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  {
    label: "Funds Raised",
    value: "$5.2M",
    change: "+12% from last month",
    icon: Heart,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    label: "Lives Impacted",
    value: "120k",
    change: "Across 3 continents",
    icon: Users,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
    label: "Active Projects",
    value: "14",
    change: "Deployed within 48h",
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  }
];

export function Stats() {
  return (
    <section id="impact" className="relative z-20 py-12 container mx-auto px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="border-0 shadow-xl ring-1 ring-black/5 bg-white text-gray-900 h-full">
              <CardContent className="p-8 flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                  <h3 className="text-4xl font-bold tracking-tight mb-2">{stat.value}</h3>
                  <div className="flex items-center text-sm">
                    <span className="text-muted-foreground">{stat.change}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
