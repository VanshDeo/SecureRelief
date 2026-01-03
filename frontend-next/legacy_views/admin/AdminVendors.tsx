import React from 'react'
import { Link } from 'react-router-dom'
import { Users, CheckCircle, Clock, XCircle, UserCheck } from 'lucide-react'
import Card from '../../components/UI/Card'
import Button from '../../components/UI/Button'

const AdminVendors = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Vendor Management
              </h1>
              <p className="text-gray-600">
                Verify and manage authorized relief vendors
              </p>
            </div>
            
            <Link to="/admin">
              <Button variant="outline">
                Back to Overview
              </Button>
            </Link>
          </div>
        </div>

        {/* Coming Soon Content */}
        <Card className="p-12 text-center">
          <Users className="w-20 h-20 mx-auto mb-6 text-blue-500" />
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Vendor Management System
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-gray-600">
            This page will contain comprehensive vendor management features including 
            verification workflows, performance monitoring, and approval processes.
          </p>
          
          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4">
            <div className="p-6 rounded-lg bg-green-50">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-green-600">24</p>
              <p className="text-sm text-gray-600">Verified Vendors</p>
            </div>
            <div className="p-6 rounded-lg bg-yellow-50">
              <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
              <p className="text-2xl font-bold text-yellow-600">3</p>
              <p className="text-sm text-gray-600">Pending Review</p>
            </div>
            <div className="p-6 rounded-lg bg-red-50">
              <XCircle className="w-8 h-8 mx-auto mb-2 text-red-600" />
              <p className="text-2xl font-bold text-red-600">2</p>
              <p className="text-sm text-gray-600">Rejected</p>
            </div>
            <div className="p-6 rounded-lg bg-blue-50">
              <UserCheck className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-blue-600">29</p>
              <p className="text-sm text-gray-600">Total Applications</p>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            Feature implementation in progress...
          </p>
        </Card>
      </div>
    </div>
  )
}

export default AdminVendors
