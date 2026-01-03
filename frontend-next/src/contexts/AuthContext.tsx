'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWeb3Store } from '../store/web3Store';
import { showSuccess, showWarning, handleError } from '../utils/errorHandler';
import apiService from '../services/apiService';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  authMethod: string | null;
  login: (credentials: any) => Promise<any>;
  logout: () => Promise<void>;
  register: (registrationData: any) => Promise<any>;
  updateProfile: (updates: any) => Promise<any>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string | string[]) => boolean;
  hasMinimumRole: (minimumRole: string) => boolean;
  canAccess: (requiredPermissions?: string[], requiredRoles?: string[], allowGuest?: boolean) => boolean;
  getDashboardRoute: () => string;
  ROLE_HIERARCHY: Record<string, number>;
  ROLE_PERMISSIONS: Record<string, string[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Role hierarchy and permissions
const ROLE_HIERARCHY = {
  admin: 10,
  government: 8,
  treasury: 7,
  oracle: 6,
  vendor: 5,
  victim: 4,
  donor: 3,
  guest: 1
};

const ROLE_PERMISSIONS = {
  admin: [
    'manage:all',
    'view:all',
    'disaster:create',
    'disaster:update',
    'disaster:delete',
    'vendor:approve',
    'vendor:reject',
    'user:manage',
    'analytics:full',
    'system:configure'
  ],
  government: [
    'disaster:create',
    'disaster:update',
    'disaster:verify',
    'vendor:approve',
    'analytics:view',
    'reports:generate'
  ],
  treasury: [
    'funds:manage',
    'treasury:view',
    'treasury:allocate',
    'analytics:financial'
  ],
  oracle: [
    'data:verify',
    'price:update',
    'validation:perform'
  ],
  vendor: [
    'voucher:redeem',
    'inventory:manage',
    'transaction:process',
    'profile:update',
    'analytics:vendor'
  ],
  victim: [
    'voucher:claim',
    'aid:request',
    'profile:update',
    'donation:track'
  ],
  donor: [
    'donation:make',
    'impact:track',
    'profile:update',
    'analytics:donation'
  ],
  guest: [
    'public:view',
    'donation:make', // Allow guests to make donations
    'transparency:view', // Allow viewing transparency portal
    'disaster:view', // Allow viewing disaster information
    'proof:view' // Allow viewing proof gallery
  ]
};

export const AuthProvider = ({ children }) => {
  const { isConnected, account, userRole: web3Role, disconnect } = useWeb3Store();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMethod, setAuthMethod] = useState(null); // 'wallet' or 'traditional'

  // Initialize authentication state
  useEffect(() => {
    initializeAuth();
  }, [isConnected, account, web3Role]);

  const initializeAuth = async () => {
    setIsLoading(true);
    try {
      // In development mode, check if backend is accessible
      if (process.env.NODE_ENV === 'development') {
        try {
          const healthCheck = await apiService.getHealthStatus();
          console.log('✅ Backend connection verified:', healthCheck);
        } catch (error) {
          console.warn('⚠️ Backend not accessible, using fallback auth');
        }
      }

      // Check for traditional authentication first
      const authToken = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');

      if (authToken && userData) {
        try {
          // Verify token with backend
          apiService.setAuthToken(authToken);
          const verification = await apiService.verifyToken();

          if (verification.success) {
            const parsedUser = JSON.parse(userData);
            setUser({
              ...parsedUser,
              authMethod: 'traditional',
              permissions: ROLE_PERMISSIONS[parsedUser.role] || []
            });
            setIsAuthenticated(true);
            setAuthMethod('traditional');
          } else {
            // Token invalid, clear storage but continue as guest
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            apiService.setAuthToken(null);
            setGuestUser();
          }
        } catch (error) {
          console.warn('Token verification failed:', error);
          // Clear invalid auth but continue as guest
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          apiService.setAuthToken(null);
          setGuestUser();
        }
      } else if (isConnected && account && web3Role) {
        // Web3 authentication - check if user exists in database
        try {
          const dbUser = await apiService.getUserByWallet(account);

          if (dbUser.success && dbUser.data) {
            // User exists in database
            const web3User = {
              ...dbUser.data,
              authMethod: 'wallet',
              permissions: ROLE_PERMISSIONS[dbUser.data.role] || [],
              verified: true
            };
            setUser(web3User);
            setIsAuthenticated(true);
            setAuthMethod('wallet');
          } else {
            // User doesn't exist, create profile
            const newUser = {
              walletAddress: account,
              role: web3Role,
              status: 'active',
              name: `User ${account.slice(0, 6)}...${account.slice(-4)}`,
              authMethod: 'wallet',
              permissions: ROLE_PERMISSIONS[web3Role] || [],
              verified: false
            };

            try {
              const createdUser = await apiService.createUser(newUser);
              if (createdUser.success) {
                setUser({
                  ...createdUser.data,
                  authMethod: 'wallet',
                  permissions: ROLE_PERMISSIONS[createdUser.data.role] || []
                });
                setIsAuthenticated(true);
                setAuthMethod('wallet');
                showSuccess('Welcome! Your profile has been created.');
              }
            } catch (createError) {
              // If creation fails, use local user without DB sync
              console.warn('User creation failed, using local auth:', createError);
              setUser(newUser);
              setIsAuthenticated(true);
              setAuthMethod('wallet');
            }
          }
        } catch (error) {
          // Database lookup failed, use local web3 auth
          console.warn('Database lookup failed, using local web3 auth:', error);
          const web3User = {
            id: account,
            address: account,
            walletAddress: account,
            role: web3Role,
            authMethod: 'wallet',
            permissions: ROLE_PERMISSIONS[web3Role] || [],
            verified: true
          };
          setUser(web3User);
          setIsAuthenticated(true);
          setAuthMethod('wallet');
        }
      } else {
        // No authentication - set as guest user with basic permissions
        setGuestUser();
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      // On any error, default to guest access
      setGuestUser();
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to set guest user with basic permissions
  const setGuestUser = () => {
    const guestUser = {
      id: 'debug-admin',
      role: 'admin',
      name: 'Debug Admin (Guest)',
      authMethod: 'guest',
      permissions: ROLE_PERMISSIONS.admin || [],
      verified: true
    };
    setUser(guestUser);
    setIsAuthenticated(false); // Keep false for guest to allow optional login
    setAuthMethod('guest');
    apiService.setAuthToken(null);
  };

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      // Traditional login via API
      const response = await apiService.login(credentials);

      if (response.success && response.data) {
        const { token, user: userData } = response.data;

        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(userData));
        apiService.setAuthToken(token);

        setUser({
          ...userData,
          authMethod: 'traditional',
          permissions: ROLE_PERMISSIONS[userData.role] || []
        });
        setIsAuthenticated(true);
        setAuthMethod('traditional');

        showSuccess(`Welcome back, ${userData.firstName || userData.name}!`);
        return userData;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      handleError(error, { context: 'Login' });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint
      try {
        await apiService.logout();
      } catch (error) {
        console.warn('Backend logout failed:', error);
      }

      if (authMethod === 'wallet') {
        await disconnect();
      }

      // Clear all auth data
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('registrationData');
      apiService.setAuthToken(null);

      setUser(null);
      setIsAuthenticated(false);
      setAuthMethod(null);

      showSuccess('Logged out successfully');
    } catch (error) {
      handleError(error, { context: 'Logout' });
    }
  };

  const register = async (registrationData) => {
    setIsLoading(true);
    try {
      const response = await apiService.register(registrationData);

      if (response.success && response.data) {
        showSuccess('Registration successful! Please check your email to verify your account.');
        return response.data;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      handleError(error, { context: 'Registration' });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    setIsLoading(true);
    try {
      const response = await apiService.updateProfile(updates);

      if (response.success && response.data) {
        const updatedUser = response.data;
        setUser(prev => ({
          ...prev,
          ...updatedUser,
          permissions: ROLE_PERMISSIONS[updatedUser.role] || prev.permissions
        }));

        if (authMethod === 'traditional') {
          localStorage.setItem('userData', JSON.stringify(updatedUser));
        }

        showSuccess('Profile updated successfully');
        return updatedUser;
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error) {
      handleError(error, { context: 'Profile Update' });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Permission checking functions
  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission) || user.permissions.includes('manage:all');
  };

  const hasRole = (role) => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  const hasMinimumRole = (minimumRole) => {
    if (!user) return false;
    const userLevel = ROLE_HIERARCHY[user.role] || 0;
    const requiredLevel = ROLE_HIERARCHY[minimumRole] || 0;
    return userLevel >= requiredLevel;
  };

  const canAccess = (requiredPermissions = [], requiredRoles = [], allowGuest = false) => {
    // Allow guest access if specified
    if (allowGuest && user?.role === 'guest') return true;

    if (!user) return allowGuest;

    // Check permissions
    if (requiredPermissions.length > 0) {
      const hasRequiredPermission = requiredPermissions.some(permission =>
        hasPermission(permission)
      );
      if (!hasRequiredPermission) return false;
    }

    // Check roles
    if (requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.some(role => hasRole(role));
      if (!hasRequiredRole) return false;
    }

    return true;
  };

  // Role-based navigation with guest fallback
  const getDashboardRoute = () => {
    if (!user || user.role === 'guest') return '/';

    const dashboardRoutes = {
      admin: '/admin',
      government: '/government',
      treasury: '/treasury',
      oracle: '/oracle',
      vendor: '/vendor',
      victim: '/victim',
      donor: '/donor',
      guest: '/'
    };

    return dashboardRoutes[user.role] || '/';
  };

  const value = {
    // State
    user,
    isAuthenticated,
    isLoading,
    authMethod,

    // Auth methods
    login,
    logout,
    register,
    updateProfile,

    // Permission methods
    hasPermission,
    hasRole,
    hasMinimumRole,
    canAccess,

    // Navigation
    getDashboardRoute,

    // Constants
    ROLE_HIERARCHY,
    ROLE_PERMISSIONS
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
