import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  MapPin, 
  Plus, 
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit,
  Filter,
  Search
} from 'lucide-react'
import Card from '../../components/UI/Card'
import Button from '../../components/UI/Button'
import LoadingSpinner from '../../components/UI/LoadingSpinner'
import NewDisasterZone from '../../components/Admin/NewDisasterZone'
import DisasterZoneCard from '../../components/Admin/DisasterZoneCard'
import { useWeb3Store } from '../../store/web3Store'

const AdminDisasters = () => {
  const { isConnected, userRole } = useWeb3Store()
  const [loading, setLoading] = useState(true)
  const [showNewDisasterModal, setShowNewDisasterModal] = useState(false)
  const [disasterZones, setDisasterZones] = useState([])
  const [filteredZones, setFilteredZones] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    // Simulate loading disaster zones
    const timer = setTimeout(() => {
      setLoading(false)
      const mockZones = [
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
          createdAt: new Date(Date.now() - 86400000 * 5),
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
          createdAt: new Date(Date.now() - 86400000 * 12),
          estimatedAffected: 25000
        },
        {
          id: 3,
          name: 'Hurricane Relief Zone',
          description: 'Hurricane preparedness and response operations',
          latitude: 25.7617,
          longitude: -80.1918,
          radiusKm: 200,
          status: 'completed',
          disasterType: 'Hurricane',
          severity: 'medium',
          urgencyLevel: 'medium',
          funding: 75000,
          createdAt: new Date(Date.now() - 86400000 * 30),
          estimatedAffected: 15000
        }
      ]
      setDisasterZones(mockZones)
      setFilteredZones(mockZones)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Filter zones based on search and status
  useEffect(() => {
    let filtered = disasterZones

    if (searchTerm) {
      filtered = filtered.filter(zone => 
        zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        zone.disasterType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        zone.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(zone => zone.status === statusFilter)
    }

    setFilteredZones(filtered)
  }, [searchTerm, statusFilter, disasterZones])

  const handleNewZoneCreated = (newZone) => {
    const zoneWithId = {
      ...newZone,
      id: Date.now(),
      createdAt: new Date()
    }
    setDisasterZones(prev => [zoneWithId, ...prev])
    setShowNewDisasterModal(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading disaster zones..." />
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
                Disaster Management
              </h1>
              <p className="text-gray-600">
                Create and manage disaster relief zones and operations
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/admin">
                <Button variant="outline">
                  Back to Overview
                </Button>
              </Link>
              <Button 
                variant="primary" 
                icon={Plus}
                onClick={() => setShowNewDisasterModal(true)}
                disabled={!isConnected || userRole !== 'admin'}
              >
                New Disaster Zone
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search disasters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            
            <div className="text-sm text-gray-600">
              Showing {filteredZones.length} of {disasterZones.length} zones
            </div>
          </div>
        </div>

        {/* Access Control Message */}
        {!isConnected && (
          <Card className="mb-6">
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
          <Card className="mb-6">
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
            {filteredZones.length === 0 ? (
              <Card>
                <div className="p-12 text-center">
                  <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {searchTerm || statusFilter !== 'all' ? 'No Matching Zones' : 'No Disaster Zones Yet'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your search criteria or filters.'
                      : 'Create your first disaster zone to start managing relief operations.'
                    }
                  </p>
                  {!searchTerm && statusFilter === 'all' && (
                    <Button 
                      variant="primary" 
                      icon={Plus}
                      onClick={() => setShowNewDisasterModal(true)}
                    >
                      Create First Zone
                    </Button>
                  )}
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredZones.map((zone) => (
                  <motion.div
                    key={zone.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <DisasterZoneCard 
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
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Summary Stats */}
        {filteredZones.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-red-600">
                {filteredZones.filter(z => z.status === 'active').length}
              </p>
              <p className="text-sm text-gray-600">Active Zones</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">
                {filteredZones.filter(z => z.urgencyLevel === 'emergency').length}
              </p>
              <p className="text-sm text-gray-600">Emergency Level</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                ${filteredZones.reduce((sum, z) => sum + (z.funding || 0), 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Total Funding</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">
                {filteredZones.reduce((sum, z) => sum + (z.estimatedAffected || 0), 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">People Affected</p>
            </Card>
          </div>
        )}
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

export default AdminDisasters
