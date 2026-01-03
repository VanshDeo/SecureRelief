import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CreditCard, DollarSign, Heart, Users, AlertTriangle } from 'lucide-react'
import Card from '../../components/UI/Card'
import Button from '../../components/UI/Button'

const DonorDonate = () => {
  const [donationAmount, setDonationAmount] = useState('')
  const [selectedDisaster, setSelectedDisaster] = useState('')
  const [donationType, setDonationType] = useState('one-time')

  const disasters = [
    { id: 'hurricane-delta', name: 'Hurricane Delta Relief', location: 'Florida Gulf Coast', urgency: 'critical' },
    { id: 'wildfire-ca', name: 'Wildfire Recovery', location: 'California Central Valley', urgency: 'urgent' },
    { id: 'flood-tx', name: 'Flood Relief 2024', location: 'Texas Panhandle', urgency: 'moderate' }
  ]

  const predefinedAmounts = [25, 50, 100, 250, 500, 1000]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-4xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Make a Donation</h1>
              <p className="text-gray-600">Support disaster relief efforts and help those in need</p>
            </div>
            <Link to="/donor">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Donation Form */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Donation Details</h2>
              
              {/* Donation Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Donation Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setDonationType('one-time')}
                    className={`p-3 border rounded-lg text-center ${
                      donationType === 'one-time'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    One-time Donation
                  </button>
                  <button
                    onClick={() => setDonationType('monthly')}
                    className={`p-3 border rounded-lg text-center ${
                      donationType === 'monthly'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    Monthly Recurring
                  </button>
                </div>
              </div>

              {/* Disaster Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Disaster
                </label>
                <div className="space-y-3">
                  {disasters.map((disaster) => (
                    <div
                      key={disaster.id}
                      onClick={() => setSelectedDisaster(disaster.id)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedDisaster === disaster.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{disaster.name}</h3>
                          <p className="text-sm text-gray-600">{disaster.location}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          disaster.urgency === 'critical'
                            ? 'bg-red-100 text-red-700'
                            : disaster.urgency === 'urgent'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {disaster.urgency}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  <div
                    onClick={() => setSelectedDisaster('general')}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedDisaster === 'general'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">General Relief Fund</h3>
                        <p className="text-sm text-gray-600">Support all ongoing relief efforts</p>
                      </div>
                      <Heart className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Amount Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Donation Amount
                </label>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {predefinedAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setDonationAmount(amount.toString())}
                      className={`p-3 border rounded-lg text-center font-semibold ${
                        donationAmount === amount.toString()
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    placeholder="Enter custom amount"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
                <div className="space-y-3">
                  <div className="p-4 border border-gray-300 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">Credit/Debit Card</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full" size="lg">
                <Heart className="w-5 h-5 mr-2" />
                Donate ${donationAmount || '0'}
              </Button>
            </Card>
          </div>

          {/* Donation Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold">${donationAmount || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-semibold capitalize">{donationType.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing Fee:</span>
                  <span className="font-semibold">$0</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${donationAmount || '0'}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Impact</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Users className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="font-semibold text-gray-900">$25</p>
                    <p className="text-sm text-gray-600">Provides emergency food for 1 family</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Heart className="w-8 h-8 text-red-500" />
                  <div>
                    <p className="font-semibold text-gray-900">$50</p>
                    <p className="text-sm text-gray-600">Supplies clean water for 10 people</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-8 h-8 text-yellow-500" />
                  <div>
                    <p className="font-semibold text-gray-900">$100</p>
                    <p className="text-sm text-gray-600">Emergency shelter for 1 week</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DonorDonate
