import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '../components/Layout/Layout'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import ProtectedRoute from '../components/Auth/ProtectedRoute'

// Lazy load victim components
const VictimDashboard = lazy(() => import('../pages/victim/VictimDashboard'))
const VictimRequests = lazy(() => import('../pages/victim/VictimRequests'))
const VictimVouchers = lazy(() => import('../pages/victim/VictimVouchers'))
const VictimHelp = lazy(() => import('../pages/victim/VictimHelp'))

const VictimRoutes = () => {
  return (
    <Layout>
      {/* <ProtectedRoute 
        requiredRoles={['victim', 'admin']}
        allowGuest={true}
        fallback={
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Victim Support Portal</h2>
            <p className="text-gray-600 mb-6">Sign in to access emergency assistance, voucher management, and relief resources.</p>
            <a href="/login" className="btn-primary">Access Emergency Services</a>
          </div>
        }
      > */}
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route index element={<VictimDashboard />} />
            <Route path="requests" element={<VictimRequests />} />
            <Route path="vouchers" element={<VictimVouchers />} />
            <Route path="help" element={<VictimHelp />} />
            <Route path="*" element={<Navigate to="/victim" replace />} />
          </Routes>
        </Suspense>
      {/* </ProtectedRoute> */}
    </Layout>
  )
}

export default VictimRoutes
