'use client';

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Menu,
  Bell,
  Wallet,
  ChevronDown,
  Mountain,
  Settings,
  LogOut,
  User,
  Shield,
  Key,
  Search
} from 'lucide-react'
import { useWeb3Store } from '../../store/web3Store'
import { useAuth } from '../../contexts/AuthContext'
import WalletConnection from '../Web3/WalletConnection'
import WalletStatusPanel from '../Web3/WalletStatusPanel'
import RoleGuard from '../Auth/RoleGuard'
import Button from '../UI/Button'

const Header = ({ onMenuClick, onDesktopMenuClick }) => {
  const pathname = usePathname()
  const router = useRouter()
  const { isConnected, account, userRole, balance } = useWeb3Store()
  const { isAuthenticated, user, logout, authMethod } = useAuth()

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatBalance = (balance) => {
    return parseFloat(balance).toFixed(4)
  }

  const getPageTitle = () => {
    const path = pathname
    const titles = {
      '/': 'SecureRelief',
      '/donate': 'Donation Dashboard',
      '/admin': 'Admin Dashboard',
      '/government': 'Government Portal',
      '/treasury': 'Treasury Management',
      '/oracle': 'Oracle Dashboard',
      '/victim': 'Victim Portal',
      '/vendor': 'Vendor Portal',
      '/transparency': 'Transparency Portal',
      '/proof-gallery': 'Proof Gallery',
      '/login': 'Sign In',
      '/register': 'Create Account'
    }
    return titles[path] || 'Disaster Relief Network'
  }

  const getRoleIcon = (role) => {
    const icons = {
      admin: Shield,
      government: Shield,
      treasury: Key,
      oracle: Key,
      vendor: User,
      victim: User,
      donor: User
    }
    return icons[role] || User
  }

  const getRoleColor = (role) => {
    const colors = {
      admin: 'text-green-600 bg-green-50',
      government: 'text-purple-600 bg-purple-50',
      treasury: 'text-yellow-600 bg-yellow-50',
      oracle: 'text-blue-600 bg-blue-50',
      vendor: 'text-green-600 bg-green-50',
      victim: 'text-indigo-600 bg-indigo-50',
      donor: 'text-avalanche-600 bg-avalanche-50'
    }
    return colors[role] || 'text-gray-600 bg-gray-50'
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const getDashboardLink = () => {
    if (!isAuthenticated) return '/login'

    const currentRole = user?.role || userRole
    const dashboardRoutes = {
      admin: '/admin',
      government: '/government',
      treasury: '/treasury',
      oracle: '/oracle',
      vendor: '/vendor',
      victim: '/victim',
      donor: '/donate'
    }
    return dashboardRoutes[currentRole] || '/'
  }

  // Get display user info (prioritize auth context over web3)
  const displayUser = user || (isConnected ? { role: userRole, address: account } : null)
  const isUserAuthenticated = isAuthenticated || isConnected

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center">
            {/* Mobile Menu Button (Hidden on Desktop) */}
            <button
              onClick={onMenuClick}
              className="p-2 text-gray-500 rounded-md lg:hidden hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <Menu className="w-6 h-6" />
            </button>
            {/* Logo and Title */}
            <Link href="/" className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center"
              >
                <Mountain className="w-8 h-8 mr-3 text-green-500" />
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-gray-900">
                    {getPageTitle()}
                  </h1>
                  <p className="text-xs text-gray-500">
                    Blockchain-Powered Relief
                  </p>
                </div>
              </motion.div>
            </Link>
          </div>

          {/* Center Section - Search (Hidden on mobile) */}
          <div className="flex-1 hidden max-w-md mx-8 md:flex">
            <div className="relative w-full">
              <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Search disasters, transactions..."
                className="w-full py-2 pl-10 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-avalanche-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Role-based Dashboard Link */}
            {isUserAuthenticated && (
              <Link
                href={getDashboardLink()}
                className="items-center hidden px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-lg sm:flex hover:bg-gray-100"
              >
                Dashboard
              </Link>
            )}

            <Link
              href="/proof"
              className="items-center hidden px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-lg sm:flex hover:bg-gray-100"
            >
              Proof Gallery
            </Link>

            <Link
              href="/transparency"
              className="items-center hidden px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-lg sm:flex hover:bg-gray-100"
            >
              Transparency
            </Link>

            {/* Notifications */}
            <RoleGuard
              roles={['admin', 'vendor', 'victim']}
              fallback={null}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 text-gray-500 rounded-full hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-avalanche-500"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 block w-3 h-3 bg-red-400 rounded-full ring-2 ring-white" />
              </motion.button>
            </RoleGuard>

            {/* Authentication Section */}
            {isUserAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* Wallet Status Panel (only if Web3 connected) */}
                {isConnected && <WalletStatusPanel />}

                {/* User Info Display */}
                <div className="hidden text-right sm:block">
                  {isConnected && (
                    <p className="text-sm font-medium text-gray-900">
                      {formatBalance(balance)} AVAX
                    </p>
                  )}
                  <div className="flex items-center justify-end">
                    {displayUser?.role && (
                      <>
                        {React.createElement(getRoleIcon(displayUser.role), {
                          className: `w-3 h-3 mr-1 ${getRoleColor(displayUser.role)}`
                        })}
                        <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(displayUser.role)} capitalize`}>
                          {displayUser.role}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Account Dropdown */}
                <div className="relative group">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center px-3 py-2 space-x-2 text-sm font-medium rounded-lg bg-avalanche-50 hover:bg-avalanche-100 text-avalanche-700 focus:outline-none focus:ring-2 focus:ring-avalanche-500"
                  >
                    {authMethod === 'wallet' ? (
                      <>
                        <Wallet className="w-4 h-4" />
                        <span className="hidden sm:inline">
                          {formatAddress(account)}
                        </span>
                      </>
                    ) : (
                      <>
                        <User className="w-4 h-4" />
                        <span className="hidden sm:inline">
                          {user?.firstName || 'User'}
                        </span>
                      </>
                    )}
                    <ChevronDown className="w-4 h-4" />
                  </motion.button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 z-50 invisible w-48 mt-2 transition-all duration-200 bg-white rounded-md shadow-lg opacity-0 ring-1 ring-black ring-opacity-5 group-hover:opacity-100 group-hover:visible">
                    <div className="py-1">
                      {/* User Info Header */}
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {authMethod === 'wallet' ? 'Web3 Account' : 'Traditional Account'}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {displayUser?.role} Access
                        </p>
                      </div>

                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User className="w-4 h-4 mr-3" />
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Settings
                      </Link>

                      {/* Admin Panel Access */}
                      <RoleGuard roles={['admin', 'government']} fallback={null}>
                        <Link
                          href="/admin"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Shield className="w-4 h-4 mr-3" />
                          Admin Panel
                        </Link>
                      </RoleGuard>

                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        {authMethod === 'wallet' ? 'Disconnect Wallet' : 'Sign Out'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-avalanche-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                >
                  <Button size="sm">Register</Button>
                </Link>
                <div className="h-6 w-px bg-gray-200 mx-2" />
                <WalletConnection />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="px-4 pb-4 md:hidden">
        <div className="relative">
          <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          <input
            type="text"
            placeholder="Search disasters, transactions..."
            className="w-full py-2 pl-10 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>
    </header >
  )
}

export default Header
