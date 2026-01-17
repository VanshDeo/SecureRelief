'use client';

import React, { useState } from 'react';
import { useAuth, UserRole } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Wrench } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function DevToolbar() {
    const { role, setRole } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const roles: UserRole[] = ['guest', 'admin', 'donor', 'beneficiary', 'vendor', 'oracle', 'agency'];

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="mb-2 w-48 rounded-lg border bg-card p-2 shadow-xl ring-1 ring-black/10 origin-bottom-right"
                    >
                        <div className="text-xs font-semibold text-muted-foreground mb-2 px-2">Dev Role Switcher</div>
                        <div className="space-y-1">
                            {roles.map((r) => (
                                <button
                                    key={r}
                                    onClick={() => { setRole(r); }}
                                    className={`w-full text-left px-2 py-1.5 text-xs rounded transition-colors capitalize ${role === r
                                        ? 'bg-primary text-primary-foreground font-medium'
                                        : 'hover:bg-muted text-foreground'
                                        }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Button
                size="icon"
                variant={isOpen ? "default" : "secondary"}
                className="rounded-full shadow-lg h-12 w-12"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Wrench className="h-6 w-6" />
            </Button>
        </div>
    );
}
