import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  MapPin,
  Activity,
  Eye,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const RealTimeStats = ({ refreshInterval = 5000 }) => {
  const [stats, setStats] = useState({
    totalDonations: 2500000,
    activeDonors: 15847,
    activeDisasters: 23,
    fundsDistributed: 2350000,
    beneficiaries: 45230,
    transactions24h: 1247,
    avgResponseTime: 12,
    systemUptime: 99.8
  });

  const [previousStats, setPreviousStats] = useState(stats);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(fetchRealTimeStats, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const fetchRealTimeStats = async () => {
    try {
      setLoading(true);
      // Simulate real-time data updates
      await new Promise(resolve => setTimeout(resolve, 500));

      setPreviousStats(stats);
      setStats(prev => ({
        totalDonations: prev.totalDonations + Math.floor(Math.random() * 5000),
        activeDonors: prev.activeDonors + Math.floor(Math.random() * 10 - 5),
        activeDisasters: prev.activeDisasters + Math.floor(Math.random() * 3 - 1),
        fundsDistributed: prev.fundsDistributed + Math.floor(Math.random() * 3000),
        beneficiaries: prev.beneficiaries + Math.floor(Math.random() * 20),
        transactions24h: Math.floor(Math.random() * 2000) + 1000,
        avgResponseTime: Math.floor(Math.random() * 20) + 8,
        systemUptime: 99.8 + (Math.random() * 0.2 - 0.1)
      }));
    } catch (error) {
      console.error('Error fetching real-time stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
    return `$${num.toLocaleString()}`;
  };

  const StatCard = ({ icon: Icon, title, value, change, isPositive, format = 'number', suffix = '' }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-300 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon className="h-16 w-16" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="p-2.5 bg-avalanche-50 rounded-xl text-avalanche-600">
          <Icon className="h-5 w-5" />
        </div>
        <div className={`flex items-center text-[10px] font-black px-2 py-0.5 rounded-full ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
          }`}>
          {isPositive ? '+' : '-'}{Math.abs(change).toFixed(1)}%
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</h3>
        <div className="flex items-baseline space-x-1">
          <span className="text-2xl font-black text-gray-900">
            {format === 'currency' ? formatNumber(value) : value.toLocaleString()}{suffix}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-50 flex items-center text-[10px] font-bold text-gray-400">
        <Activity className="h-3 w-3 mr-1 text-avalanche-400" />
        LIVE UPDATING
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Real-Time Analytics</h2>
          <p className="text-gray-600">Live system metrics updated every {refreshInterval / 1000} seconds</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
            {loading ? 'Updating...' : 'Live'}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={DollarSign}
          title="Total Donations"
          value={stats.totalDonations}
          change={calculatePercentageChange(stats.totalDonations, previousStats.totalDonations)}
          isPositive={stats.totalDonations >= previousStats.totalDonations}
          format="currency"
        />

        <StatCard
          icon={Users}
          title="Active Donors"
          value={stats.activeDonors}
          change={calculatePercentageChange(stats.activeDonors, previousStats.activeDonors)}
          isPositive={stats.activeDonors >= previousStats.activeDonors}
        />

        <StatCard
          icon={MapPin}
          title="Active Disasters"
          value={stats.activeDisasters}
          change={calculatePercentageChange(stats.activeDisasters, previousStats.activeDisasters)}
          isPositive={stats.activeDisasters >= previousStats.activeDisasters}
        />

        <StatCard
          icon={TrendingUp}
          title="Funds Distributed"
          value={stats.fundsDistributed}
          change={calculatePercentageChange(stats.fundsDistributed, previousStats.fundsDistributed)}
          isPositive={stats.fundsDistributed >= previousStats.fundsDistributed}
          format="currency"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="Beneficiaries Helped"
          value={stats.beneficiaries}
          change={calculatePercentageChange(stats.beneficiaries, previousStats.beneficiaries)}
          isPositive={stats.beneficiaries >= previousStats.beneficiaries}
        />

        <StatCard
          icon={Activity}
          title="24h Transactions"
          value={stats.transactions24h}
          change={calculatePercentageChange(stats.transactions24h, previousStats.transactions24h)}
          isPositive={stats.transactions24h >= previousStats.transactions24h}
        />

        <StatCard
          icon={Eye}
          title="Avg Response Time"
          value={stats.avgResponseTime}
          change={calculatePercentageChange(stats.avgResponseTime, previousStats.avgResponseTime)}
          isPositive={stats.avgResponseTime <= previousStats.avgResponseTime}
          suffix="s"
        />

        <StatCard
          icon={TrendingUp}
          title="System Uptime"
          value={stats.systemUptime}
          change={calculatePercentageChange(stats.systemUptime, previousStats.systemUptime)}
          isPositive={stats.systemUptime >= previousStats.systemUptime}
          suffix="%"
        />
      </div>

      {/* Live Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Live Activity</h3>
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Real-time updates
          </div>
        </div>

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {[
            { type: 'donation', amount: 500, donor: '0x1234...5678', disaster: 'Turkey Earthquake', time: '2 min ago' },
            { type: 'distribution', amount: 250, vendor: 'Local Food Bank', disaster: 'Flood Relief', time: '5 min ago' },
            { type: 'verification', vendor: 'Medical Supplies Co.', disaster: 'Wildfire Support', time: '8 min ago' },
            { type: 'donation', amount: 1000, donor: '0x9876...4321', disaster: 'Hurricane Relief', time: '12 min ago' },
            { type: 'distribution', amount: 750, vendor: 'Emergency Shelter', disaster: 'Earthquake Aid', time: '15 min ago' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${activity.type === 'donation' ? 'bg-green-500' :
                  activity.type === 'distribution' ? 'bg-blue-500' : 'bg-purple-500'
                }`}></div>
              <div className="flex-1 text-sm">
                {activity.type === 'donation' && (
                  <span>
                    <span className="font-medium">${activity.amount}</span> donated by{' '}
                    <span className="text-gray-600">{activity.donor}</span> to{' '}
                    <span className="font-medium">{activity.disaster}</span>
                  </span>
                )}
                {activity.type === 'distribution' && (
                  <span>
                    <span className="font-medium">${activity.amount}</span> distributed by{' '}
                    <span className="text-gray-600">{activity.vendor}</span> for{' '}
                    <span className="font-medium">{activity.disaster}</span>
                  </span>
                )}
                {activity.type === 'verification' && (
                  <span>
                    Vendor <span className="font-medium">{activity.vendor}</span> verified for{' '}
                    <span className="font-medium">{activity.disaster}</span>
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500">{activity.time}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default RealTimeStats;
