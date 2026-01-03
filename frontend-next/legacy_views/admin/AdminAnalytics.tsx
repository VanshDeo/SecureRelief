import React from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react'
import Card from '../../components/UI/Card'
import Button from '../../components/UI/Button'
import DonationChart from '../../components/Charts/DonationChart'
import ImpactMetrics from '../../components/Charts/ImpactMetrics'
import GeographicDistribution from '../../components/Charts/GeographicDistribution'

const AdminAnalytics = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Analytics & Reports
              </h1>
              <p className="text-gray-600">
                Comprehensive insights into disaster relief operations
              </p>
            </div>
            
            <Link to="/admin">
              <Button variant="outline">
                Back to Overview
              </Button>
            </Link>
          </div>
        </div>

        {/* Analytics Content */}
        <div className="space-y-8">
          {/* Charts Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <DonationChart />
            <GeographicDistribution />
          </div>
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <ImpactMetrics />
            <Card className="p-6">
              <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                <Activity className="w-5 h-5 mr-2 text-purple-500" />
                Additional Analytics
              </h3>
              <div className="py-8 text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-purple-500" />
                <p className="text-gray-600">Additional analytics features coming soon...</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminAnalytics
