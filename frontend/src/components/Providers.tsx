'use client';

import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
// import { AuthProvider } from '@/contexts/AuthContext';
import { useWeb3Store } from '@/store/web3Store';

export default function Providers({ children }: { children: React.ReactNode }) {
    // Use any for store to avoid strict type issues during initial migration
    const initialize = useWeb3Store((state: any) => state.initialize);

    useEffect(() => {
        initialize();
    }, [initialize]);

    return (
        <>
            {children}
            < Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        duration: 5000,
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }
                }
            />
        </>
    );
}
