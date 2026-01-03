import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Eye,
  Zap,
  Clock,
  Shield,
  BarChart3,
  Search,
  Settings,
  Wifi,
  WifiOff,
  Bell,
  Filter,
  Download,
  Upload,
  Activity
} from 'lucide-react';
import RoleGuard from '../components/Auth/RoleGuard';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

const OracleDashboard = () => {
  const [activeTab, setActiveTab] = useState('verification');
  const [loading, setLoading] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [verificationQueue, setVerificationQueue] = useState([]);
  const [priceFeeds, setPriceFeeds] = useState([]);
  const [dataSources, setDataSources] = useState([]);
  const [oracleStats, setOracleStats] = useState({});
  
  // Price update state
  const [priceUpdate, setPriceUpdate] = useState({
    commodity: '',
    price: '',
    source: '',
    confidence: 95
  });

  // Configuration state
  const [oracleConfig, setOracleConfig] = useState({
    updateFrequency: 300,
    confidenceThreshold: 90,
    autoValidation: true,
    alertsEnabled: true
  });

  // Mock data
  useEffect(() => {
    // Mock verification queue
    setVerificationQueue([
      {
        id: 'VER-001',
        type: 'disaster_assessment',
        title: 'Hurricane Impact Assessment',
        location: 'Florida Keys',
        source: 'NOAA Weather Service',
        priority: 'high',
        confidence: 94,
        sourcesVerified: 3,
        totalSources: 3,
        submittedAt: '2024-08-10T10:30:00Z',
        status: 'pending'
      },
      {
        id: 'VER-002',
        type: 'price_update',
        title: 'Supply Price Update',
        item: 'Emergency Food Rations',
        source: 'Multiple vendors',
        priority: 'medium',
        confidence: 87,
        avgPrice: 12.50,
        priceChange: 5,
        submittedAt: '2024-08-10T09:15:00Z',
        status: 'pending'
      },
      {
        id: 'VER-003',
        type: 'location_verification',
        title: 'Vendor Location Verification',
        vendor: 'Relief Supply Co.',
        location: 'Austin, TX',
        source: 'GPS Data',
        priority: 'low',
        confidence: 100,
        gpsConfirmed: true,
        capacity: 10000,
        submittedAt: '2024-08-10T08:45:00Z',
        status: 'verified'
      },
      {
        id: 'VER-004',
        type: 'damage_assessment',
        title: 'Damage Assessment',
        event: 'California Earthquake',
        source: 'Satellite imagery',
        priority: 'medium',
        confidence: 87,
        aiAnalysis: 87,
        manualReviewNeeded: true,
        submittedAt: '2024-08-10T08:00:00Z',
        status: 'in_review'
      }
    ]);

    // Mock price feeds
    setPriceFeeds([
      {
        id: 'FEED-001',
        commodity: 'Emergency Food Rations',
        currentPrice: 12.50,
        lastUpdate: '2 minutes ago',
        change24h: 5.2,
        status: 'active',
        sources: 5,
        reliability: 98
      },
      {
        id: 'FEED-002',
        commodity: 'Medical Supplies Kit',
        currentPrice: 45.75,
        lastUpdate: '5 minutes ago',
        change24h: -2.1,
        status: 'active',
        sources: 8,
        reliability: 96
      },
      {
        id: 'FEED-003',
        commodity: 'Emergency Water (5L)',
        currentPrice: 8.99,
        lastUpdate: '12 minutes ago',
        change24h: 0.5,
        status: 'active',
        sources: 12,
        reliability: 99
      },
      {
        id: 'FEED-004',
        commodity: 'Emergency Shelter Kit',
        currentPrice: 125.00,
        lastUpdate: '45 minutes ago',
        change24h: 8.7,
        status: 'stale',
        sources: 3,
        reliability: 85
      }
    ]);

    // Mock data sources
    setDataSources([
      {
        id: 'SRC-001',
        name: 'NOAA Weather Service',
        type: 'weather',
        status: 'online',
        uptime: 99.8,
        lastPing: '30 seconds ago',
        reliability: 98,
        dataPoints: 1547
      },
      {
        id: 'SRC-002',
        name: 'USGS Earthquake Monitor',
        type: 'geological',
        status: 'online',
        uptime: 99.5,
        lastPing: '1 minute ago',
        reliability: 97,
        dataPoints: 892
      },
      {
        id: 'SRC-003',
        name: 'Vendor Price API',
        type: 'pricing',
        status: 'online',
        uptime: 98.2,
        lastPing: '15 seconds ago',
        reliability: 95,
        dataPoints: 2341
      },
      {
        id: 'SRC-004',
        name: 'Satellite Imagery Feed',
        type: 'imagery',
        status: 'degraded',
        uptime: 89.4,
        lastPing: '5 minutes ago',
        reliability: 88,
        dataPoints: 156
      }
    ]);

    // Mock oracle stats
    setOracleStats({
      dataPointsVerified: 1247,
      todayIncrease: 23,
      priceUpdates: 89,
      lastUpdateMinutes: 2,
      pendingValidations: 12,
      networkUptime: 99.8,
      totalSources: dataSources.length,
      activeSources: dataSources.filter(s => s.status === 'online').length
    });
  }, []);

  const handleVerification = async (verificationId, action) => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setVerificationQueue(prev => prev.map(item => 
        item.id === verificationId 
          ? { ...item, status: action === 'approve' ? 'verified' : 'rejected' }
          : item
      ));
      
      toast.success(`Verification ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
      
    } catch (error) {
      toast.error('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePriceUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newFeed = {
        id: `FEED-${Date.now()}`,
        commodity: priceUpdate.commodity,
        currentPrice: parseFloat(priceUpdate.price),
        lastUpdate: 'Just now',
        change24h: 0,
        status: 'active',
        sources: 1,
        reliability: priceUpdate.confidence
      };
      
      setPriceFeeds(prev => [newFeed, ...prev]);
      setPriceUpdate({ commodity: '', price: '', source: '', confidence: 95 });
      setShowPriceModal(false);
      toast.success('Price feed updated successfully!');
      
    } catch (error) {
      toast.error('Price update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleConfigUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update configuration
      setShowConfigModal(false);
      toast.success('Oracle configuration updated!');
      
    } catch (error) {
      toast.error('Configuration update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Oracle Dashboard</h1>
            <p className="text-gray-600">
              Data verification and price oracle management for the relief network
            </p>
          </div>
          <div className="flex space-x-4">
            <Button
              onClick={() => setShowPriceModal(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Update Price
            </Button>
            <Button
              onClick={() => setShowConfigModal(true)}
              variant="outline"
            >
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
          </div>
        </div>
      </div>

      {/* Oracle Status Overview */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4">
        <div className="p-6 bg-white rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Data Points Verified</p>
              <p className="text-2xl font-bold text-gray-900">{oracleStats.dataPointsVerified}</p>
              <p className="text-sm text-green-600">+{oracleStats.todayIncrease} today</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Price Updates</p>
              <p className="text-2xl font-bold text-gray-900">{oracleStats.priceUpdates}</p>
              <p className="text-sm text-blue-600">Last: {oracleStats.lastUpdateMinutes} min ago</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Validations</p>
              <p className="text-2xl font-bold text-gray-900">{oracleStats.pendingValidations}</p>
              <p className="text-sm text-yellow-600">Requires attention</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Network Uptime</p>
              <p className="text-2xl font-bold text-gray-900">{oracleStats.networkUptime}%</p>
              <p className="text-sm text-purple-600">Excellent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex -mb-px space-x-8">
          {[
            { id: 'verification', label: 'Data Verification', icon: Database },
            { id: 'pricing', label: 'Price Feeds', icon: TrendingUp },
            { id: 'sources', label: 'Data Sources', icon: Wifi },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'verification' && (
          <motion.div
            key="verification"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 gap-8 lg:grid-cols-3"
          >
            {/* Data Verification Queue */}
            <RoleGuard permissions={['data:verify', 'validation:perform']} fallback={null}>
              <div className="lg:col-span-2">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="flex items-center text-lg font-semibold text-gray-900">
                      <Database className="w-5 h-5 mr-2 text-blue-500" />
                      Data Verification Queue
                    </h3>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-1" />
                        Filter
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {verificationQueue.map(item => (
                      <div key={item.id} className={`p-4 border rounded-lg ${
                        item.priority === 'high' ? 'border-orange-200 bg-orange-50' :
                        item.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                        item.priority === 'low' ? 'border-green-200 bg-green-50' :
                        'border-gray-200 bg-gray-50'
                      }`}>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{item.title}</h4>
                            {item.location && (
                              <p className="text-sm text-gray-600">Location: {item.location}</p>
                            )}
                            {item.item && (
                              <p className="text-sm text-gray-600">Item: {item.item}</p>
                            )}
                            {item.vendor && (
                              <p className="text-sm text-gray-600">Vendor: {item.vendor}</p>
                            )}
                            {item.event && (
                              <p className="text-sm text-gray-600">Event: {item.event}</p>
                            )}
                            <p className="text-sm text-gray-500">Source: {item.source}</p>
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              item.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                              item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {item.priority} priority
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              item.status === 'verified' ? 'bg-green-100 text-green-700' :
                              item.status === 'in_review' ? 'bg-blue-100 text-blue-700' :
                              item.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {item.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-gray-600">
                            Confidence Score: {item.confidence}%
                          </span>
                          {item.sourcesVerified && (
                            <span className="text-sm text-gray-600">
                              Sources: {item.sourcesVerified}/{item.totalSources} verified
                            </span>
                          )}
                          {item.avgPrice && (
                            <span className="text-sm text-gray-600">
                              Avg Price: ${item.avgPrice}
                            </span>
                          )}
                          {item.capacity && (
                            <span className="text-sm text-gray-600">
                              Capacity: {item.capacity.toLocaleString()} units
                            </span>
                          )}
                        </div>
                        
                        {item.status === 'pending' && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              onClick={() => handleVerification(item.id, 'approve')}
                              disabled={loading}
                            >
                              {loading ? <LoadingSpinner size="sm" /> : 'Verify & Approve'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleVerification(item.id, 'request_data')}
                            >
                              Request More Data
                            </Button>
                          </div>
                        )}
                        
                        {item.status === 'in_review' && (
                          <div className="flex space-x-2">
                            <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                              Continue Review
                            </Button>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </div>
                        )}
                        
                        {item.status === 'verified' && (
                          <Button size="sm" variant="outline" disabled>
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Already Verified
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </RoleGuard>

            {/* Oracle Tools */}
            <RoleGuard permissions={['price:update', 'data:verify']} fallback={null}>
              <div>
                <Card className="p-6">
                  <h3 className="flex items-center mb-6 text-lg font-semibold text-gray-900">
                    <Shield className="w-5 h-5 mr-2 text-green-500" />
                    Oracle Tools
                  </h3>
                  
                  <div className="space-y-4">
                    <button
                      onClick={() => setShowPriceModal(true)}
                      className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Price Feed Manager</p>
                          <p className="text-sm text-gray-500">Update commodity prices</p>
                        </div>
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                      </div>
                    </button>

                    <button className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Data Source Monitor</p>
                          <p className="text-sm text-gray-500">Check feed reliability</p>
                        </div>
                        <Eye className="w-5 h-5 text-green-500" />
                      </div>
                    </button>

                    <button
                      onClick={() => setShowConfigModal(true)}
                      className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Validation Rules</p>
                          <p className="text-sm text-gray-500">Configure verification</p>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-purple-500" />
                      </div>
                    </button>

                    <button className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Network Analytics</p>
                          <p className="text-sm text-gray-500">Performance metrics</p>
                        </div>
                        <BarChart3 className="w-5 h-5 text-orange-500" />
                      </div>
                    </button>

                    <button className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Data Search</p>
                          <p className="text-sm text-gray-500">Historical lookup</p>
                        </div>
                        <Search className="w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          className="bg-white text-gray-900"
                        />
                      </div>
                    </button>
                  </div>
                </Card>
              </div>
            </RoleGuard>
          </motion.div>
        )}

        {activeTab === 'pricing' && (
          <motion.div
            key="pricing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Price Feeds</h3>
                <Button onClick={() => setShowPriceModal(true)}>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Update Price
                </Button>
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {priceFeeds.map(feed => (
                  <div key={feed.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{feed.commodity}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        feed.status === 'active' ? 'bg-green-100 text-green-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {feed.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-2xl font-bold text-gray-900">
                          ${feed.currentPrice}
                        </span>
                        <span className={`text-sm ${
                          feed.change24h > 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {feed.change24h > 0 ? '+' : ''}{feed.change24h}%
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <p>Last update: {feed.lastUpdate}</p>
                        <p>Sources: {feed.sources}</p>
                        <p>Reliability: {feed.reliability}%</p>
                      </div>
                    </div>
                    
                    <div className="pt-3 mt-3 border-t border-gray-200">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Update
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'sources' && (
          <motion.div
            key="sources"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-6">
              <h3 className="mb-6 text-lg font-semibold text-gray-900">Data Sources</h3>
              
              <div className="space-y-4">
                {dataSources.map(source => (
                  <div key={source.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          source.status === 'online' ? 'bg-green-100' :
                          source.status === 'degraded' ? 'bg-yellow-100' :
                          'bg-red-100'
                        }`}>
                          {source.status === 'online' ? (
                            <Wifi className="w-5 h-5 text-green-600" />
                          ) : (
                            <WifiOff className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{source.name}</h4>
                          <p className="text-sm text-gray-600 capitalize">{source.type} data source</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          source.status === 'online' ? 'bg-green-100 text-green-700' :
                          source.status === 'degraded' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {source.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm md:grid-cols-4">
                      <div>
                        <p className="text-gray-600">Uptime</p>
                        <p className="font-medium">{source.uptime}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Last Ping</p>
                        <p className="font-medium">{source.lastPing}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Reliability</p>
                        <p className="font-medium">{source.reliability}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Data Points</p>
                        <p className="font-medium">{source.dataPoints.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-6">
              <h3 className="mb-6 text-lg font-semibold text-gray-900">Oracle Analytics</h3>
              <div className="py-12 text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Advanced analytics and reporting coming soon...</p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Price Update Modal */}
      <Modal
        isOpen={showPriceModal}
        onClose={() => setShowPriceModal(false)}
        title="Update Price Feed"
      >
        <form onSubmit={handlePriceUpdate} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Commodity
            </label>
            <input
              type="text"
              value={priceUpdate.commodity}
              onChange={(e) => setPriceUpdate({ ...priceUpdate, commodity: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Emergency Food Rations"
              required
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={priceUpdate.price}
              onChange={(e) => setPriceUpdate({ ...priceUpdate, price: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              required
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Data Source
            </label>
            <input
              type="text"
              value={priceUpdate.source}
              onChange={(e) => setPriceUpdate({ ...priceUpdate, source: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Vendor API"
              required
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Confidence Level: {priceUpdate.confidence}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={priceUpdate.confidence}
              onChange={(e) => setPriceUpdate({ ...priceUpdate, confidence: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
          
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPriceModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Update Price'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Configuration Modal */}
      <Modal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        title="Oracle Configuration"
      >
        <form onSubmit={handleConfigUpdate} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Update Frequency (seconds)
            </label>
            <input
              type="number"
              value={oracleConfig.updateFrequency}
              onChange={(e) => setOracleConfig({ ...oracleConfig, updateFrequency: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              min="60"
              max="3600"
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Confidence Threshold (%)
            </label>
            <input
              type="number"
              value={oracleConfig.confidenceThreshold}
              onChange={(e) => setOracleConfig({ ...oracleConfig, confidenceThreshold: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              min="50"
              max="100"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={oracleConfig.autoValidation}
              onChange={(e) => setOracleConfig({ ...oracleConfig, autoValidation: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="block ml-2 text-sm text-gray-700">
              Enable auto-validation for high confidence data
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={oracleConfig.alertsEnabled}
              onChange={(e) => setOracleConfig({ ...oracleConfig, alertsEnabled: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="block ml-2 text-sm text-gray-700">
              Enable real-time alerts
            </label>
          </div>
          
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowConfigModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Save Configuration'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Recent Oracle Activity */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Oracle Activity</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Action
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Data Type
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Confidence
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Price Update</div>
                  <div className="text-sm text-gray-500">Emergency Food Rations</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Supply Pricing</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                    Verified
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  98%
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  2 minutes ago
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Data Validation</div>
                  <div className="text-sm text-gray-500">Hurricane damage report</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Weather Data</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 text-xs font-semibold leading-5 text-yellow-800 bg-yellow-100 rounded-full">
                    In Review
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  94%
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  15 minutes ago
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Location Verification</div>
                  <div className="text-sm text-gray-500">Vendor: Relief Supply Co.</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">GPS Data</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                    Verified
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  100%
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  1 hour ago
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OracleDashboard;

