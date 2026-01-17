'use client';

import { useAuth, UserRole } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
    const { role, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated) {
            router.push('/login');
        } else if (!allowedRoles.includes(role)) {
            // If logged in but wrong role, push to their actual dashboard or unauth page
            // For now, redirect to their role's dashboard if valid, or home
            if (role !== 'guest') {
                router.push(`/dashboard/${role}`);
            } else {
                router.push('/');
            }
        } else {
            // Authorized
            if (!authorized) {
                setAuthorized(true);
            }
        }
    }, [isAuthenticated, role, allowedRoles, router, isLoading, authorized]);

    if (isLoading || !authorized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return <>{children}</>;
}
