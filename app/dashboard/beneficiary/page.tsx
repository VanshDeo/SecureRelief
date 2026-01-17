'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAccount } from 'wagmi';
import { CheckCircle, AlertCircle, RefreshCw, WifiOff, FileText, Loader2, Upload, History, MapPin, Calendar, Landmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog';

type VerificationStatus = 'unverified' | 'pending' | 'verified';

const MOCK_VOUCHERS = [
    { id: 101, type: "Food & Water", amount: 50, expiry: "2026-02-01", zone: "Odisha Cyclone Relief" },
    { id: 102, type: "Medical Supplies", amount: 100, expiry: "2026-03-01", zone: "Himachal Flood Response" },
];

const MOCK_HISTORY = [
    { id: "tx_01", date: "2024-01-10", item: "Food Kit (Rice, Wheat)", location: "Bhubaneswar Relief Center", status: "Redeemed" },
    { id: "tx_02", date: "2023-12-25", item: "Medical Checkup", location: "Mobile Clinic #4", status: "Redeemed" },
];

export default function BeneficiaryDashboard() {
    const { isConnected } = useAccount();
    const [status, setStatus] = useState<VerificationStatus>('unverified');
    const [isOffline, setIsOffline] = useState(false);
    const [isVerifyOpen, setIsVerifyOpen] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

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

    const handleVerifySubmit = () => {
        setUploadProgress(0);
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsVerifyOpen(false);
                    setStatus('pending');
                    // Simulate Oracle approval after a few seconds for demo
                    setTimeout(() => setStatus('verified'), 3000);
                    return 100;
                }
                return prev + 10;
            });
        }, 300);
    };

    return (
        <RoleGuard allowedRoles={['beneficiary']}>
            <div className="container mx-auto p-4 md:p-8 space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Relief Vouchers</h1>
                        <p className="text-muted-foreground">Access your verified digital vouchers. Present the QR code to any approved vendor to redeem.</p>
                    </div>
                    {isOffline && (
                        <Badge variant="destructive" className="flex gap-1 animate-pulse">
                            <WifiOff className="h-3 w-3" /> Offline Mode
                        </Badge>
                    )}
                </div>

                {/* Status Card */}
                <Card className={`border-l-4 shadow-sm ${status === 'verified' ? 'border-l-green-500 bg-green-50/50 dark:bg-green-950/10' :
                    status === 'pending' ? 'border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/10' :
                        'border-l-gray-500'
                    }`}>
                    <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className={`h-14 w-14 rounded-full flex items-center justify-center shadow-sm ${status === 'verified' ? 'bg-green-100 text-green-600' :
                                status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-500'
                                }`}>
                                {status === 'verified' ? <CheckCircle className="h-7 w-7" /> :
                                    status === 'pending' ? <Loader2 className="h-7 w-7 animate-spin" /> :
                                        <AlertCircle className="h-7 w-7" />}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold capitalize text-gray-900 dark:text-gray-100">
                                    {status === 'verified' ? 'Verified Beneficiary' :
                                        status === 'pending' ? 'Verification In Progress' : 'Identity Unverified'}
                                </h2>
                                <p className="text-sm text-muted-foreground max-w-md mt-1">
                                    {status === 'verified' ? 'Your identity is confirmed on the blockchain. You can now access and redeem your relief vouchers.' :
                                        status === 'pending' ? 'Your government ID is being validated by the Oracle network. This usually takes 24 hours.' :
                                            'To prevent fraud and ensure aid reaches the right people, please verify your identity with a government ID.'}
                                </p>
                            </div>
                        </div>
                        {status === 'unverified' && (
                            <Button onClick={() => setIsVerifyOpen(true)} size="lg" className="shrink-0 shadow-lg shadow-primary/20">
                                Verify Identity
                            </Button>
                        )}
                        {status === 'verified' && (
                            <div className="text-right hidden md:block">
                                <p className="text-xs text-muted-foreground uppercase font-semibold">Total Voucher Value</p>
                                <p className="text-2xl font-bold font-mono text-primary">$150.00 USDC</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Verification Dialog */}
                <Dialog open={isVerifyOpen} onOpenChange={setIsVerifyOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Verify Your Identity</DialogTitle>
                            <DialogDescription>
                                Upload a clear photo of your Aadhaar Card or Voter ID.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors">
                                <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-3">
                                    <Upload className="h-6 w-6" />
                                </div>
                                <p className="text-sm font-medium text-gray-900">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or PDF (max. 5MB)</p>
                            </div>
                            {uploadProgress > 0 && (
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span>Uploading...</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                                    </div>
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsVerifyOpen(false)}>Cancel</Button>
                            <Button onClick={handleVerifySubmit} disabled={uploadProgress > 0}>
                                {uploadProgress > 0 ? 'Verifying...' : 'Submit Documents'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Vouchers Section */}
                <AnimatePresence>
                    {status === 'verified' && (
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" /> Available Vouchers
                                </h3>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                >
                                    {MOCK_VOUCHERS.map((voucher) => (
                                        <div key={voucher.id} className="group bg-white dark:bg-slate-800 border-2 border-primary/10 text-card-foreground shadow-sm hover:shadow-lg hover:border-primary/30 transition-all rounded-2xl overflow-hidden flex flex-col md:flex-row">
                                            {/* Left: Info */}
                                            <div className="p-6 flex-1 space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                                                {voucher.type === "Medical Supplies" ? <Landmark className="h-3 w-3 mr-1" /> : <FileText className="h-3 w-3 mr-1" />}
                                                                {voucher.type}
                                                            </Badge>
                                                            <Badge variant="secondary" className="text-[10px] font-bold">VOUCHER #{voucher.id}</Badge>
                                                        </div>
                                                        <p className="text-3xl font-bold tracking-tight">{voucher.amount} <span className="text-base font-medium text-muted-foreground">USDC</span></p>
                                                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" /> Valid until {voucher.expiry}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="pt-4 border-t border-dashed space-y-3">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Restricted To</p>
                                                        <p className="text-sm font-semibold flex items-center gap-1">
                                                            <MapPin className="h-3 w-3 text-red-500" /> {voucher.zone}
                                                        </p>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <Button variant="outline" size="sm" className="h-8 text-[10px] gap-1.5" onClick={() => window.print()}>
                                                            <History className="h-3 w-3" /> Print PDF
                                                        </Button>
                                                        <Button variant="outline" size="sm" className="h-8 text-[10px] gap-1.5" onClick={() => alert('Voucher saved to your gallery for offline use.')}>
                                                            <Upload className="h-3 w-3 rotate-180" /> Save to Gallery
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right: QR */}
                                            <div className="bg-slate-50 dark:bg-slate-900/50 p-8 flex flex-col items-center justify-center border-l dark:border-slate-800 relative min-w-[200px]">
                                                <div className="bg-white p-3 rounded-2xl shadow-inner border-4 border-white">
                                                    <QRCode
                                                        value={JSON.stringify({
                                                            id: voucher.id,
                                                            amount: voucher.amount,
                                                            beneficiary: "0x123",
                                                            type: voucher.type,
                                                            zone: voucher.zone
                                                        })}
                                                        size={120}
                                                        className="h-28 w-28"
                                                    />
                                                </div>
                                                <p className="text-[10px] font-bold text-primary mt-4 tracking-widest uppercase">Scan to Redeem</p>
                                                <p className="text-[9px] text-muted-foreground mt-1 text-center max-w-[140px]">Show this to any approved vendor in the relief zone.</p>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            </div>

                            {/* Redemption History */}
                            <div>
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <History className="h-5 w-5 text-primary" /> Redemption History
                                </h3>
                                <Card>
                                    <div className="rounded-md overflow-hidden">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-semibold">
                                                <tr>
                                                    <th className="px-6 py-3">Date</th>
                                                    <th className="px-6 py-3">Item / Service</th>
                                                    <th className="px-6 py-3">Location</th>
                                                    <th className="px-6 py-3">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {MOCK_HISTORY.map((tx) => (
                                                    <tr key={tx.id} className="hover:bg-muted/50 transition-colors">
                                                        <td className="px-6 py-4 font-mono text-xs flex items-center gap-2">
                                                            <Calendar className="h-3 w-3 text-muted-foreground" /> {tx.date}
                                                        </td>
                                                        <td className="px-6 py-4 font-medium">{tx.item}</td>
                                                        <td className="px-6 py-4 text-muted-foreground">{tx.location}</td>
                                                        <td className="px-6 py-4">
                                                            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200 border-none">
                                                                {tx.status}
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Empty State for Unverified */}
                {status !== 'verified' && status !== 'pending' && (
                    <div className="text-center py-20 bg-gray-50/50 rounded-xl border-2 border-dashed">
                        <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                            <FileText className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-semibold">Vouchers Locked</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto mt-1">Complete the identity verification process above to unlock your relief aid entitlements.</p>
                    </div>
                )}
            </div>
        </RoleGuard>
    );
}
