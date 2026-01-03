import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, 
  Settings, 
  BarChart3, 
  Activity,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Eye,
  Plus,
  Filter,
  Search,
  Download,
  Users
} from 'lucide-react'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import RealTimeStats from '../components/Charts/RealTimeStats'
import DonationChart from '../components/Charts/DonationChart'
import ImpactMetrics from '../components/Charts/ImpactMetrics'
import GeographicDistribution from '../components/Charts/GeographicDistribution'
import RealTimeMonitor from '../components/DisasterRelief/RealTimeMonitor'
import ContractEventMonitor from '../components/DisasterRelief/ContractEventMonitor'
import NewDisasterZone from '../components/Admin/NewDisasterZone'
import DisasterZoneCard from '../components/Admin/DisasterZoneCard'
import { useWeb3Store } from '../store/web3Store'

const AdminDashboard = () => {
  const { isConnected, userRole } = useWeb3Store()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [alerts, setAlerts] = useState([])
  const [showNewDisasterModal, setShowNewDisasterModal] = useState(false)
  const [disasterZones, setDisasterZones] = useState([])

  // Handle new disaster zone creation
  const handleNewZoneCreated = (newZone) => {
    setDisasterZones(prev => [...prev, {
      ...newZone,
      id: Date.now(), // Temporary ID for demo
      createdAt: new Date()
    }])
    setShowNewDisasterModal(false)
  }

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
      // Mock alerts
      setAlerts([
        {
          id: 1,
          type: 'warning',
          title: 'High Transaction Volume',
          message: 'Turkey Earthquake relief is experiencing unusually high donation volume',
          timestamp: new Date(Date.now() - 300000)
        },
        {
          id: 2,
          type: 'info',
          title: 'New Vendor Pending',
          message: '3 vendors awaiting verification for Kerala Flood relief',
          timestamp: new Date(Date.now() - 600000)
        }
      ])
      
      // Mock disaster zones for demonstration
      setDisasterZones([
        {
          id: 1,
          name: 'Turkey Earthquake 2024',
          description: 'Major earthquake relief operations in southeastern Turkey',
          latitude: 37.0662,
          longitude: 37.3833,
          radiusKm: 100,
          status: 'active',
          disasterType: 'Earthquake',
          severity: 'critical',
          urgencyLevel: 'emergency',
          funding: 50000,
          createdAt: new Date(Date.now() - 86400000 * 5), // 5 days ago
          estimatedAffected: 50000
        },
        {
          id: 2,
          name: 'Kerala Flood Relief',
          description: 'Monsoon flood relief operations in Kerala state',
          latitude: 10.8505,
          longitude: 76.2711,
          radiusKm: 150,
          status: 'active',
          disasterType: 'Flood',
          severity: 'high',
          urgencyLevel: 'high',
          funding: 25000,
          createdAt: new Date(Date.now() - 86400000 * 12), // 12 days ago
          estimatedAffected: 25000
        }
      ])
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleNewDisasterSuccess = (result) => {
    // Add the new disaster zone to the list
    const newZone = {
      id: result.zoneId,
      name: result.name || 'New Disaster Zone',
      status: 'active',
      createdAt: new Date(),
      ...result
    }
    setDisasterZones(prev => [newZone, ...prev])
    
    // Add success alert
    const successAlert = {
      id: Date.now(),
      type: 'success',
      title: 'Disaster Zone Created',
      message: `Successfully created "${newZone.name}" disaster zone`,
      timestamp: new Date()
    }
    setAlerts(prev => [successAlert, ...prev])
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp },
    { id: 'monitoring', name: 'Live Monitor', icon: Activity },
    { id: 'disasters', name: 'Disasters', icon: MapPin },
    { id: 'vendors', name: 'Vendors', icon: Users },
    { id: 'settings', name: 'Settings', icon: Settings }
  ]

  const TabButton = ({ tab, active, onClick }) => {
    const Icon = tab.icon
    return (
      <button
        onClick={() => onClick(tab.id)}
        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          active
            ? 'bg-avalanche-500 text-white shadow-md'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
      >
        <Icon className="w-5 h-5 mr-2" />
        {tab.name}
      </button>
    )
  }

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
        <LoadingSpinner size="lg" text="Loading admin dashboard..." />
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
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Comprehensive monitoring and management of disaster relief operations
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" icon={Download}>
                Export Report
              </Button>
              <Button 
                variant="primary" 
                icon={Plus}
                onClick={() => setShowNewDisasterModal(true)}
                disabled={!isConnected || userRole !== 'admin'}
              >
                New Disaster
              </Button>
            </div>
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

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-2 overflow-x-auto">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                tab={tab}
                active={activeTab === tab.id}
                onClick={setActiveTab}
              />
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <RealTimeStats />
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                  <DonationChart />
                  <GeographicDistribution />
                </div>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                  <ImpactMetrics />
                  <ContractEventMonitor />
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-8">
                <ImpactMetrics />
                <DonationChart />
              </div>
            )}

            {activeTab === 'monitoring' && (
              <RealTimeMonitor />
            )}

            {activeTab === 'disasters' && (
              <div className="space-y-6">
                {/* Header with Create Button */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Disaster Zones</h2>
                    <p className="text-gray-600">Manage active disaster relief zones</p>
                  </div>
                  <Button 
                    variant="primary" 
                    icon={Plus}
                    onClick={() => setShowNewDisasterModal(true)}
                    disabled={!isConnected || userRole !== 'admin'}
                  >
                    Create New Zone
                  </Button>
                </div>

                {/* Access Control Message */}
                {!isConnected && (
                  <Card>
                    <div className="p-6 text-center">
                      <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Wallet Required
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Please connect your wallet to access disaster management features.
                      </p>
                    </div>
                  </Card>
                )}

                {isConnected && userRole !== 'admin' && (
                  <Card>
                    <div className="p-6 text-center">
                      <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Admin Access Required
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Only administrators can manage disaster zones. Current role: {userRole}
                      </p>
                    </div>
                  </Card>
                )}

                {/* Disaster Zones List */}
                {isConnected && userRole === 'admin' && (
                  <>
                    {disasterZones.length === 0 ? (
                      <Card>
                        <div className="p-12 text-center">
                          <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No Disaster Zones Yet
                          </h3>
                          <p className="text-gray-600 mb-6">
                            Create your first disaster zone to start managing relief operations.
                          </p>
                          <Button 
                            variant="primary" 
                            icon={Plus}
                            onClick={() => setShowNewDisasterModal(true)}
                          >
                            Create First Zone
                          </Button>
                        </div>
                      </Card>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {disasterZones.map((zone) => (
                          <DisasterZoneCard 
                            key={zone.id} 
                            zone={zone}
                            onEdit={(zone) => {
                              // TODO: Implement edit functionality
                              console.log('Edit zone:', zone)
                            }}
                            onViewDetails={(zone) => {
                              // TODO: Implement view details functionality
                              console.log('View details:', zone)
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 'vendors' && (
              <Card>
                <div className="p-6 text-center">
                  <Users className="w-16 h-16 mx-auto mb-4 text-green-500" />
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Vendor Management
                  </h3>
                  <p className="mb-6 text-gray-600">
                    Verify and manage authorized vendors
                  </p>
                  <Button variant="primary">Manage Vendors</Button>
                </div>
              </Card>
            )}

            {activeTab === 'settings' && (
              <Card>
                <div className="p-6 text-center">
                  <Settings className="w-16 h-16 mx-auto mb-4 text-purple-500" />
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    System Settings
                  </h3>
                  <p className="mb-6 text-gray-600">
                    Configure platform parameters and rules
                  </p>
                  <Button variant="primary">Manage Settings</Button>
                </div>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* New Disaster Zone Modal */}
      <NewDisasterZone
        isOpen={showNewDisasterModal}
        onClose={() => setShowNewDisasterModal(false)}
        onSuccess={handleNewZoneCreated}
      />
    </div>
  )
}

export default AdminDashboard