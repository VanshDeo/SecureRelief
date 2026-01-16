import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Calendar, BarChart3 } from 'lucide-react';

const DonationChart = ({ timeRange = '7d' }) => {
  const [currentTimeRange, setCurrentTimeRange] = useState(timeRange);
  const [chartData, setChartData] = useState<any[]>([]);
  const [totalDonations, setTotalDonations] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);
  const [growthRate, setGrowthRate] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateChartData();
  }, [currentTimeRange]);

  const generateChartData = () => {
    setLoading(true);

    // Generate mock data based on time range
    const range = currentTimeRange.toLowerCase();
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const data = [];
    let total = 0;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const baseAmount = Math.random() * 50000 + 10000;
      const amount = Math.floor(baseAmount);
      total += amount;

      data.push({
        date: date.toISOString().split('T')[0],
        amount,
        label: date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        })
      });
    }

    setChartData(data);
    setTotalDonations(total);
    setTotalDonations(total);
    setPercentageChange((Math.random() * 30 - 10)); // Random percentage change
    setGrowthRate(Math.floor(Math.random() * 50 + 20)); // Generate growth rate once
    setLoading(false);
  };

  const maxAmount = Math.max(...chartData.map(d => d.amount));
  const minAmount = Math.min(...chartData.map(d => d.amount));

  const getBarHeight = (amount) => {
    const height = ((amount - minAmount) / (maxAmount - minAmount)) * 200 + 20;
    return `${height}px`;
  };

  const formatCurrency = (amount) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount.toLocaleString()}`;
  };

  const TimeRangeButton = ({ range, label, active, onClick }) => (
    <button
      onClick={() => onClick(range)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${active
        ? 'bg-avalanche-500 text-white shadow-md'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
    >
      {label}
    </button>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      {/* Summary Stats at Top */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
          <div className="text-2xl font-black text-gray-900 mb-0.5">
            {formatCurrency(Math.max(...chartData.map(d => d.amount)))}
          </div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Peak Day</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
          <div className="text-2xl font-black text-gray-900 mb-0.5">
            {formatCurrency(totalDonations / chartData.length)}
          </div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Daily Average</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
          <div className="text-2xl font-black text-gray-900 mb-0.5">
            {chartData.filter(d => d.amount > totalDonations / chartData.length).length}
          </div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Above Average Days</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
          <div className="text-2xl font-black text-avalanche-500 mb-0.5">
            +{growthRate}%
          </div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Growth Rate</div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="p-2 bg-avalanche-100 rounded-lg mr-3">
            <BarChart3 className="h-5 w-5 text-avalanche-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">Donation Analytics</h3>
            <p className="text-xs text-gray-500 font-medium">Trends for last {currentTimeRange}</p>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          {['7D', '30D', '90D'].map((label) => (
            <button
              key={label}
              onClick={() => setCurrentTimeRange(label.toLowerCase())}
              className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${label.toLowerCase() === currentTimeRange.toLowerCase()
                ? 'bg-white text-avalanche-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative pt-8 pb-4">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-8 bottom-4 flex flex-col justify-between text-[10px] font-bold text-gray-400 w-12 pb-6">
          <span>{formatCurrency(maxAmount)}</span>
          <span className="opacity-50 tracking-tighter">—</span>
          <span>{formatCurrency(minAmount)}</span>
        </div>

        {/* Chart area */}
        <div className="ml-12">
          <div className="flex items-end justify-between h-56 border-b-2 border-gray-100 gap-1 px-2">
            {chartData.map((item, index) => (
              <div key={item.date} className="flex flex-col items-center flex-1 group relative">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: getBarHeight(item.amount) }}
                  transition={{ duration: 0.8, delay: index * 0.05 }}
                  className="w-full bg-gradient-to-t from-avalanche-500/80 to-avalanche-400 rounded-t-sm hover:from-avalanche-600 hover:to-avalanche-500 transition-all duration-200 cursor-pointer"
                  style={{ minHeight: '4px' }}
                />
                <div className="absolute bottom-full mb-2 bg-gray-900 text-white text-[10px] rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none whitespace-nowrap">
                  {formatCurrency(item.amount)}
                </div>
              </div>
            ))}
          </div>

          {/* X-axis labels */}
          <div className="flex justify-between mt-3 text-[10px] font-bold text-gray-400 px-1">
            {chartData.filter((_, index) => index % Math.ceil(chartData.length / 4) === 0).map((item) => (
              <span key={item.date}>{item.label}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DonationChart;
