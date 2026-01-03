import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Store, 
  CreditCard, 
  BarChart3, 
  QrCode, 
  Camera, 
  Upload, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Users,
  MapPin,
  Star,
  Filter,
  Search,
  Eye,
  FileText,
  AlertCircle
} from 'lucide-react'
import { useWeb3Store } from '../store/web3Store'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import Modal from '../components/UI/Modal'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import toast from 'react-hot-toast'

const VendorPortal = () => {
  const { isConnected, account, userRole } = useWeb3Store()
  const [activeTab, setActiveTab] = useState('payments')
  const [loading, setLoading] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showProofModal, setShowProofModal] = useState(false)
  const [vendorProfile, setVendorProfile] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [pendingPayments, setPendingPayments] = useState([])
  
  // Payment processing state
  const [paymentData, setPaymentData] = useState({
    voucherCode: '',
    amount: '',
    description: '',
    category: 'food'
  })
  
  // Proof submission state
  const [proofData, setProofData] = useState({
    transactionId: '',
    images: [],
    description: '',
    location: ''
  })

  // Mock vendor profile data
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
      
      // Mock transactions
      setTransactions([
        {
          id: 'TX001',
          date: '2024-08-10',
          victim: '0x1234...5678',
          amount: 125.50,
          category: 'Food',
          status: 'completed',
          proofSubmitted: true,
          items: ['Emergency Food Kit', 'Water Bottles']
        },
        {
          id: 'TX002',
          date: '2024-08-09',
          victim: '0x2345...6789',
          amount: 89.75,
          category: 'Medical',
          status: 'completed',
          proofSubmitted: false,
          items: ['First Aid Kit', 'Pain Medication']
        },
        {
          id: 'TX003',
          date: '2024-08-09',
          victim: '0x3456...7890',
          amount: 200.00,
          category: 'Shelter',
          status: 'pending',
          proofSubmitted: false,
          items: ['Emergency Tent', 'Sleeping Bag']
        }
      ])
      
      // Mock pending payments
      setPendingPayments([
        {
          id: 'P001',
          voucherCode: 'VCH-2024-001',
          victim: '0x4567...8901',
          amount: 150.00,
          category: 'food',
          requestedItems: ['Food Kit', 'Water'],
          urgency: 'high'
        },
        {
          id: 'P002',
          voucherCode: 'VCH-2024-002', 
          victim: '0x5678...9012',
          amount: 75.00,
          category: 'medical',
          requestedItems: ['First Aid'],
          urgency: 'medium'
        }
      ])
    }
  }, [isConnected, userRole])

  const handleProcessPayment = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Add to transactions
      const newTransaction = {
        id: `TX${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        victim: paymentData.voucherCode,
        amount: parseFloat(paymentData.amount),
        category: paymentData.category,
        status: 'completed',
        proofSubmitted: false,
        items: [paymentData.description]
      }
      
      setTransactions(prev => [newTransaction, ...prev])
      setPaymentData({ voucherCode: '', amount: '', description: '', category: 'food' })
      setShowPaymentModal(false)
      toast.success('Payment processed successfully!')
      
    } catch (error) {
      toast.error('Payment processing failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitProof = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Simulate proof submission
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update transaction with proof
      setTransactions(prev => 
        prev.map(tx => 
          tx.id === proofData.transactionId 
            ? { ...tx, proofSubmitted: true }
            : tx
        )
      )
      
      setProofData({ transactionId: '', images: [], description: '', location: '' })
      setShowProofModal(false)
      toast.success('Proof of aid submitted successfully!')
      
    } catch (error) {
      toast.error('Proof submission failed')
    } finally {
      setLoading(false)
    }
  }

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
              <h1 className="text-3xl font-bold text-gray-900">Vendor Portal</h1>
              <p className="text-gray-600">Process payments and manage your relief operations</p>
            </div>
            <div className="flex space-x-4">
              <Button
                onClick={() => setShowPaymentModal(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Process Payment
              </Button>
              <Button
                onClick={() => setShowProofModal(true)}
                variant="outline"
              >
                <Upload className="w-4 h-4 mr-2" />
                Submit Proof
              </Button>
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

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'payments', label: 'Payment Processing', icon: CreditCard },
              { id: 'transactions', label: 'Transaction History', icon: BarChart3 },
              { id: 'profile', label: 'Profile Management', icon: Store }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'payments' && (
            <motion.div
              key="payments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Pending Payments */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Payment Requests</h3>
                <div className="space-y-4">
                  {pendingPayments.map(payment => (
                    <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">{payment.voucherCode}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              payment.urgency === 'high' ? 'bg-red-100 text-red-700' :
                              payment.urgency === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {payment.urgency} priority
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">Victim: {payment.victim}</p>
                          <p className="text-sm text-gray-600">Items: {payment.requestedItems.join(', ')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">${payment.amount}</p>
                          <Button 
                            size="sm"
                            onClick={() => {
                              setPaymentData({
                                voucherCode: payment.voucherCode,
                                amount: payment.amount.toString(),
                                category: payment.category,
                                description: payment.requestedItems.join(', ')
                              })
                              setShowPaymentModal(true)
                            }}
                          >
                            Process
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* QR Code Scanner */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Payment Processing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="font-medium text-gray-900 mb-2">Scan Voucher QR Code</h4>
                    <p className="text-sm text-gray-600 mb-4">Quickly process payments by scanning victim voucher QR codes</p>
                    <Button variant="outline">
                      <Camera className="w-4 h-4 mr-2" />
                      Open Camera
                    </Button>
                  </div>
                  <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="font-medium text-gray-900 mb-2">Manual Entry</h4>
                    <p className="text-sm text-gray-600 mb-4">Enter voucher details manually for payment processing</p>
                    <Button 
                      variant="outline"
                      onClick={() => setShowPaymentModal(true)}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Enter Details
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'transactions' && (
            <motion.div
              key="transactions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search transactions..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Transaction
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Victim
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Proof
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transactions.map(transaction => (
                        <tr key={transaction.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{transaction.id}</div>
                              <div className="text-sm text-gray-500">{transaction.date}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{transaction.victim}</div>
                            <div className="text-sm text-gray-500">{transaction.category}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">${transaction.amount}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                              transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {transaction.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {transaction.proofSubmitted ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-yellow-500" />
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setProofData({ ...proofData, transactionId: transaction.id })
                                setShowProofModal(true)
                              }}
                              disabled={transaction.proofSubmitted}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              {transaction.proofSubmitted ? 'View' : 'Submit'} Proof
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Vendor Profile Management</h3>
                {/* Profile management form would go here */}
                <div className="text-center py-8">
                  <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Profile management features coming soon...</p>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Payment Processing Modal */}
        <Modal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          title="Process Payment"
        >
          <form onSubmit={handleProcessPayment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Voucher Code
              </label>
              <input
                type="text"
                value={paymentData.voucherCode}
                onChange={(e) => setPaymentData({ ...paymentData, voucherCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="VCH-2024-001"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={paymentData.amount}
                onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={paymentData.category}
                onChange={(e) => setPaymentData({ ...paymentData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="food">Food & Water</option>
                <option value="medical">Medical Supplies</option>
                <option value="shelter">Shelter & Clothing</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={paymentData.description}
                onChange={(e) => setPaymentData({ ...paymentData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="List of items provided..."
                required
              />
            </div>
            
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPaymentModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? <LoadingSpinner size="sm" /> : 'Process Payment'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Proof Submission Modal */}
        <Modal
          isOpen={showProofModal}
          onClose={() => setShowProofModal(false)}
          title="Submit Proof of Aid"
        >
          <form onSubmit={handleSubmitProof} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction ID
              </label>
              <input
                type="text"
                value={proofData.transactionId}
                onChange={(e) => setProofData({ ...proofData, transactionId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="TX001"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={proofData.location}
                onChange={(e) => setProofData({ ...proofData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Delivery location"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={proofData.description}
                onChange={(e) => setProofData({ ...proofData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Description of aid delivery..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Photos
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Click to upload or drag and drop photos</p>
                <input type="file" multiple accept="image/*" className="hidden" />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowProofModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? <LoadingSpinner size="sm" /> : 'Submit Proof'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  )
}

export default VendorPortal
