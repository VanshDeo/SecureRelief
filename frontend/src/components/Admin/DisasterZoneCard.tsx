import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  MapPin,
  DollarSign,
  Users,
  Activity,
  TrendingUp,
  Calendar,
  Settings,
  Eye,
  Pause,
  Play,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import Card from '../UI/Card'
import Button from '../UI/Button'
import { useContract } from '../../hooks/useContract'

const DisasterZoneCard = ({ zone, onEdit, onViewDetails }) => {
  const [stats, setStats] = useState({
    totalFunding: zone.funding || 0,
    currentFunding: zone.funding || 0,
    totalSpent: 0,
    vendorCount: 0,
    voucherCount: 0,
    beneficiariesHelped: 0
  })

  const [loading, setLoading] = useState(false)
  const { getDisasterZoneStats } = useContract()

  useEffect(() => {
    const loadStats = async () => {
      if (zone.id) {
        setLoading(true)
        try {
          const zoneStats = await getDisasterZoneStats(zone.id)
          if (zoneStats) {
            setStats({
              totalFunding: zoneStats.initialFunding || 0,
              currentFunding: zoneStats.currentFunding || 0,
              totalSpent: zoneStats.totalSpent || 0,
              vendorCount: zoneStats.vendorCount || 0,
              voucherCount: 0, // This would come from voucher queries
              beneficiariesHelped: 0 // This would be calculated
            })
          }
        } catch (error) {
          console.error('Error loading zone stats:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    loadStats()
  }, [zone.id, getDisasterZoneStats])

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'emergency': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const fundingPercentage = stats.totalFunding > 0
    ? ((stats.totalFunding - stats.currentFunding) / stats.totalFunding) * 100
    : 0

  return (
    <Card hover className="overflow-hidden border border-gray-100 shadow-sm bg-white rounded-2xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 border-b border-gray-50 pb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-black text-gray-900 truncate tracking-tight">
                {zone.name}
              </h3>
            </div>

            <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <MapPin className="w-3 h-3 mr-1 text-avalanche-400" />
              <span className="truncate">{zone.location || 'Co-ordinates set'}</span>
            </div>
          </div>
          <div className="ml-4">
            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm ${getStatusColor(zone.status)}`}>
              {zone.status}
            </span>
          </div>
        </div>

        {/* Stats Grid - Premium Layout */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center">
              <DollarSign className="w-3 h-3 mr-1 text-green-500" />
              Available
            </div>
            <div className="text-base font-black text-gray-900">{formatCurrency(stats.currentFunding)}</div>
          </div>

          <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center">
              <Users className="w-3 h-3 mr-1 text-blue-500" />
              Vendors
            </div>
            <div className="text-base font-black text-gray-900">{stats.vendorCount}</div>
          </div>

          <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center">
              <Activity className="w-3 h-3 mr-1 text-orange-500" />
              Activity
            </div>
            <div className="text-base font-black text-gray-900">{stats.voucherCount}</div>
          </div>

          <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1 text-purple-500" />
              Utilized
            </div>
            <div className="text-base font-black text-gray-900">{fundingPercentage.toFixed(0)}%</div>
          </div>
        </div>

        {/* Funding Progress Bar */}
        <div className="mb-6 bg-gray-50 p-3 rounded-xl border border-gray-100">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-400">
            <span>Funding Utilization</span>
            <span className="text-gray-900">{fundingPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${fundingPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-avalanche-500 h-full rounded-full"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails?.(zone)}
            className="flex-1 border-gray-200 text-gray-700 font-bold text-[10px] uppercase tracking-widest h-10"
          >
            Details
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit?.(zone)}
            className="border-gray-200 text-gray-700 font-bold text-[10px] uppercase tracking-widest h-10 w-10 px-0 flex items-center justify-center"
          >
            <Settings className="w-4 h-4" />
          </Button>

          {zone.status === 'active' ? (
            <Button
              variant="outline"
              size="sm"
              className="bg-red-50 border-red-100 text-red-600 font-bold text-[10px] uppercase tracking-widest h-10 px-4"
            >
              Pause
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="bg-green-50 border-green-100 text-green-600 font-bold text-[10px] uppercase tracking-widest h-10 px-4"
            >
              Start
            </Button>
          )}
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
            <div className="w-6 h-6 border-2 border-avalanche-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </Card>
  )
}

export default DisasterZoneCard
