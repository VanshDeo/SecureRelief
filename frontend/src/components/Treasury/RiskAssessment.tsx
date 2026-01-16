import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  PieChart,
  Target,
  Eye,
  EyeOff,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Globe,
  Users,
  DollarSign,
  Thermometer,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Settings
} from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';
import Modal from '../UI/Modal';
import toast from 'react-hot-toast';

const RiskAssessment = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<any>(null);
  const [riskData, setRiskData] = useState<any>(null);
  const [showMitigation, setShowMitigation] = useState(false);

  // Initialize risk assessment data
  useEffect(() => {
    setRiskData({
      summary: {
        overallRiskScore: 6.8,
        riskLevel: 'medium',
        totalExposure: 125750000,
        mitigatedRisks: 8,
        activeRisks: 12,
        criticalRisks: 2,
        riskTrend: -0.3 // Improvement
      },
      categories: {
        credit: {
          score: 7.2,
          level: 'medium-high',
          exposure: 45000000,
          trend: 0.2,
          mitigation: 85
        },
        market: {
          score: 6.5,
          level: 'medium',
          exposure: 38000000,
          trend: -0.1,
          mitigation: 78
        },
        operational: {
          score: 5.8,
          level: 'medium',
          exposure: 22000000,
          trend: -0.4,
          mitigation: 92
        },
        liquidity: {
          score: 4.2,
          level: 'low',
          exposure: 15000000,
          trend: -0.6,
          mitigation: 95
        },
        esg: {
          score: 7.8,
          level: 'medium-high',
          exposure: 5750000,
          trend: 0.3,
          mitigation: 72
        }
      },
      activeRisks: [
        {
          id: 'RISK-001',
          title: 'Interest Rate Volatility',
          category: 'market',
          severity: 'high',
          probability: 75,
          impact: 8500000,
          riskScore: 8.2,
          status: 'monitoring',
          description: 'Rising interest rates affecting bond valuations and borrowing costs',
          lastAssessed: '2024-08-14T10:30:00Z',
          nextReview: '2024-08-21T10:30:00Z',
          owner: 'Treasury Team',
          mitigation: {
            status: 'partial',
            actions: [
              'Diversify bond portfolio maturities',
              'Implement interest rate hedging',
              'Monitor Fed policy changes'
            ],
            effectiveness: 65
          }
        },
        {
          id: 'RISK-002',
          title: 'Counterparty Credit Risk',
          category: 'credit',
          severity: 'high',
          probability: 60,
          impact: 12000000,
          riskScore: 8.8,
          status: 'active',
          description: 'Concentration risk with major bond issuers and investment counterparties',
          lastAssessed: '2024-08-13T15:45:00Z',
          nextReview: '2024-08-20T15:45:00Z',
          owner: 'Risk Management',
          mitigation: {
            status: 'implemented',
            actions: [
              'Diversify counterparty exposure',
              'Enhanced due diligence',
              'Credit monitoring systems'
            ],
            effectiveness: 80
          }
        },
        {
          id: 'RISK-003',
          title: 'ESG Regulation Changes',
          category: 'esg',
          severity: 'medium',
          probability: 85,
          impact: 5500000,
          riskScore: 7.1,
          status: 'monitoring',
          description: 'Potential changes in ESG regulations affecting investment compliance',
          lastAssessed: '2024-08-12T09:20:00Z',
          nextReview: '2024-08-19T09:20:00Z',
          owner: 'Compliance Team',
          mitigation: {
            status: 'planned',
            actions: [
              'Monitor regulatory developments',
              'Engage with policy makers',
              'Prepare compliance frameworks'
            ],
            effectiveness: 55
          }
        },
        {
          id: 'RISK-004',
          title: 'Operational System Failure',
          category: 'operational',
          severity: 'medium',
          probability: 25,
          impact: 8000000,
          riskScore: 6.5,
          status: 'mitigated',
          description: 'Risk of critical system failures affecting treasury operations',
          lastAssessed: '2024-08-11T14:10:00Z',
          nextReview: '2024-08-18T14:10:00Z',
          owner: 'IT Operations',
          mitigation: {
            status: 'implemented',
            actions: [
              'Redundant system architecture',
              'Regular backup procedures',
              'Disaster recovery testing'
            ],
            effectiveness: 90
          }
        },
        {
          id: 'RISK-005',
          title: 'Climate Physical Risk',
          category: 'esg',
          severity: 'medium',
          probability: 70,
          impact: 3200000,
          riskScore: 6.8,
          status: 'monitoring',
          description: 'Physical climate risks affecting infrastructure and operations',
          lastAssessed: '2024-08-10T11:30:00Z',
          nextReview: '2024-08-17T11:30:00Z',
          owner: 'ESG Committee',
          mitigation: {
            status: 'partial',
            actions: [
              'Climate risk modeling',
              'Infrastructure resilience planning',
              'Geographic diversification'
            ],
            effectiveness: 70
          }
        }
      ],
      stressTests: {
        scenarios: [
          {
            name: 'Market Downturn',
            type: 'severe',
            probability: 15,
            impact: -35000000,
            description: '30% market decline scenario',
            lastRun: '2024-08-01',
            result: 'passed',
            confidenceLevel: 95
          },
          {
            name: 'Interest Rate Shock',
            type: 'moderate',
            probability: 25,
            impact: -18000000,
            description: '300 basis point rate increase',
            lastRun: '2024-08-01',
            result: 'passed',
            confidenceLevel: 88
          },
          {
            name: 'Credit Event',
            type: 'severe',
            probability: 10,
            impact: -45000000,
            description: 'Major counterparty default',
            lastRun: '2024-08-01',
            result: 'warning',
            confidenceLevel: 92
          },
          {
            name: 'Liquidity Crisis',
            type: 'moderate',
            probability: 20,
            impact: -25000000,
            description: 'Funding market disruption',
            lastRun: '2024-08-01',
            result: 'passed',
            confidenceLevel: 85
          }
        ]
      },
      metrics: {
        var: {
          oneDay: 2800000,
          fiveDay: 6200000,
          confidence: 95
        },
        sharpeRatio: 1.52,
        maxDrawdown: -8.5,
        beta: 0.85,
        volatility: 12.4,
        correlations: {
          market: 0.72,
          bonds: 0.45,
          commodities: 0.23
        }
      },
      alerts: [
        {
          id: 1,
          type: 'critical',
          title: 'Credit Rating Downgrade',
          message: 'Major investment counterparty credit rating lowered',
          riskId: 'RISK-002',
          timestamp: '2024-08-14T10:30:00Z',
          severity: 'high'
        },
        {
          id: 2,
          type: 'warning',
          title: 'VaR Limit Breach',
          message: '5-day VaR exceeded defined threshold',
          riskId: null,
          timestamp: '2024-08-13T15:45:00Z',
          severity: 'medium'
        },
        {
          id: 3,
          type: 'info',
          title: 'Risk Assessment Due',
          message: 'Quarterly risk assessment review scheduled',
          riskId: null,
          timestamp: '2024-08-12T09:20:00Z',
          severity: 'low'
        }
      ]
    });
  }, []);

  const refreshData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Risk assessment data refreshed');
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  const exportRiskReport = () => {
    toast.success('Risk assessment report exported');
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

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'medium-high':
        return 'text-orange-600 bg-orange-100';
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'critical':
        return 'text-red-800 bg-red-200';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <Shield className="w-4 h-4 text-green-500" />;
      default:
        return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'mitigated':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'active':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'monitoring':
        return <Eye className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) {
      return <ArrowUpRight className="w-4 h-4 text-red-500" />;
    } else if (trend < 0) {
      return <ArrowDownRight className="w-4 h-4 text-green-500" />;
    }
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'risks', label: 'Risk Register', icon: AlertTriangle },
    { id: 'stress', label: 'Stress Testing', icon: Zap },
    { id: 'metrics', label: 'Risk Metrics', icon: Target }
  ];

  if (!riskData) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner aria-label="Loading risk assessment" />
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Risk Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overall Risk Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {riskData.summary.overallRiskScore}/10
              </p>
              <p className="text-sm flex items-center mt-1">
                {getTrendIcon(riskData.summary.riskTrend)}
                <span className={riskData.summary.riskTrend < 0 ? 'text-green-600' : 'text-red-600'}>
                  {riskData.summary.riskTrend > 0 ? '+' : ''}{riskData.summary.riskTrend}
                </span>
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Exposure</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(riskData.summary.totalExposure)}
              </p>
              <p className="text-sm text-blue-600">At risk amount</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Risks</p>
              <p className="text-2xl font-bold text-gray-900">
                {riskData.summary.activeRisks}
              </p>
              <p className="text-sm text-red-600">
                {riskData.summary.criticalRisks} critical
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Mitigated Risks</p>
              <p className="text-2xl font-bold text-gray-900">
                {riskData.summary.mitigatedRisks}
              </p>
              <p className="text-sm text-green-600">Successfully managed</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Risk Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Categories</h3>
          <div className="space-y-4">
            {Object.entries(riskData.categories).map(([category, data]: [string, any]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {category} Risk
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{data.score}/10</span>
                      {getTrendIcon(data.trend)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${data.score >= 8 ? 'bg-red-500' :
                          data.score >= 6 ? 'bg-yellow-500' :
                            data.score >= 4 ? 'bg-blue-500' : 'bg-green-500'
                          }`}
                        style={{ width: `${(data.score / 10) * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getRiskLevelColor(data.level)}`}>
                      {data.level}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Exposure: {formatCurrency(data.exposure)}</span>
                    <span>Mitigation: {data.mitigation}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Risk Alerts</h3>
          <div className="space-y-3">
            {riskData.alerts.map(alert => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                <div className={`p-1 rounded-full ${alert.type === 'critical' ? 'bg-red-100' :
                  alert.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                  {alert.type === 'critical' ?
                    <XCircle className="w-3 h-3 text-red-600" /> :
                    alert.type === 'warning' ?
                      <AlertTriangle className="w-3 h-3 text-yellow-600" /> :
                      <Activity className="w-3 h-3 text-blue-600" />
                  }
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
                  <p className="text-sm text-gray-600">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(alert.timestamp)}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                  alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                  {alert.severity}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Risk Heatmap */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Heat Map</h3>
        <div className="grid grid-cols-5 gap-2">
          {/* Probability Labels */}
          <div></div>
          <div className="text-center text-xs text-gray-500 font-medium">Low</div>
          <div className="text-center text-xs text-gray-500 font-medium">Medium</div>
          <div className="text-center text-xs text-gray-500 font-medium">High</div>
          <div className="text-center text-xs text-gray-500 font-medium">Very High</div>

          {/* High Impact */}
          <div className="text-xs text-gray-500 font-medium flex items-center">High Impact</div>
          <div className="h-12 bg-yellow-200 border border-yellow-300 rounded flex items-center justify-center"></div>
          <div className="h-12 bg-orange-300 border border-orange-400 rounded flex items-center justify-center"></div>
          <div className="h-12 bg-red-400 border border-red-500 rounded flex items-center justify-center">
            <span className="text-xs text-white font-bold">2</span>
          </div>
          <div className="h-12 bg-red-600 border border-red-700 rounded flex items-center justify-center"></div>

          {/* Medium Impact */}
          <div className="text-xs text-gray-500 font-medium flex items-center">Medium Impact</div>
          <div className="h-12 bg-green-200 border border-green-300 rounded flex items-center justify-center"></div>
          <div className="h-12 bg-yellow-200 border border-yellow-300 rounded flex items-center justify-center">
            <span className="text-xs font-bold">3</span>
          </div>
          <div className="h-12 bg-orange-300 border border-orange-400 rounded flex items-center justify-center"></div>
          <div className="h-12 bg-red-400 border border-red-500 rounded flex items-center justify-center"></div>

          {/* Low Impact */}
          <div className="text-xs text-gray-500 font-medium flex items-center">Low Impact</div>
          <div className="h-12 bg-green-100 border border-green-200 rounded flex items-center justify-center"></div>
          <div className="h-12 bg-green-200 border border-green-300 rounded flex items-center justify-center"></div>
          <div className="h-12 bg-yellow-200 border border-yellow-300 rounded flex items-center justify-center"></div>
          <div className="h-12 bg-orange-300 border border-orange-400 rounded flex items-center justify-center"></div>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          Numbers indicate count of risks in each category. Color intensity represents risk severity.
        </div>
      </Card>
    </div>
  );

  const renderRiskRegister = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Active Risk Register</h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" onClick={exportRiskReport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {riskData.activeRisks.map(risk => (
            <div key={risk.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                setSelectedRisk(risk);
                setShowDetails(true);
              }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getSeverityIcon(risk.severity)}
                    <h4 className="font-medium text-gray-900">{risk.title}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${getRiskLevelColor(risk.severity)}`}>
                      {risk.severity}
                    </span>
                    {getStatusIcon(risk.status)}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{risk.description}</p>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Category:</span>
                      <span className="ml-1 font-medium capitalize">{risk.category}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Probability:</span>
                      <span className="ml-1 font-medium">{risk.probability}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Impact:</span>
                      <span className="ml-1 font-medium">{formatCurrency(risk.impact)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Risk Score:</span>
                      <span className="ml-1 font-medium">{risk.riskScore}/10</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                    <span>Owner: {risk.owner}</span>
                    <span>Last Assessed: {formatDate(risk.lastAssessed)}</span>
                    <span>Next Review: {formatDate(risk.nextReview)}</span>
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">Mitigation</div>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${risk.mitigation.effectiveness >= 80 ? 'bg-green-500' :
                            risk.mitigation.effectiveness >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                          style={{ width: `${risk.mitigation.effectiveness}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">{risk.mitigation.effectiveness}%</span>
                    </div>
                    <span className={`text-xs px-2 py-1 mt-1 rounded-full inline-block ${risk.mitigation.status === 'implemented' ? 'bg-green-100 text-green-800' :
                      risk.mitigation.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                      {risk.mitigation.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderStressTesting = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Stress Test Scenarios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {riskData.stressTests.scenarios.map((scenario, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{scenario.name}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${scenario.result === 'passed' ? 'bg-green-100 text-green-800' :
                  scenario.result === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                  {scenario.result}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Probability:</span>
                  <span className="font-medium">{scenario.probability}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Potential Impact:</span>
                  <span className="font-medium text-red-600">{formatCurrency(scenario.impact)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Confidence Level:</span>
                  <span className="font-medium">{scenario.confidenceLevel}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Run:</span>
                  <span className="font-medium">{formatDate(scenario.lastRun)}</span>
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${scenario.result === 'passed' ? 'bg-green-500' :
                      scenario.result === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                    style={{ width: `${scenario.confidenceLevel}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Scenario Analysis</h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-900">Best Case Scenario</h4>
              <p className="text-sm text-green-700 mt-1">All investments perform above expectations</p>
              <div className="mt-2 text-sm text-green-600">
                Potential Gain: <span className="font-bold">+{formatCurrency(15000000)}</span>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-900">Base Case Scenario</h4>
              <p className="text-sm text-yellow-700 mt-1">Expected performance based on current trends</p>
              <div className="mt-2 text-sm text-yellow-600">
                Projected Return: <span className="font-bold">+{formatCurrency(8000000)}</span>
              </div>
            </div>

            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-900">Worst Case Scenario</h4>
              <p className="text-sm text-red-700 mt-1">Multiple risk events occur simultaneously</p>
              <div className="mt-2 text-sm text-red-600">
                Potential Loss: <span className="font-bold">{formatCurrency(-45000000)}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Stress Test Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tests Passed</span>
              <span className="font-bold text-green-600">3/4</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Warnings</span>
              <span className="font-bold text-yellow-600">1</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Failed Tests</span>
              <span className="font-bold text-red-600">0</span>
            </div>
            <div className="flex justify-between items-center border-t pt-4">
              <span className="text-gray-900 font-medium">Overall Rating</span>
              <span className="font-bold text-green-600">STRONG</span>
            </div>
            <div className="mt-4">
              <Button className="w-full">
                <Zap className="w-4 h-4 mr-2" />
                Run New Stress Test
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderMetrics = () => (
    <div className="space-y-6">
      {/* Key Risk Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(riskData.metrics.var.oneDay)}
          </div>
          <div className="text-sm text-gray-600">1-Day VaR</div>
          <div className="text-xs text-gray-500 mt-1">{riskData.metrics.var.confidence}% confidence</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {riskData.metrics.sharpeRatio}
          </div>
          <div className="text-sm text-gray-600">Sharpe Ratio</div>
          <div className="text-xs text-green-600 mt-1">Above benchmark</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {riskData.metrics.maxDrawdown}%
          </div>
          <div className="text-sm text-gray-600">Max Drawdown</div>
          <div className="text-xs text-orange-600 mt-1">12-month period</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {riskData.metrics.volatility}%
          </div>
          <div className="text-sm text-gray-600">Volatility</div>
          <div className="text-xs text-green-600 mt-1">Annualized</div>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Value at Risk (VaR)</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">1-Day VaR (95%)</span>
              <span className="font-medium">{formatCurrency(riskData.metrics.var.oneDay)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">5-Day VaR (95%)</span>
              <span className="font-medium">{formatCurrency(riskData.metrics.var.fiveDay)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Confidence Level</span>
              <span className="font-medium">{riskData.metrics.var.confidence}%</span>
            </div>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                There is a 5% chance that losses will exceed the VaR amount on any given day.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Correlations</h3>
          <div className="space-y-4">
            {Object.entries(riskData.metrics.correlations).map(([asset, correlation]: [string, any]) => (
              <div key={asset} className="flex items-center justify-between">
                <span className="text-gray-600 capitalize">{asset}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${correlation >= 0.7 ? 'bg-red-500' :
                        correlation >= 0.4 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                      style={{ width: `${Math.abs(correlation) * 100}%` }}
                    />
                  </div>
                  <span className="font-medium w-12 text-right">{correlation.toFixed(2)}</span>
                </div>
              </div>
            ))}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700">
                High correlations (&gt;0.7) may indicate concentration risk during market stress.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Risk-Return Analysis */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk-Return Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{riskData.metrics.beta}</div>
            <div className="text-sm text-gray-600">Beta</div>
            <div className="text-xs text-blue-600 mt-1">vs Market Index</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{riskData.metrics.sharpeRatio}</div>
            <div className="text-sm text-gray-600">Sharpe Ratio</div>
            <div className="text-xs text-green-600 mt-1">Risk-Adjusted Return</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{riskData.metrics.volatility}%</div>
            <div className="text-sm text-gray-600">Volatility</div>
            <div className="text-xs text-purple-600 mt-1">Standard Deviation</div>
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
          <h2 className="text-xl font-bold text-gray-900">Risk Assessment</h2>
          <p className="text-gray-600">Comprehensive risk monitoring and analysis</p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
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
            {loading ? <LoadingSpinner size="sm" aria-label="Refreshing data" /> : <RefreshCw className="w-4 h-4" />}
          </Button>

          <Button onClick={exportRiskReport} size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
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
          {activeTab === 'risks' && renderRiskRegister()}
          {activeTab === 'stress' && renderStressTesting()}
          {activeTab === 'metrics' && renderMetrics()}
        </motion.div>
      </AnimatePresence>

      {/* Risk Details Modal */}
      <Modal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title="Risk Details"
        size="lg"
      >
        {selectedRisk && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{selectedRisk.title}</h3>
              <span className={`px-3 py-1 text-sm rounded-full ${getRiskLevelColor(selectedRisk.severity)}`}>
                {selectedRisk.severity}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Risk Score</span>
                <div className="text-2xl font-bold text-gray-900">{selectedRisk.riskScore}/10</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Potential Impact</span>
                <div className="text-2xl font-bold text-red-600">{formatCurrency(selectedRisk.impact)}</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Probability</span>
                <div className="text-2xl font-bold text-yellow-600">{selectedRisk.probability}%</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Category</span>
                <div className="text-2xl font-bold text-blue-600 capitalize">{selectedRisk.category}</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-gray-700">{selectedRisk.description}</p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Mitigation Actions</h4>
              <div className="space-y-2">
                {selectedRisk.mitigation.actions.map((action, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">{action}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center space-x-2">
                <span className="text-sm text-gray-600">Effectiveness:</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${selectedRisk.mitigation.effectiveness}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{selectedRisk.mitigation.effectiveness}%</span>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowDetails(false)}>
                Close
              </Button>
              <Button onClick={() => setShowMitigation(true)}>
                Update Mitigation
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RiskAssessment;
