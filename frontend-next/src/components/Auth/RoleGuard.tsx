'use client';

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const RoleGuard = ({
  roles = [],
  permissions = [],
  children,
  fallback = null,
  requireAll = false,
  minRole = null,
  showFallbackForUnauthenticated = false
}) => {
  const { hasRole, hasPermission, hasMinimumRole, isAuthenticated, user } = useAuth();

  // If user is not authenticated and we don't want to show fallback for unauthenticated users
  if (!isAuthenticated && !showFallbackForUnauthenticated) {
    return null;
  }

  // If user is not authenticated but we want to show fallback
  if (!isAuthenticated && showFallbackForUnauthenticated) {
    return fallback;
  }

  // Check minimum role requirement
  if (minRole && !hasMinimumRole(minRole)) {
    return fallback;
  }

  // Check roles
  let hasRequiredRole = true;
  if (roles.length > 0) {
    if (requireAll) {
      hasRequiredRole = roles.every(role => hasRole(role));
    } else {
      hasRequiredRole = roles.some(role => hasRole(role));
    }
  }

  // Check permissions
  let hasRequiredPermission = true;
  if (permissions.length > 0) {
    if (requireAll) {
      hasRequiredPermission = permissions.every(permission => hasPermission(permission));
    } else {
      hasRequiredPermission = permissions.some(permission => hasPermission(permission));
    }
  }

  // Return children if user has required access
  if (hasRequiredRole && hasRequiredPermission) {
    return children;
  }

  // Return fallback or null if access is denied
  return fallback;
};

export default RoleGuard;
