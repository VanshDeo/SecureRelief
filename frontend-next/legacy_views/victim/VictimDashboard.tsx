import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Heart, 
  CreditCard, 
  FileText, 
  MapPin,
  AlertTriangle,
  User,
  CheckCircle,
  Clock,
  Activity,
  Plus,
  Phone
} from 'lucide-react'
import { useWeb3Store } from '../../store/web3Store'
import Card from '../../components/UI/Card'
import Button from '../../components/UI/Button'
import LoadingSpinner from '../../components/UI/LoadingSpinner'

const VictimDashboard = () => {
  const { isConnected, account, userRole } = useWeb3Store()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(null)
  const [quickStats, setQuickStats] = useState({})
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    if (isConnected) {
      // Check if user is registered
      const isRegistered = localStorage.getItem(`victim_${account}`)
      
      if (isRegistered) {
        setProfile({
          fullName: 'Sarah Johnson',
          phone: '+1 (555) 123-4567',
          email: 'sarah.johnson@email.com',
          address: '123 Relief Street, Austin, TX 78701',
          familySize: 4,
          registrationDate: '2024-08-01',
          verificationStatus: 'verified',
          totalAidReceived: 1250.50,
          applications: 5,
          activeVouchers: 2,
          emergencyContact: '+1 (555) 987-6543'
        })
        
        setQuickStats({
          activeApplications: 2,
          activeVouchers: 2,
          totalReceived: 1250.50,
          nextAppointment: 'Aug 15, 2024'
        })

        setRecentActivity([
          { id: 1, type: 'voucher', message: 'New food voucher approved - $150', time: '2 hours ago', status: 'success' },
          { id: 2, type: 'application', message: 'Housing assistance under review', time: '1 day ago', status: 'pending' },
          { id: 3, type: 'payment', message: 'Used medical voucher - $100', time: '2 days ago', status: 'completed' }
        ])
      }
    }
  }, [isConnected, account])

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center">
          <Heart className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h2 className="mb-2 text-xl font-semibold text-gray-900">Connect Your Wallet</h2>
          <p className="mb-4 text-gray-600">Please connect your wallet to access the victim portal.</p>
        </Card>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md p-8 text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-blue-400" />
          <h2 className="mb-2 text-xl font-semibold text-gray-900">Registration Required</h2>
          <p className="mb-6 text-gray-600">You need to register to access assistance services.</p>
          <Button className="w-full bg-red-600 hover:bg-red-700">
            <FileText className="w-4 h-4 mr-2" />
            Register Now
          </Button>
        </Card>
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
              <h1 className="text-3xl font-bold text-gray-900">Victim Portal</h1>
              <p className="text-gray-600">Access disaster relief assistance and manage your aid</p>
            </div>
            <div className="flex space-x-4">
              <Button className="bg-red-600 hover:bg-red-700">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Emergency
              </Button>
              <Link to="/victim/requests">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Heart className="w-4 h-4 mr-2" />
                  Request Aid
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="p-6 mb-8 bg-white border rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-full">
                <User className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h2 className="flex items-center text-xl font-semibold text-gray-900">
                  {profile.fullName}
                  {profile.verificationStatus === 'verified' && (
                    <CheckCircle className="w-5 h-5 ml-2 text-green-500" />
                  )}
                </h2>
                <p className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  {profile.address}
                </p>
                <p className="text-sm text-gray-500">
                  Family size: {profile.familySize} | Emergency: {profile.emergencyContact}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{profile.applications}</p>
                <p className="text-sm text-gray-600">Applications</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">${profile.totalAidReceived.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Aid Received</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{profile.activeVouchers}</p>
                <p className="text-sm text-gray-600">Active Vouchers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{quickStats.activeApplications}</p>
                <p className="text-sm text-gray-600">Active Applications</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{quickStats.activeVouchers}</p>
                <p className="text-sm text-gray-600">Active Vouchers</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">${quickStats.totalReceived?.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Received</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-bold text-gray-900">{quickStats.nextAppointment}</p>
                <p className="text-sm text-gray-600">Next Appointment</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center border-l-4 border-red-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Emergency</h3>
            <p className="mb-4 text-gray-600">Immediate assistance</p>
            <Button className="w-full bg-red-600 hover:bg-red-700">
              Call for Help
            </Button>
          </Card>
          
          <Card className="p-6 text-center border-l-4 border-blue-500">
            <Heart className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Request Aid</h3>
            <p className="mb-4 text-gray-600">Submit application</p>
            <Link to="/victim/requests">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Request Now
              </Button>
            </Link>
          </Card>
          
          <Card className="p-6 text-center border-l-4 border-green-500">
            <CreditCard className="w-12 h-12 mx-auto mb-4 text-green-500" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">My Vouchers</h3>
            <p className="mb-4 text-gray-600">View and use vouchers</p>
            <Link to="/victim/vouchers">
              <Button variant="outline" className="w-full text-green-700 border-green-500 hover:bg-green-50">
                View Vouchers
              </Button>
            </Link>
          </Card>
          
          <Card className="p-6 text-center border-l-4 border-purple-500">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-purple-500" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Find Help</h3>
            <p className="mb-4 text-gray-600">Locate nearby services</p>
            <Link to="/victim/help">
              <Button variant="outline" className="w-full text-purple-700 border-purple-500 hover:bg-purple-50">
                Find Locations
              </Button>
            </Link>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
            <Activity className="w-5 h-5 mr-2 text-blue-500" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map(activity => (
              <div key={activity.id} className={`flex items-center space-x-4 p-3 rounded-lg ${
                activity.status === 'success' ? 'bg-green-50' :
                activity.status === 'pending' ? 'bg-yellow-50' :
                'bg-blue-50'
              }`}>
                {activity.status === 'success' ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : activity.status === 'pending' ? (
                  <Clock className="w-6 h-6 text-yellow-500" />
                ) : (
                  <Activity className="w-6 h-6 text-blue-500" />
                )}
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.message}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/victim/requests">
            <Button variant="outline" className="w-full mt-4">
              View All Activity
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}

export default VictimDashboard
