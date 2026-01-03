import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Store, 
  CreditCard, 
  BarChart3, 
  User,
  DollarSign,
  Users,
  CheckCircle,
  MapPin,
  Star,
  TrendingUp,
  Activity
} from 'lucide-react'
import { useWeb3Store } from '../../store/web3Store'
import Card from '../../components/UI/Card'
import Button from '../../components/UI/Button'
import LoadingSpinner from '../../components/UI/LoadingSpinner'

const VendorDashboard = () => {
  const { isConnected, account, userRole } = useWeb3Store()
  const [loading, setLoading] = useState(false)
  const [vendorProfile, setVendorProfile] = useState(null)
  const [dashboardStats, setDashboardStats] = useState({})

  useEffect(() => {
    if (isConnected && userRole === 'vendor') {
      setVendorProfile({
        name: 'Relief Supply Co.',
        location: 'Austin, TX',
        verified: true,
        rating: 4.8,
        totalTransactions: 342,
        totalEarnings: 45670.25,
        joinedDate: '2024-01-15',
        categories: ['Food', 'Water', 'Medical', 'Shelter'],
        reputation: 95
      })
      
      setDashboardStats({
        pendingPayments: 5,
        completedToday: 12,
        monthlyRevenue: 8450.50,
        customerRating: 4.8
      })
    }
  }, [isConnected, userRole])

  if (!isConnected || userRole !== 'vendor') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Vendor Access Required</h2>
          <p className="text-gray-600 mb-4">Please connect your wallet and ensure you have vendor permissions.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
              <p className="text-gray-600">Welcome back, manage your relief operations</p>
            </div>
            <div className="flex space-x-4">
              <Link to="/vendor/payments">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Process Payment
                </Button>
              </Link>
              <Link to="/vendor/profile">
                <Button variant="outline">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Vendor Profile Summary */}
        {vendorProfile && (
          <div className="bg-white rounded-lg shadow-sm border mb-8 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Store className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    {vendorProfile.name}
                    {vendorProfile.verified && (
                      <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
                    )}
                  </h2>
                  <p className="text-gray-600 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {vendorProfile.location}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{vendorProfile.totalTransactions}</p>
                  <p className="text-sm text-gray-600">Transactions</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">${vendorProfile.totalEarnings.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Earnings</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600 flex items-center justify-center">
                    {vendorProfile.rating}
                    <Star className="w-4 h-4 ml-1 fill-current" />
                  </p>
                  <p className="text-sm text-gray-600">Rating</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full">
                <CreditCard className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.pendingPayments}</p>
                <p className="text-sm text-gray-600">Pending Payments</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.completedToday}</p>
                <p className="text-sm text-gray-600">Completed Today</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">${dashboardStats.monthlyRevenue?.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Monthly Revenue</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.customerRating}</p>
                <p className="text-sm text-gray-600">Customer Rating</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 text-center">
            <CreditCard className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Process Payments</h3>
            <p className="text-gray-600 mb-4">Handle voucher redemptions and payments</p>
            <Link to="/vendor/payments">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Go to Payments
              </Button>
            </Link>
          </Card>

          <Card className="p-6 text-center">
            <BarChart3 className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">View Transactions</h3>
            <p className="text-gray-600 mb-4">Review transaction history and analytics</p>
            <Link to="/vendor/transactions">
              <Button className="w-full" variant="outline">
                View History
              </Button>
            </Link>
          </Card>

          <Card className="p-6 text-center">
            <User className="h-12 w-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Profile</h3>
            <p className="text-gray-600 mb-4">Update business information and settings</p>
            <Link to="/vendor/profile">
              <Button className="w-full" variant="outline">
                Edit Profile
              </Button>
            </Link>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
            <Activity className="w-5 h-5 mr-2 text-blue-500" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {[
              { time: '2 hours ago', action: 'Processed payment for $125.50', status: 'completed' },
              { time: '4 hours ago', action: 'Voucher redemption - Medical supplies', status: 'completed' },
              { time: '6 hours ago', action: 'New pending payment request', status: 'pending' },
              { time: '1 day ago', action: 'Submitted proof of delivery', status: 'completed' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activity.status === 'completed' ? 'bg-green-100 text-green-700' :
                  activity.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
          <Link to="/vendor/transactions">
            <Button variant="outline" className="w-full mt-4">
              View All Activity
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}

export default VendorDashboard
