import React from 'react'
import { Link } from 'react-router-dom'
import { User, Store, MapPin, Star } from 'lucide-react'
import Card from '../../components/UI/Card'
import Button from '../../components/UI/Button'

const VendorProfile = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Vendor Profile</h1>
              <p className="text-gray-600">Manage your business information and settings</p>
            </div>
            <Link to="/vendor">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>

        {/* Profile Form */}
        <div className="space-y-8">
          <Card className="p-6">
            <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
              <Store className="w-5 h-5 mr-2 text-blue-500" />
              Business Information
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Business Name</label>
                <input
                  type="text"
                  defaultValue="Relief Supply Co."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Business Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                  <option>Food Supplier</option>
                  <option>Medical Supplier</option>
                  <option>Shelter Provider</option>
                  <option>General Supplier</option>
                </select>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
              <MapPin className="w-5 h-5 mr-2 text-green-500" />
              Location & Contact
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Address</label>
                <textarea
                  rows={3}
                  defaultValue="123 Supply Street, Austin, TX 78701"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    defaultValue="+1 (555) 123-4567"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    defaultValue="contact@reliefsupply.co"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              Performance Metrics
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="p-4 text-center rounded-lg bg-gray-50">
                <p className="text-2xl font-bold text-gray-900">4.8</p>
                <p className="text-sm text-gray-600">Customer Rating</p>
              </div>
              <div className="p-4 text-center rounded-lg bg-gray-50">
                <p className="text-2xl font-bold text-gray-900">342</p>
                <p className="text-sm text-gray-600">Total Transactions</p>
              </div>
              <div className="p-4 text-center rounded-lg bg-gray-50">
                <p className="text-2xl font-bold text-gray-900">95%</p>
                <p className="text-sm text-gray-600">Reliability Score</p>
              </div>
            </div>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button variant="outline">Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VendorProfile
