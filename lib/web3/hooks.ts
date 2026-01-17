
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useState } from 'react';
import { USDC_ABI, TREASURY_ABI, VOUCHER_MANAGER_ABI } from './abis';
import { parseUnits } from 'viem';
import { useToast } from '@/components/ui/Toast';

// Addresses - MOCK ADDRESSES (Replace with deployed addresses in real env)
export const USDC_ADDRESS = "0x0000000000000000000000000000000000000001";
export const TREASURY_ADDRESS = "0x0000000000000000000000000000000000000002";
export const VOUCHER_MANAGER_ADDRESS = "0x0000000000000000000000000000000000000003";

import { useQuery } from '@tanstack/react-query';

export function useUSDCBalance(address: string | undefined) {
    return useQuery({
        queryKey: ['usdcBalance', address],
        queryFn: async () => {
            if (!address) return 0;
            const res = await fetch(`/api/user/balance?wallet=${address}`);
            if (!res.ok) return 0;
            const data = await res.json();
            return data.balance; // Returns string or decimal, client handles it
        },
        enabled: !!address,
        refetchInterval: 5000
    });
}

export function useDonate() {
    // WEB3 (Commented out for Mock Mode)
    // const { writeContract, data: hash, isPending, error } = useWriteContract();
    // const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    //     hash,
    // });

    // MOCK MODE STATE
    const [isPending, setIsPending] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [hash, setHash] = useState<string | undefined>(undefined);
    const [error, setError] = useState<any>(null);
    const { toast } = useToast();

    const donate = async (zoneId: string, amount: string, donorWallet?: string) => {
        setIsPending(true);
        try {
            // Simulate network delay (Approving tokens...)
            toast("Processing Donation...", { type: 'loading', description: "Interacting with blockchain (Mock)" });
            await new Promise(resolve => setTimeout(resolve, 1500));

            setIsPending(false);
            setIsConfirming(true);

            // Simulate transaction mining
            await new Promise(resolve => setTimeout(resolve, 1000));

            const res = await fetch('/api/donate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    zoneId,
                    amount,
                    donorWallet: donorWallet || "0xMockAddress..."
                })
            });

            if (!res.ok) throw new Error("Donation processing failed on server");

            setIsConfirming(false);
            setIsConfirmed(true);
            const txHash = "0x" + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
            setHash(txHash);

            toast("Donation Successful!", {
                type: 'success',
                description: `Thank you! ${amount} USDC donated to relief fund.`
            });

        } catch (err: any) {
            console.error(err);
            setError(err);
            setIsPending(false);
            setIsConfirming(false);
            toast("Donation Failed", { type: 'error', description: err.message || "Unknown error occurred" });
        }
    };

    return { donate, isPending, isConfirming, isConfirmed, error, hash };
}

export function useIssueVoucher() {
    const { writeContract, data: hash, isPending } = useWriteContract();

    // For Oracle/Admin use
    const issue = (beneficiary: string, amount: string, zoneId: string) => {
        writeContract({
            address: VOUCHER_MANAGER_ADDRESS,
            abi: VOUCHER_MANAGER_ABI,
            functionName: 'issueVoucher',
            args: [beneficiary as `0x${string}`, parseUnits(amount, 6), zoneId],
        });
    };

    return { issue, isPending, hash };
}

export function useRedeemVoucher() {
    const { writeContract, data: hash, isPending } = useWriteContract();

    // For Vendor use
    const redeem = (voucherId: number) => {
        writeContract({
            address: VOUCHER_MANAGER_ADDRESS,
            abi: VOUCHER_MANAGER_ABI,
            functionName: 'redeemVoucher',
            args: [BigInt(voucherId)],
        });
    };

    return { redeem, isPending, hash };
}
