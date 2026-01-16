import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  AlertTriangle,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  RefreshCw,
  Filter,
  Eye,
  PieChart,
  Activity,
  Clock,
  Target,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';
import Modal from '../UI/Modal';
import toast from 'react-hot-toast';

const CashFlowManager = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [showForecast, setShowForecast] = useState(false);
  const [cashFlowData, setCashFlowData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Initialize cash flow data
  useEffect(() => {
    setCashFlowData({
      summary: {
        currentCash: 28500000,
        monthlyInflow: 12500000,
        monthlyOutflow: 9200000,
        netCashFlow: 3300000,
        burnRate: 3200000,
        runway: 8.9, // months
        liquidityRatio: 2.35,
        operatingCashFlow: 2800000
      },
      trends: {
        cashGrowth: 12.5,
        inflowGrowth: 8.2,
        outflowGrowth: 3.1,
        efficiencyScore: 87
      },
      forecast: {
        nextMonth: {
          inflow: 13200000,
          outflow: 9800000,
          netFlow: 3400000,
          confidence: 92
        },
        nextQuarter: {
          inflow: 39600000,
          outflow: 28800000,
          netFlow: 10800000,
          confidence: 85
        },
        projectedCash: [
          { month: 'Jan', amount: 28500000 },
          { month: 'Feb', amount: 31900000 },
          { month: 'Mar', amount: 35300000 },
          { month: 'Apr', amount: 38100000 },
          { month: 'May', amount: 41200000 },
          { month: 'Jun', amount: 44600000 }
        ]
      },
      categories: {
        inflows: [
          { name: 'Treasury Bonds', amount: 8000000, percentage: 64, growth: 5.2 },
          { name: 'ESG Investments', amount: 3200000, percentage: 25.6, growth: 12.8 },
          { name: 'Disaster Donations', amount: 1000000, percentage: 8, growth: -2.1 },
          { name: 'Interest Income', amount: 300000, percentage: 2.4, growth: 8.5 }
        ],
        outflows: [
          { name: 'Relief Disbursements', amount: 4500000, percentage: 48.9, growth: 2.3 },
          { name: 'Operations', amount: 2200000, percentage: 23.9, growth: 1.8 },
          { name: 'Infrastructure', amount: 1500000, percentage: 16.3, growth: 5.7 },
          { name: 'Administrative', amount: 1000000, percentage: 10.9, growth: -1.2 }
        ]
      },
      recentTransactions: [
        {
          id: 'CF-001',
          type: 'inflow',
          category: 'Treasury Bonds',
          amount: 5000000,
          description: 'Emergency Response Bond Proceeds',
          date: '2024-08-14T10:30:00Z',
          status: 'completed',
          reference: 'TRB-2024-081401'
        },
        {
          id: 'CF-002',
          type: 'outflow',
          category: 'Relief Disbursements',
          amount: -2500000,
          description: 'Hurricane Relief Fund Distribution',
          date: '2024-08-13T15:45:00Z',
          status: 'completed',
          reference: 'HRF-2024-081301'
        },
        {
          id: 'CF-003',
          type: 'inflow',
          category: 'ESG Investments',
          amount: 1800000,
          description: 'Climate Resilience Bond Returns',
          date: '2024-08-12T09:20:00Z',
          status: 'completed',
          reference: 'CRB-2024-081201'
        },
        {
          id: 'CF-004',
          type: 'outflow',
          category: 'Operations',
          amount: -850000,
          description: 'Monthly Operations Expense',
          date: '2024-08-11T14:10:00Z',
          status: 'completed',
          reference: 'OPS-2024-081101'
        },
        {
          id: 'CF-005',
          type: 'outflow',
          category: 'Infrastructure',
          amount: -1200000,
          description: 'Technology Infrastructure Upgrade',
          date: '2024-08-10T11:30:00Z',
          status: 'pending',
          reference: 'TECH-2024-081001'
        }
      ],
      alerts: [
        {
          id: 1,
          type: 'warning',
          title: 'Burn Rate Increase',
          message: 'Monthly burn rate increased by 8% compared to last month',
          priority: 'medium',
          timestamp: '2024-08-14T10:30:00Z'
        },
        {
          id: 2,
          type: 'info',
          title: 'Large Inflow Expected',
          message: 'ESG bond maturity will add $5M to cash position next week',
          priority: 'low',
          timestamp: '2024-08-14T09:15:00Z'
        },
        {
          id: 3,
          type: 'success',
          title: 'Liquidity Target Met',
          message: 'Current liquidity ratio exceeds target threshold',
          priority: 'low',
          timestamp: '2024-08-14T08:45:00Z'
        }
      ]
    });
  }, []);

  const refreshData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Cash flow data refreshed');
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  const exportCashFlow = () => {
    toast.success('Cash flow report exported');
  };

  const formatCurrency = (amount) => {
    if (Math.abs(amount) >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTransactionIcon = (type) => {
    return type === 'inflow' ?
      <ArrowUpRight className="w-4 h-4 text-green-500" /> :
      <ArrowDownRight className="w-4 h-4 text-red-500" />;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      failed: { color: 'bg-red-100 text-red-800', label: 'Failed' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'flows', label: 'Cash Flows', icon: Activity },
    { id: 'forecast', label: 'Forecast', icon: TrendingUp },
    { id: 'analysis', label: 'Analysis', icon: PieChart }
  ];

  if (!cashFlowData) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner aria-label="Loading cash flow data" />
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Cash</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(cashFlowData.summary.currentCash)}
              </p>
              <p className="flex items-center mt-1 text-sm text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{cashFlowData.trends.cashGrowth}%
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Net Cash Flow</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(cashFlowData.summary.netCashFlow)}
              </p>
              <p className="text-sm text-blue-600">This month</p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Burn Rate</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(cashFlowData.summary.burnRate)}
              </p>
              <p className="text-sm text-orange-600">Per month</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-full">
              <TrendingDown className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cash Runway</p>
              <p className="text-xl font-bold text-gray-900">
                {cashFlowData.summary.runway} months
              </p>
              <p className="text-sm text-purple-600">At current rate</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-full">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Cash Flow Categories */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
            <ArrowUpRight className="w-5 h-5 mr-2 text-green-500" />
            Cash Inflows
          </h3>
          <div className="space-y-4">
            {cashFlowData.categories.inflows.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    <span className="text-sm text-gray-600">{formatCurrency(category.amount)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 transition-all duration-300 bg-green-500 rounded-full"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                    <span className={`text-xs ${category.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {category.growth > 0 ? '+' : ''}{category.growth}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
            <ArrowDownRight className="w-5 h-5 mr-2 text-red-500" />
            Cash Outflows
          </h3>
          <div className="space-y-4">
            {cashFlowData.categories.outflows.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    <span className="text-sm text-gray-600">{formatCurrency(category.amount)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 transition-all duration-300 bg-red-500 rounded-full"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                    <span className={`text-xs ${category.growth > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {category.growth > 0 ? '+' : ''}{category.growth}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Alerts */}
      <Card className="p-6">
        <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
          <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
          Cash Flow Alerts
        </h3>
        <div className="space-y-3">
          {cashFlowData.alerts.map(alert => (
            <div key={alert.id} className="flex items-start p-3 space-x-3 border border-gray-200 rounded-lg">
              <div className={`p-1 rounded-full ${alert.type === 'warning' ? 'bg-yellow-100' :
                alert.type === 'success' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                {alert.type === 'warning' ?
                  <AlertTriangle className="w-3 h-3 text-yellow-600" /> :
                  alert.type === 'success' ?
                    <CheckCircle className="w-3 h-3 text-green-600" /> :
                    <Activity className="w-3 h-3 text-blue-600" />
                }
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
                <p className="text-sm text-gray-600">{alert.message}</p>
                <p className="mt-1 text-xs text-gray-500">{formatDate(alert.timestamp)}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                {alert.priority}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderCashFlows = () => (
    <div className="space-y-6">
      {/* Recent Transactions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Cash Flows</h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" onClick={exportCashFlow}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {cashFlowData.recentTransactions.map(transaction => (
            <div key={transaction.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
              onClick={() => {
                setSelectedTransaction(transaction);
                setShowDetails(true);
              }}>
              <div className="flex items-center space-x-3">
                {getTransactionIcon(transaction.type)}
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{transaction.description}</h4>
                  <p className="text-sm text-gray-600">{transaction.category}</p>
                  <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                  {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                </p>
                {getStatusBadge(transaction.status)}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderForecast = () => (
    <div className="space-y-6">
      {/* Forecast Summary */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Next Month Forecast</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Expected Inflow</span>
              <span className="font-medium text-green-600">
                {formatCurrency(cashFlowData.forecast.nextMonth.inflow)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Expected Outflow</span>
              <span className="font-medium text-red-600">
                {formatCurrency(cashFlowData.forecast.nextMonth.outflow)}
              </span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <span className="font-medium text-gray-900">Net Cash Flow</span>
              <span className="font-bold text-blue-600">
                {formatCurrency(cashFlowData.forecast.nextMonth.netFlow)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Confidence Level</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: `${cashFlowData.forecast.nextMonth.confidence}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{cashFlowData.forecast.nextMonth.confidence}%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Quarterly Outlook</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Q3 Total Inflow</span>
              <span className="font-medium text-green-600">
                {formatCurrency(cashFlowData.forecast.nextQuarter.inflow)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Q3 Total Outflow</span>
              <span className="font-medium text-red-600">
                {formatCurrency(cashFlowData.forecast.nextQuarter.outflow)}
              </span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <span className="font-medium text-gray-900">Net Quarter Flow</span>
              <span className="font-bold text-blue-600">
                {formatCurrency(cashFlowData.forecast.nextQuarter.netFlow)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Confidence Level</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: `${cashFlowData.forecast.nextQuarter.confidence}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{cashFlowData.forecast.nextQuarter.confidence}%</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Cash Projection Chart */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">6-Month Cash Projection</h3>
        <div className="flex items-end justify-between h-64 space-x-2">
          {cashFlowData.forecast.projectedCash.map((data, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="relative w-full bg-gray-200 rounded-t-lg">
                <div
                  className="flex items-end justify-center transition-all duration-500 bg-blue-500 rounded-t-lg"
                  style={{ height: `${(data.amount / 50000000) * 200}px` }}
                >
                  <span className="pb-2 text-xs font-medium text-white">
                    {formatCurrency(data.amount)}
                  </span>
                </div>
              </div>
              <span className="mt-2 text-sm text-gray-600">{data.month}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderAnalysis = () => (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {cashFlowData.trends.efficiencyScore}%
          </div>
          <div className="text-sm text-gray-600">Cash Efficiency</div>
          <div className="mt-1 text-xs text-green-600">+3.2% vs last month</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {cashFlowData.summary.liquidityRatio}
          </div>
          <div className="text-sm text-gray-600">Liquidity Ratio</div>
          <div className="mt-1 text-xs text-green-600">Above target (2.0)</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {cashFlowData.trends.inflowGrowth}%
          </div>
          <div className="text-sm text-gray-600">Inflow Growth</div>
          <div className="mt-1 text-xs text-purple-600">Month-over-month</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {cashFlowData.trends.outflowGrowth}%
          </div>
          <div className="text-sm text-gray-600">Outflow Growth</div>
          <div className="mt-1 text-xs text-orange-600">Controlled increase</div>
        </Card>
      </div>

      {/* Analysis Insights */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Cash Flow Analysis</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h4 className="mb-3 font-medium text-gray-900">Strengths</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">Strong liquidity position above target</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">Diversified revenue streams</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">Positive operating cash flow</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">ESG investments showing strong returns</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-medium text-gray-900">Areas for Improvement</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-700">Increasing burn rate needs monitoring</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-700">Disaster donations declining</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-700">Infrastructure costs growing faster than revenue</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Cash Flow Management</h2>
          <p className="text-gray-600">Monitor and analyze cash flow patterns and liquidity</p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>

          <Button
            onClick={refreshData}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="sm" aria-label="Loading" /> : <RefreshCw className="w-4 h-4" />}
          </Button>

          <Button onClick={() => setShowForecast(true)} size="sm">
            <Eye className="w-4 h-4 mr-2" />
            View Forecast
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex p-1 space-x-1 bg-gray-100 rounded-lg">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'flows' && renderCashFlows()}
          {activeTab === 'forecast' && renderForecast()}
          {activeTab === 'analysis' && renderAnalysis()}
        </motion.div>
      </AnimatePresence>

      {/* Transaction Details Modal */}
      <Modal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title="Transaction Details"
        size="md"
      >
        {selectedTransaction && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Transaction ID</span>
              <span className="font-medium">{selectedTransaction.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Reference</span>
              <span className="font-medium">{selectedTransaction.reference}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Type</span>
              <span className="font-medium capitalize">{selectedTransaction.type}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Category</span>
              <span className="font-medium">{selectedTransaction.category}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Amount</span>
              <span className={`font-bold ${selectedTransaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                {selectedTransaction.amount > 0 ? '+' : ''}
                {formatCurrency(selectedTransaction.amount)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Date</span>
              <span className="font-medium">{formatDate(selectedTransaction.date)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status</span>
              {getStatusBadge(selectedTransaction.status)}
            </div>
            <div className="pt-4 border-t">
              <span className="text-sm text-gray-600">Description</span>
              <p className="mt-1 font-medium">{selectedTransaction.description}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Forecast Modal */}
      <Modal
        isOpen={showForecast}
        onClose={() => setShowForecast(false)}
        title="Advanced Cash Flow Forecast"
        size="lg"
      >
        <div className="space-y-6">
          {renderForecast()}
        </div>
      </Modal>
    </div>
  );
};

export default CashFlowManager;
