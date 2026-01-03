import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, DollarSign, Activity, Filter, Search } from 'lucide-react';

const GeographicDistribution = () => {
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [viewMode, setViewMode] = useState('regions'); // regions, countries, cities
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGeographicData();
  }, [viewMode]);

  const loadGeographicData = async () => {
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockData = [
      {
        id: 'asia-pacific',
        name: 'Asia Pacific',
        coordinates: { lat: 35.6762, lng: 139.6503 },
        disasters: 42,
        totalFunds: 2450000,
        beneficiaries: 18500,
        activeVendors: 125,
        avgResponseTime: 4.2,
        countries: [
          { name: 'Japan', disasters: 8, funds: 680000, beneficiaries: 4200 },
          { name: 'Philippines', disasters: 12, funds: 580000, beneficiaries: 5100 },
          { name: 'Indonesia', disasters: 15, funds: 720000, beneficiaries: 6800 },
          { name: 'India', disasters: 7, funds: 470000, beneficiaries: 2400 }
        ]
      },
      {
        id: 'americas',
        name: 'Americas',
        coordinates: { lat: 40.7128, lng: -74.0060 },
        disasters: 38,
        totalFunds: 2100000,
        beneficiaries: 15200,
        activeVendors: 98,
        avgResponseTime: 5.8,
        countries: [
          { name: 'United States', disasters: 18, funds: 980000, beneficiaries: 7200 },
          { name: 'Mexico', disasters: 8, funds: 420000, beneficiaries: 3100 },
          { name: 'Brazil', disasters: 7, funds: 380000, beneficiaries: 2800 },
          { name: 'Colombia', disasters: 5, funds: 320000, beneficiaries: 2100 }
        ]
      },
      {
        id: 'europe',
        name: 'Europe',
        coordinates: { lat: 50.1109, lng: 8.6821 },
        disasters: 28,
        totalFunds: 1650000,
        beneficiaries: 9800,
        activeVendors: 76,
        avgResponseTime: 3.5,
        countries: [
          { name: 'Turkey', disasters: 12, funds: 720000, beneficiaries: 4500 },
          { name: 'Italy', disasters: 6, funds: 380000, beneficiaries: 2100 },
          { name: 'Greece', disasters: 5, funds: 290000, beneficiaries: 1800 },
          { name: 'Spain', disasters: 5, funds: 260000, beneficiaries: 1400 }
        ]
      },
      {
        id: 'africa',
        name: 'Africa',
        coordinates: { lat: -1.2921, lng: 36.8219 },
        disasters: 22,
        totalFunds: 980000,
        beneficiaries: 12400,
        activeVendors: 58,
        avgResponseTime: 8.2,
        countries: [
          { name: 'Kenya', disasters: 6, funds: 280000, beneficiaries: 3200 },
          { name: 'Nigeria', disasters: 8, funds: 320000, beneficiaries: 4100 },
          { name: 'South Africa', disasters: 4, funds: 190000, beneficiaries: 2400 },
          { name: 'Ethiopia', disasters: 4, funds: 190000, beneficiaries: 2700 }
        ]
      }
    ];

    setRegions(mockData);
    setLoading(false);
  };

  const formatCurrency = (amount) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount.toLocaleString()}`;
  };

  const getRegionColor = (disasters) => {
    if (disasters >= 35) return 'bg-red-500';
    if (disasters >= 25) return 'bg-orange-500';
    if (disasters >= 15) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getRegionSize = (funds) => {
    const maxFunds = Math.max(...regions.map(r => r.totalFunds));
    const minSize = 60;
    const maxSize = 120;
    const size = minSize + ((funds / maxFunds) * (maxSize - minSize));
    return `${size}px`;
  };

  const RegionCard = ({ region, isSelected, onClick }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`cursor-pointer rounded-2xl border-2 p-6 transition-all duration-300 ${isSelected
        ? 'border-avalanche-500 bg-avalanche-50 shadow-lg'
        : 'border-gray-200 bg-white hover:border-avalanche-300 hover:shadow-md'
        }`}
    >
      {/* Region Name */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-4 h-4 rounded-full ${getRegionColor(region.disasters)}`}></div>
        <h3 className="text-xl font-bold text-gray-900">{region.name}</h3>
      </div>

      {/* Disaster Count */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <div className="text-4xl font-black text-gray-900">{region.disasters}</div>
        <div className="text-sm font-medium text-gray-500">Active Disasters</div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-lg font-bold text-green-600">{formatCurrency(region.totalFunds)}</div>
          <div className="text-xs text-gray-500">Funds</div>
        </div>
        <div>
          <div className="text-lg font-bold text-blue-600">{(region.beneficiaries / 1000).toFixed(1)}K</div>
          <div className="text-xs text-gray-500">Helped</div>
        </div>
        <div>
          <div className="text-lg font-bold text-orange-600">{region.activeVendors}</div>
          <div className="text-xs text-gray-500">Vendors</div>
        </div>
      </div>
    </motion.div>
  );

  const CountryBreakdown = ({ region }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-0">
          {region.name} - Country Breakdown
        </h3>
        <button
          onClick={() => setSelectedRegion(null)}
          className="self-end sm:self-auto text-gray-500 hover:text-gray-700 text-xl sm:text-2xl leading-none transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {region.countries.map((country, index) => (
          <div key={country.name} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center mb-2 sm:mb-0">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-avalanche-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold mr-3 shadow-sm">
                {index + 1}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">{country.name}</h4>
                <p className="text-xs sm:text-sm text-gray-600">
                  {country.disasters} active disaster{country.disasters !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right ml-9 sm:ml-0">
              <div className="font-bold text-gray-900 text-sm sm:text-base">{formatCurrency(country.funds)}</div>
              <div className="text-xs sm:text-sm text-gray-600">{country.beneficiaries.toLocaleString()} people</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="animate-pulse">
          <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/2 sm:w-1/3 mb-2"></div>
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 sm:w-1/2"></div>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 animate-pulse">
          <div className="h-5 sm:h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-48 sm:h-64 lg:h-80 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 animate-pulse">
              <div className="h-4 sm:h-6 bg-gray-200 rounded mb-3 sm:mb-4 w-3/4"></div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-gray-100 rounded-lg p-2 sm:p-3">
                  <div className="h-3 bg-gray-200 rounded mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="bg-gray-100 rounded-lg p-2 sm:p-3">
                  <div className="h-3 bg-gray-200 rounded mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="bg-gray-100 rounded-lg p-2 sm:p-3">
                  <div className="h-3 bg-gray-200 rounded mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="bg-gray-100 rounded-lg p-2 sm:p-3">
                  <div className="h-3 bg-gray-200 rounded mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Geographic Distribution</h2>
          <p className="text-gray-600">Global relief operations and fund distribution</p>
        </div>
      </div>

      {/* World Map Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Global Activity Map</h3>

        {/* Real World Map with SVG */}
        <div className="relative bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg h-64 sm:h-80 lg:h-96 overflow-hidden">
          <svg
            viewBox="0 0 1000 500"
            className="w-full h-full"
            style={{ background: 'linear-gradient(to bottom, #dbeafe, #bfdbfe)' }}
          >
            {/* World Map SVG Paths - Simplified continents */}

            {/* North America */}
            <path
              d="M150 100 L250 90 L280 120 L300 140 L290 180 L270 200 L240 190 L200 170 L160 150 Z"
              fill="#10b981"
              className="hover:fill-green-600 transition-colors cursor-pointer"
              onClick={() => setSelectedRegion(regions.find(r => r.id === 'americas'))}
            />

            {/* South America */}
            <path
              d="M220 220 L260 210 L280 240 L290 280 L285 320 L270 350 L250 340 L230 300 L225 260 Z"
              fill="#10b981"
              className="hover:fill-green-600 transition-colors cursor-pointer"
              onClick={() => setSelectedRegion(regions.find(r => r.id === 'americas'))}
            />

            {/* Europe */}
            <path
              d="M480 120 L520 110 L550 130 L560 150 L540 170 L500 165 L485 145 Z"
              fill="#f59e0b"
              className="hover:fill-yellow-600 transition-colors cursor-pointer"
              onClick={() => setSelectedRegion(regions.find(r => r.id === 'europe'))}
            />

            {/* Africa */}
            <path
              d="M480 180 L530 175 L550 200 L560 240 L555 280 L540 310 L520 320 L490 315 L475 280 L470 240 L475 200 Z"
              fill="#ef4444"
              className="hover:fill-red-600 transition-colors cursor-pointer"
              onClick={() => setSelectedRegion(regions.find(r => r.id === 'africa'))}
            />

            {/* Asia */}
            <path
              d="M580 100 L700 90 L750 110 L780 140 L790 170 L780 200 L760 220 L720 210 L680 190 L640 160 L600 130 Z"
              fill="#ef4444"
              className="hover:fill-red-600 transition-colors cursor-pointer"
              onClick={() => setSelectedRegion(regions.find(r => r.id === 'asia-pacific'))}
            />

            {/* Australia */}
            <path
              d="M720 280 L780 275 L800 290 L795 310 L775 320 L740 315 L725 300 Z"
              fill="#10b981"
              className="hover:fill-green-600 transition-colors cursor-pointer"
              onClick={() => setSelectedRegion(regions.find(r => r.id === 'asia-pacific'))}
            />

            {/* Interactive Region Markers */}
            {regions.map((region) => {
              const positions = {
                'americas': { x: 220, y: 150 },
                'europe': { x: 520, y: 140 },
                'africa': { x: 515, y: 240 },
                'asia-pacific': { x: 680, y: 150 }
              };

              const pos = positions[region.id];
              if (!pos) return null;

              return (
                <g key={region.id}>
                  {/* Pulsing circle animation */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="20"
                    fill={region.disasters >= 35 ? '#ef4444' : region.disasters >= 25 ? '#f59e0b' : '#10b981'}
                    opacity="0.3"
                    className="animate-pulse"
                  />
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="12"
                    fill={region.disasters >= 35 ? '#ef4444' : region.disasters >= 25 ? '#f59e0b' : '#10b981'}
                    className="cursor-pointer hover:r-16 transition-all"
                    onClick={() => setSelectedRegion(selectedRegion?.id === region.id ? null : region)}
                  />
                  <text
                    x={pos.x}
                    y={pos.y + 4}
                    textAnchor="middle"
                    className="fill-white text-xs font-bold pointer-events-none"
                  >
                    {region.disasters}
                  </text>
                  {/* Region name on hover */}
                  <text
                    x={pos.x}
                    y={pos.y - 25}
                    textAnchor="middle"
                    className="fill-gray-800 text-xs font-medium opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
                  >
                    {region.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Responsive overlay info */}
          <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 sm:p-3 text-xs sm:text-sm">
              <p className="text-gray-700 font-medium mb-1">Click on regions to explore detailed breakdown</p>
              <p className="text-gray-600">Circle size represents funding levels • Color indicates activity level</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-4 lg:gap-6 text-xs sm:text-sm">
          <div className="flex items-center bg-white rounded-full px-2 py-1 shadow-sm">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full mr-1 sm:mr-2"></div>
            <span className="whitespace-nowrap">High Activity (35+ disasters)</span>
          </div>
          <div className="flex items-center bg-white rounded-full px-2 py-1 shadow-sm">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-500 rounded-full mr-1 sm:mr-2"></div>
            <span className="whitespace-nowrap">Medium Activity (25-34)</span>
          </div>
          <div className="flex items-center bg-white rounded-full px-2 py-1 shadow-sm">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-500 rounded-full mr-1 sm:mr-2"></div>
            <span className="whitespace-nowrap">Moderate Activity (15-24)</span>
          </div>
          <div className="flex items-center bg-white rounded-full px-2 py-1 shadow-sm">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full mr-1 sm:mr-2"></div>
            <span className="whitespace-nowrap">Low Activity (0-14)</span>
          </div>
        </div>
      </motion.div>

      {/* Regional Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {regions.map((region) => (
          <RegionCard
            key={region.id}
            region={region}
            isSelected={selectedRegion?.id === region.id}
            onClick={() => setSelectedRegion(selectedRegion?.id === region.id ? null : region)}
          />
        ))}
      </div>

      {/* Country Breakdown */}
      {selectedRegion && <CountryBreakdown region={selectedRegion} />}

      {/* Summary Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6"
      >
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Global Summary</h3>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="text-center bg-white border border-blue-100 shadow-sm rounded-2xl p-5">
            <div className="text-3xl font-black text-blue-600 mb-1">
              {regions.reduce((sum, r) => sum + r.disasters, 0)}
            </div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Disasters</div>
          </div>
          <div className="text-center bg-white border border-green-100 shadow-sm rounded-2xl p-5">
            <div className="text-3xl font-black text-green-600 mb-1">
              {formatCurrency(regions.reduce((sum, r) => sum + r.totalFunds, 0))}
            </div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Funds</div>
          </div>
          <div className="text-center bg-white border border-purple-100 shadow-sm rounded-2xl p-5">
            <div className="text-3xl font-black text-purple-600 mb-1">
              {regions.reduce((sum, r) => sum + r.beneficiaries, 0).toLocaleString()}
            </div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Beneficiaries</div>
          </div>
          <div className="text-center bg-white border border-orange-100 shadow-sm rounded-2xl p-5">
            <div className="text-3xl font-black text-orange-600 mb-1">
              {regions.reduce((sum, r) => sum + r.activeVendors, 0)}
            </div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Vendors</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GeographicDistribution;
