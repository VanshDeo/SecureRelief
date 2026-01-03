'use client';

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Home,
  Heart,
  Shield,
  Users,
  Store,
  Eye,
  Banknote,
  Database,
  Building
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import RoleGuard from '../Auth/RoleGuard'

const MobileNavigation = () => {
  const pathname = usePathname()
  const { isAuthenticated, user } = useAuth()

  const getNavigationItems = () => {
    const items = [
      {
        name: 'Home',
        href: '/',
        icon: Home,
        roles: [],
        permissions: []
      },
      {
        name: 'Donate',
        href: '/donate',
        icon: Heart,
        roles: ['donor'],
        permissions: ['donation:make']
      },
      {
        name: 'Admin',
        href: '/admin',
        icon: Shield,
        roles: ['admin'],
        permissions: ['manage:all']
      },
      {
        name: 'Gov',
        href: '/government',
        icon: Building,
        roles: ['government'],
        permissions: ['disaster:create']
      },
      {
        name: 'Treasury',
        href: '/treasury',
        icon: Banknote,
        roles: ['treasury'],
        permissions: ['treasury:allocate']
      },
      {
        name: 'Oracle',
        href: '/oracle',
        icon: Database,
        roles: ['oracle'],
        permissions: ['data:verify']
      },
      {
        name: 'Vendor',
        href: '/vendor',
        icon: Store,
        roles: ['vendor'],
        permissions: ['voucher:redeem']
      },
      {
        name: 'Portal',
        href: '/victim',
        icon: Users,
        roles: ['victim'],
        permissions: ['voucher:claim']
      },
      {
        name: 'Transparency',
        href: '/transparency',
        icon: Eye,
        roles: [],
        permissions: []
      }
    ]

    return items
  }

  const navigationItems = getNavigationItems()

  const isActiveLink = (href) => {
    return pathname === href
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 safe-bottom">
      <div className="flex h-16 overflow-x-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = isActiveLink(item.href)

          return (
            <RoleGuard
              key={item.name}
              roles={item.roles}
              permissions={item.permissions}
              fallback={null}
            >
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0 min-w-16"
              >
                <Link
                  href={item.href}
                  className={`
                    flex flex-col items-center justify-center h-full px-3 py-1 transition-all duration-200 relative
                    ${isActive
                      ? 'text-avalanche-600 bg-avalanche-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className={`
                    h-5 w-5 mb-1
                    ${isActive ? 'text-avalanche-600' : 'text-gray-400'}
                  `} />
                  <span className={`
                    text-xs font-medium truncate
                    ${isActive ? 'text-avalanche-600' : 'text-gray-500'}
                  `}>
                    {item.name}
                  </span>

                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute top-0 left-0 right-0 h-0.5 bg-avalanche-500"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                      }}
                    />
                  )}
                </Link>
              </motion.div>
            </RoleGuard>
          )
        })}
      </div>
    </div>
  )
}

export default MobileNavigation
