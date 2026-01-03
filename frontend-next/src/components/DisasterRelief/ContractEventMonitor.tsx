import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Zap,
  CreditCard,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Wifi,
  Eye,
  Filter,
  Pause,
  Play
} from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';

const ContractEventMonitor = ({ className = '' }) => {
  const [events, setEvents] = useState([]);
  const [isListening, setIsListening] = useState(true);
  const [filter, setFilter] = useState('all');
  const [connectionStatus, setConnectionStatus] = useState('connected');

  // Mock contract events
  useEffect(() => {
    if (!isListening) return;

    const mockEvents = [
      {
        id: 'evt-' + Date.now(),
        type: 'VoucherIssued',
        timestamp: new Date(),
        data: {
          recipient: '0x742d35Cc6635C0532FFC92844c0A6C4E5F7F8F8f',
          amount: 150.00,
          category: 'food',
          voucherId: 'VCH-2024-001'
        },
        txHash: '0x1234567890abcdef...',
        blockNumber: 12345678,
        status: 'confirmed'
      },
      {
        id: 'evt-' + (Date.now() + 1),
        type: 'VoucherRedeemed',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        data: {
          vendor: '0x8ba1f109551bD432803012645Hac136c5e8a3e8',
          amount: 89.75,
          voucherId: 'VCH-2024-002',
          items: ['Medical Kit', 'Pain Relief']
        },
        txHash: '0xabcdef1234567890...',
        blockNumber: 12345677,
        status: 'confirmed'
      },
      {
        id: 'evt-' + (Date.now() + 2),
        type: 'DisasterDeclared',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        data: {
          disasterId: 'DIS-001',
          name: 'Hurricane Florence',
          budgetAllocated: 2500000,
          severity: 'high'
        },
        txHash: '0x567890abcdef1234...',
        blockNumber: 12345676,
        status: 'confirmed'
      },
      {
        id: 'evt-' + (Date.now() + 3),
        type: 'VendorVerified',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        data: {
          vendor: '0x9cb2f109551bD432803012645Hac136c5e8a3e9',
          name: 'Relief Supply Co.',
          category: 'food_water'
        },
        txHash: '0x890abcdef1234567...',
        blockNumber: 12345675,
        status: 'confirmed'
      },
      {
        id: 'evt-' + (Date.now() + 4),
        type: 'BulkPayout',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        data: {
          totalAmount: 45850.00,
          recipientCount: 12,
          disasterId: 'DIS-001',
          payoutType: 'vendor_reimbursement'
        },
        txHash: '0xdef1234567890abc...',
        blockNumber: 12345674,
        status: 'pending'
      }
    ];

    const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];

    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of new event
        const newEvent = {
          ...randomEvent,
          id: 'evt-' + Date.now(),
          timestamp: new Date(),
          blockNumber: 12345678 + Math.floor(Math.random() * 100)
        };

        setEvents(prev => [newEvent, ...prev.slice(0, 19)]); // Keep last 20 events
      }
    }, 3000); // Check every 3 seconds

    // Initial events
    setEvents(mockEvents);

    return () => clearInterval(interval);
  }, [isListening]);

  const getEventIcon = (type) => {
    switch (type) {
      case 'VoucherIssued':
        return <CreditCard className="w-4 h-4 text-blue-500" />;
      case 'VoucherRedeemed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'DisasterDeclared':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'VendorVerified':
        return <Users className="w-4 h-4 text-purple-500" />;
      case 'BulkPayout':
        return <DollarSign className="w-4 h-4 text-yellow-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'VoucherIssued':
        return 'border-l-blue-500 bg-blue-50';
      case 'VoucherRedeemed':
        return 'border-l-green-500 bg-green-50';
      case 'DisasterDeclared':
        return 'border-l-red-500 bg-red-50';
      case 'VendorVerified':
        return 'border-l-purple-500 bg-purple-50';
      case 'BulkPayout':
        return 'border-l-yellow-500 bg-yellow-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatEventData = (type, data) => {
    switch (type) {
      case 'VoucherIssued':
        return (
          <div>
            <p className="font-medium">Voucher issued to {data.recipient.slice(0, 10)}...</p>
            <p className="text-sm text-gray-600">
              Amount: ${data.amount} • Category: {data.category} • ID: {data.voucherId}
            </p>
          </div>
        );
      case 'VoucherRedeemed':
        return (
          <div>
            <p className="font-medium">Voucher redeemed at {data.vendor.slice(0, 10)}...</p>
            <p className="text-sm text-gray-600">
              Amount: ${data.amount} • Items: {data.items.join(', ')}
            </p>
          </div>
        );
      case 'DisasterDeclared':
        return (
          <div>
            <p className="font-medium">Disaster declared: {data.name}</p>
            <p className="text-sm text-gray-600">
              Budget: ${data.budgetAllocated.toLocaleString()} • Severity: {data.severity}
            </p>
          </div>
        );
      case 'VendorVerified':
        return (
          <div>
            <p className="font-medium">Vendor verified: {data.name}</p>
            <p className="text-sm text-gray-600">
              Address: {data.vendor.slice(0, 10)}... • Category: {data.category.replace('_', ' & ')}
            </p>
          </div>
        );
      case 'BulkPayout':
        return (
          <div>
            <p className="font-medium">Bulk payout processed</p>
            <p className="text-sm text-gray-600">
              Amount: ${data.totalAmount.toLocaleString()} • Recipients: {data.recipientCount} • Type: {data.payoutType.replace('_', ' ')}
            </p>
          </div>
        );
      default:
        return <p className="font-medium">Unknown event</p>;
    }
  };

  const filteredEvents = events.filter(event =>
    filter === 'all' || event.type === filter
  );

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <Card className={`${className}`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Contract Events</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  {connectionStatus === 'connected' ? (
                    <Wifi className="w-3 h-3 text-green-500" />
                  ) : (
                    <Wifi className="w-3 h-3 text-red-500" />
                  )}
                  <span className="capitalize">{connectionStatus}</span>
                </div>
                <span>•</span>
                <span>{events.length} events</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Events</option>
              <option value="VoucherIssued">Voucher Issued</option>
              <option value="VoucherRedeemed">Voucher Redeemed</option>
              <option value="DisasterDeclared">Disaster Declared</option>
              <option value="VendorVerified">Vendor Verified</option>
              <option value="BulkPayout">Bulk Payout</option>
            </select>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsListening(!isListening)}
            >
              {isListening ? (
                <>
                  <Pause className="w-3 h-3 mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 mr-1" />
                  Resume
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        <AnimatePresence>
          {filteredEvents.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Activity className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No events to display</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`p-4 border-l-4 ${getEventColor(event.type)} hover:bg-opacity-75 transition-colors`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="p-1 bg-white rounded-full shadow-sm">
                        {getEventIcon(event.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900 text-sm">
                            {event.type.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className={`px-1.5 py-0.5 text-xs rounded-full ${event.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                              event.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                            }`}>
                            {event.status}
                          </span>
                        </div>

                        {formatEventData(event.type, event.data)}

                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>{formatTimeAgo(event.timestamp)}</span>
                          <span>Block #{event.blockNumber.toLocaleString()}</span>
                          <button
                            className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                            onClick={() => window.open(`https://snowtrace.io/tx/${event.txHash}`, '_blank')}
                          >
                            <Eye className="w-3 h-3" />
                            <span>View Tx</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Stats Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-600">Vouchers</p>
            <p className="text-sm font-semibold text-blue-600">
              {events.filter(e => e.type.includes('Voucher')).length}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Disasters</p>
            <p className="text-sm font-semibold text-red-600">
              {events.filter(e => e.type === 'DisasterDeclared').length}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Vendors</p>
            <p className="text-sm font-semibold text-purple-600">
              {events.filter(e => e.type === 'VendorVerified').length}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Payouts</p>
            <p className="text-sm font-semibold text-yellow-600">
              {events.filter(e => e.type === 'BulkPayout').length}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ContractEventMonitor;
