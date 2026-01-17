'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth, UserRole } from '@/context/MockAuthContext';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { ShieldCheck, Bell, User, LogOut, ChevronDown, Wallet, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { injected } from 'wagmi/connectors';

export function Navbar() {
    const { role, setRole, isAuthenticated, logout: authLogout } = useAuth();
    const { address, isConnected } = useAccount();
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();

    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isUserOpen, setIsUserOpen] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleLogin = () => {
        connect({ connector: injected() });
    };

    const handleDisconnect = () => {
        disconnect();
        authLogout();
    };

    const navLinks = [
        { name: 'How it Works', href: '/#how-it-works' },
        { name: 'Active Reliefs', href: '/#campaigns' },
        { name: 'Impact', href: '/impact/hurricane-delta' }, // Mock link
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Secure Relief</span>
                </Link>

                {/* Desktop Navigation & Actions (Grouped on Right) */}
                <div className="hidden md:flex items-center gap-8">
                    {/* Navigation Links */}
                    <div className="flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Separator */}
                    <div className="h-6 w-px bg-border/50" />

                    {/* Actions */}
                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        {/* Guest State: Connect Wallet */}
                        {!isConnected && (
                            <Button onClick={handleLogin} className="gap-2 shadow-lg shadow-primary/20">
                                <Wallet className="h-4 w-4" />
                                Connect Wallet
                            </Button>
                        )}

                        {/* Authenticated State */}
                        {isConnected && (
                            <>
                                {/* Wallet Info */}
                                <div className="hidden lg:flex items-center gap-2 rounded-full border px-3 py-1 bg-muted/50">
                                    <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                                    <span className="text-xs font-mono font-medium text-muted-foreground">
                                        {address?.slice(0, 6)}...{address?.slice(-4)}
                                    </span>
                                </div>

                                {/* Role Badge */}
                                <Badge variant="secondary" className="capitalize hidden sm:flex">
                                    {role}
                                </Badge>

                                {/* Separator */}
                                <div className="h-6 w-px bg-border/50 mx-1" />

                                {/* Notifications */}
                                <div className="relative">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="relative rounded-full hover:bg-muted"
                                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                                    >
                                        <Bell className="h-5 w-5 text-muted-foreground" />
                                        <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
                                    </Button>

                                    <AnimatePresence>
                                        {isNotifOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute right-0 mt-2 w-80 rounded-xl border bg-card/95 backdrop-blur-sm p-4 shadow-xl ring-1 ring-black/5 z-50"
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="text-sm font-semibold">Notifications</h4>
                                                    <Badge variant="outline" className="text-xs">2 New</Badge>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex gap-3 items-start p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                                                        <div className="h-2 w-2 mt-2 rounded-full bg-primary shrink-0" />
                                                        <div>
                                                            <p className="text-sm font-medium leading-none mb-1">Hurricane Delta Relief</p>
                                                            <p className="text-xs text-muted-foreground">Your donation of 50 USDC was successfully allocated.</p>
                                                            <p className="text-[10px] text-muted-foreground mt-1">2 mins ago</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-3 items-start p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                                                        <div className="h-2 w-2 mt-2 rounded-full bg-muted-foreground shrink-0" />
                                                        <div>
                                                            <p className="text-sm font-medium leading-none mb-1">New Campaign Alert</p>
                                                            <p className="text-xs text-muted-foreground">Wildfire Recovery Fund is now live in your region.</p>
                                                            <p className="text-[10px] text-muted-foreground mt-1">1 hour ago</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* User Profile Button */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsUserOpen(!isUserOpen)}
                                        className="flex items-center gap-2 focus:outline-none ml-1"
                                    >
                                        <div className="relative">
                                            <Avatar className="h-9 w-9 border-2 border-background ring-2 ring-border/50 transition-all hover:ring-primary/50">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${address}`} />
                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                    {role?.slice(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-background" />
                                        </div>
                                    </button>

                                    <AnimatePresence>
                                        {isUserOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.1 }}
                                                className="absolute right-0 mt-3 w-64 rounded-xl border bg-card/95 backdrop-blur-sm shadow-xl ring-1 ring-black/5 z-50 overflow-hidden"
                                            >
                                                <div className="p-4 border-b bg-muted/30">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${address}`} />
                                                            <AvatarFallback>U</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 overflow-hidden">
                                                            <p className="text-sm font-semibold truncate">User {address?.slice(0, 4)}</p>
                                                            <p className="text-xs text-muted-foreground capitalize">{role} Account</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-2 space-y-1">
                                                    <Link href={`/dashboard/${role}`} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors">
                                                        <User className="h-4 w-4 text-muted-foreground" />
                                                        Dashboard
                                                    </Link>
                                                    <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors">
                                                        <Bell className="h-4 w-4 text-muted-foreground" />
                                                        Notifications
                                                    </button>
                                                </div>

                                                {/* Role Switcher (Dev) */}
                                                <div className="px-3 py-2 border-t border-border/50">
                                                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-2 tracking-wider">Dev Tools: Switch Role</p>
                                                    <div className="grid grid-cols-2 gap-1">
                                                        {['donor', 'admin', 'beneficiary', 'vendor'].map((r) => (
                                                            <button
                                                                key={r}
                                                                onClick={() => { setRole(r as UserRole); setIsUserOpen(false); }}
                                                                className={cn(
                                                                    "text-left px-2 py-1 text-xs rounded hover:bg-primary/10 hover:text-primary capitalize transition-colors",
                                                                    role === r && "bg-primary/10 text-primary font-medium"
                                                                )}
                                                            >
                                                                {r}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="p-2 border-t bg-muted/30">
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleDisconnect();
                                                        }}
                                                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                                                    >
                                                        <LogOut className="h-4 w-4" />
                                                        Sign Out
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden p-2" onClick={() => setIsMobileOpen(!isMobileOpen)}>
                    {isMobileOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden border-b bg-background"
                    >
                        <div className="p-4 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="block text-sm font-medium hover:text-primary"
                                    onClick={() => setIsMobileOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 border-t">
                                {isConnected ? <Button onClick={handleDisconnect} variant="destructive" className="w-full">Disconnect</Button> : <Button onClick={handleLogin} className="w-full">Connect Wallet</Button>}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
