'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAccount } from 'wagmi';
import { CheckCircle, AlertCircle, RefreshCw, WifiOff, FileText, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RoleGuard } from '@/components/auth/RoleGuard';

type VerificationStatus = 'unverified' | 'pending' | 'verified';

const MOCK_VOUCHERS = [
    { id: 101, type: "Food & Water", amount: 50, expiry: "2026-02-01", zone: "Turkey Earthquake" },
    { id: 102, type: "Medical Supplies", amount: 100, expiry: "2026-03-01", zone: "Turkey Earthquake" },
];

export default function BeneficiaryDashboard() {
    const { isConnected } = useAccount();
    const [status, setStatus] = useState<VerificationStatus>('unverified');
    const [isOffline, setIsOffline] = useState(false);

    // Simulate offline detection
    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleVerify = () => {
        setStatus('pending');
        // Simulate Oracle delay
        setTimeout(() => {
            setStatus('verified');
        }, 3000);
    };

    return (
        <RoleGuard allowedRoles={['beneficiary']}>
            <div className="container mx-auto p-4 md:p-8 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Beneficiary Portal</h1>
                    {isOffline && (
                        <Badge variant="destructive" className="flex gap-1">
                            <WifiOff className="h-3 w-3" /> Offline Mode
                        </Badge>
                    )}
                </div>

                {/* Status Card */}
                <Card className="border-l-4 border-l-primary">
                    <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${status === 'verified' ? 'bg-green-100 text-green-600' :
                                status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-500'
                                }`}>
                                {status === 'verified' ? <CheckCircle className="h-6 w-6" /> :
                                    status === 'pending' ? <Loader2 className="h-6 w-6 animate-spin" /> :
                                        <AlertCircle className="h-6 w-6" />}
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold capitalize">
                                    Status: {status === 'verified' ? 'Verified Beneficiary' : status === 'pending' ? 'Verification Pending' : 'Identity Unverified'}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    {status === 'verified' ? 'You are eligible to receive and redeem relief vouchers.' :
                                        status === 'pending' ? 'Your documents are being reviewed by an Oracle.' :
                                            'Please verify your identity to access relief funds.'}
                                </p>
                            </div>
                        </div>
                        {status === 'unverified' && (
                            <Button onClick={handleVerify} size="lg">Verify Identity</Button>
                        )}
                    </CardContent>
                </Card>

                {/* Vouchers Section */}
                <AnimatePresence>
                    {status === 'verified' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8"
                        >
                            {MOCK_VOUCHERS.map((voucher) => (
                                <div key={voucher.id} className="bg-white border text-card-foreground shadow-sm rounded-xl overflow-hidden flex flex-col items-center p-6 text-center space-y-4">
                                    <div className="w-full flex justify-between items-center mb-2">
                                        <Badge variant="outline">{voucher.type}</Badge>
                                        <span className="font-bold text-lg">{voucher.amount} USDC</span>
                                    </div>

                                    <div className="p-4 bg-white rounded-xl border-2 border-dashed border-gray-200">
                                        <QRCode
                                            value={JSON.stringify({
                                                id: voucher.id,
                                                amount: voucher.amount,
                                                beneficiary: "0x123", // Mock
                                                secret: "secure-relief-secret"
                                            })}
                                            size={200}
                                            className="h-48 w-48"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground font-mono">ID: {voucher.id} • EXP: {voucher.expiry}</p>
                                        <p className="text-xs text-muted-foreground">{voucher.zone}</p>
                                    </div>

                                    <div className="w-full flex gap-2">
                                        <Button variant="outline" className="w-full text-xs" onClick={() => alert("Saved to offline cache")}>
                                            <FileText className="h-3 w-3 mr-1" /> Save Offline
                                        </Button>
                                        <Button variant="ghost" size="icon">
                                            <RefreshCw className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Empty State for Unverified */}
                {status !== 'verified' && status !== 'pending' && (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>Complete verification to see your available aid vouchers.</p>
                    </div>
                )}
            </div>
        </RoleGuard>
    );
}
