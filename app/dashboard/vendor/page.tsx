'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useRedeemVoucher } from '@/lib/web3/hooks';
import { ScanLine, CheckCircle2, ArrowRight, Loader2, History } from 'lucide-react';
import { motion } from 'framer-motion';
import { RoleGuard } from '@/components/auth/RoleGuard';

interface ScannedData {
    id: number | string;
    amount: number;
    type: string;
    beneficiary: string;
}

export default function VendorDashboard() {
    const [isScanning, setIsScanning] = useState(false);
    const [scannedData, setScannedData] = useState<ScannedData | null>(null);
    const [manualCode, setManualCode] = useState("");

    // Web3 Hook
    const { redeem, isPending, hash } = useRedeemVoucher();

    const handleSimulateScan = () => {
        setIsScanning(true);
        // Simulate a successful scan after 2 seconds
        setTimeout(() => {
            const mockVoucher = {
                id: Math.floor(Math.random() * 1000),
                amount: 50,
                type: "Food & Water",
                beneficiary: "0xBen...eficiary"
            };
            setScannedData(mockVoucher);
            setIsScanning(false);
        }, 1500);
    };

    const handleRedeem = () => {
        if (!scannedData) return;
        redeem(Number(scannedData.id));
    };

    const resetScan = () => {
        setScannedData(null);
        setManualCode("");
    };

    return (
        <RoleGuard allowedRoles={['vendor']}>
            <div className="container mx-auto p-4 md:p-8 space-y-6">
                <h1 className="text-3xl font-bold">Vendor Portal</h1>
                <p className="text-muted-foreground">Scan beneficiary vouchers to receive instant stablecoin settlement.</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Scanner Interface */}
                    <Card className="h-full border-2 border-primary/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ScanLine className="h-5 w-5 text-primary" />
                                Voucher Redemption
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {!scannedData ? (
                                <div className="flex flex-col items-center justify-center space-y-4 py-8">
                                    <div className="h-48 w-full bg-black/5 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 relative overflow-hidden group">
                                        {isScanning ? (
                                            <>
                                                <div className="absolute inset-0 bg-black/10 animate-pulse" />
                                                <div className="absolute top-0 w-full h-1 bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-[scan_2s_ease-in-out_infinite]" />
                                                <div className="z-10 text-sm font-medium">Scanning Camera Feed...</div>
                                            </>
                                        ) : (
                                            <Button variant="ghost" className="h-full w-full flex flex-col gap-2 hover:bg-transparent" onClick={handleSimulateScan}>
                                                <ScanLine className="h-12 w-12 text-muted-foreground" />
                                                <span className="text-sm font-medium text-muted-foreground">Tap to Activate Camera</span>
                                            </Button>
                                        )}
                                    </div>
                                    <div className="w-full relative flex items-center">
                                        <div className="flex-grow border-t border-gray-200"></div>
                                        <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase">Or enter code manually</span>
                                        <div className="flex-grow border-t border-gray-200"></div>
                                    </div>
                                    <div className="flex w-full gap-2">
                                        <Input
                                            type="text"
                                            placeholder="Voucher ID (e.g. 10452)"
                                            value={manualCode}
                                            onChange={(e) => setManualCode(e.target.value)}
                                        />
                                        <Button onClick={() => {
                                            setScannedData({ id: manualCode, amount: 50, type: "Manual Entry", beneficiary: "Unknown" });
                                        }} disabled={!manualCode}>
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="space-y-6"
                                >
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                                        <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                                            <CheckCircle2 className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-lg font-bold text-green-800">Voucher Valid</h3>
                                        <p className="text-sm text-green-700">Code successfully scanned.</p>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-muted-foreground">Voucher Type</span>
                                            <span className="font-medium">{scannedData.type}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-muted-foreground">Amount</span>
                                            <span className="font-bold text-lg">{scannedData.amount} USDC</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b">
                                            <span className="text-muted-foreground">Beneficiary</span>
                                            <span className="font-mono text-xs">{scannedData.beneficiary}</span>
                                        </div>
                                    </div>

                                    {hash ? (
                                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-blue-800 text-sm">
                                            <p className="font-bold mb-1">Redemption Submitted!</p>
                                            <p className="font-mono text-xs break-all">{hash}</p>
                                        </div>
                                    ) : (
                                        <div className="flex gap-4">
                                            <Button variant="outline" className="flex-1" onClick={resetScan}>Cancel</Button>
                                            <Button className="flex-1" onClick={handleRedeem} disabled={isPending}>
                                                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <DollarSignIcon className="mr-2 h-4 w-4" />}
                                                Redeem Now
                                            </Button>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </CardContent>
                    </Card>

                    {/* History */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <History className="h-5 w-5" />
                                Recent Settlements
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                        <div className="flex gap-3 items-center">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                                V
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Voucher #{4000 + i}</p>
                                                <p className="text-xs text-muted-foreground">Processed today, 10:2{i} AM</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-green-600">+$50.00</p>
                                            <p className="text-xs text-muted-foreground">Confirmed</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </RoleGuard>
    );
}

function DollarSignIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="12" x2="12" y1="2" y2="22" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
    )
}
