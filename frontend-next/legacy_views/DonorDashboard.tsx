import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Heart,
  MapPin,
  Users,
  Clock,
  TrendingUp,
  DollarSign,
  Search,
  Filter,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useWeb3Store } from '../store/web3Store'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import Modal from '../components/UI/Modal'
import toast from 'react-hot-toast'

const DonorDashboard = () => {
  const { isConnected, account, usdcContract, disasterReliefContract, getUSDCBalance } = useWeb3Store()
  const [disasters, setDisasters] = useState([])
  const [loading, setLoading] = useState(true)
  const [usdcBalance, setUsdcBalance] = useState('0')
  const [selectedDisaster, setSelectedDisaster] = useState(null)
  const [donationAmount, setDonationAmount] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showDonationModal, setShowDonationModal] = useState(false)
  const [donating, setDonating] = useState(false)

  // Mock data - replace with actual contract calls
  const mockDisasters = [
    {
      id: 1,
      name: 'Turkey Earthquake Relief',
      location: 'Kahramanmaraş, Turkey',
      description: 'Emergency aid for earthquake victims in southern Turkey',
      raised: 125000,
      target: 200000,
      distributed: 98000,
      beneficiaries: 2500,
      status: 'active',
      urgency: 'high',
      image: 'https://forward.com/wp-content/uploads/2023/02/GettyImages-1246848248.jpeg',
      createdAt: new Date('2024-01-15'),
      categories: ['Medical', 'Food', 'Shelter', 'Water']
    },
    {
      id: 2,
      name: 'Flood Recovery Fund',
      location: 'Kerala, India',
      description: 'Supporting families affected by monsoon flooding',
      raised: 87500,
      target: 150000,
      distributed: 75200,
      beneficiaries: 1800,
      status: 'active',
      urgency: 'medium',
      image: 'https://imagesvs.oneindia.com/img/2023/12/chennai-floods-small-1701933535.jpg',
      createdAt: new Date('2024-01-20'),
      categories: ['Food', 'Shelter', 'Clothing', 'Medical']
    },
    {
      id: 3,
      name: 'Wildfire Support',
      location: 'California, USA',
      description: 'Recovery assistance for wildfire-affected communities',
      raised: 156000,
      target: 156000,
      distributed: 156000,
      beneficiaries: 3200,
      status: 'completed',
      urgency: 'low',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS97yLCkYtLMx3pMfG4KAOd6luNbIk-YYQejg&s',
      createdAt: new Date('2024-01-10'),
      categories: ['Shelter', 'Food', 'Medical', 'Transportation']
    }
  ]

  useEffect(() => {
    loadDisasters()
    if (isConnected) {
      loadUSDCBalance()
    }
  }, [isConnected])

  const loadDisasters = async () => {
    try {
      setLoading(true)
      // In a real app, this would fetch from the smart contract
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate loading
      setDisasters(mockDisasters)
    } catch (error) {
      console.error('Error loading disasters:', error)
      toast.error('Failed to load disasters')
    } finally {
      setLoading(false)
    }
  }

  const loadUSDCBalance = async () => {
    try {
      const balance = await getUSDCBalance()
      setUsdcBalance(balance)
    } catch (error) {
      console.error('Error loading USDC balance:', error)
    }
  }

  const handleDonate = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      toast.error('Please enter a valid donation amount')
      return
    }

    if (parseFloat(donationAmount) > parseFloat(usdcBalance)) {
      toast.error('Insufficient USDC balance')
      return
    }

    try {
      setDonating(true)
      
      // In a real app, this would interact with the smart contract
      // 1. Approve USDC spending
      // 2. Call donation function on disaster relief contract
      
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate transaction
      
      toast.success('Donation successful! Thank you for your contribution.')
      setShowDonationModal(false)
      setDonationAmount('')
      setSelectedDisaster(null)
      
      // Refresh data
      loadDisasters()
      loadUSDCBalance()
      
    } catch (error) {
      console.error('Donation error:', error)
      toast.error('Donation failed. Please try again.')
    } finally {
      setDonating(false)
    }
  }

  const filteredDisasters = disasters.filter(disaster => {
    const matchesSearch = disaster.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         disaster.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || disaster.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getProgressPercentage = (raised, target) => {
    return Math.min((raised / target) * 100, 100)
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-orange-600 bg-orange-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Connect Your Wallet
          </h1>
          <p className="text-gray-600 mb-6">
            Please connect your wallet to access the donation dashboard.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Donation Dashboard
              </h1>
              <p className="text-gray-600">
                Support disaster relief efforts with transparent, blockchain-verified donations
              </p>
            </div>
            
            <div className="mt-6 lg:mt-0">
              <div className="bg-avalanche-50 rounded-lg p-4">
                <div className="text-sm text-avalanche-700 mb-1">
                  Your USDC Balance
                </div>
                <div className="text-2xl font-bold text-avalanche-900">
                  ${parseFloat(usdcBalance).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search disasters by name or location..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avalanche-500 focus:border-transparent bg-white text-gray-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-avalanche-500 focus:border-transparent bg-white text-gray-900"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Disasters</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" text="Loading disasters..." />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {filteredDisasters.filter(d => d.status === 'active').length}
                    </div>
                    <div className="text-sm text-gray-600">Active Disasters</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">
                      ${filteredDisasters.reduce((sum, d) => sum + d.raised, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Total Raised</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {filteredDisasters.reduce((sum, d) => sum + d.beneficiaries, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Lives Impacted</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Disasters Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredDisasters.map((disaster, index) => (
                <motion.div
                  key={disaster.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden"
                >
                  {/* Image */}
                  <div className="h-48 bg-gray-200 relative">
                    <img 
                      src={disaster.image}
                      alt={disaster.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextElementSibling.style.display = 'flex'
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-avalanche-400 to-avalanche-600 hidden items-center justify-center">
                      <MapPin className="h-12 w-12 text-white" />
                    </div>
                    
                    {/* Status and Urgency Badges */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between">
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${disaster.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                        }
                      `}>
                        {disaster.status === 'active' ? 'Active' : 'Completed'}
                      </span>
                      
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium capitalize
                        ${getUrgencyColor(disaster.urgency)}
                      `}>
                        {disaster.urgency} Priority
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {disaster.name}
                    </h3>
                    
                    <p className="text-gray-600 mb-3 flex items-center">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      {disaster.location}
                    </p>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {disaster.description}
                    </p>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">
                          ${disaster.raised.toLocaleString()} / ${disaster.target.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-avalanche-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getProgressPercentage(disaster.raised, disaster.target)}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {getProgressPercentage(disaster.raised, disaster.target).toFixed(1)}% funded
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <div className="text-gray-600">Distributed</div>
                        <div className="font-medium">${disaster.distributed.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Beneficiaries</div>
                        <div className="font-medium">{disaster.beneficiaries.toLocaleString()}</div>
                      </div>
                    </div>

                    {/* Categories */}
                    <div className="mb-4">
                      <div className="text-xs text-gray-600 mb-2">Aid Categories</div>
                      <div className="flex flex-wrap gap-1">
                        {disaster.categories.slice(0, 3).map((category) => (
                          <span 
                            key={category}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                          >
                            {category}
                          </span>
                        ))}
                        {disaster.categories.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                            +{disaster.categories.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {disaster.status === 'active' ? (
                        <button
                          onClick={() => {
                            setSelectedDisaster(disaster)
                            setShowDonationModal(true)
                          }}
                          className="flex-1 btn-primary flex items-center justify-center"
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          Donate Now
                        </button>
                      ) : (
                        <div className="flex-1 flex items-center justify-center py-2 px-4 bg-gray-100 text-gray-600 rounded-lg">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Completed
                        </div>
                      )}
                      
                      <button className="btn-secondary">
                        View Details
                      </button>
                    </div>

                    {/* Time */}
                    <div className="mt-3 pt-3 border-t border-gray-200 flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      Created {disaster.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredDisasters.length === 0 && !loading && (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto mb-4" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No disasters found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Donation Modal */}
      <Modal
        isOpen={showDonationModal}
        onClose={() => {
          setShowDonationModal(false)
          setSelectedDisaster(null)
          setDonationAmount('')
        }}
        title="Make a Donation"
        size="md"
      >
        {selectedDisaster && (
          <div>
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">
                {selectedDisaster.name}
              </h4>
              <p className="text-sm text-gray-600 flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {selectedDisaster.location}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Donation Amount (USDC)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-avalanche-500 focus:border-transparent"
                  placeholder="0.00"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">USDC</span>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Available balance: ${parseFloat(usdcBalance).toLocaleString()} USDC
              </div>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2">Transaction Details</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Donation Amount:</span>
                  <span className="font-medium">${donationAmount || '0.00'} USDC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Network Fee:</span>
                  <span className="font-medium">~$0.02 AVAX</span>
                </div>
                <div className="flex justify-between text-gray-900 font-medium border-t border-gray-200 pt-2">
                  <span>Total Cost:</span>
                  <span>${donationAmount || '0.00'} USDC + gas</span>
                </div>
              </div>
            </div>

            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">Impact Preview</h5>
              <p className="text-sm text-blue-800">
                Your ${donationAmount || '0'} donation will be geo-locked to {selectedDisaster.location} and 
                can only be spent by verified vendors for essential supplies like food, water, medical aid, and shelter.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDonationModal(false)
                  setSelectedDisaster(null)
                  setDonationAmount('')
                }}
                className="flex-1 btn-secondary"
                disabled={donating}
              >
                Cancel
              </button>
              <button
                onClick={handleDonate}
                disabled={donating || !donationAmount || parseFloat(donationAmount) <= 0}
                className="flex-1 btn-primary flex items-center justify-center"
              >
                {donating ? (
                  <LoadingSpinner size="sm" color="white" />
                ) : (
                  <>
                    <Heart className="h-4 w-4 mr-2" />
                    Confirm Donation
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default DonorDashboard
