import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  MapPin, 
  Users, 
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Activity,
  Plus,
  Eye,
  Settings
} from 'lucide-react'
import Card from '../../components/UI/Card'
import Button from '../../components/UI/Button'
import LoadingSpinner from '../../components/UI/LoadingSpinner'
import RealTimeStats from '../../components/Charts/RealTimeStats'
import { useWeb3Store } from '../../store/web3Store'

const AdminOverview = () => {
  const { isConnected, userRole } = useWeb3Store()
  const [loading, setLoading] = useState(true)
  const [alerts, setAlerts] = useState([])
  const [quickStats, setQuickStats] = useState({})

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
      setAlerts([
        {
          id: 1,
          type: 'warning',
          title: 'High Transaction Volume',
          message: 'Turkey Earthquake relief experiencing high donation volume',
          timestamp: new Date(Date.now() - 300000)
        },
        {
          id: 2,
          type: 'info',
          title: 'New Vendor Pending',
          message: '3 vendors awaiting verification',
          timestamp: new Date(Date.now() - 600000)
        }
      ])
      
      setQuickStats({
        activeDisasters: 5,
        totalVendors: 28,
        totalFunding: 125000,
        completedReleases: 342
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const AlertCard = ({ alert }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-4 rounded-lg border-l-4 ${
        alert.type === 'warning' 
          ? 'bg-yellow-50 border-yellow-400' 
          : alert.type === 'error'
          ? 'bg-red-50 border-red-400'
          : 'bg-blue-50 border-blue-400'
      }`}
    >
      <div className="flex items-start">
        <div className={`p-1 rounded-full mr-3 ${
          alert.type === 'warning' 
            ? 'bg-yellow-100' 
            : alert.type === 'error'
            ? 'bg-red-100'
            : 'bg-blue-100'
        }`}>
          {alert.type === 'warning' ? (
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
          ) : alert.type === 'error' ? (
            <AlertTriangle className="w-4 h-4 text-red-600" />
          ) : (
            <CheckCircle className="w-4 h-4 text-blue-600" />
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{alert.title}</h4>
          <p className="mt-1 text-sm text-gray-600">{alert.message}</p>
          <p className="mt-1 text-xs text-gray-500">
            {alert.timestamp.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </motion.div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading admin overview..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Admin Overview
              </h1>
              <p className="text-gray-600">
                Monitor and manage disaster relief operations across the platform
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/admin/settings">
                <Button variant="outline" icon={Settings}>
                  Settings
                </Button>
              </Link>
              <Link to="/admin/disasters">
                <Button variant="primary" icon={Plus}>
                  New Disaster
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="grid grid-cols-2 gap-4 mt-6 md:grid-cols-4">
            <Link to="/admin/disasters" className="block">
              <Card className="p-4 transition-all hover:shadow-md">
                <div className="flex items-center">
                  <MapPin className="w-8 h-8 text-red-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Disasters</p>
                    <p className="text-2xl font-bold text-gray-900">{quickStats.activeDisasters}</p>
                  </div>
                </div>
              </Card>
            </Link>
            
            <Link to="/admin/vendors" className="block">
              <Card className="p-4 transition-all hover:shadow-md">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Vendors</p>
                    <p className="text-2xl font-bold text-gray-900">{quickStats.totalVendors}</p>
                  </div>
                </div>
              </Card>
            </Link>
            
            <Link to="/admin/analytics" className="block">
              <Card className="p-4 transition-all hover:shadow-md">
                <div className="flex items-center">
                  <DollarSign className="w-8 h-8 text-green-500" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Total Funding</p>
                    <p className="text-2xl font-bold text-gray-900">${quickStats.totalFunding?.toLocaleString()}</p>
                  </div>
                </div>
              </Card>
            </Link>
            
            <Card className="p-4">
              <div className="flex items-center">
                <Activity className="w-8 h-8 text-purple-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{quickStats.completedReleases}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="text-sm font-medium text-gray-900">Recent Alerts</h3>
              {alerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          )}
        </div>

        {/* Real-time Stats */}
        <div className="mb-8">
          <RealTimeStats />
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6 text-center">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Manage Disasters
            </h3>
            <p className="mb-6 text-gray-600">
              Create, monitor, and manage disaster relief zones
            </p>
            <Link to="/admin/disasters">
              <Button variant="primary" className="w-full">
                <MapPin className="w-4 h-4 mr-2" />
                View Disasters
              </Button>
            </Link>
          </Card>

          <Card className="p-6 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-blue-500" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Vendor Management
            </h3>
            <p className="mb-6 text-gray-600">
              Verify and manage authorized vendors
            </p>
            <Link to="/admin/vendors">
              <Button variant="primary" className="w-full">
                <Users className="w-4 h-4 mr-2" />
                Manage Vendors
              </Button>
            </Link>
          </Card>

          <Card className="p-6 text-center">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Analytics & Reports
            </h3>
            <p className="mb-6 text-gray-600">
              View detailed analytics and generate reports
            </p>
            <Link to="/admin/analytics">
              <Button variant="primary" className="w-full">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminOverview
