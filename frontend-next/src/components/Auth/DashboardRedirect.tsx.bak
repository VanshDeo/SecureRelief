import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../UI/LoadingSpinner'

/**
 * Simple dashboard redirect based on user role
 * Replaces the complex RoleBasedRouter with cleaner logic
 */
const DashboardRedirect = () => {
  const { isAuthenticated, user, isLoading } = useAuth()

  // Show loading while determining authentication state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 rounded-full animate-spin border-green-600"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Simple role-based redirects
  const roleRoutes = {
    admin: '/admin',
    vendor: '/vendor', 
    victim: '/victim',
    donor: '/donor',
    government: '/government',
    treasury: '/treasury',
    oracle: '/oracle'
  }

  const dashboardRoute = roleRoutes[user?.role] || '/'
  
  return <Navigate to={dashboardRoute} replace />
}

export default DashboardRedirect
