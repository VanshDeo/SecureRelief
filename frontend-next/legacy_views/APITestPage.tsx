import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { testAPIConnection, testWalletIntegration } from '../test/api-integration.test';
import apiService from '../services/apiService';

const APITestPage = () => {
  const { user, isAuthenticated, authMethod } = useAuth();
  const [testResults, setTestResults] = useState(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [systemHealth, setSystemHealth] = useState(null);
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    // Load system health on component mount
    loadSystemHealth();
    if (isAuthenticated) {
      loadUserStats();
    }
  }, [isAuthenticated]);

  const loadSystemHealth = async () => {
    try {
      const health = await apiService.getHealthStatus();
      setSystemHealth(health);
    } catch (error) {
      console.error('Failed to load system health:', error);
    }
  };

  const loadUserStats = async () => {
    try {
      const stats = await apiService.getUserStats();
      setUserStats(stats);
    } catch (error) {
      console.error('Failed to load user stats:', error);
    }
  };

  const runIntegrationTests = async () => {
    setIsRunningTests(true);
    try {
      const results = await testAPIConnection();
      setTestResults(results);
    } catch (error) {
      console.error('Test execution failed:', error);
      setTestResults({
        success: false,
        error: error.message,
        results: []
      });
    } finally {
      setIsRunningTests(false);
    }
  };

  const testCurrentWallet = async () => {
    if (user && user.walletAddress) {
      setIsRunningTests(true);
      try {
        const result = await testWalletIntegration(user.walletAddress, user.role);
        console.log('Wallet integration test result:', result);
      } catch (error) {
        console.error('Wallet test failed:', error);
      } finally {
        setIsRunningTests(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          🔗 API Integration Test Dashboard
        </h1>

        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-3">🏥 System Health</h2>
            {systemHealth ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={`font-medium ${
                    systemHealth.status === 'OK' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {systemHealth.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Uptime:</span>
                  <span>{Math.floor(systemHealth.uptime)}s</span>
                </div>
                <div className="flex justify-between">
                  <span>Database:</span>
                  <span className={`font-medium ${
                    systemHealth.database === 'healthy' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {systemHealth.database}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Cache:</span>
                  <span className={`font-medium ${
                    systemHealth.cache === 'connected' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {systemHealth.cache}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">Loading...</div>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-3">👤 Current User</h2>
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Method:</span>
                  <span className="font-medium capitalize">{authMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Role:</span>
                  <span className="font-medium capitalize">{user.role}</span>
                </div>
                <div className="flex justify-between">
                  <span>Address:</span>
                  <span className="font-mono text-sm">
                    {user.walletAddress ? 
                      `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}` : 
                      'N/A'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Permissions:</span>
                  <span className="text-sm">{user.permissions?.length || 0}</span>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">Not authenticated</div>
            )}
          </div>
        </div>

        {/* User Statistics */}
        {userStats && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-semibold mb-3">📊 User Statistics</h2>
            <pre className="text-sm bg-white p-3 rounded border overflow-auto">
              {JSON.stringify(userStats, null, 2)}
            </pre>
          </div>
        )}

        {/* Test Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={runIntegrationTests}
            disabled={isRunningTests}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunningTests ? '🔄 Running Tests...' : '🧪 Run Full Integration Tests'}
          </button>

          {user && user.walletAddress && (
            <button
              onClick={testCurrentWallet}
              disabled={isRunningTests}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunningTests ? '🔄 Testing...' : '🔗 Test Current Wallet'}
            </button>
          )}

          <button
            onClick={loadSystemHealth}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            🔄 Refresh Health
          </button>
        </div>

        {/* Test Results */}
        {testResults && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-3">
              📋 Test Results
              {testResults.success ? (
                <span className="ml-2 text-green-600">✅ All Passed</span>
              ) : (
                <span className="ml-2 text-red-600">❌ Some Failed</span>
              )}
            </h2>

            {testResults.stats && (
              <div className="mb-4 text-sm text-gray-600">
                Completed in {testResults.duration}s - 
                Passed: {testResults.stats.passed}, 
                Failed: {testResults.stats.failed}, 
                Total: {testResults.stats.total}
              </div>
            )}

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {testResults.results?.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded border-l-4 ${
                    result.status === 'PASS'
                      ? 'bg-green-50 border-green-400'
                      : result.status === 'FAIL'
                      ? 'bg-red-50 border-red-400'
                      : 'bg-yellow-50 border-yellow-400'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-medium">{result.test}</span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      result.status === 'PASS'
                        ? 'bg-green-100 text-green-800'
                        : result.status === 'FAIL'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {result.status}
                    </span>
                  </div>
                  {result.details && (
                    <div className="text-sm text-gray-600 mt-1">{result.details}</div>
                  )}
                </div>
              ))}
            </div>

            {testResults.error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                <div className="text-red-800 font-medium">Error:</div>
                <div className="text-red-600 text-sm">{testResults.error}</div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">💡 Instructions</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Make sure the backend server is running on localhost:5000</li>
            <li>• Connect your wallet to test wallet integration</li>
            <li>• Check the browser console for detailed test output</li>
            <li>• All tests should pass if the integration is working correctly</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default APITestPage;
