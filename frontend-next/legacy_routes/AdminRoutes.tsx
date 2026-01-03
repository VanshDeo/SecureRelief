import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '../components/Layout/Layout'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import ProtectedRoute from '../components/Auth/ProtectedRoute'

// Lazy load admin components
const AdminOverview = lazy(() => import('../pages/admin/AdminOverview'))
const AdminDisasters = lazy(() => import('../pages/admin/AdminDisasters'))
const AdminVendors = lazy(() => import('../pages/admin/AdminVendors'))
const AdminAnalytics = lazy(() => import('../pages/admin/AdminAnalytics'))
const AdminSettings = lazy(() => import('../pages/admin/AdminSettings'))

const AdminRoutes = () => {
  return (
    <Layout>
      {/* <ProtectedRoute 
        requiredRoles={['admin']}
        requireAuth={true}
        allowGuest={false}
      > */}
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="disasters" element={<AdminDisasters />} />
            <Route path="vendors" element={<AdminVendors />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </Suspense>
      {/* </ProtectedRoute> */}
    </Layout>
  )
}

export default AdminRoutes
