import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '../components/Layout/Layout'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import ProtectedRoute from '../components/Auth/ProtectedRoute'

// Lazy load donor components
const DonorDashboard = lazy(() => import('../pages/donor/DonorDashboard'))
const DonorDonate = lazy(() => import('../pages/donor/DonorDonate'))
const DonorHistory = lazy(() => import('../pages/donor/DonorHistory'))
const DonorImpact = lazy(() => import('../pages/donor/DonorImpact'))

const DonorRoutes = () => {
  return (
    <Layout>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Donation page allows guest access */}
          {/* <Route path="donate" element={
            <ProtectedRoute allowGuest={true}>
              <DonorDonate />
            </ProtectedRoute>
          } /> */}
          
          {/* Other donor pages require authentication */}
          <Route path="*" element={
            // <ProtectedRoute 
            //   requiredRoles={['donor', 'admin']}
            //   allowGuest={false}
            //   fallback={
            //     <div className="text-center py-16">
            //       <h2 className="text-2xl font-bold text-gray-900 mb-4">Donor Portal</h2>
            //       <p className="text-gray-600 mb-6">Join our community of donors and track your impact in disaster relief efforts.</p>
            //       <div className="space-y-4">
            //         <a href="/login" className="bg-green-600 px-4 py-2 rounded-lg text-white inline-block">Sign In to Access Portal</a>
            //         <div>
            //           <a href="/donor/donate" className="text-green-600 hover:text-green-700">
            //             Or make a quick donation as guest →
            //           </a>
            //         </div>
            //       </div>
            //     </div>
            //   }
            // >
              <Routes>
                <Route index element={<DonorDashboard />} />
                <Route path="history" element={<DonorHistory />} />
                <Route path="impact" element={<DonorImpact />} />
                <Route path="*" element={<Navigate to="/donor" replace />} />
              </Routes>
            // </ProtectedRoute>
          } />
        </Routes>
      </Suspense>
    </Layout>
  )
}

export default DonorRoutes
