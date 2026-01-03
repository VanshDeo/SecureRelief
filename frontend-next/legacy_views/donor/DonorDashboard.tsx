import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, TrendingUp, Users, CreditCard, BarChart3, Award } from 'lucide-react'
import Card from '../../components/UI/Card'
import Button from '../../components/UI/Button'

const DonorDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Donor Dashboard</h1>
          <p className="text-gray-600">Make a difference in disaster relief efforts</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Heart className="w-8 h-8 text-red-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Donated</p>
                <p className="text-2xl font-bold text-gray-900">$5,250</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="w-8 h-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">People Helped</p>
                <p className="text-2xl font-bold text-gray-900">127</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">$850</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Award className="w-8 h-8 text-yellow-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Impact Score</p>
                <p className="text-2xl font-bold text-gray-900">Gold</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
          <Card className="p-6">
            <div className="text-center">
              <CreditCard className="w-12 h-12 mx-auto mb-4 text-blue-500" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Make Donation
              </h3>
              <p className="mb-4 text-gray-600">
                Support disaster relief efforts with a secure donation
              </p>
              <Link to="/donor/donate">
                <Button className="w-full">Donate Now</Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                View Impact
              </h3>
              <p className="mb-4 text-gray-600">
                See how your donations are making a difference
              </p>
              <Link to="/donor/impact">
                <Button variant="outline" className="w-full">View Impact</Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-purple-500" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Donation History
              </h3>
              <p className="mb-4 text-gray-600">
                Review your past contributions and receipts
              </p>
              <Link to="/donor/history">
                <Button variant="outline" className="w-full">View History</Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Recent Disasters */}
        <Card className="p-6 mb-8">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">Active Disasters</h2>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">Hurricane Delta Relief</h3>
                  <p className="text-gray-600">Florida Gulf Coast</p>
                </div>
                <span className="px-2 py-1 text-xs text-red-700 bg-red-100 rounded-full">
                  Critical
                </span>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between mb-1 text-sm">
                  <span>Funding Progress</span>
                  <span>$125,000 / $200,000</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-blue-500 rounded-full" style={{ width: '62.5%' }}></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">2,300 people affected</p>
                <Button size="sm">Donate to This Disaster</Button>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">Wildfire Recovery</h3>
                  <p className="text-gray-600">California Central Valley</p>
                </div>
                <span className="px-2 py-1 text-xs text-orange-700 bg-orange-100 rounded-full">
                  Urgent
                </span>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between mb-1 text-sm">
                  <span>Funding Progress</span>
                  <span>$85,000 / $150,000</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-blue-500 rounded-full" style={{ width: '56.7%' }}></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">850 people affected</p>
                <Button size="sm" variant="outline">Donate to This Disaster</Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-2 h-2 mt-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Donated $100 to Hurricane Delta Relief</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Received impact report for Flood Relief 2024</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-2 h-2 mt-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Reached Gold impact level</p>
                <p className="text-xs text-gray-500">3 days ago</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default DonorDashboard
