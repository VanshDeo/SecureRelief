import React from 'react'
import { Link } from 'react-router-dom'
import { CreditCard, QrCode, Camera } from 'lucide-react'
import Card from '../../components/UI/Card'
import Button from '../../components/UI/Button'

const VendorPayments = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment Processing</h1>
              <p className="text-gray-600">Process voucher redemptions and handle payments</p>
            </div>
            <Link to="/vendor">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2">
          <Card className="p-8 text-center">
            <QrCode className="w-16 h-16 mx-auto mb-4 text-blue-500" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">QR Code Scanner</h3>
            <p className="mb-6 text-gray-600">Scan victim voucher QR codes for instant processing</p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Camera className="w-4 h-4 mr-2" />
              Open Scanner
            </Button>
          </Card>

          <Card className="p-8 text-center">
            <CreditCard className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Manual Entry</h3>
            <p className="mb-6 text-gray-600">Enter voucher details manually for processing</p>
            <Button variant="outline" className="w-full">
              Manual Processing
            </Button>
          </Card>
        </div>

        {/* Pending Payments */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Pending Payment Requests</h3>
          <div className="py-8 text-center">
            <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Payment processing interface coming soon...</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default VendorPayments
