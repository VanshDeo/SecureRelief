'use client';

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Menu,
  X,
  Mountain,
  Settings,
  HelpCircle
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import RoleBasedNavigation from '../Navigation/RoleBasedNavigation'

const Sidebar = ({ isCollapsed = false, onToggle, onClose }: { isCollapsed?: boolean; onToggle?: () => void; onClose?: () => void }) => {
  const { isAuthenticated, user } = useAuth()

  const bottomNavigation = [
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings
    },
    {
      name: 'Help & Support',
      href: '/help',
      icon: HelpCircle
    }
  ]

  return (
    <div className={`relative flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-full'}`}>
      {/* Brand Section with Toggle */}
      <div className={`flex items-center p-4 border-b border-gray-200 ${isCollapsed ? 'flex-col space-y-4 justify-center' : 'justify-start space-x-4'}`}>
        {/* Desktop Toggle Button */}
        {!onClose && onToggle && (
          <motion.button
            onClick={onToggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center justify-center p-2 text-gray-400 hover:text-green-600 hover:bg-gray-50 rounded-lg transition-all"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <Menu className="w-5 h-5" />
          </motion.button>
        )}

        <div className="flex items-center overflow-hidden">
          <Link href="/" className="flex items-center group" onClick={onClose}>
            {!isCollapsed && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mountain className="flex-shrink-0 w-8 h-8 text-green-500 transition-colors group-hover:text-green-600" />
              </motion.div>
            )}
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="ml-3 text-lg font-bold text-gray-900 whitespace-nowrap group-hover:text-green-600 transition-colors"
              >
                Relief Network
              </motion.span>
            )}
          </Link>
        </div>

        {/* Close button for mobile */}
        {onClose && (
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="ml-auto p-2 text-gray-400 rounded-lg lg:hidden hover:text-gray-900 hover:bg-gray-50 transition-all"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </motion.button>
        )}
      </div>

      {/* Role-based Navigation - Scrollable with padding for fixed bottom */}
      <nav className="flex-1 px-4 py-6 pb-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        <RoleBasedNavigation isMobile={!!onClose} isCollapsed={onClose ? false : isCollapsed} />
      </nav>

      {/* Bottom Section - Absolute positioned at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100">
        {/* Bottom Navigation */}
        <div className="px-4 py-3 space-y-1">
          {bottomNavigation.map((item) => {
            const Icon = item.icon

            return (
              <motion.div
                key={item.name}
                whileHover={{ x: isCollapsed ? 0 : 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center p-2 text-gray-600 transition-all duration-200 rounded-lg group hover:bg-gray-50 hover:text-gray-900 ${(isCollapsed && !onClose) ? 'justify-center' : ''}`}
                  title={(isCollapsed && !onClose) ? item.name : ''}
                >
                  <Icon className={`flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-gray-500 ${(isCollapsed && !onClose) ? '' : 'mr-3'}`} />
                  {(onClose || !isCollapsed) && (
                    <span className="text-sm font-medium whitespace-nowrap">
                      {item.name}
                    </span>
                  )}
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Sidebar Footer */}
        {!isCollapsed && (
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/50">
            <p className="text-[10px] text-gray-400 text-center">
              v1.0.0 • Fuji Testnet
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar