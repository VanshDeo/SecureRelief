import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calculator
} from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';
import toast from 'react-hot-toast';

const TreasuryAnalytics = ({ className = '' }) => {
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('12M');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [analyticsData, setAnalyticsData] = useState(null);

  // Mock analytics data
  useEffect(() => {
    setAnalyticsData({
      overview: {
        totalRevenue: 45750000,
        totalExpenses: 38200000,
        netIncome: 7550000,
        cashFlow: 12300000,
        assetValue: 125000000,
        liabilityValue: 45000000,
        equity: 80000000,
        burnRate: 3200000,
        runway: 25 // months
      },
      bonds: {
        totalIssued: 26000000,
        totalOutstanding: 18500000,
        averageYield: 4.7,
        totalHolders: 493,
        maturityProfile: [
          { year: '2024', amount: 2500000 },
          { year: '2025', amount: 4200000 },
          { year: '2026', amount: 3800000 },
          { year: '2027', amount: 5000000 },
          { year: '2028', amount: 3000000 }
        ]
      },
      performance: {
        revenueGrowth: 23.5,
        expenseRatio: 0.83,
        returnOnAssets: 6.0,
        returnOnEquity: 9.4,
        debtToEquity: 0.56,
        currentRatio: 2.3,
        quickRatio: 1.8,
        interestCoverage: 4.2
      },
      riskMetrics: {
        creditRating: 'AA-',
        defaultProbability: 0.3,
        volatilityIndex: 12.5,
        liquidityRatio: 1.9,
        concentrationRisk: 'Low',
        geographicRisk: 'Medium',
        sectorRisk: 'Low'
      },
      trends: {
        revenue: [
          { month: 'Jan', value: 3200000 },
          { month: 'Feb', value: 3450000 },
          { month: 'Mar', value: 3800000 },
          { month: 'Apr', value: 3650000 },
          { month: 'May', value: 4100000 },
          { month: 'Jun', value: 4350000 },
          { month: 'Jul', value: 4200000 },
          { month: 'Aug', value: 4600000 },
          { month: 'Sep', value: 4800000 },
          { month: 'Oct', value: 4450000 },
          { month: 'Nov', value: 4700000 },
          { month: 'Dec', value: 5000000 }
        ],
        expenses: [
          { month: 'Jan', value: 2800000 },
          { month: 'Feb', value: 2950000 },
          { month: 'Mar', value: 3100000 },
          { month: 'Apr', value: 3200000 },
          { month: 'May', value: 3350000 },
          { month: 'Jun', value: 3400000 },
          { month: 'Jul', value: 3250000 },
          { month: 'Aug', value: 3500000 },
          { month: 'Sep', value: 3600000 },
          { month: 'Oct', value: 3450000 },
          { month: 'Nov', value: 3700000 },
          { month: 'Dec', value: 3850000 }
        ]
      },
      allocation: {
        assetTypes: [
          { name: 'Bonds', value: 45, amount: 56250000 },
          { name: 'Cash & Equivalents', value: 25, amount: 31250000 },
          { name: 'Real Estate', value: 15, amount: 18750000 },
          { name: 'Equity Investments', value: 10, amount: 12500000 },
          { name: 'Other Assets', value: 5, amount: 6250000 }
        ],
        sectors: [
          { name: 'Disaster Relief', value: 40, amount: 50000000 },
          { name: 'Climate Adaptation', value: 30, amount: 37500000 },
          { name: 'Emergency Preparedness', value: 20, amount: 25000000 },
          { name: 'Infrastructure', value: 10, amount: 12500000 }
        ]
      }
    });
  }, [timeRange]);

  const refreshData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Analytics data refreshed');
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    toast.success('Financial report exported to PDF');
  };

  const getPerformanceColor = (value, threshold) => {
    if (value >= threshold) return 'text-green-600';
    if (value >= threshold * 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskColor = (level) => {
    switch (level.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!analyticsData) {
    return (
      <div className={`${className} flex items-center justify-center h-64`}>
        <LoadingSpinner aria-label="Loading analytics" />
      </div>
    );
  }

  return (
    <div className={className}>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
              Treasury Analytics
            </h3>
            <p className="text-sm text-gray-600">Comprehensive financial performance and risk metrics</p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="3M">3 Months</option>
              <option value="6M">6 Months</option>
              <option value="12M">12 Months</option>
              <option value="2Y">2 Years</option>
            </select>

            <Button
              onClick={refreshData}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="sm" aria-label="Refreshing data" /> : <RefreshCw className="w-4 h-4" />}
            </Button>

            <Button onClick={exportReport} size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Total Revenue</p>
                <p className="text-xl font-bold text-blue-900">
                  ${(analyticsData.overview.totalRevenue / 1000000).toFixed(1)}M
                </p>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{analyticsData.performance.revenueGrowth}%
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Net Income</p>
                <p className="text-xl font-bold text-green-900">
                  ${(analyticsData.overview.netIncome / 1000000).toFixed(1)}M
                </p>
                <p className="text-xs text-gray-600">
                  Margin: {((analyticsData.overview.netIncome / analyticsData.overview.totalRevenue) * 100).toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Asset Value</p>
                <p className="text-xl font-bold text-purple-900">
                  ${(analyticsData.overview.assetValue / 1000000).toFixed(0)}M
                </p>
                <p className="text-xs text-gray-600">
                  ROA: {analyticsData.performance.returnOnAssets}%
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600">Cash Runway</p>
                <p className="text-xl font-bold text-yellow-900">
                  {analyticsData.overview.runway} mo
                </p>
                <p className="text-xs text-gray-600">
                  Burn: ${(analyticsData.overview.burnRate / 1000000).toFixed(1)}M/mo
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-4">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="w-4 h-4 mr-2 text-green-500" />
              Key Performance Indicators
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Return on Equity</span>
                <span className={`font-semibold ${getPerformanceColor(analyticsData.performance.returnOnEquity, 8)}`}>
                  {analyticsData.performance.returnOnEquity}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Return on Assets</span>
                <span className={`font-semibold ${getPerformanceColor(analyticsData.performance.returnOnAssets, 5)}`}>
                  {analyticsData.performance.returnOnAssets}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current Ratio</span>
                <span className={`font-semibold ${getPerformanceColor(analyticsData.performance.currentRatio, 2)}`}>
                  {analyticsData.performance.currentRatio}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Debt-to-Equity</span>
                <span className={`font-semibold ${analyticsData.performance.debtToEquity < 1 ? 'text-green-600' : 'text-red-600'}`}>
                  {analyticsData.performance.debtToEquity}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Interest Coverage</span>
                <span className={`font-semibold ${getPerformanceColor(analyticsData.performance.interestCoverage, 3)}`}>
                  {analyticsData.performance.interestCoverage}x
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-orange-500" />
              Risk Assessment
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Credit Rating</span>
                <span className="font-semibold text-blue-600">
                  {analyticsData.riskMetrics.creditRating}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Default Probability</span>
                <span className="font-semibold text-green-600">
                  {analyticsData.riskMetrics.defaultProbability}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Concentration Risk</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(analyticsData.riskMetrics.concentrationRisk)}`}>
                  {analyticsData.riskMetrics.concentrationRisk}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Geographic Risk</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(analyticsData.riskMetrics.geographicRisk)}`}>
                  {analyticsData.riskMetrics.geographicRisk}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Volatility Index</span>
                <span className="font-semibold text-blue-600">
                  {analyticsData.riskMetrics.volatilityIndex}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Bond Portfolio Analysis */}
        <Card className="p-4 mb-8">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <LineChart className="w-4 h-4 mr-2 text-purple-500" />
            Bond Portfolio Analysis
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                ${(analyticsData.bonds.totalOutstanding / 1000000).toFixed(1)}M
              </p>
              <p className="text-sm text-gray-600">Outstanding Bonds</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {analyticsData.bonds.averageYield}%
              </p>
              <p className="text-sm text-gray-600">Average Yield</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {analyticsData.bonds.totalHolders}
              </p>
              <p className="text-sm text-gray-600">Total Holders</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {((analyticsData.bonds.totalOutstanding / analyticsData.bonds.totalIssued) * 100).toFixed(0)}%
              </p>
              <p className="text-sm text-gray-600">Utilization</p>
            </div>
          </div>

          {/* Maturity Profile */}
          <div className="mt-6">
            <h5 className="font-medium text-gray-900 mb-3">Maturity Profile</h5>
            <div className="space-y-2">
              {analyticsData.bonds.maturityProfile.map((item, index) => (
                <div key={index} className="flex items-center">
                  <span className="w-12 text-sm text-gray-600">{item.year}</span>
                  <div className="flex-1 mx-3">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${(item.amount / 5000000) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    ${(item.amount / 1000000).toFixed(1)}M
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Asset Allocation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <PieChart className="w-4 h-4 mr-2 text-indigo-500" />
              Asset Allocation
            </h4>
            <div className="space-y-3">
              {analyticsData.allocation.assetTypes.map((asset, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{asset.name}</span>
                      <span className="text-sm text-gray-600">{asset.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${asset.value}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      ${(asset.amount / 1000000).toFixed(1)}M
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-4 h-4 mr-2 text-emerald-500" />
              Sector Allocation
            </h4>
            <div className="space-y-3">
              {analyticsData.allocation.sectors.map((sector, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{sector.name}</span>
                      <span className="text-sm text-gray-600">{sector.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${sector.value}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      ${(sector.amount / 1000000).toFixed(1)}M
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Financial Health Score */}
        <Card className="p-4 mt-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Calculator className="w-4 h-4 mr-2 text-blue-500" />
            Financial Health Score
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-3">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-300"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-blue-600"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray="85, 100"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">85</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900">Liquidity Score</p>
              <p className="text-xs text-gray-600">Excellent</p>
            </div>

            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-3">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-300"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-green-600"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray="78, 100"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-green-600">78</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900">Solvency Score</p>
              <p className="text-xs text-gray-600">Good</p>
            </div>

            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-3">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-300"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-purple-600"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray="92, 100"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-purple-600">92</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900">Efficiency Score</p>
              <p className="text-xs text-gray-600">Outstanding</p>
            </div>
          </div>
        </Card>
      </Card>
    </div>
  );
};

export default TreasuryAnalytics;
