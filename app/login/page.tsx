'use client';

import React, { useEffect, useState } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useAuth, UserRole } from '@/context/MockAuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, User, Users, Store, Glasses, Landmark, ArrowRight, Wallet, AlertTriangle, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';

const roles = [
    { id: 'donor', label: 'Donor', icon: User, desc: 'Global impact, verified.' },
    { id: 'beneficiary', label: 'Beneficiary', icon: Users, desc: 'Instant, secure aid.' },
    { id: 'vendor', label: 'Vendor', icon: Store, desc: 'Scan & redeem vouchers.' },
    { id: 'admin', label: 'Admin', icon: ShieldCheck, desc: 'System oversight.' },
    { id: 'oracle', label: 'Oracle', icon: Glasses, desc: 'Verify claims.' },
    { id: 'government', label: 'Government', icon: Landmark, desc: 'Compliance & audit.' },
];

export default function LoginPage() {
    const { isConnected } = useAccount();
    const { connect, connectors } = useConnect();
    const { setRole, isAuthenticated, role } = useAuth();
    const router = useRouter();


    useEffect(() => {
        if (isAuthenticated && role && role !== 'guest') {
            router.push(`/dashboard/${role}`);
        }
    }, [isAuthenticated, role, router]);

    const handleLogin = (roleId: string) => {
        setRole(roleId as UserRole);
        // If not connected, we still set role for dev testing, but normally we'd want wallet first.
        // For dev mode, we allow bypass.
        if (!isConnected) {
            connect({ connector: injected() });
        } else {
            router.push(`/dashboard/${roleId}`);
        }
    };

    return (
        <div className="min-h-screen flex bg-background">
            {/* Left Side - Visual & Brand */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#0A0F1C] text-white flex-col justify-between p-12 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2000')] bg-cover bg-center opacity-20 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-transparent to-transparent" />

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">SecureRelief</span>
                    </div>
                    <div className="max-w-md">
                        <h1 className="text-5xl font-bold tracking-tight mb-6 leading-tight">
                            Aid that moves at the speed of urgency.
                        </h1>
                        <p className="text-xl text-gray-300 font-light">
                            Direct, transparent, and instant relief distribution powered by Weilchain.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 flex gap-4 text-sm text-gray-400">
                    <span>Trusted by NGOs</span>
                    <span>•</span>
                    <span>Audit Ready</span>
                    <span>•</span>
                    <span>Global Reach</span>
                </div>
            </div>

            {/* Right Side - Interaction */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative overflow-y-auto">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome Back</h2>
                        <p className="mt-2 text-muted-foreground">Select your role to connect wallet</p>
                    </div>

                    {/* Role Selection Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {roles.map((r) => (
                            <button
                                key={r.id}
                                onClick={() => handleLogin(r.id)}
                                className="flex flex-col items-start gap-3 p-4 bg-card hover:bg-muted/50 rounded-xl text-left transition-all border shadow-sm hover:shadow-md hover:border-primary/50 group"
                            >
                                <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <r.icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="font-semibold text-foreground">{r.label}</div>
                                    <div className="text-xs text-muted-foreground mt-1">{r.desc}</div>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or connect cleanly</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Button
                            className="w-full h-12 text-base gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-lg shadow-indigo-500/20"
                            onClick={() => {
                                const injectedConnector = connectors.find(c => c.id === 'injected');
                                if (injectedConnector) connect({ connector: injectedConnector });
                            }}
                            disabled={isConnected}
                        >
                            <div className="h-6 w-6 bg-white/20 rounded-full flex items-center justify-center border border-white/30 backdrop-blur-sm">
                                <span className="text-[10px] font-bold text-white">W</span>
                            </div>
                            {isConnected ? 'Weilliptic Connected' : 'Connect Weilliptic'}
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full h-12 text-base gap-2"
                            onClick={() => {
                                const mmConnector = connectors.find(c => c.name === 'MetaMask' || c.id === 'io.metamask');
                                if (mmConnector) {
                                    connect({ connector: mmConnector });
                                } else {
                                    const fallback = connectors.find(c => c.id !== 'injected');
                                    if (fallback) connect({ connector: fallback });
                                }
                            }}
                            disabled={isConnected}
                        >
                            <div className="relative h-5 w-5">
                                <Wallet className="h-5 w-5" />
                            </div>
                            {isConnected ? 'Wallet Connected' : 'Connect MetaMask / Other'}
                        </Button>
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                        New to SecureRelief?{' '}
                        <Link href="/signup" className="font-semibold text-primary hover:underline">
                            Create an account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
