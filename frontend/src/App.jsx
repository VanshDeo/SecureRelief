import React, { Suspense, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout/Layout'
import LoadingSpinner from './components/UI/LoadingSpinner'
import WalletDebugger from './components/Web3/WalletDebugger'
import PerformanceDashboard from './components/Dev/PerformanceDashboard'
import { AuthProvider } from './contexts/AuthContext'
import { useWeb3Store } from './store/web3Store'
import ErrorBoundary from './components/UI/ErrorBoundary'
import {
  LazyRoutes,
  preloadCriticalRoutes,
  createLazyRoute
} from './utils/codeSplitting.jsx'
import {
  initializePerformanceMonitoring,
  performanceMonitor
} from './utils/performance.jsx'

// Role-based route groups with optimized chunking
const AdminRoutes = createLazyRoute(() => import('./routes/AdminRoutes'), {
  chunkName: 'admin-routes'
})
const VendorRoutes = createLazyRoute(() => import('./routes/VendorRoutes'), {
  chunkName: 'vendor-routes'
})
const VictimRoutes = createLazyRoute(() => import('./routes/VictimRoutes'), {
  chunkName: 'victim-routes'
})
const DonorRoutes = createLazyRoute(() => import('./routes/DonorRoutes'), {
  chunkName: 'donor-routes'
})
const GovernmentRoutes = createLazyRoute(() => import('./routes/GovernmentRoutes'), {
  chunkName: 'government-routes'
})

// Simple role-based redirect component
const DashboardRedirect = createLazyRoute(() => import('./components/Auth/DashboardRedirect'), {
  chunkName: 'dashboard-redirect'
})

// Enhanced loading fallback with better UX
const RouteLoadingFallback = ({ message = "Loading..." }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="text-center"
    >
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-600">{message}</p>
    </motion.div>
  </div>
)

// App initialization loading screen
const AppInitializing = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-avalanche-500 to-avalanche-600">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="mb-8">
        <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-white rounded-full">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-avalanche-500">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
            </svg>
          </div>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-white">
          Disaster Relief Network
        </h1>
        <p className="text-avalanche-100">
          Initializing blockchain connection...
        </p>
      </div>
      <LoadingSpinner size="lg" color="white" />
    </motion.div>
  </div>
)

function App() {
  const { isInitialized, initialize } = useWeb3Store()

  useEffect(() => {
    // Initialize performance monitoring
    const monitor = initializePerformanceMonitoring()

    // Track app initialization
    performanceMonitor.mark('app-init')

    console.log('App component mounted, calling initialize...')
    initialize()

    performanceMonitor.measure('app-init')

    // Preload critical routes after initialization
    if (isInitialized) {
      preloadCriticalRoutes()
    }

    // Cleanup function
    return () => {
      monitor.disconnect()
    }
  }, [initialize, isInitialized])

  console.log('App render - isInitialized:', isInitialized)

  if (!isInitialized) {
    return <AppInitializing />
  }

  return (
    <ErrorBoundary
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="p-8 text-center">
            <div className="mb-4 text-red-500">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="mb-4 text-2xl font-bold text-gray-900">Application Error</h1>
            <p className="mb-6 text-gray-600">Something went wrong. Please refresh the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      }
      onError={(error, errorInfo) => {
        console.error('App-level error:', error, errorInfo)
        // You could send this to an error reporting service
      }}
    >
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Suspense
            fallback={<RouteLoadingFallback message="Loading page..." />}
          >
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LazyRoutes.Login />} />
              <Route path="/register" element={<LazyRoutes.Register />} />

              {/* Public Pages with Layout */}
              <Route
                path="/"
                element={
                  <Layout>
                    <LazyRoutes.HomePage />
                  </Layout>
                }
              />
              <Route
                path="/transparency"
                element={
                  <Layout>
                    <LazyRoutes.TransparencyPortal />
                  </Layout>
                }
              />
              <Route
                path="/disaster/:id"
                element={
                  <Layout>
                    <LazyRoutes.DisasterDetails />
                  </Layout>
                }
              />
              <Route
                path="/proof-gallery"
                element={
                  <Layout>
                    <LazyRoutes.ProofGallery />
                  </Layout>
                }
              />

              {/* API Test - Development only */}
              {import.meta.env.DEV && (
                <Route
                  path="/api-test"
                  element={
                    <Layout>
                      <LazyRoutes.APITestPage />
                    </Layout>
                  }
                />
              )}

              {/* Role-based Route Groups */}
              <Route
                path="/admin/*"
                element={
                  <Suspense fallback={<RouteLoadingFallback message="Loading admin dashboard..." />}>
                    <AdminRoutes />
                  </Suspense>
                }
              />
              <Route
                path="/vendor/*"
                element={
                  <Suspense fallback={<RouteLoadingFallback message="Loading vendor dashboard..." />}>
                    <VendorRoutes />
                  </Suspense>
                }
              />
              <Route
                path="/victim/*"
                element={
                  <Suspense fallback={<RouteLoadingFallback message="Loading victim dashboard..." />}>
                    <VictimRoutes />
                  </Suspense>
                }
              />
              <Route
                path="/donor/*"
                element={
                  <Suspense fallback={<RouteLoadingFallback message="Loading donor dashboard..." />}>
                    <DonorRoutes />
                  </Suspense>
                }
              />
              <Route
                path="/government/*"
                element={
                  <Suspense fallback={<RouteLoadingFallback message="Loading government dashboard..." />}>
                    <GovernmentRoutes />
                  </Suspense>
                }
              />

              {/* Legacy route redirects for backward compatibility */}
              <Route path="/donate" element={<Navigate to="/donor" replace />} />
              <Route
                path="/dashboard"
                element={
                  <Suspense fallback={<RouteLoadingFallback message="Redirecting..." />}>
                    <DashboardRedirect />
                  </Suspense>
                }
              />

              {/* 404 Page */}
              <Route path="*" element={
                <Layout>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="py-16 text-center"
                  >
                    <div className="mb-8">
                      <div className="mb-4 text-6xl">🌊</div>
                      <h1 className="mb-4 text-4xl font-bold text-gray-900">404</h1>
                      <p className="mb-8 text-gray-600">
                        The page you're looking for seems to have drifted away.
                      </p>
                    </div>
                    <motion.a
                      href="/"
                      className="inline-flex items-center btn-primary"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      Return Home
                    </motion.a>
                  </motion.div>
                </Layout>
              } />
            </Routes>
          </Suspense>

          {/* Development Debug Tools */}
          {process.env.NODE_ENV === 'development' && (
            <>
              <WalletDebugger />
              <PerformanceDashboard />
            </>
          )}

          {/* Toast Notifications with better styling */}
          <Toaster
            position="top-right"
            gutter={8}
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                borderRadius: '8px',
                fontSize: '14px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
                style: {
                  background: '#065f46',
                  color: '#d1fae5',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
                style: {
                  background: '#991b1b',
                  color: '#fed7d7',
                },
              },
              loading: {
                duration: Infinity,
                iconTheme: {
                  primary: '#3b82f6',
                  secondary: '#fff',
                },
                style: {
                  background: '#1e40af',
                  color: '#dbeafe',
                },
              },
            }}
          />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
