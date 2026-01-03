import React from 'react'
import { useParams } from 'react-router-dom'
import { MapPin, Calendar, TrendingUp } from 'lucide-react'

const DisasterDetails = () => {
  const { id } = useParams()

  return (
    <div className="min-h-screen">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <MapPin className="w-16 h-16 mx-auto mb-4 text-avalanche-500" />
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            Disaster Details
          </h1>
          <p className="mb-8 text-gray-600">
            Detailed information for disaster relief operation #{id}
          </p>
          
          <div className="grid max-w-4xl grid-cols-1 gap-6 mx-auto md:grid-cols-2 lg:grid-cols-3">
            <div className="text-center card">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-blue-500" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Timeline
              </h3>
              <p className="text-gray-600">
                Disaster timeline and key milestones
              </p>
            </div>
            
            <div className="text-center card">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Progress
              </h3>
              <p className="text-gray-600">
                Funding progress and distribution status
              </p>
            </div>
            
            <div className="text-center card">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-purple-500" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Impact Map
              </h3>
              <p className="text-gray-600">
                Geographic distribution of aid and support
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DisasterDetails
