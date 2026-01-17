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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/Toast';

type VerificationStatus = 'unverified' | 'pending' | 'verified';



export default function BeneficiaryDashboard() {
    const { isConnected, address } = useAccount();
    const { toast } = useToast();
    const [status, setStatus] = useState<VerificationStatus>('unverified');
    const [isOffline, setIsOffline] = useState(false);
    const [isVerifyOpen, setIsVerifyOpen] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [vouchers, setVouchers] = useState<any[]>([]);
    const [loadingVouchers, setLoadingVouchers] = useState(false);
    const [isClaimOpen, setIsClaimOpen] = useState(false);
    const [zones, setZones] = useState<any[]>([]);
    const [loadingZones, setLoadingZones] = useState(false);
    const [selectedZone, setSelectedZone] = useState<string>('');
    const [isClaiming, setIsClaiming] = useState(false);

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

    useEffect(() => {
        if (isConnected && address) {
            fetchVouchers();
        }
    }, [isConnected, address]);

    const fetchVouchers = async () => {
        try {
            setLoadingVouchers(true);
            console.log("Fetching vouchers for wallet:", address);
            const res = await fetch(`/api/beneficiary/vouchers?wallet=${address}`);
            const data = await res.json();
            console.log("Voucher data received:", data);
            if (data.vouchers) {
                setVouchers(data.vouchers);
                // If we have vouchers, assume verified for demo purposes
                if (data.vouchers.length > 0) {
                    setStatus('verified');
                }
            }
        } catch (error) {
            console.error("Failed to fetch vouchers", error);
        } finally {
            setLoadingVouchers(false);
        }
    };

    const handleVerifySubmit = () => {
        setUploadProgress(0);
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsVerifyOpen(false);
                    setStatus('pending');
                    // Simulate Oracle approval after a few seconds for demo
                    setTimeout(() => {
                        setStatus('verified');
                        fetchVouchers();
                    }, 3000);
                    return 100;
                }
                return prev + 10;
            });
        }, 300);
    };

    const fetchZones = async () => {
        try {
            setLoadingZones(true);
            const res = await fetch('/api/admin/zones');
            const data = await res.json();
            setZones(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch zones", error);
        } finally {
            setLoadingZones(false);
        }
    };

    const handleClaimAid = async () => {
        if (!selectedZone) {
            toast("Please select a disaster zone", { type: 'error' });
            return;
        }

        try {
            setIsClaiming(true);
            const res = await fetch('/api/beneficiary/vouchers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    walletAddress: address,
                    zoneId: selectedZone
                })
            });

            const data = await res.json();

            if (data.success) {
                setVouchers(prev => [data.voucher, ...prev]);
                setIsClaimOpen(false);
                toast("Voucher claimed successfully!", { type: 'success' });
            } else {
                toast(data.error || "Failed to claim aid", { type: 'error' });
            }
        } catch (error) {
            console.error("Claim aid error:", error);
            toast("An error occurred while claiming aid", { type: 'error' });
        } finally {
            setIsClaiming(false);
        }
    };

    useEffect(() => {
        if (isClaimOpen) {
            fetchZones();
        }
    }, [isClaimOpen]);

    const totalValue = vouchers
        .filter(v => v.status === 'ISSUED')
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

    return (
        <RoleGuard allowedRoles={['beneficiary']}>
            <div className="container mx-auto p-4 md:p-8 space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Relief Vouchers</h1>
                        <p className="text-muted-foreground">Access your verified digital vouchers. Present the QR code to any approved vendor to redeem.</p>
                    </div>
                    <div className="flex gap-4 items-center">
                        {status === 'verified' && (
                            <Button onClick={() => setIsClaimOpen(true)} className="bg-primary hover:bg-primary/90">
                                Claim Relief Aid
                            </Button>
                        )}
                        {isOffline && (
                            <Badge variant="destructive" className="flex gap-1 animate-pulse">
                                <WifiOff className="h-3 w-3" /> Offline Mode
                            </Badge>
                        )}
                    </div>
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
                                <p className="text-2xl font-bold font-mono text-primary">${totalValue.toFixed(2)} USDC</p>
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

                {/* Claim Aid Dialog */}
                <Dialog open={isClaimOpen} onOpenChange={setIsClaimOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Claim Relief Aid</DialogTitle>
                            <DialogDescription>
                                Select an active disaster zone to claim your relief aid entitlement.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Select Relief Zone</label>
                                <Select onValueChange={setSelectedZone} value={selectedZone}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={loadingZones ? "Loading zones..." : "Choose a zone"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {zones.map((zone) => (
                                            <SelectItem key={zone.id} value={zone.id}>
                                                {zone.name} ({zone.type})
                                            </SelectItem>
                                        ))}
                                        {zones.length === 0 && !loadingZones && (
                                            <div className="p-2 text-sm text-muted-foreground text-center">No active zones found</div>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-900/20">
                                <div className="flex gap-3">
                                    <AlertCircle className="h-5 w-5 text-blue-500 shrink-0" />
                                    <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                                        <p className="font-bold">Important Notice</p>
                                        <p>Claiming aid will generate a unique digital voucher tied to your identity. This voucher can only be redeemed at authorized vendors within the selected zone.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsClaimOpen(false)}>Cancel</Button>
                            <Button onClick={handleClaimAid} disabled={isClaiming || !selectedZone}>
                                {isClaiming ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : 'Generate Voucher'}
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
                                    {vouchers.filter(v => v.status === 'ISSUED').map((voucher) => (
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
                                                            <Badge variant="secondary" className="text-[10px] font-bold">VOUCHER #{voucher.id.slice(0, 8)}</Badge>
                                                        </div>
                                                        <p className="text-3xl font-bold tracking-tight">{Number(voucher.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-base font-medium text-muted-foreground">USDC</span></p>
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

                                                    {voucher.donor && (
                                                        <div>
                                                            <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Funded By</p>
                                                            <p className="text-sm font-semibold flex items-center gap-1 text-blue-600">
                                                                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                                                {voucher.donor === 'Anonymous' ? 'Anonymous Donor' : `${voucher.donor.slice(0, 6)}...${voucher.donor.slice(-4)}`}
                                                            </p>
                                                        </div>
                                                    )}

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
                                                        value={voucher.qrCode}
                                                        size={120}
                                                        className="h-28 w-28"
                                                    />
                                                </div>
                                                <div className="mt-2 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-mono text-muted-foreground break-all max-w-[140px] text-center border border-slate-200 dark:border-slate-700">
                                                    {voucher.qrCode}
                                                </div>
                                                <p className="text-[10px] font-bold text-primary mt-2 tracking-widest uppercase">Scan to Redeem</p>
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
                                                {vouchers.filter(v => v.status === 'REDEEMED' || v.status === 'EXPIRED').length === 0 ? (
                                                    <tr>
                                                        <td colSpan={4} className="px-6 py-4 text-center text-muted-foreground">No history found.</td>
                                                    </tr>
                                                ) : (
                                                    vouchers.filter(v => v.status === 'REDEEMED' || v.status === 'EXPIRED').map((tx) => (
                                                        <tr key={tx.id} className="hover:bg-muted/50 transition-colors">
                                                            <td className="px-6 py-4 font-mono text-xs flex items-center gap-2">
                                                                <Calendar className="h-3 w-3 text-muted-foreground" /> {tx.expiry} {/* Using expiry as date placeholder */}
                                                            </td>
                                                            <td className="px-6 py-4 font-medium">{tx.type}</td>
                                                            <td className="px-6 py-4 text-muted-foreground">{tx.zone}</td>
                                                            <td className="px-6 py-4">
                                                                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200 border-none">
                                                                    {tx.status}
                                                                </Badge>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
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
