import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '../components/Layout/Layout'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import ProtectedRoute from '../components/Auth/ProtectedRoute'

// For now, use the existing government dashboard
const GovernmentDashboard = lazy(() => import('../pages/GovernmentDashboard'))

const GovernmentRoutes = () => {
  return (
    <Layout>
      <ProtectedRoute requiredRoles={['government']}>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route index element={<GovernmentDashboard />} />
            <Route path="*" element={<Navigate to="/government" replace />} />
          </Routes>
        </Suspense>
      </ProtectedRoute>
    </Layout>
  )
}

export default GovernmentRoutes
