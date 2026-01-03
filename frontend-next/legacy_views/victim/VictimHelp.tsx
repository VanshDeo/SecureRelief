import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Clock, Navigation } from 'lucide-react'
import Card from '../../components/UI/Card'
import Button from '../../components/UI/Button'

const VictimHelp = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Get Help</h1>
              <p className="text-gray-600">Find assistance and resources near you</p>
            </div>
            <Link to="/victim">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>

        {/* Emergency Contacts */}
        <Card className="p-6 mb-6 border-red-200 bg-red-50">
          <h2 className="mb-4 text-xl font-semibold text-red-900">Emergency Contacts</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-semibold text-red-900">Emergency</p>
                <p className="text-red-700">911</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-semibold text-red-900">Local Relief</p>
                <p className="text-red-700">(555) 123-HELP</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-semibold text-red-900">Crisis Hotline</p>
                <p className="text-red-700">(555) 999-CRISIS</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Map and Nearby Resources */}
        <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
          {/* Map Placeholder */}
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Nearby Resources
            </h2>
            <div className="flex items-center justify-center h-64 mb-4 bg-gray-100 rounded-lg">
              <div className="text-center">
                <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-600">Interactive map loading...</p>
              </div>
            </div>
            <Button className="w-full">
              <Navigation className="w-4 h-4 mr-2" />
              Show My Location
            </Button>
          </Card>

          {/* Resource List */}
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Available Resources
            </h2>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Community Relief Center</h3>
                  <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
                    Open
                  </span>
                </div>
                <p className="mb-2 text-sm text-gray-600">Food, water, temporary shelter</p>
                <div className="flex items-center mb-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>123 Main St, 0.3 miles away</span>
                </div>
                <div className="flex items-center mb-3 text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Open 24/7</span>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  Get Directions
                </Button>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Medical Aid Station</h3>
                  <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
                    Open
                  </span>
                </div>
                <p className="mb-2 text-sm text-gray-600">First aid, medications, medical supplies</p>
                <div className="flex items-center mb-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>456 Health Ave, 0.7 miles away</span>
                </div>
                <div className="flex items-center mb-3 text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>8 AM - 8 PM</span>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  Get Directions
                </Button>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Evacuation Center</h3>
                  <span className="px-2 py-1 text-xs text-yellow-700 bg-yellow-100 rounded-full">
                    Limited
                  </span>
                </div>
                <p className="mb-2 text-sm text-gray-600">Safe shelter, bedding, meals</p>
                <div className="flex items-center mb-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>789 School Rd, 1.2 miles away</span>
                </div>
                <div className="flex items-center mb-3 text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Check-in until 10 PM</span>
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  Get Directions
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link to="/victim/requests">
              <Button variant="outline" className="w-full h-16">
                <div className="text-center">
                  <p className="font-semibold">Request Aid</p>
                  <p className="text-xs text-gray-600">Submit assistance request</p>
                </div>
              </Button>
            </Link>
            
            <Button variant="outline" className="w-full h-16">
              <div className="text-center">
                <p className="font-semibold">Report Emergency</p>
                <p className="text-xs text-gray-600">Alert local authorities</p>
              </div>
            </Button>
            
            <Button variant="outline" className="w-full h-16">
              <div className="text-center">
                <p className="font-semibold">Find Shelter</p>
                <p className="text-xs text-gray-600">Locate safe housing</p>
              </div>
            </Button>
            
            <Button variant="outline" className="w-full h-16">
              <div className="text-center">
                <p className="font-semibold">Contact Family</p>
                <p className="text-xs text-gray-600">Family reunification</p>
              </div>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default VictimHelp
