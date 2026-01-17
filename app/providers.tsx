'use client';

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '@/lib/config';
import { AuthProvider } from '@/context/AuthContext';
import { useState, useEffect } from 'react';

import { ToastProvider } from '@/components/ui/Toast';

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="min-h-screen bg-gray-50" />;
    }

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <ToastProvider>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </ToastProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
