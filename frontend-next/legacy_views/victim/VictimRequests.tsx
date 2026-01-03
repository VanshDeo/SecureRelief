import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, Heart, Plus } from 'lucide-react'
import Card from '../../components/UI/Card'
import Button from '../../components/UI/Button'

const VictimRequests = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Assistance Requests</h1>
              <p className="text-gray-600">Submit and track your assistance applications</p>
            </div>
            <div className="flex space-x-4">
              <Link to="/victim">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Request
              </Button>
            </div>
          </div>
        </div>

        {/* Request Form */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Submit New Request</h3>
              <div className="py-8 text-center">
                <Heart className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                <p className="text-gray-600">Request assistance interface coming soon...</p>
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Emergency Request
                </Button>
                <Button className="w-full" variant="outline">
                  Food Assistance
                </Button>
                <Button className="w-full" variant="outline">
                  Medical Aid
                </Button>
                <Button className="w-full" variant="outline">
                  Housing Support
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Recent Requests */}
        <Card className="p-6 mt-8">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">My Requests</h3>
          <div className="py-8 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Request history will appear here...</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default VictimRequests
