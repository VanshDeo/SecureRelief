import React from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, Users, MapPin, BarChart3, Award, Heart } from 'lucide-react'
import Card from '../../components/UI/Card'
import Button from '../../components/UI/Button'

const DonorImpact = () => {
  const impactStats = {
    totalPeopleHelped: 127,
    communitiesSupported: 8,
    disastersSupported: 5,
    impactScore: 'Gold',
    carbonFootprint: 2.3
  }

  const disasters = [
    {
      name: 'Hurricane Delta Relief',
      location: 'Florida Gulf Coast',
      donated: 250,
      peopleHelped: 45,
      outcome: 'Emergency shelter and food provided to 45 families'
    },
    {
      name: 'Wildfire Recovery',
      location: 'California Central Valley',
      donated: 150,
      peopleHelped: 32,
      outcome: 'Temporary housing and medical supplies for 32 individuals'
    },
    {
      name: 'Flood Relief 2024',
      location: 'Texas Panhandle',
      donated: 200,
      peopleHelped: 50,
      outcome: 'Clean water and emergency provisions for 50 families'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Impact</h1>
              <p className="text-gray-600">See how your donations are making a difference</p>
            </div>
            <Link to="/donor">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>

        {/* Impact Overview */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <h3 className="text-2xl font-bold text-gray-900">{impactStats.totalPeopleHelped}</h3>
            <p className="text-gray-600">People Helped</p>
          </Card>

          <Card className="p-6 text-center">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-green-500" />
            <h3 className="text-2xl font-bold text-gray-900">{impactStats.communitiesSupported}</h3>
            <p className="text-gray-600">Communities Supported</p>
          </Card>

          <Card className="p-6 text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-purple-500" />
            <h3 className="text-2xl font-bold text-gray-900">{impactStats.disastersSupported}</h3>
            <p className="text-gray-600">Disasters Supported</p>
          </Card>

          <Card className="p-6 text-center">
            <Award className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
            <h3 className="text-2xl font-bold text-gray-900">{impactStats.impactScore}</h3>
            <p className="text-gray-600">Impact Level</p>
          </Card>
        </div>

        {/* Impact Timeline */}
        <Card className="p-6 mb-8">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">Impact Over Time</h2>
          <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-600">Impact chart visualization</p>
              <p className="text-sm text-gray-500">Shows growth in people helped over time</p>
            </div>
          </div>
        </Card>

        {/* Disaster-Specific Impact */}
        <Card className="p-6 mb-8">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">Impact by Disaster</h2>
          <div className="space-y-6">
            {disasters.map((disaster, index) => (
              <div key={index} className="p-6 border rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{disaster.name}</h3>
                    <p className="text-gray-600">{disaster.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">${disaster.donated}</p>
                    <p className="text-sm text-gray-500">donated</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-semibold text-gray-900">{disaster.peopleHelped} people helped</p>
                      <p className="text-sm text-gray-600">Direct beneficiaries</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Heart className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-semibold text-gray-900">Immediate relief</p>
                      <p className="text-sm text-gray-600">Emergency response</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-gray-50">
                  <h4 className="mb-2 font-semibold text-gray-900">Outcome:</h4>
                  <p className="text-gray-700">{disaster.outcome}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recognition and Achievements */}
        <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
          <Card className="p-6">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">Your Achievements</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Award className="w-8 h-8 text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Gold Impact Level</h3>
                  <p className="text-sm text-gray-600">Reached after helping 100+ people</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Heart className="w-8 h-8 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Community Champion</h3>
                  <p className="text-sm text-gray-600">Supported 5+ disaster relief efforts</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Consistent Supporter</h3>
                  <p className="text-sm text-gray-600">Monthly donations for 6+ months</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">Environmental Impact</h2>
            <div className="mb-6 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-green-100 rounded-full">
                <span className="text-2xl font-bold text-green-600">{impactStats.carbonFootprint}</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">Tons CO₂ Offset</p>
              <p className="text-sm text-gray-600">Through sustainable relief efforts</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Solar-powered shelters</span>
                <span className="font-semibold">12 installed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Water purification systems</span>
                <span className="font-semibold">3 deployed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sustainable food programs</span>
                <span className="font-semibold">5 supported</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="p-6 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Continue Making a Difference
            </h2>
            <p className="mb-6 text-gray-600">
              Your contributions have helped 127 people rebuild their lives. 
              Help us reach even more communities in need.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/donor/donate">
                <Button className="w-full sm:w-auto">
                  Make Another Donation
                </Button>
              </Link>
              <Button variant="outline" className="w-full sm:w-auto">
                Share Your Impact
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default DonorImpact
