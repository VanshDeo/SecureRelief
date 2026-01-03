import React from 'react';
import {
  BarChart3,
  Users,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Shield,
  CheckCircle2,
  Eye,
  Clock,
  Activity
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import RoleGuard from '../Auth/RoleGuard';

const UniversalDashboard = () => {
  const { user, hasPermission, hasRole } = useAuth();

  const getWelcomeMessage = () => {
    const greetings = {
      admin: "Welcome to the Admin Control Center",
      government: "Government Oversight Dashboard",
      treasury: "Treasury Management Console",
      oracle: "Data Verification Hub",
      vendor: "Vendor Service Portal",
      victim: "Aid Request Center",
      donor: "Donation Impact Dashboard"
    };
    return greetings[user?.role] || "Disaster Relief Dashboard";
  };

  const getRoleDescription = () => {
    const descriptions = {
      admin: "Complete system oversight and management",
      government: "Regulatory compliance and disaster coordination",
      treasury: "Financial controls and fund allocation",
      oracle: "Data verification and price management",
      vendor: "Service provision and payment processing",
      victim: "Aid requests and benefit management",
      donor: "Donation tracking and impact measurement"
    };
    return descriptions[user?.role] || "Platform access and information";
  };

  const getQuickStats = () => {
    // These would be fetched from API based on user role and permissions
    const stats = [
      {
        name: 'Total Donations',
        value: '$2.4M',
        change: '+12%',
        icon: DollarSign,
        color: 'green',
        roles: ['admin', 'government', 'treasury', 'donor'],
        permissions: ['analytics:view']
      },
      {
        name: 'Active Disasters',
        value: '12',
        change: '+2',
        icon: AlertTriangle,
        color: 'red',
        roles: ['admin', 'government', 'oracle'],
        permissions: ['disaster:view']
      },
      {
        name: 'Verified Vendors',
        value: '148',
        change: '+5',
        icon: CheckCircle2,
        color: 'blue',
        roles: ['admin', 'government', 'vendor'],
        permissions: ['vendor:view']
      },
      {
        name: 'Aid Recipients',
        value: '3,247',
        change: '+127',
        icon: Users,
        color: 'purple',
        roles: ['admin', 'government', 'victim'],
        permissions: ['user:view']
      }
    ];

    return stats.filter(stat => {
      if (stat.roles.length === 0) return true;
      return stat.roles.some(role => hasRole(role)) ||
        stat.permissions.some(permission => hasPermission(permission));
    });
  };

  const getQuickActions = () => {
    const actions = [
      {
        name: 'Emergency Declaration',
        description: 'Declare new disaster emergency',
        icon: AlertTriangle,
        href: '/disasters/new',
        color: 'red',
        roles: ['admin', 'government'],
        permissions: ['disaster:create']
      },
      {
        name: 'Fund Allocation',
        description: 'Allocate emergency funds',
        icon: DollarSign,
        href: '/treasury/allocate',
        color: 'green',
        roles: ['treasury'],
        permissions: ['treasury:allocate']
      },
      {
        name: 'Data Verification',
        description: 'Verify pending data',
        icon: Shield,
        href: '/oracle/verify',
        color: 'blue',
        roles: ['oracle'],
        permissions: ['data:verify']
      },
      {
        name: 'Process Payments',
        description: 'Process vendor payments',
        icon: CheckCircle2,
        href: '/vendor/payments',
        color: 'indigo',
        roles: ['vendor'],
        permissions: ['voucher:redeem']
      },
      {
        name: 'Request Aid',
        description: 'Submit aid request',
        icon: Users,
        href: '/victim/request',
        color: 'purple',
        roles: ['victim'],
        permissions: ['aid:request']
      },
      {
        name: 'Make Donation',
        description: 'Contribute to relief efforts',
        icon: TrendingUp,
        href: '/donate/quick',
        color: 'pink',
        roles: ['donor'],
        permissions: ['donation:make']
      }
    ];

    return actions.filter(action => {
      return action.roles.some(role => hasRole(role)) ||
        action.permissions.some(permission => hasPermission(permission));
    });
  };

  const quickStats = getQuickStats();
  const quickActions = getQuickActions();

  return (
    <div className="p-6 mx-auto max-w-7xl">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          {getWelcomeMessage()}
        </h1>
        <p className="mb-4 text-gray-600">
          {getRoleDescription()}
        </p>

        {/* Role Badge */}
        <div className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-avalanche-100 text-avalanche-700">
          <Shield className="w-4 h-4 mr-2" />
          {user?.role} Access
          <span className="ml-2 text-xs text-avalanche-500">
            ({user?.authMethod === 'wallet' ? 'Web3' : 'Traditional'})
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      {quickStats.length > 0 && (
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          {quickStats.map((stat) => {
            const Icon = stat.icon;
            const colorClasses = {
              green: 'bg-green-100 text-green-600',
              red: 'bg-red-100 text-red-600',
              blue: 'bg-blue-100 text-blue-600',
              purple: 'bg-purple-100 text-purple-600',
              indigo: 'bg-indigo-100 text-indigo-600',
              pink: 'bg-pink-100 text-pink-600'
            };

            return (
              <div key={stat.name} className="p-6 bg-white rounded-lg shadow">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${colorClasses[stat.color]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      {quickActions.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              const colorClasses = {
                green: 'border-green-200 hover:bg-green-50 text-green-700',
                red: 'border-red-200 hover:bg-red-50 text-red-700',
                blue: 'border-blue-200 hover:bg-blue-50 text-blue-700',
                purple: 'border-purple-200 hover:bg-purple-50 text-purple-700',
                indigo: 'border-indigo-200 hover:bg-indigo-50 text-indigo-700',
                pink: 'border-pink-200 hover:bg-pink-50 text-pink-700'
              };

              return (
                <a
                  key={action.name}
                  href={action.href}
                  className={`p-4 border-2 rounded-lg transition-colors ${colorClasses[action.color]}`}
                >
                  <div className="flex items-center mb-2">
                    <Icon className="w-5 h-5 mr-2" />
                    <h3 className="font-medium">{action.name}</h3>
                  </div>
                  <p className="text-sm opacity-75">{action.description}</p>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Role-specific Dashboard Sections */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Activity */}
        <RoleGuard
          permissions={['analytics:view']}
          fallback={null}
        >
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="flex items-center text-lg font-semibold text-gray-900">
                <Activity className="w-5 h-5 mr-2 text-blue-500" />
                Recent Activity
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center p-3 rounded-lg bg-gray-50">
                  <div className="w-2 h-2 mr-3 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Fund allocation approved</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center p-3 rounded-lg bg-gray-50">
                  <div className="w-2 h-2 mr-3 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">New vendor verified</p>
                    <p className="text-xs text-gray-500">15 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center p-3 rounded-lg bg-gray-50">
                  <div className="w-2 h-2 mr-3 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Data verification pending</p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RoleGuard>

        {/* System Status */}
        <RoleGuard
          roles={['admin', 'government', 'treasury']}
          fallback={null}
        >
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="flex items-center text-lg font-semibold text-gray-900">
                <Eye className="w-5 h-5 mr-2 text-green-500" />
                System Status
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Blockchain Network</span>
                  <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">IPFS Storage</span>
                  <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
                    Operational
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Oracle Services</span>
                  <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Payment Processing</span>
                  <span className="px-2 py-1 text-xs text-yellow-700 bg-yellow-100 rounded-full">
                    Maintenance
                  </span>
                </div>
              </div>
            </div>
          </div>
        </RoleGuard>
      </div>

      {/* Role-specific Additional Information */}
      <RoleGuard roles={['victim']} fallback={null}>
        <div className="p-6 mt-8 border border-blue-200 rounded-lg bg-blue-50">
          <h3 className="mb-2 text-lg font-semibold text-blue-900">Need Help?</h3>
          <p className="mb-4 text-blue-700">
            If you need immediate assistance or have questions about aid distribution,
            our support team is available 24/7.
          </p>
          <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            Contact Support
          </button>
        </div>
      </RoleGuard>

      <RoleGuard roles={['donor']} fallback={null}>
        <div className="p-6 mt-8 border border-green-200 rounded-lg bg-green-50">
          <h3 className="mb-2 text-lg font-semibold text-green-900">Thank You!</h3>
          <p className="mb-4 text-green-700">
            Your contributions make a real difference in disaster relief efforts.
            Track your donation impact and see how you're helping communities recover.
          </p>
          <button className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700">
            View Impact Report
          </button>
        </div>
      </RoleGuard>
    </div>
  );
};

export default UniversalDashboard;
