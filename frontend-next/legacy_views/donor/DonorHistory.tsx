import React from 'react'
import { Link } from 'react-router-dom'
import { Download, Calendar, DollarSign, FileText } from 'lucide-react'
import Card from '../../components/UI/Card'
import Button from '../../components/UI/Button'

const DonorHistory = () => {
  const donations = [
    {
      id: 'DON-2024-001',
      date: '2024-08-10',
      amount: 100,
      disaster: 'Hurricane Delta Relief',
      type: 'One-time',
      status: 'Completed',
      receipt: 'receipt-001.pdf'
    },
    {
      id: 'DON-2024-002',
      date: '2024-08-05',
      amount: 50,
      disaster: 'Wildfire Recovery',
      type: 'One-time',
      status: 'Completed',
      receipt: 'receipt-002.pdf'
    },
    {
      id: 'DON-2024-003',
      date: '2024-08-01',
      amount: 75,
      disaster: 'General Relief Fund',
      type: 'Monthly',
      status: 'Completed',
      receipt: 'receipt-003.pdf'
    },
    {
      id: 'DON-2024-004',
      date: '2024-07-25',
      amount: 200,
      disaster: 'Flood Relief 2024',
      type: 'One-time',
      status: 'Completed',
      receipt: 'receipt-004.pdf'
    },
    {
      id: 'DON-2024-005',
      date: '2024-07-15',
      amount: 150,
      disaster: 'Hurricane Delta Relief',
      type: 'One-time',
      status: 'Completed',
      receipt: 'receipt-005.pdf'
    }
  ]

  const totalDonated = donations.reduce((sum, donation) => sum + donation.amount, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Donation History</h1>
              <p className="text-gray-600">View and manage your past contributions</p>
            </div>
            <Link to="/donor">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Donated</p>
                <p className="text-2xl font-bold text-gray-900">${totalDonated}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Donations</p>
                <p className="text-2xl font-bold text-gray-900">{donations.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="w-8 h-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Year</p>
                <p className="text-2xl font-bold text-gray-900">${totalDonated}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Filter by Year
              </label>
              <select className="px-3 py-2 text-sm border border-gray-300 rounded-md">
                <option>2024</option>
                <option>2023</option>
                <option>All Years</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Filter by Type
              </label>
              <select className="px-3 py-2 text-sm border border-gray-300 rounded-md">
                <option>All Types</option>
                <option>One-time</option>
                <option>Monthly</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Filter by Disaster
              </label>
              <select className="px-3 py-2 text-sm border border-gray-300 rounded-md">
                <option>All Disasters</option>
                <option>Hurricane Delta Relief</option>
                <option>Wildfire Recovery</option>
                <option>Flood Relief 2024</option>
                <option>General Relief Fund</option>
              </select>
            </div>
            
            <div className="ml-auto">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export All
              </Button>
            </div>
          </div>
        </Card>

        {/* Donations Table */}
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Donations</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Donation ID
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Disaster
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Receipt
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {donations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {donation.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(donation.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
                      ${donation.amount}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {donation.disaster}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {donation.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                        {donation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Tax Information */}
        <Card className="p-6 mt-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Tax Information</h2>
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <div className="flex items-start">
              <FileText className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
              <div>
                <h3 className="font-semibold text-blue-900">Annual Tax Summary</h3>
                <p className="mb-3 text-sm text-blue-700">
                  Your total charitable donations for 2024: <strong>${totalDonated}</strong>
                </p>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Tax Summary
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default DonorHistory
