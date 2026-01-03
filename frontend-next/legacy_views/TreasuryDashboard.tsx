import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  BarChart3,
  Shield,
  DollarSign,
  AlertTriangle,
  Settings,
  Download,
  Bell,
  RefreshCw,
  Eye,
  EyeOff,
  Lock,
  Unlock
} from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Modal from '../components/UI/Modal';
import ESGBondManager from '../components/Treasury/ESGBondManager';
import TreasuryAnalytics from '../components/Treasury/TreasuryAnalytics';
import CashFlowManager from '../components/Treasury/CashFlowManager';
import RiskAssessment from '../components/Treasury/RiskAssessment';
import RoleGuard from '../components/Auth/RoleGuard';
import toast from 'react-hot-toast';

const TreasuryDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [treasuryData, setTreasuryData] = useState(null);
  const [showBalances, setShowBalances] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Initialize treasury data
  useEffect(() => {
    setTreasuryData({
      overview: {
        totalAssets: 125750000,
        liquidAssets: 45200000,
        investedAssets: 80550000,
        totalLiabilities: 34200000,
        netWorth: 91550000,
        cashPosition: 28500000,
        monthlyBurn: 3200000,
        runway: 8.9 // months
      },
      alerts: [
        {
          id: 1,
          type: 'warning',
          title: 'Low Cash Reserves',
          message: 'Cash reserves below 3-month threshold',
          priority: 'high',
          timestamp: '2024-08-15T10:30:00Z'
        },
        {
          id: 2,
          type: 'info',
          title: 'Bond Maturity',
          message: 'Emergency Response Bond maturing in 30 days',
          priority: 'medium',
          timestamp: '2024-08-15T09:15:00Z'
        },
        {
          id: 3,
          type: 'success',
          title: 'Investment Performance',
          message: 'Climate bonds yielding above target',
          priority: 'low',
          timestamp: '2024-08-15T08:45:00Z'
        }
      ],
      performance: {
        monthlyReturn: 2.3,
        quarterlyReturn: 7.8,
        yearlyReturn: 12.4,
        volatility: 8.2,
        sharpeRatio: 1.52,
        maxDrawdown: -4.1
      },
      allocations: {
        bonds: 45,
        cash: 25,
        realEstate: 15,
        equity: 10,
        alternatives: 5
      },
      recentTransactions: [
        {
          id: 'TXN-001',
          type: 'bond_purchase',
          amount: 5000000,
          description: 'Climate Resilience Bond Series A',
          date: '2024-08-14',
          status: 'completed'
        },
        {
          id: 'TXN-002',
          type: 'disbursement',
          amount: -2500000,
          description: 'Hurricane Relief Fund Distribution',
          date: '2024-08-13',
          status: 'completed'
        },
        {
          id: 'TXN-003',
          type: 'deposit',
          amount: 8000000,
          description: 'Treasury Bond Proceeds',
          date: '2024-08-12',
          status: 'completed'
        }
      ]
    });

    setNotifications([
      { id: 1, message: 'Monthly treasury report ready', read: false },
      { id: 2, message: 'ESG compliance score updated', read: false },
      { id: 3, message: 'New investment opportunity', read: true }
    ]);
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'cashflow', label: 'Cash Flow', icon: TrendingUp },
    { id: 'bonds', label: 'ESG Bonds', icon: Shield },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'risk', label: 'Risk Assessment', icon: AlertTriangle }
  ];

  const refreshData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Treasury data refreshed');
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    toast.success('Treasury report exported');
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'success':
        return <Shield className="w-4 h-4 text-green-500" />;
      default:
        return <Bell className="w-4 h-4 text-blue-500" />;
    }
  };

  const formatCurrency = (amount) => {
    if (!showBalances) return '••••••••';
    if (Math.abs(amount) >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${amount.toLocaleString()}`;
  };

  if (!treasuryData) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Assets</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(treasuryData.overview.totalAssets)}
              </p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{treasuryData.performance.monthlyReturn}% this month
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Wallet className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Net Worth</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(treasuryData.overview.netWorth)}
              </p>
              <p className="text-sm text-blue-600">
                Assets minus liabilities
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cash Runway</p>
              <p className="text-2xl font-bold text-gray-900">
                {treasuryData.overview.runway} months
              </p>
              <p className="text-sm text-orange-600">
                Based on current burn rate
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Asset Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Allocation</h3>
          <div className="space-y-3">
            {Object.entries(treasuryData.allocations).map(([asset, percentage]) => (
              <div key={asset} className="flex items-center">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {asset.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-gray-600">{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {treasuryData.performance.yearlyReturn}%
              </p>
              <p className="text-sm text-gray-600">Annual Return</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {treasuryData.performance.sharpeRatio}
              </p>
              <p className="text-sm text-gray-600">Sharpe Ratio</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {treasuryData.performance.volatility}%
              </p>
              <p className="text-sm text-gray-600">Volatility</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">
                {treasuryData.performance.maxDrawdown}%
              </p>
              <p className="text-sm text-gray-600">Max Drawdown</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Alerts</h3>
          <div className="space-y-3">
            {treasuryData.alerts.map(alert => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
                  <p className="text-sm text-gray-600">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(alert.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                  alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {alert.priority}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {treasuryData.recentTransactions.map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{transaction.description}</h4>
                  <p className="text-sm text-gray-600">{transaction.date}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                  </p>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <RoleGuard permissions={['treasury:view', 'treasury:manage']} fallback={
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to access treasury management.</p>
      </div>
    }>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Treasury Management</h1>
              <p className="text-gray-600">Comprehensive financial oversight and asset management</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setShowBalances(!showBalances)}
                variant="outline"
                size="sm"
              >
                {showBalances ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
              
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="relative"
                >
                  <Bell className="w-4 h-4" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </Button>
              </div>
              
              <Button
                onClick={refreshData}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                {loading ? <LoadingSpinner size="sm" /> : <RefreshCw className="w-4 h-4" />}
              </Button>
              
              <Button onClick={exportReport} size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              
              <Button
                onClick={() => setShowSettings(true)}
                variant="outline"
                size="sm"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    activeTab === tab.id
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
              {activeTab === 'cashflow' && <CashFlowManager />}
              {activeTab === 'bonds' && <ESGBondManager />}
              {activeTab === 'analytics' && <TreasuryAnalytics />}
              {activeTab === 'risk' && <RiskAssessment />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Settings Modal */}
        <Modal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          title="Treasury Settings"
          size="md"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Show Balance Details</h4>
                <p className="text-sm text-gray-600">Display actual monetary values</p>
              </div>
              <button
                onClick={() => setShowBalances(!showBalances)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  showBalances ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    showBalances ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Real-time Updates</h4>
                <p className="text-sm text-gray-600">Auto-refresh treasury data</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Email Alerts</h4>
                <p className="text-sm text-gray-600">Receive treasury notifications</p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
              </button>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowSettings(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowSettings(false)}>
              Save Settings
            </Button>
          </div>
        </Modal>
      </div>
    </RoleGuard>
  );
};

export default TreasuryDashboard;
