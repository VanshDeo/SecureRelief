import React from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, Download, Filter } from 'lucide-react'
import Card from '../../components/UI/Card'
import Button from '../../components/UI/Button'

const VendorTransactions = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
              <p className="text-gray-600">View and manage your payment transaction history</p>
            </div>
            <div className="flex space-x-4">
              <Link to="/vendor">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Transaction Filters */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </Card>

        {/* Transaction List */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <div className="py-12 text-center">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Transaction history interface coming soon...</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default VendorTransactions
