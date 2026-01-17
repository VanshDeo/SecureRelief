'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useIssueVoucher } from '@/lib/web3/hooks';
import { Check, X, FileText, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RoleGuard } from '@/components/auth/RoleGuard';

interface Claim {
    id: string;
    beneficiaryName: string;
    beneficiaryAddress: string;
    document: string;
    score: number;
    status: 'pending' | 'approved' | 'rejected';
}

const MOCK_CLAIMS: Claim[] = [
    { id: '#CLM-9921', beneficiaryName: 'Sarah Connor', beneficiaryAddress: '0x123...abc', document: 'ID_Front.jpg', score: 98, status: 'pending' },
    { id: '#CLM-9922', beneficiaryName: 'Kyle Reese', beneficiaryAddress: '0x456...def', document: 'Utility_Bill.pdf', score: 75, status: 'pending' },
    { id: '#CLM-9923', beneficiaryName: 'John Doe', beneficiaryAddress: '0x789...ghi', document: 'Passport.pdf', score: 45, status: 'pending' },
];

export default function OracleDashboard() {
    const [claims, setClaims] = useState<Claim[]>(MOCK_CLAIMS);
    const { issue, isPending } = useIssueVoucher();

    const handleAction = (id: string, action: 'approved' | 'rejected') => {
        // Simulate Web3 action
        if (action === 'approved') {
            issue("0xMockC...", "50", "zone-1");
        }

        setClaims(claims.map(c => c.id === id ? { ...c, status: action } : c));

        // Remove from view after delay
        setTimeout(() => {
            setClaims(prev => prev.filter(c => c.id !== id));
        }, 1500);
    };

    return (
        <RoleGuard allowedRoles={['oracle']}>
            <div className="container mx-auto p-8 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Oracle Verification Queue</h1>
                        <p className="text-muted-foreground">Review and verify beneficiary eligibility claims.</p>
                    </div>
                    <Badge variant="outline" className="h-8 px-3">Queue Size: {claims.filter(c => c.status === 'pending').length}</Badge>
                </div>

                <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Claim ID</th>
                                <th className="px-6 py-4 font-semibold">Beneficiary</th>
                                <th className="px-6 py-4 font-semibold">Documents</th>
                                <th className="px-6 py-4 font-semibold">AI Confidence</th>
                                <th className="px-6 py-4 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y relative">
                            <AnimatePresence>
                                {claims.map((claim) => (
                                    <motion.tr
                                        key={claim.id}
                                        initial={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="group hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-mono font-medium">{claim.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{claim.beneficiaryName}</div>
                                            <div className="text-xs text-muted-foreground font-mono">{claim.beneficiaryAddress}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-primary cursor-pointer hover:underline">
                                                <FileText className="h-4 w-4" />
                                                {claim.document}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${claim.score > 80 ? 'bg-green-100 text-green-800' :
                                                claim.score > 50 ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {claim.score}% Match
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {claim.status === 'pending' ? (
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700"
                                                        onClick={() => handleAction(claim.id, 'approved')}
                                                        disabled={isPending}
                                                    >
                                                        <Check className="h-4 w-4 mr-1" /> Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleAction(claim.id, 'rejected')}
                                                    >
                                                        <X className="h-4 w-4 mr-1" /> Reject
                                                    </Button>
                                                </div>
                                            ) : (
                                                <span className={`text-sm font-medium ${claim.status === 'approved' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {claim.status === 'approved' ? 'Approved' : 'Rejected'}
                                                </span>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                    {claims.length === 0 && (
                        <div className="p-12 text-center text-muted-foreground">
                            <Check className="h-12 w-12 mx-auto mb-4 text-green-200" />
                            <h3 className="text-lg font-medium text-gray-900">All caught up!</h3>
                            <p>No pending claims in the queue.</p>
                        </div>
                    )}
                </div>
            </div>
        </RoleGuard>
    );
}
