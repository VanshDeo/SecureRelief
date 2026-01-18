'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';
import { getRoleByAddress } from '@/lib/auth/roleConfig';
import { useToast } from '@/components/ui/Toast';

export type UserRole =
    | 'guest'
    | 'donor'
    | 'admin'
    | 'beneficiary'
    | 'vendor'
    | 'oracle'
    | 'agency';

interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: string;
    walletAddress: string;
}

interface AuthContextType {
    user: User | null;
    role: UserRole;
    isAuthenticated: boolean;
    walletAddress?: string;
    login: () => Promise<void>;
    register: (data: { name: string; email: string; role: string }) => Promise<void>;
    loginAsDemo: (role: UserRole) => void;
    logout: () => void;
    isLoading: boolean;
    setRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { address, isConnected, status, chainId } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const { disconnect } = useDisconnect();
    const { toast } = useToast();

    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<UserRole>('guest');
    const [isLoading, setIsLoading] = useState(true);
    const [isDevOverride, setIsDevOverride] = useState(false);

    // Initial session check
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    const res = await fetch('/api/auth/me', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const userData = await res.json();
                        setUser(userData);
                        setRole(userData.role.toLowerCase() as UserRole);
                    } else {
                        localStorage.removeItem('accessToken');
                    }
                } catch (e) {
                    console.error("[Auth] Session check failed:", e);
                }
            }
            setIsLoading(false);
        };
        checkAuth();
    }, []);

    // Auto-detect role on wallet connection
    useEffect(() => {
        if (!isDevOverride && isConnected && address) {
            const detectedRole = getRoleByAddress(address);
            if (role === 'guest' || (detectedRole !== role && !isDevOverride)) {
                // Toast for connection
                toast("Wallet Connected", {
                    description: `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`,
                    type: 'wallet'
                });

                console.log(`[Auth] Auto-detected role: ${detectedRole}`);
                setRole(detectedRole);
            }
        } else if (!isDevOverride && !isConnected && status !== 'reconnecting') {
            setRole('guest');
        }
    }, [address, isConnected, isDevOverride, role, status, toast]);

    const handleSetRole = (newRole: UserRole) => {
        setIsDevOverride(true);
        setRole(newRole);
    };

    const loginAsDemo = (demoRole: UserRole) => {
        console.log(`[Auth] Logging in as Demo: ${demoRole}`);
        setIsDevOverride(true);
        setRole(demoRole);
    };

    const register = async (data: { name: string; email: string; role: string }) => {
        if (!address || !isConnected) {
            toast('Please connect your wallet first', { type: 'error' });
            return;
        }

        try {
            setIsLoading(true);
            // Generate a random secure password since we use wallet auth exclusively
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8) + "1aA!";

            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    walletAddress: address,
                    password: randomPassword,
                    confirmPassword: randomPassword
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Registration failed');
            }

            // Auto-login after registration
            await login();
            toast("Registration Successful", { type: 'success', description: `Welcome, ${data.name}!` });
        } catch (error: any) {
            console.error('[Auth] Registration failed:', error);
            toast("Registration Failed", { type: 'error', description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const login = async () => {
        if (!address || !isConnected) {
            toast('Please connect your wallet first', { type: 'error' });
            return;
        }

        try {
            setIsLoading(true);
            const nonceRes = await fetch('/api/auth/nonce', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ walletAddress: address })
            });

            if (!nonceRes.ok) throw new Error('Failed to get nonce');
            const { nonce } = await nonceRes.json();

            const message = new SiweMessage({
                domain: window.location.host,
                address: address,
                statement: 'Sign in with Ethereum to SecureRelief.',
                uri: window.location.origin,
                version: '1',
                chainId: chainId || 1,
                nonce: nonce,
            });
            const messageText = message.prepareMessage();
            const signature = await signMessageAsync({ message: messageText });

            const loginRes = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: messageText, signature })
            });

            if (!loginRes.ok) throw new Error('Login failed');
            const data = await loginRes.json();

            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            setUser(data.user);
            setRole(data.user.role.toLowerCase() as UserRole);
            toast("Secure Login Successful", { type: 'success', description: "Session authenticated via SIWE." });

        } catch (error: any) {
            console.error('[Auth] SIWE Login failed:', error);
            toast('Login failed', {
                type: 'error',
                description: error.message || 'Authentication error'
            });
            throw error; // Re-throw so login page can handle it
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try { await fetch('/api/auth/logout', { method: 'POST' }); } catch (e) { }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setRole('guest');
        setIsDevOverride(false);
        disconnect();
        toast("Logged out", { type: 'info' });
    };

    return (
        <AuthContext.Provider value={{
            user,
            role,
            setRole: handleSetRole,
            // Authenticated if we have a user (Real) OR if dev override is on OR wallet connected
            isAuthenticated: !!user || isDevOverride || (isConnected && role !== 'guest'),
            walletAddress: address,
            login,
            register,
            loginAsDemo,
            logout,
            isLoading: isLoading || status === 'connecting' || status === 'reconnecting'
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
