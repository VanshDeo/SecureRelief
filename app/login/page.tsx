'use client';

import React, { useEffect, useState } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useAuth, UserRole } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, User, Users, Store, Glasses, Landmark, ArrowRight, Wallet, AlertTriangle, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const roles = [
    { id: 'donor', label: 'Donor', icon: User, desc: 'Global impact, verified.' },
    { id: 'beneficiary', label: 'Beneficiary', icon: Users, desc: 'Instant, secure aid.' },
    { id: 'vendor', label: 'Vendor', icon: Store, desc: 'Scan & redeem vouchers.' },
    { id: 'admin', label: 'Admin', icon: ShieldCheck, desc: 'System oversight.' },
    { id: 'oracle', label: 'Oracle', icon: Glasses, desc: 'Verify claims.' },
    { id: 'agency', label: 'Agency', icon: Landmark, desc: 'Compliance & audit.' },
];

export default function LoginPage() {
    const { isConnected } = useAccount();
    const { connect, connectAsync, connectors } = useConnect();
    const { setRole, isAuthenticated, role, loginAsDemo, login } = useAuth();
    const router = useRouter();


    useEffect(() => {
        // If we just connected and have a role selected (not guest), redirect
        if (isConnected && role && role !== 'guest' && isAuthenticated) {
            router.push(`/dashboard/${role}`);
        }
    }, [isConnected, role, isAuthenticated, router]);

    const handleRoleSelect = (roleId: string) => {
        setRole(roleId as UserRole);
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {roles.map((r) => (
                            <button
                                key={r.id}
                                onClick={() => handleRoleSelect(r.id)}
                                className={cn(
                                    "flex flex-col items-center gap-2 p-4 bg-card rounded-xl text-center transition-all border shadow-sm hover:shadow-md",
                                    role === r.id ? "ring-2 ring-primary border-transparent bg-primary/5 scale-[1.02]" : "hover:border-primary/50"
                                )}
                            >
                                <div className={cn(
                                    "p-2 rounded-lg transition-colors",
                                    role === r.id ? "bg-primary text-white" : "bg-primary/10 text-primary"
                                )}>
                                    <r.icon className="h-5 w-5" />
                                </div>
                                <div className="font-semibold text-xs">{r.label}</div>
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {role !== 'guest' ? (
                            <motion.div
                                key="options"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <div className="space-y-3">
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                                        <div className="h-[1px] flex-1 bg-border" />
                                        Option 1: Web3 Wallet
                                        <div className="h-[1px] flex-1 bg-border" />
                                    </p>
                                    <div className="space-y-2">
                                        {connectors.length > 0 ? (
                                            connectors.map((connector) => (
                                                <Button
                                                    key={connector.id}
                                                    variant="outline"
                                                    className="w-full h-11 text-sm gap-2 border-primary/20 hover:border-primary/50"
                                                    onClick={async () => {
                                                        try {
                                                            await connectAsync({ connector });
                                                            await login();
                                                        } catch (err: any) {
                                                            if (err.code !== 4001) alert(`Wallet error: ${err.message}`);
                                                        }
                                                    }}
                                                >
                                                    <Wallet className="h-4 w-4" />
                                                    {isConnected ? `Use Connected ${connector.name}` : `Login with ${connector.name}`}
                                                </Button>
                                            ))
                                        ) : (
                                            <div className="text-xs text-amber-600 bg-amber-50 p-3 rounded-lg flex gap-2 border border-amber-100">
                                                <AlertTriangle className="h-4 w-4 shrink-0" />
                                                No wallet detected. Please install MetaMask or use Demo mode below.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                                        <div className="h-[1px] flex-1 bg-border" />
                                        Option 2: Demo Bypass
                                        <div className="h-[1px] flex-1 bg-border" />
                                    </p>
                                    <Button
                                        className="w-full h-12 text-base font-bold gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg shadow-blue-500/20"
                                        onClick={() => loginAsDemo(role)}
                                    >
                                        <Code className="h-4 w-4" />
                                        Login as {role.toUpperCase()} (Instant)
                                    </Button>
                                    <p className="text-[10px] text-center text-muted-foreground italic">
                                        Bypasses wallet requirement for rapid development testing.
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-10 text-center border-2 border-dashed rounded-2xl bg-muted/5 border-border/50"
                            >
                                <User className="h-8 w-8 mx-auto mb-3 opacity-10" />
                                <p className="text-sm text-muted-foreground font-medium italic">Select a role above to unlock login options</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

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
