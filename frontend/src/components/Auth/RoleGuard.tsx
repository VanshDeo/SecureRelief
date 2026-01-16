import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWeb3Store } from '@/store/web3Store';
import GuestWelcome from './GuestWelcome';
import LoadingSpinner from '@/components/UI/LoadingSpinner';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole?: string; // e.g. 'admin', 'vendor', 'government'
  roles?: string[]; // List of allowed roles
  permissions?: string[]; // List of required permissions
  requireConnection?: boolean; // defaults to true
  title?: string;
  subtitle?: string;
  fallback?: React.ReactNode | null; // Custom fallback content (or null to hide)
}

const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  requiredRole,
  roles,
  permissions,
  requireConnection = true,
  title = "Access Restricted",
  subtitle = "Please connect your wallet to access this area.",
  fallback
}) => {
  const router = useRouter();
  const { isConnected, isInitialized, userRole, initialize, hasRole, hasPermission } = useWeb3Store();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyAccess = async () => {
      // Give a moment for store to rehydrate/initialize
      if (!isInitialized) {
        await initialize();
      }
      setIsChecking(false);
    };

    verifyAccess();
  }, [isInitialized, initialize]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" aria-label="Checking access permissions..." />
      </div>
    );
  }

  // 1. Connection Check
  if (requireConnection && !isConnected) {
    return (
      <GuestWelcome
        title={title}
        subtitle={subtitle}
      />
    );
  }

  // 2. Role Check
  // Check requiredRole (legacy/strict single)
  if (requiredRole && !hasRole(requiredRole)) {
    if (fallback !== undefined) return <>{fallback}</>;
    return (
      <GuestWelcome
        title="Unauthorized Access"
        subtitle={`This area is restricted to ${requiredRole}s only.`}
        roleSpecific={`Current role: ${userRole || 'None'}`}
      />
    );
  }

  // Check roles array (OR logic - if user matches ANY of the allowed roles)
  if (roles && roles.length > 0) {
    const hasAllowedRole = roles.some(role => hasRole(role));
    if (!hasAllowedRole) {
      if (fallback !== undefined) return <>{fallback}</>;
      return (
        <GuestWelcome
          title="Unauthorized Access"
          subtitle={`This area is restricted.`}
          roleSpecific={`Current role: ${userRole || 'None'}`}
        />
      );
    }
  }

  // Check permissions array (OR logic - if user has ANY of the permissions)
  // Or should it be AND? Usually permissions guard specific features.
  // Given usage is often singular ['analytics:view'], OR is safe.
  // If multiple ['a', 'b'], usually means "needs capability A OR capability B".
  if (permissions && permissions.length > 0) {
    const hasAllowedPermission = permissions.some(permission => hasPermission(permission));
    if (!hasAllowedPermission) {
      if (fallback !== undefined) return <>{fallback}</>;
      return (
        <GuestWelcome
          title="Permission Denied"
          subtitle="You do not have the required permissions to view this content."
        />
      );
    }
  }

  return <>{children}</>;
};

export default RoleGuard;
