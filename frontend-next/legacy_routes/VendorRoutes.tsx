import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '../components/Layout/Layout'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import ProtectedRoute from '../components/Auth/ProtectedRoute'

// Lazy load vendor components
const VendorDashboard = lazy(() => import('../pages/vendor/VendorDashboard'))
const VendorPayments = lazy(() => import('../pages/vendor/VendorPayments'))
const VendorTransactions = lazy(() => import('../pages/vendor/VendorTransactions'))
const VendorProfile = lazy(() => import('../pages/vendor/VendorProfile'))

const VendorRoutes = () => {
  return (
    <Layout>
      <ProtectedRoute 
        requiredRoles={['vendor', 'admin']}
        allowGuest={true}
        fallback={
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Vendor Portal</h2>
            <p className="text-gray-600 mb-6">Sign in as a vendor to access payment processing and inventory management.</p>
            <a href="/login" className="btn-primary">Sign In as Vendor</a>
          </div>
        }
      >
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route index element={<VendorDashboard />} />
            <Route path="payments" element={<VendorPayments />} />
            <Route path="transactions" element={<VendorTransactions />} />
            <Route path="profile" element={<VendorProfile />} />
            <Route path="*" element={<Navigate to="/vendor" replace />} />
          </Routes>
        </Suspense>
      </ProtectedRoute>
    </Layout>
  )
}

export default VendorRoutes
