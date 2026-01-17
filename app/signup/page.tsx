'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useRouter } from 'next/navigation';
import { ShieldCheck, User, Users, Store, ArrowRight, Wallet, CheckCircle2, ChevronRight, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { useAuth, UserRole } from '@/context/AuthContext';

const accountTypes = [
    {
        id: 'donor',
        title: 'Donor',
        description: 'Fund verified relief campaigns and track your impact in real-time.',
        icon: User,
        color: 'bg-blue-500',
        features: ['Real-time impact tracking', 'Tax-deductible receipts', 'Direct wallet transfers']
    },
    {
        id: 'beneficiary',
        title: 'Beneficiary',
        description: 'Apply for aid and receive direct support through secure vouchers.',
        icon: Users,
        color: 'bg-green-500',
        features: ['Instant verification', 'Digital voucher wallet', 'Local vendor value']
    },
    {
        id: 'vendor',
        title: 'Vendor',
        description: 'Register your business to accept relief vouchers for goods.',
        icon: Store,
        color: 'bg-orange-500',
        features: ['Immediate settlements', 'Digital inventory log', 'Community trusted status']
    }
];

export default function SignUpPage() {
    const { isConnected } = useAccount();
    const { connect, connectAsync, connectors } = useConnect();
    const { setRole, role, isAuthenticated, register } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isConnected && role && role !== 'guest' && isAuthenticated) {
            router.push(`/dashboard/${role}`);
        }
    }, [isConnected, role, isAuthenticated, router]);

    const [step, setStep] = useState(1);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: '', email: '', org: '' });

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);



    // Redirect if already connected and role set? 
    // Maybe not, allow them to finish the "flow"

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">

            {/* Left Panel - Progress & Info */}
            <div className="lg:w-1/3 bg-white border-r p-8 lg:p-12 flex flex-col justify-between">
                <div>
                    <Link href="/" className="flex items-center gap-2 mb-12">
                        <div className="bg-primary/10 p-2 rounded-lg">
                            <ShieldCheck className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-xl font-bold">SecureRelief</span>
                    </Link>

                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight mb-4">Create your account</h1>
                            <p className="text-muted-foreground">Join the first fully transparent global aid network.</p>
                        </div>

                        {/* Steps */}
                        <div className="space-y-4">
                            <div className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${step === 1 ? 'bg-primary/5 border border-primary/10' : ''}`}>
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 1 ? 'bg-primary text-white' : step > 1 ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    {step > 1 ? <CheckCircle2 className="h-5 w-5" /> : '1'}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm font-medium ${step === 1 ? 'text-primary' : 'text-gray-900'}`}>Account Type</p>
                                    <p className="text-xs text-muted-foreground">Choose how you want to help</p>
                                </div>
                            </div>

                            <div className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${step === 2 ? 'bg-primary/5 border border-primary/10' : ''}`}>
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 2 ? 'bg-primary text-white' : step > 2 ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    {step > 2 ? <CheckCircle2 className="h-5 w-5" /> : '2'}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm font-medium ${step === 2 ? 'text-primary' : 'text-gray-900'}`}>Personal Details</p>
                                    <p className="text-xs text-muted-foreground">Tell us a bit about yourself</p>
                                </div>
                            </div>

                            <div className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${step === 3 ? 'bg-primary/5 border border-primary/10' : ''}`}>
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 3 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    3
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm font-medium ${step === 3 ? 'text-primary' : 'text-gray-900'}`}>Connect Wallet</p>
                                    <p className="text-xs text-muted-foreground">Secure your digital identity</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t text-sm text-center lg:text-left text-muted-foreground">
                    Already have an account? <Link href="/login" className="text-primary font-medium hover:underline">Log in</Link>
                </div>
            </div>

            {/* Right Panel - Form Content */}
            <div className="flex-1 bg-gray-50 p-8 lg:p-12 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />

                <div className="max-w-2xl w-full relative z-10">
                    <AnimatePresence mode="wait">

                        {/* Step 1: Account Type */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {accountTypes.map((type) => (
                                        <div
                                            key={type.id}
                                            onClick={() => setSelectedRole(type.id)}
                                            className={`cursor-pointer rounded-xl border p-6 transition-all duration-200 hover:shadow-lg relative overflow-hidden bg-white ${selectedRole === type.id ? 'ring-2 ring-primary border-transparent' : 'hover:border-primary/50'}`}
                                        >
                                            <div className={`w-12 h-12 rounded-lg ${type.color} flex items-center justify-center text-white mb-4 shadow-md`}>
                                                <type.icon className="h-6 w-6" />
                                            </div>
                                            <h3 className="font-semibold text-lg mb-2">{type.title}</h3>
                                            <p className="text-sm text-gray-500 mb-4 leading-relaxed">{type.description}</p>
                                            <ul className="space-y-2">
                                                {type.features.map((feature, i) => (
                                                    <li key={i} className="text-xs text-gray-400 flex items-center gap-1.5">
                                                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button
                                        size="lg"
                                        disabled={!selectedRole}
                                        onClick={handleNext}
                                        className="gap-2"
                                    >
                                        Continue <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Details */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="max-w-md mx-auto space-y-6 bg-white p-8 rounded-2xl shadow-sm border"
                            >
                                <h3 className="text-xl font-bold">Your Details</h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Full Name</label>
                                        <input
                                            type="text"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email Address</label>
                                        <input
                                            type="email"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    {selectedRole === 'vendor' && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Organization / Store Name</label>
                                            <input
                                                type="text"
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="Store Name"
                                                value={formData.org}
                                                onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between pt-4">
                                    <Button variant="ghost" onClick={handleBack}>Back</Button>
                                    <Button
                                        onClick={handleNext}
                                        disabled={!formData.name || !formData.email}
                                    >
                                        Continue
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Connect Wallet */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="max-w-md mx-auto text-center space-y-6"
                            >
                                <div className="bg-white p-8 rounded-2xl shadow-xl border border-primary/20 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-primary to-purple-500" />

                                    <div className="inline-flex items-center justify-center p-4 bg-primary/10 text-primary rounded-full mb-6">
                                        <Wallet className="h-8 w-8" />
                                    </div>

                                    <h3 className="text-2xl font-bold mb-2">Connect your Wallet</h3>
                                    <p className="text-muted-foreground mb-8">
                                        To finalize your {selectedRole} account, please connect your Web3 wallet. This will be your unique digital identity.
                                    </p>

                                    {isConnected ? (
                                        <div className="space-y-4">
                                            <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center justify-center gap-2 font-medium">
                                                <CheckCircle2 className="h-5 w-5" />
                                                Wallet Connected!
                                            </div>
                                            <Button
                                                className="w-full h-12 text-base gap-2"
                                                onClick={() => router.push(`/dashboard/${selectedRole}`)}
                                            >
                                                Go to Dashboard <ChevronRight className="h-4 w-4" />
                                            </Button>
                                            <button onClick={() => setStep(2)} className="text-xs text-muted-foreground hover:underline mt-4">
                                                Use a different wallet?
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {connectors.length > 0 ? (
                                                connectors.map((connector) => (
                                                    <Button
                                                        key={connector.id}
                                                        variant={connector.name === 'MetaMask' ? 'default' : 'outline'}
                                                        className="w-full h-12 text-base gap-2 shadow-lg"
                                                        onClick={async () => {
                                                            try {
                                                                if (selectedRole) setRole(selectedRole as UserRole);
                                                                console.log(`[Auth] Attempting to connect with ${connector.name}...`);
                                                                await connectAsync({ connector });

                                                                // Trigger Registration
                                                                await register({
                                                                    name: formData.name,
                                                                    email: formData.email,
                                                                    role: selectedRole?.toUpperCase() || 'DONOR'
                                                                });
                                                            } catch (err) {
                                                                console.error("SignUp connection failed:", err);
                                                                if ((err as any).code !== 4001) {
                                                                    alert(`Connection failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        <Wallet className="h-4 w-4" />
                                                        Connect {connector.name}
                                                    </Button>
                                                ))
                                            ) : (
                                                <div className="text-center p-4 border border-dashed rounded-lg text-sm text-destructive bg-destructive/5">
                                                    <AlertTriangle className="h-5 w-5 mx-auto mb-2" />
                                                    No wallet detected. Please ensure MetaMask is installed.
                                                    <br />
                                                    <Button variant="link" size="sm" className="mt-2" onClick={() => window.location.reload()}>Refresh</Button>
                                                </div>
                                            )}
                                            <p className="text-xs text-muted-foreground mt-4">
                                                By connecting, you agree to our Terms of Service and Privacy Policy.
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <Button variant="ghost" onClick={handleBack}>Back</Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
