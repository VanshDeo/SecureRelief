import React from 'react'
import { Link } from 'react-router-dom'
import { Settings, Shield, Database, Bell, Users, Globe } from 'lucide-react'
import Card from '../../components/UI/Card'
import Button from '../../components/UI/Button'

const AdminSettings = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                System Settings
              </h1>
              <p className="text-gray-600">
                Configure platform parameters and administrative settings
              </p>
            </div>
            
            <Link to="/admin">
              <Button variant="outline">
                Back to Overview
              </Button>
            </Link>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Security Settings
            </h3>
            <p className="mb-4 text-gray-600">
              Manage authentication and access controls
            </p>
            <Button variant="outline" className="w-full">
              Configure
            </Button>
          </Card>

          <Card className="p-6 text-center">
            <Database className="w-12 h-12 mx-auto mb-4 text-green-500" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Data Management
            </h3>
            <p className="mb-4 text-gray-600">
              Backup, export, and data retention policies
            </p>
            <Button variant="outline" className="w-full">
              Manage
            </Button>
          </Card>

          <Card className="p-6 text-center">
            <Bell className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Notifications
            </h3>
            <p className="mb-4 text-gray-600">
              Alert systems and notification preferences
            </p>
            <Button variant="outline" className="w-full">
              Setup
            </Button>
          </Card>

          <Card className="p-6 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-purple-500" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              User Management
            </h3>
            <p className="mb-4 text-gray-600">
              Role permissions and user administration
            </p>
            <Button variant="outline" className="w-full">
              Manage Users
            </Button>
          </Card>

          <Card className="p-6 text-center">
            <Globe className="w-12 h-12 mx-auto mb-4 text-indigo-500" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Network Settings
            </h3>
            <p className="mb-4 text-gray-600">
              Blockchain network and API configurations
            </p>
            <Button variant="outline" className="w-full">
              Configure
            </Button>
          </Card>

          <Card className="p-6 text-center">
            <Settings className="w-12 h-12 mx-auto mb-4 text-gray-500" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              General Settings
            </h3>
            <p className="mb-4 text-gray-600">
              Platform configuration and preferences
            </p>
            <Button variant="outline" className="w-full">
              Settings
            </Button>
          </Card>
        </div>

        {/* Configuration Preview */}
        <Card className="p-6 mt-8">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Current Configuration
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-medium text-gray-900">Platform Status</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">System Status</span>
                  <span className="font-medium text-green-600">Operational</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Network</span>
                  <span className="font-medium text-blue-600">Avalanche Fuji</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Users</span>
                  <span className="font-medium">247</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="mb-2 font-medium text-gray-900">Security Status</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Authentication</span>
                  <span className="font-medium text-green-600">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Role-based Access</span>
                  <span className="font-medium text-green-600">Enabled</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Audit Logging</span>
                  <span className="font-medium text-green-600">Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AdminSettings
