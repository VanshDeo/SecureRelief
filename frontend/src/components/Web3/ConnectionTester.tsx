import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { TestTube, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { ethers } from 'ethers'
import toast from 'react-hot-toast'

const ConnectionTester = () => {
  const [testResults, setTestResults] = useState({})
  const [isRunning, setIsRunning] = useState(false)

  const tests = [
    {
      id: 'ethereum',
      name: 'Ethereum Provider',
      test: async () => {
        return typeof window.ethereum !== 'undefined'
      }
    },
    {
      id: 'metamask',
      name: 'MetaMask Detection',
      test: async () => {
        return window.ethereum?.isMetaMask || false
      }
    },
    {
      id: 'accounts',
      name: 'Request Accounts',
      test: async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        return accounts.length > 0
      }
    },
    {
      id: 'provider',
      name: 'Create Provider',
      test: async () => {
        const provider = new ethers.BrowserProvider(window.ethereum)
        return !!provider
      }
    },
    {
      id: 'signer',
      name: 'Get Signer',
      test: async () => {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        return !!signer
      }
    },
    {
      id: 'network',
      name: 'Check Network',
      test: async () => {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const network = await provider.getNetwork()
        return network.chainId === BigInt(43113)
      }
    },
    {
      id: 'balance',
      name: 'Get Balance',
      test: async () => {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const account = await signer.getAddress()
        const balance = await provider.getBalance(account)
        return balance >= 0n
      }
    }
  ]

  const runTests = async () => {
    setIsRunning(true)
    setTestResults({})

    for (const test of tests) {
      try {
        const result = await test.test()
        setTestResults(prev => ({
          ...prev,
          [test.id]: { success: result, error: null }
        }))

        if (!result) {
          console.warn(`Test failed: ${test.name}`)
        }
      } catch (error) {
        console.error(`Test error for ${test.name}:`, error)
        setTestResults(prev => ({
          ...prev,
          [test.id]: { success: false, error: error.message }
        }))
      }

      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    setIsRunning(false)
  }

  const getTestIcon = (testId) => {
    if (isRunning && !testResults[testId]) {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
    }

    const result = testResults[testId]
    if (!result) return null

    return result.success
      ? <CheckCircle className="h-4 w-4 text-green-500" />
      : <XCircle className="h-4 w-4 text-red-500" />
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <TestTube className="h-6 w-6 text-blue-500" />
        <h2 className="text-xl font-semibold text-gray-900">Connection Test</h2>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={runTests}
        disabled={isRunning}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-lg transition-colors mb-6"
      >
        {isRunning ? 'Running Tests...' : 'Run Connection Tests'}
      </motion.button>

      <div className="space-y-3">
        {tests.map((test) => (
          <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">{test.name}</span>
            <div className="flex items-center space-x-2">
              {getTestIcon(test.id)}
              {testResults[test.id]?.error && (
                <span className="text-xs text-red-600 max-w-32 truncate" title={testResults[test.id].error}>
                  {testResults[test.id].error}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {Object.keys(testResults).length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {Object.values(testResults).filter((r: any) => r.success).length} / {tests.length} tests passed
          </p>
        </div>
      )}
    </div>
  )
}

export default ConnectionTester
