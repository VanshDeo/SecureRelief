import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Wallet, 
  User, 
  Shield, 
  Eye, 
  EyeOff, 
  AlertCircle,
  CheckCircle,
  Mail,
  Lock,
  Mountain,
  ArrowRight
} from 'lucide-react';
import Button from '../components/UI/Button';
import { useWeb3Store } from '../store/web3Store';
import { showSuccess, showWarning, handleError } from '../utils/errorHandler';

const Login = () => {
  const navigate = useNavigate();
  const { connectWallet, isConnected, account, userRole } = useWeb3Store();
  const [authMode, setAuthMode] = useState('wallet'); // 'wallet', 'traditional'
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'donor'
  });
  const [errors, setErrors] = useState({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isConnected && account && userRole) {
      const dashboardRoutes = {
        admin: '/admin',
        government: '/government',
        treasury: '/treasury',
        oracle: '/oracle',
        vendor: '/vendor',
        victim: '/victim',
        donor: '/donate'
      };
      navigate(dashboardRoutes[userRole] || '/');
    }
  }, [isConnected, account, userRole, navigate]);

  const handleWalletLogin = async () => {
    setIsLoading(true);
    try {
      await connectWallet();
      showSuccess('Wallet connected successfully!');
    } catch (error) {
      handleError(error, {
        context: 'Wallet Login',
        onAction: () => handleWalletLogin()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTraditionalLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Validate form
      const newErrors = {};
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.password) newErrors.password = 'Password is required';
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      // Traditional authentication (demo implementation)
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Demo users for testing
      const demoUsers = {
        'admin@relief.network': { role: 'admin', name: 'System Administrator' },
        'gov@relief.network': { role: 'government', name: 'Government Official' },
        'treasury@relief.network': { role: 'treasury', name: 'Treasury Manager' },
        'oracle@relief.network': { role: 'oracle', name: 'Data Oracle' },
        'vendor@relief.network': { role: 'vendor', name: 'Relief Vendor' },
        'victim@relief.network': { role: 'victim', name: 'Relief Recipient' },
        'donor@relief.network': { role: 'donor', name: 'Generous Donor' }
      };

      const user = demoUsers[formData.email];
      if (!user || formData.password !== 'demo123') {
        setErrors({ general: 'Invalid email or password' });
        return;
      }

      // Store auth data (in production, use proper JWT tokens)
      // localStorage.setItem('authToken', `demo-token-${user.role}`);
      // localStorage.setItem('userData', JSON.stringify(user));
      
      showSuccess(`Welcome back, ${user.name}!`);
      
      // Navigate based on role
      const dashboardRoutes = {
        admin: '/admin',
        government: '/government',
        treasury: '/treasury',
        oracle: '/oracle',
        vendor: '/vendor',
        victim: '/victim',
        donor: '/donate'
      };
      navigate(dashboardRoutes[user.role] || '/');

    } catch (error) {
      handleError(error, { context: 'Traditional Login' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const roleDescriptions = {
    admin: 'Full system access - Manage disaster zones, vendors, and operations',
    government: 'Government oversight - Disaster verification and vendor approval',
    treasury: 'Financial management - Fund allocation and budget control',
    oracle: 'Data management - Data verification and price updates',
    vendor: 'Process payments and manage aid distribution',
    victim: 'Access relief vouchers and aid resources',
    donor: 'Make donations and track impact'
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <Mountain className="w-12 h-12 mr-2 text-green-500" />
            <h1 className="text-2xl font-bold text-gray-900">Relief Network</h1>
          </div>
          <p className="text-gray-600">
            Secure access to the Avalanche Disaster Relief Network
          </p>
        </motion.div>

        {/* Auth Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="p-1 mb-6 bg-gray-100 rounded-lg"
        >
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => setAuthMode('wallet')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                authMode === 'wallet'
                  ? 'bg-white text-green-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Wallet className="inline w-4 h-4 mr-2" />
              Web3 Wallet
            </button>
            <button
              onClick={() => setAuthMode('traditional')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                authMode === 'traditional'
                  ? 'bg-white text-green-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="inline w-4 h-4 mr-2" />
              Email Login
            </button>
          </div>
        </motion.div>

        {/* Authentication Forms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="p-6 bg-white shadow-lg rounded-xl"
        >
          <AnimatePresence mode="wait">
            {authMode === 'wallet' ? (
              /* Wallet Authentication */
              <motion.div
                key="wallet"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center">
                  <Shield className="w-16 h-16 mx-auto mb-4 text-green-500" />
                  <h2 className="mb-2 text-xl font-semibold text-gray-900">
                    Web3 Wallet Login
                  </h2>
                  <p className="mb-6 text-gray-600">
                    Connect your wallet to access the platform. Your role will be automatically detected.
                  </p>

                  <Button
                    onClick={handleWalletLogin}
                    loading={isLoading}
                    className="w-full mb-4"
                    icon={Wallet}
                  >
                    Connect Wallet
                  </Button>

                  <div className="text-xs text-gray-500">
                    <p>Supported wallets: MetaMask, Core Wallet</p>
                    <p>Network: Avalanche Fuji Testnet</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Traditional Authentication */
              <motion.div
                key="traditional"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="mb-6 text-xl font-semibold text-gray-900">
                  Email Login
                </h2>

                <form onSubmit={handleTraditionalLogin} className="space-y-4">
                  {/* Email Field */}
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 bg-white">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && (
                      <p className="flex items-center mt-1 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          errors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute text-gray-400 right-3 top-3 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="flex items-center mt-1 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* General Error */}
                  {errors.general && (
                    <div className="p-3 border border-red-200 rounded-lg bg-red-50">
                      <p className="flex items-center text-sm text-red-600">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {errors.general}
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    loading={isLoading}
                    className="w-full"
                    icon={ArrowRight}
                  >
                    Sign In
                  </Button>
                </form>

                {/* Demo Credentials */}
                <div className="p-4 mt-6 rounded-lg bg-blue-50">
                  <h3 className="mb-2 text-sm font-medium text-blue-900">Demo Credentials:</h3>
                  <div className="space-y-1 text-xs text-blue-700">
                    <p><strong>Admin:</strong> admin@relief.network / demo123</p>
                    <p><strong>Vendor:</strong> vendor@relief.network / demo123</p>
                    <p><strong>Victim:</strong> victim@relief.network / demo123</p>
                    <p><strong>Donor:</strong> donor@relief.network / demo123</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Additional Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 text-center"
        >
          <div className="text-sm text-gray-600">
            <Link 
              to="/register"
              className="font-medium text-green-600 hover:text-green-700"
            >
              Need an account? Register here
            </Link>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <Link 
              to="/forgot-password"
              className="hover:text-gray-700"
            >
              Forgot your password?
            </Link>
          </div>
        </motion.div>

        {/* Role Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="p-4 mt-8 bg-white rounded-lg shadow-sm"
        >
          <h3 className="mb-3 text-sm font-medium text-gray-900">Platform Roles:</h3>
          <div className="space-y-2">
            {Object.entries(roleDescriptions).map(([role, description]) => (
              <div key={role} className="flex items-start">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-sm font-medium text-gray-900 capitalize">{role}:</span>
                  <span className="ml-1 text-sm text-gray-600">{description}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 text-xs text-center text-gray-500"
        >
          <p>Powered by Avalanche Blockchain</p>
          <p className="mt-1">
            <Link to="/privacy" className="hover:text-gray-700">Privacy Policy</Link>
            {' • '}
            <Link to="/terms" className="hover:text-gray-700">Terms of Service</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
