import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  DollarSign,
  Users,
  Clock,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Eye,
  TrendingUp
} from 'lucide-react';

const RealTimeMonitor = ({ maxItems = 50 }) => {
  const [transactions, setTransactions] = useState([]);
  const [isLive, setIsLive] = useState(true);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    totalToday: 0,
    avgAmount: 0,
    successRate: 0,
    activeUsers: 0
  });

  useEffect(() => {
    // Start real-time monitoring
    if (isLive) {
      const interval = setInterval(generateTransaction, 2000);
      return () => clearInterval(interval);
    }
  }, [isLive]);

  useEffect(() => {
    updateStats();
  }, [transactions]);

  const generateTransaction = () => {
    const types = [
      { type: 'donation', probability: 0.4 },
      { type: 'distribution', probability: 0.3 },
      { type: 'verification', probability: 0.2 },
      { type: 'withdrawal', probability: 0.1 }
    ];

    const disasters = [
      'Turkey Earthquake Relief',
      'Kerala Flood Recovery',
      'California Wildfire Support',
      'Hurricane Recovery Fund',
      'Nepal Earthquake Aid',
      'Australia Bushfire Relief'
    ];

    const vendors = [
      'Local Food Bank',
      'Medical Supplies Co.',
      'Emergency Shelter Org',
      'Water Relief Foundation',
      'Community Kitchen',
      'Healthcare Clinic'
    ];

    const getRandomType = () => {
      const rand = Math.random();
      let cumulative = 0;
      for (const t of types) {
        cumulative += t.probability;
        if (rand <= cumulative) return t.type;
      }
      return types[0].type;
    };

    const type = getRandomType();
    const amount = type === 'donation' ?
      Math.floor(Math.random() * 2000) + 100 :
      Math.floor(Math.random() * 500) + 50;

    const newTransaction = {
      id: Date.now() + Math.random(),
      type,
      amount,
      disaster: disasters[Math.floor(Math.random() * disasters.length)],
      vendor: type === 'distribution' ? vendors[Math.floor(Math.random() * vendors.length)] : null,
      donor: type === 'donation' ? `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}` : null,
      timestamp: new Date(),
      status: Math.random() > 0.05 ? 'success' : 'failed',
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      networkFee: (Math.random() * 0.1 + 0.01).toFixed(4)
    };

    setTransactions(prev => [newTransaction, ...prev.slice(0, maxItems - 1)]);
  };

  const updateStats = () => {
    const today = new Date().toDateString();
    const todayTransactions = transactions.filter(tx =>
      tx.timestamp.toDateString() === today && tx.status === 'success'
    );

    const totalAmount = todayTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    const successfulTx = transactions.filter(tx => tx.status === 'success').length;
    const successRate = transactions.length > 0 ? (successfulTx / transactions.length) * 100 : 100;

    setStats({
      totalToday: totalAmount,
      avgAmount: todayTransactions.length > 0 ? totalAmount / todayTransactions.length : 0,
      successRate,
      activeUsers: new Set(transactions.map(tx => tx.donor).filter(Boolean)).size
    });
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'donation': return <DollarSign className="h-4 w-4" />;
      case 'distribution': return <Users className="h-4 w-4" />;
      case 'verification': return <CheckCircle className="h-4 w-4" />;
      case 'withdrawal': return <ArrowRight className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type, status) => {
    if (status === 'failed') return 'text-red-600 bg-red-50';

    switch (type) {
      case 'donation': return 'text-green-600 bg-green-50';
      case 'distribution': return 'text-blue-600 bg-blue-50';
      case 'verification': return 'text-purple-600 bg-purple-50';
      case 'withdrawal': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return `${seconds}s ago`;
  };

  const filteredTransactions = transactions.filter(tx =>
    filter === 'all' || tx.type === filter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Real-Time Transaction Monitor</h2>
          <p className="text-gray-600">Live monitoring of all platform transactions</p>
        </div>

        <div className="mt-4 lg:mt-0 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-gray-600">{isLive ? 'Live' : 'Paused'}</span>
          </div>
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${isLive
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
          >
            {isLive ? 'Pause' : 'Resume'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{formatAmount(stats.totalToday)}</div>
              <div className="text-sm text-gray-600">Today's Volume</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{formatAmount(stats.avgAmount)}</div>
              <div className="text-sm text-gray-600">Avg Transaction</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats.successRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats.activeUsers}</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Transaction Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Live Transaction Feed</h3>

            <div className="flex items-center space-x-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-avalanche-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="donation">Donations</option>
                <option value="distribution">Distributions</option>
                <option value="verification">Verifications</option>
                <option value="withdrawal">Withdrawals</option>
              </select>

              <div className="flex items-center text-sm text-gray-600">
                <Eye className="h-4 w-4 mr-1" />
                {filteredTransactions.length} transactions
              </div>
            </div>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          <AnimatePresence>
            {filteredTransactions.map((transaction) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getTransactionColor(transaction.type, transaction.status)}`}>
                      {getTransactionIcon(transaction.type)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900 capitalize">
                          {transaction.type}
                        </h4>
                        {transaction.status === 'failed' && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                        {transaction.status === 'success' && transaction.type === 'donation' && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>

                      <div className="text-sm text-gray-600">
                        {transaction.type === 'donation' && (
                          <>
                            <span className="font-medium">{formatAmount(transaction.amount)}</span> donated by{' '}
                            <span className="font-mono text-xs">{transaction.donor}</span> to{' '}
                            <span className="font-medium">{transaction.disaster}</span>
                          </>
                        )}
                        {transaction.type === 'distribution' && (
                          <>
                            <span className="font-medium">{formatAmount(transaction.amount)}</span> distributed by{' '}
                            <span className="font-medium">{transaction.vendor}</span> for{' '}
                            <span className="font-medium">{transaction.disaster}</span>
                          </>
                        )}
                        {transaction.type === 'verification' && (
                          <>
                            Vendor verification completed for{' '}
                            <span className="font-medium">{transaction.disaster}</span>
                          </>
                        )}
                        {transaction.type === 'withdrawal' && (
                          <>
                            <span className="font-medium">{formatAmount(transaction.amount)}</span> withdrawn from{' '}
                            <span className="font-medium">{transaction.disaster}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-gray-500">{formatTime(transaction.timestamp)}</div>
                    <div className="text-xs text-gray-400">
                      Fee: ${transaction.networkFee} AVAX
                    </div>
                    <div className="text-xs font-mono text-gray-400 truncate w-24">
                      {transaction.txHash.substring(0, 10)}...
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredTransactions.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No transactions to display</p>
              <p className="text-sm">Waiting for real-time updates...</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default RealTimeMonitor;
