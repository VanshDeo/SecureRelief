import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  Star,
  Shield,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Plus,
  Download,
  Users,
  Target
} from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import LoadingSpinner from '../UI/LoadingSpinner';
import toast from 'react-hot-toast';

const ESGBondManager = ({ className = '' }) => {
  const [bonds, setBonds] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedBond, setSelectedBond] = useState(null);

  // Bond creation state
  const [bondData, setBondData] = useState({
    name: '',
    targetAmount: '',
    interestRate: '',
    maturityPeriod: '',
    minInvestment: '',
    category: 'disaster_relief',
    description: '',
    esgScore: 85
  });

  // Mock ESG bond data
  useEffect(() => {
    setBonds([
      {
        id: 'BOND-001',
        name: 'Hurricane Relief Bonds 2024',
        category: 'disaster_relief',
        targetAmount: 5000000,
        raisedAmount: 3750000,
        interestRate: 4.5,
        maturityDate: '2027-08-15',
        minInvestment: 1000,
        investors: 147,
        esgScore: 92,
        status: 'active',
        launchDate: '2024-08-01',
        performance: {
          currentYield: 4.2,
          riskRating: 'AA-',
          liquidityScore: 88
        },
        impactMetrics: {
          peopleHelped: 45000,
          co2Offset: 0,
          sustainabilityGoals: 3
        }
      },
      {
        id: 'BOND-002',
        name: 'Climate Resilience Infrastructure',
        category: 'climate_adaptation',
        targetAmount: 10000000,
        raisedAmount: 7200000,
        interestRate: 5.2,
        maturityDate: '2029-12-31',
        minInvestment: 5000,
        investors: 89,
        esgScore: 96,
        status: 'active',
        launchDate: '2024-06-15',
        performance: {
          currentYield: 5.0,
          riskRating: 'AAA',
          liquidityScore: 94
        },
        impactMetrics: {
          peopleHelped: 120000,
          co2Offset: 15000,
          sustainabilityGoals: 5
        }
      },
      {
        id: 'BOND-003',
        name: 'Emergency Response Fund',
        category: 'emergency_preparedness',
        targetAmount: 3000000,
        raisedAmount: 3000000,
        interestRate: 3.8,
        maturityDate: '2026-03-20',
        minInvestment: 500,
        investors: 234,
        esgScore: 88,
        status: 'fully_funded',
        launchDate: '2024-03-01',
        performance: {
          currentYield: 3.6,
          riskRating: 'AA',
          liquidityScore: 85
        },
        impactMetrics: {
          peopleHelped: 75000,
          co2Offset: 2500,
          sustainabilityGoals: 4
        }
      },
      {
        id: 'BOND-004',
        name: 'Sustainable Recovery Bonds',
        category: 'sustainable_recovery',
        targetAmount: 8000000,
        raisedAmount: 1200000,
        interestRate: 4.8,
        maturityDate: '2028-06-30',
        minInvestment: 2500,
        investors: 23,
        esgScore: 90,
        status: 'launching',
        launchDate: '2024-08-15',
        performance: {
          currentYield: 0,
          riskRating: 'AA+',
          liquidityScore: 0
        },
        impactMetrics: {
          peopleHelped: 0,
          co2Offset: 0,
          sustainabilityGoals: 6
        }
      }
    ]);
  }, []);

  const handleCreateBond = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newBond = {
        id: `BOND-${Date.now()}`,
        ...bondData,
        targetAmount: parseFloat(bondData.targetAmount),
        interestRate: parseFloat(bondData.interestRate),
        minInvestment: parseFloat(bondData.minInvestment),
        raisedAmount: 0,
        investors: 0,
        status: 'launching',
        launchDate: new Date().toISOString().split('T')[0],
        maturityDate: new Date(Date.now() + parseInt(bondData.maturityPeriod) * 365 * 24 * 60 * 60 * 1000)
          .toISOString().split('T')[0],
        performance: {
          currentYield: 0,
          riskRating: 'Pending',
          liquidityScore: 0
        },
        impactMetrics: {
          peopleHelped: 0,
          co2Offset: 0,
          sustainabilityGoals: Math.floor(Math.random() * 6) + 1
        }
      };

      setBonds(prev => [newBond, ...prev]);
      setBondData({
        name: '',
        targetAmount: '',
        interestRate: '',
        maturityPeriod: '',
        minInvestment: '',
        category: 'disaster_relief',
        description: '',
        esgScore: 85
      });

      setShowCreateModal(false);
      toast.success('ESG Bond created successfully!');

    } catch (error) {
      toast.error('Bond creation failed');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'fully_funded':
        return 'bg-blue-100 text-blue-800';
      case 'launching':
        return 'bg-yellow-100 text-yellow-800';
      case 'matured':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'disaster_relief':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'climate_adaptation':
        return <Shield className="w-4 h-4 text-green-500" />;
      case 'emergency_preparedness':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'sustainable_recovery':
        return <Target className="w-4 h-4 text-purple-500" />;
      default:
        return <BarChart3 className="w-4 h-4 text-gray-500" />;
    }
  };

  const totalTargetAmount = bonds.reduce((sum, bond) => sum + bond.targetAmount, 0);
  const totalRaisedAmount = bonds.reduce((sum, bond) => sum + bond.raisedAmount, 0);
  const totalInvestors = bonds.reduce((sum, bond) => sum + bond.investors, 0);
  const avgESGScore = bonds.reduce((sum, bond) => sum + bond.esgScore, 0) / bonds.length || 0;

  return (
    <div className={className}>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="flex items-center text-lg font-semibold text-gray-900">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              ESG Bond Management
            </h3>
            <p className="text-sm text-gray-600">Environmental, Social & Governance impact bonds</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Bond
          </Button>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4">
          <div className="p-4 rounded-lg bg-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Total Target</p>
                <p className="text-lg font-semibold text-blue-900">
                  ${(totalTargetAmount / 1000000).toFixed(1)}M
                </p>
              </div>
              <DollarSign className="w-6 h-6 text-blue-500" />
            </div>
          </div>

          <div className="p-4 rounded-lg bg-green-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Total Raised</p>
                <p className="text-lg font-semibold text-green-900">
                  ${(totalRaisedAmount / 1000000).toFixed(1)}M
                </p>
              </div>
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
          </div>

          <div className="p-4 rounded-lg bg-purple-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Investors</p>
                <p className="text-lg font-semibold text-purple-900">{totalInvestors}</p>
              </div>
              <Users className="w-6 h-6 text-purple-500" />
            </div>
          </div>

          <div className="p-4 rounded-lg bg-yellow-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600">Avg ESG Score</p>
                <p className="text-lg font-semibold text-yellow-900">{avgESGScore.toFixed(1)}</p>
              </div>
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Bonds List */}
        <div className="space-y-4">
          {bonds.map(bond => (
            <div key={bond.id} className="p-4 transition-shadow border border-gray-200 rounded-lg hover:shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getCategoryIcon(bond.category)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{bond.name}</h4>
                    <p className="text-sm text-gray-600 capitalize">
                      {bond.category.replace('_', ' ')}
                    </p>
                    <div className="flex items-center mt-1 space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(bond.status)}`}>
                        {bond.status.replace('_', ' ')}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs text-gray-600">ESG {bond.esgScore}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-600">Interest Rate</p>
                  <p className="text-lg font-semibold text-green-600">{bond.interestRate}%</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between mb-1 text-sm text-gray-600">
                  <span>Funding Progress</span>
                  <span>
                    ${(bond.raisedAmount / 1000000).toFixed(1)}M / ${(bond.targetAmount / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 transition-all duration-300 bg-blue-600 rounded-full"
                    style={{ width: `${Math.min((bond.raisedAmount / bond.targetAmount) * 100, 100)}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {Math.round((bond.raisedAmount / bond.targetAmount) * 100)}% funded
                </p>
              </div>

              {/* Bond Details Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                <div>
                  <p className="text-gray-600">Min Investment</p>
                  <p className="font-medium">${bond.minInvestment.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Investors</p>
                  <p className="font-medium">{bond.investors}</p>
                </div>
                <div>
                  <p className="text-gray-600">Maturity</p>
                  <p className="font-medium">{bond.maturityDate}</p>
                </div>
                <div>
                  <p className="text-gray-600">Risk Rating</p>
                  <p className="font-medium">{bond.performance.riskRating}</p>
                </div>
              </div>

              {/* Impact Metrics */}
              <div className="p-3 mt-4 rounded-lg bg-gray-50">
                <h5 className="mb-2 text-sm font-medium text-gray-900">Impact Metrics</h5>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="text-gray-600">People Helped</p>
                    <p className="font-semibold text-blue-600">
                      {bond.impactMetrics.peopleHelped.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">CO₂ Offset (tons)</p>
                    <p className="font-semibold text-green-600">
                      {bond.impactMetrics.co2Offset.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">SDG Goals</p>
                    <p className="font-semibold text-purple-600">
                      {bond.impactMetrics.sustainabilityGoals}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  Launched: {bond.launchDate}
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedBond(bond)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Details
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-3 h-3 mr-1" />
                    Prospectus
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Create Bond Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New ESG Bond"
        size="lg"
      >
        <form onSubmit={handleCreateBond} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Bond Name *
              </label>
              <input
                type="text"
                value={bondData.name}
                onChange={(e) => setBondData({ ...bondData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="Climate Resilience Bonds 2024"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                value={bondData.category}
                onChange={(e) => setBondData({ ...bondData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              >
                <option value="disaster_relief">Disaster Relief</option>
                <option value="climate_adaptation">Climate Adaptation</option>
                <option value="emergency_preparedness">Emergency Preparedness</option>
                <option value="sustainable_recovery">Sustainable Recovery</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Target Amount ($)
              </label>
              <input
                type="number"
                value={bondData.targetAmount}
                onChange={(e) => setBondData({ ...bondData, targetAmount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="5000000"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Interest Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={bondData.interestRate}
                onChange={(e) => setBondData({ ...bondData, interestRate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="4.5"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Maturity (years)
              </label>
              <input
                type="number"
                value={bondData.maturityPeriod}
                onChange={(e) => setBondData({ ...bondData, maturityPeriod: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="3"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Minimum Investment ($)
            </label>
            <input
              type="number"
              value={bondData.minInvestment}
              onChange={(e) => setBondData({ ...bondData, minInvestment: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder="1000"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={bondData.description}
              onChange={(e) => setBondData({ ...bondData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              rows={3}
              placeholder="Describe the bond's purpose and impact goals..."
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Expected ESG Score: {bondData.esgScore}
            </label>
            <input
              type="range"
              min="50"
              max="100"
              value={bondData.esgScore}
              onChange={(e) => setBondData({ ...bondData, esgScore: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>50</span>
              <span>75</span>
              <span>100</span>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {loading ? <LoadingSpinner size="sm" aria-label="Creating bond" /> : 'Create Bond'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ESGBondManager;
