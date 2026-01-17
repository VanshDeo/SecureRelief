'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, Loader2, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info' | 'loading' | 'wallet';

interface Toast {
    id: string;
    message: string;
    description?: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextType {
    toast: (message: string, options?: { type?: ToastType; description?: string; duration?: number }) => void;
    dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = useCallback((message: string, options: { type?: ToastType; description?: string; duration?: number } = {}) => {
        const id = Math.random().toString(36).substring(7);
        const type = options.type || 'info';
        const duration = options.duration || 4000;

        setToasts((prev) => [...prev, { id, message, description: options.description, type, duration }]);

        if (duration > 0) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, duration);
        }
    }, []);

    const dismiss = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toast, dismiss }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
                <AnimatePresence mode='popLayout'>
                    {toasts.map((t) => (
                        <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
    const icons = {
        success: <CheckCircle className="h-5 w-5 text-green-500" />,
        error: <AlertCircle className="h-5 w-5 text-red-500" />,
        info: <Info className="h-5 w-5 text-blue-500" />,
        loading: <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />,
        wallet: <Wallet className="h-5 w-5 text-purple-500" />
    };

    const bgStyles = {
        success: "border-green-200 bg-green-50/90 dark:bg-green-900/20 dark:border-green-800",
        error: "border-red-200 bg-red-50/90 dark:bg-red-900/20 dark:border-red-800",
        info: "border-blue-200 bg-blue-50/90 dark:bg-blue-900/20 dark:border-blue-800",
        loading: "border-blue-200 bg-blue-50/90 dark:bg-blue-900/20 dark:border-blue-800",
        wallet: "border-purple-200 bg-purple-50/90 dark:bg-purple-900/20 dark:border-purple-800"
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className={cn(
                "pointer-events-auto w-full border rounded-xl shadow-lg shadow-black/5 p-4 flex gap-3 items-start relative backdrop-blur-md",
                bgStyles[toast.type]
            )}
        >
            <div className="mt-0.5 shrink-0 bg-white/50 p-1.5 rounded-full ring-1 ring-inset ring-black/5">
                {icons[toast.type]}
            </div>
            <div className="flex-1 mr-4">
                <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 leading-snug">{toast.message}</p>
                {toast.description && <p className="text-xs text-black/60 dark:text-white/60 mt-1 leading-relaxed">{toast.description}</p>}
            </div>
            <button
                onClick={() => onDismiss(toast.id)}
                className="text-black/40 hover:text-black/70 transition-colors absolute top-3 right-3 p-1 hover:bg-black/5 rounded-md"
            >
                <X className="h-3.5 w-3.5" />
            </button>
        </motion.div>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within a ToastProvider");
    return context;
}
