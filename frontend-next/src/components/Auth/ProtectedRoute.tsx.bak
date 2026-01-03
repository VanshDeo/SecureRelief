import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../UI/LoadingSpinner';
import { AlertCircle, Lock } from 'lucide-react';

const ProtectedRoute = ({ 
  children, 
  requiredPermissions = [], 
  requiredRoles = [],
  requireAuth = false, // Changed default to false for open access
  allowGuest = true, // Allow guest access by default
  fallback = null 
}) => {
  const { isAuthenticated, isLoading, user, canAccess } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If guest access is allowed and user is guest, grant access
  if (allowGuest && user?.role === 'guest') {
    return children;
  }

  // Redirect to login only if authentication is explicitly required and user is not authenticated
  if (requireAuth && !isAuthenticated && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check permissions and roles (but allow guest access if permitted)
  if (user && (requiredPermissions.length > 0 || requiredRoles.length > 0)) {
    if (!canAccess(requiredPermissions, requiredRoles, allowGuest)) {
      // Show access denied page or fallback component
      if (fallback) {
        return fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="w-full max-w-md mx-auto text-center">
            <div className="p-8 bg-white rounded-lg shadow-lg">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Lock className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
              <h1 className="mb-2 text-2xl font-bold text-gray-900">Enhanced Access Required</h1>
              <p className="mb-6 text-gray-600">
                This feature requires {isAuthenticated ? 'elevated permissions' : 'authentication'}.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p><strong>Your Role:</strong> {user?.role || 'Guest'}</p>
                {requiredRoles.length > 0 && (
                  <p><strong>Required Roles:</strong> {requiredRoles.join(', ')}</p>
                )}
                {requiredPermissions.length > 0 && (
                  <p><strong>Required Permissions:</strong> {requiredPermissions.join(', ')}</p>
                )}
              </div>
              <div className="flex gap-3 mt-6">
                {!isAuthenticated && (
                  <a
                    href="/login"
                    className="px-6 py-2 text-white transition-colors rounded-lg bg-green-600 hover:bg-green-700"
                  >
                    Sign In
                  </a>
                )}
                <button
                  onClick={() => window.history.back()}
                  className="px-6 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;
