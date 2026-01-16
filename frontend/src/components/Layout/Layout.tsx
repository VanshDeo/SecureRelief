'use client';

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './Header'
import Sidebar from './Sidebar'
import MobileNavigation from './MobileNavigation'
import Footer from './Footer'

const Layout = ({ children, fullWidth = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header onMenuClick={() => setSidebarOpen(true)} onDesktopMenuClick={toggleSidebar} />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar - Fixed position */}
        <div className={`hidden lg:block lg:flex-shrink-0 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-72'}`}>
          <div className="fixed top-16 left-0 bottom-0 z-30 transition-all duration-300" style={{ width: isSidebarCollapsed ? '80px' : '288px' }}>
            <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-40 bg-transparent lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />

              {/* Mobile Sidebar */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden bg-white/90 backdrop-blur-md border-r border-gray-200"
              >
                <Sidebar onClose={() => setSidebarOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <motion.div
          className="flex-1 flex flex-col overflow-hidden bg-white"
          layout
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <main className="flex-1 overflow-y-auto">
            {fullWidth ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {children}
              </motion.div>
            ) : (
              <div className="py-6 px-4 sm:px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-7xl mx-auto"
                >
                  {children}
                </motion.div>
              </div>
            )}
          </main>

          {/* Footer */}
          <Footer />
        </motion.div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden">
        <MobileNavigation />
      </div>
    </div>
  )
}

export default Layout
