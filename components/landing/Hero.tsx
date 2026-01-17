'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, ShieldCheck, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useAuth } from '@/context/MockAuthContext'; // Or your auth context path

export function Hero() {
  const { isConnected } = useAccount();
  const { isAuthenticated, role } = useAuth();

  return (
    <section className="py-6 md:py-10 container mx-auto px-4 md:px-6">
      <div className="relative rounded-[2.5rem] overflow-hidden min-h-[600px] flex items-center bg-gray-900 text-white shadow-2xl ring-1 ring-black/5">
        {/* Background Image / Overlay */}
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop')] 
          bg-cover bg-center bg-no-repeat"
        />
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

        <div className="relative z-10 px-8 md:px-16 py-12 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left"
          >
            {/* Optional Badge */}
            {/* <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm backdrop-blur-sm mb-6">
              <Activity className="mr-2 h-4 w-4 text-primary-foreground" />
              <span className="text-gray-200">Emergency Response System Online</span>
            </div> */}

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              Immediate Aid Where It <span className="text-primary block mt-2">Matters Most</span>
            </h1>

            <p className="text-xl text-gray-200 mb-8 max-w-xl leading-relaxed font-medium">
              Providing rapid response resources to communities affected by natural disasters worldwide.
              We ensure 100% of public donations go directly to relief efforts.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {isAuthenticated ? (
                <Link href={`/dashboard/${role || 'donor'}`}>
                  <Button size="lg" className="text-base h-14 px-8 shadow-xl shadow-primary/20 gap-2 bg-primary hover:bg-primary/90 text-white border-0">
                    <LayoutDashboard className="h-5 w-5" />
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button size="lg" className="text-base h-14 px-8 shadow-xl shadow-primary/20 gap-2 bg-primary hover:bg-primary/90 text-white border-0">
                    <ShieldCheck className="h-5 w-5" />
                    Donate Now
                  </Button>
                </Link>
              )}

              <Link href="/impact/hurricane-delta">
                <Button variant="outline" size="lg" className="text-base h-14 px-8 bg-white text-gray-900 border-white hover:bg-gray-100 hover:text-gray-900 font-semibold">
                  Track Fund Distribution
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
