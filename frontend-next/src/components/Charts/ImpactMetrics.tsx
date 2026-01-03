import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Heart,
  Target,
  TrendingUp,
  MapPin,
  Clock,
  Award,
  Activity
} from 'lucide-react';

const ImpactMetrics = () => {
  const [metrics, setMetrics] = useState({
    totalBeneficiaries: 45230,
    livesImpacted: 128450,
    disastersSupported: 156,
    countriesReached: 34,
    avgResponseTime: 6.2,
    fundEfficiency: 98.7,
    vendorSatisfaction: 94.3,
    userRetention: 87.1
  });

  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('all');

  useEffect(() => {
    // Simulate loading impact metrics
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const impactStats = [
    {
      icon: Users,
      title: 'Direct Beneficiaries',
      value: metrics.totalBeneficiaries,
      format: 'number',
      color: 'blue',
      description: 'People directly receiving aid',
      trend: '+12%',
      trendPositive: true
    },
    {
      icon: Heart,
      title: 'Lives Impacted',
      value: metrics.livesImpacted,
      format: 'number',
      color: 'red',
      description: 'Including family members and communities',
      trend: '+18%',
      trendPositive: true
    },
    {
      icon: Target,
      title: 'Disasters Supported',
      value: metrics.disastersSupported,
      format: 'number',
      color: 'green',
      description: 'Active and completed relief operations',
      trend: '+23%',
      trendPositive: true
    },
    {
      icon: MapPin,
      title: 'Countries Reached',
      value: metrics.countriesReached,
      format: 'number',
      color: 'purple',
      description: 'Global disaster relief coverage',
      trend: '+6%',
      trendPositive: true
    }
  ];

  const performanceMetrics = [
    {
      icon: Clock,
      title: 'Avg Response Time',
      value: metrics.avgResponseTime,
      format: 'decimal',
      suffix: ' hours',
      color: 'orange',
      description: 'Time from disaster to first aid',
      trend: '-15%',
      trendPositive: true
    },
    {
      icon: TrendingUp,
      title: 'Fund Efficiency',
      value: metrics.fundEfficiency,
      format: 'decimal',
      suffix: '%',
      color: 'green',
      description: 'Percentage of funds reaching beneficiaries',
      trend: '+2.1%',
      trendPositive: true
    },
    {
      icon: Award,
      title: 'Vendor Satisfaction',
      value: metrics.vendorSatisfaction,
      format: 'decimal',
      suffix: '%',
      color: 'blue',
      description: 'Vendor satisfaction rating',
      trend: '+3.4%',
      trendPositive: true
    },
    {
      icon: Activity,
      title: 'User Retention',
      value: metrics.userRetention,
      format: 'decimal',
      suffix: '%',
      color: 'purple',
      description: 'Monthly active user retention',
      trend: '+1.8%',
      trendPositive: true
    }
  ];

  const formatValue = (value, format) => {
    switch (format) {
      case 'number':
        return value.toLocaleString();
      case 'decimal':
        return value.toFixed(1);
      default:
        return value;
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      red: 'bg-red-100 text-red-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colors[color] || colors.blue;
  };

  const MetricCard = ({ metric, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${getColorClasses(metric.color)}`}>
          <metric.icon className="h-6 w-6" />
        </div>
        <div className={`text-sm font-medium px-2 py-1 rounded-full ${metric.trendPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
          }`}>
          {metric.trend}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
        <div className="text-3xl font-bold text-gray-900">
          {formatValue(metric.value, metric.format)}{metric.suffix || ''}
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          {metric.description}
        </p>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 animate-pulse">
              <div className="h-12 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Impact Metrics</h2>
          <p className="text-gray-600">Measuring our real-world impact on disaster relief efforts</p>
        </div>

        <div className="mt-4 lg:mt-0">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-avalanche-500 focus:border-transparent"
          >
            <option value="all">All Time</option>
            <option value="year">This Year</option>
            <option value="month">This Month</option>
            <option value="week">This Week</option>
          </select>
        </div>
      </div>

      {/* Impact Statistics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Direct Impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {impactStats.map((metric, index) => (
            <MetricCard key={metric.title} metric={metric} index={index} />
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {performanceMetrics.map((metric, index) => (
            <MetricCard key={metric.title} metric={metric} index={index + 4} />
          ))}
        </div>
      </div>

      {/* Impact Stories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Impact Stories</h3>

        <div className="space-y-4">
          {[
            {
              title: "Emergency Medical Supplies Delivered",
              location: "Turkey Earthquake Zone",
              impact: "2,500 families received medical aid",
              timeframe: "Within 8 hours",
              icon: Heart,
              color: "red"
            },
            {
              title: "Temporary Shelters Constructed",
              location: "Kerala Flood Areas",
              impact: "850 families housed safely",
              timeframe: "3 days response time",
              icon: Users,
              color: "blue"
            },
            {
              title: "Food Distribution Network",
              location: "California Wildfire Region",
              impact: "1,200 people fed daily",
              timeframe: "Ongoing for 2 weeks",
              icon: Target,
              color: "green"
            }
          ].map((story, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className={`p-2 rounded-lg ${getColorClasses(story.color)}`}>
                <story.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{story.title}</h4>
                <p className="text-sm text-gray-600 mb-1">{story.location}</p>
                <p className="text-sm font-medium text-gray-900">{story.impact}</p>
                <p className="text-xs text-gray-500">{story.timeframe}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Global Reach Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Global Reach</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { region: 'Asia Pacific', disasters: 42, color: 'blue' },
            { region: 'Americas', disasters: 38, color: 'green' },
            { region: 'Europe', disasters: 28, color: 'purple' },
            { region: 'Africa', disasters: 22, color: 'orange' }
          ].map((region, index) => (
            <div key={region.region} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${getColorClasses(region.color)}`}>
                <MapPin className="h-6 w-6" />
              </div>
              <h4 className="font-medium text-gray-900">{region.region}</h4>
              <p className="text-2xl font-bold text-gray-900 mt-1">{region.disasters}</p>
              <p className="text-xs text-gray-600">Disasters Supported</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ImpactMetrics;
