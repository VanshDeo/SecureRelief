'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

// Context to share state
const DialogContext = React.createContext<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
} | undefined>(undefined);

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
    return (
        <DialogContext.Provider value={{ open, onOpenChange }}>
            {children}
        </DialogContext.Provider>
    );
}

export function DialogContent({ className, children }: { className?: string; children: React.ReactNode }) {
    const context = React.useContext(DialogContext);
    if (!context) throw new Error("DialogContent must be used within Dialog");
    const { open, onOpenChange } = context;
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Only render on client to avoid hydration mismatch
    if (!mounted) return null;

    const portalContent = (
        <AnimatePresence mode="wait">
            {open && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-auto"
                    aria-modal="true"
                    role="dialog"
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => onOpenChange(false)}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className={cn("relative z-[99999] w-full bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-border p-6 max-h-[90vh] overflow-y-auto", className)}
                    >
                        {children}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => onOpenChange(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return createPortal(portalContent, document.body);
}

export function DialogHeader({ className, children }: { className?: string; children: React.ReactNode }) {
    return <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left mb-4", className)}>{children}</div>;
}

export function DialogTitle({ className, children }: { className?: string; children: React.ReactNode }) {
    return <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)}>{children}</h2>;
}

export function DialogDescription({ className, children }: { className?: string; children: React.ReactNode }) {
    return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>;
}

export function DialogFooter({ className, children }: { className?: string; children: React.ReactNode }) {
    return <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6", className)}>{children}</div>;
}
