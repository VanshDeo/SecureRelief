import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bug, CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react'
import { useWeb3Store } from '../../store/web3Store'

const WalletDebugger = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>({})

  const { isConnected, account, chainId, provider, contractService } = useWeb3Store()

  const runDiagnostics = async () => {
    const info: any = {
      timestamp: new Date().toISOString(),
      ethereum: typeof window.ethereum !== 'undefined',
      isMetaMask: window.ethereum?.isMetaMask || false,
      isConnected: window.ethereum?.isConnected() || false,
      account,
      chainId,
      expectedChainId: 43113,
      provider: !!provider,
      contractService: !!contractService,
      contracts: {}
    }

    if (contractService) {
      info.contracts.disasterRelief = !!(contractService as any).disasterReliefContract
      info.contracts.usdc = !!(contractService as any).usdcContract
      info.contracts.initialized = (contractService as any).initialized
    }

    try {
      if (window.ethereum) {
        info.accounts = await window.ethereum.request({ method: 'eth_accounts' })
        info.currentChainId = await window.ethereum.request({ method: 'eth_chainId' })
      }
    } catch (error) {
      info.error = error.message
    }

    setDebugInfo(info)
  }

  useEffect(() => {
    if (isOpen) {
      runDiagnostics()
    }
  }, [isOpen, isConnected, account, chainId])

  const StatusIcon = ({ condition }) => {
    if (condition === true) return <CheckCircle className="w-4 h-4 text-green-500" />
    if (condition === false) return <XCircle className="w-4 h-4 text-red-500" />
    return <AlertTriangle className="w-4 h-4 text-yellow-500" />
  }

  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'production') {
    return null // Don't show in production
  }

  return (
    <>
      {/* Debug Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-50 p-3 text-white transition-colors bg-gray-900 rounded-full shadow-lg bottom-4 left-4 hover:bg-gray-800"
        title="Open Wallet Debugger"
      >
        <Bug className="w-5 h-5" />
      </motion.button>

      {/* Debug Panel */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed z-50 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-xl bottom-20 left-4 w-96 max-h-96"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Wallet Debug Info</h3>
              <div className="flex space-x-2">
                <button
                  onClick={runDiagnostics}
                  className="p-1 text-gray-500 hover:text-gray-700"
                  title="Refresh"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Ethereum Provider:</span>
                <div className="flex items-center space-x-2">
                  <StatusIcon condition={debugInfo.ethereum} />
                  <span>{debugInfo.ethereum ? 'Available' : 'Missing'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span>MetaMask:</span>
                <div className="flex items-center space-x-2">
                  <StatusIcon condition={debugInfo.isMetaMask} />
                  <span>{debugInfo.isMetaMask ? 'Detected' : 'Not detected'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span>Connection:</span>
                <div className="flex items-center space-x-2">
                  <StatusIcon condition={isConnected} />
                  <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
                </div>
              </div>

              {account && (
                <div className="flex items-center justify-between">
                  <span>Account:</span>
                  <span className="font-mono text-xs">{account.slice(0, 10)}...</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span>Network:</span>
                <div className="flex items-center space-x-2">
                  <StatusIcon condition={chainId === 43113} />
                  <span>{chainId || 'Unknown'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span>Provider Instance:</span>
                <div className="flex items-center space-x-2">
                  <StatusIcon condition={debugInfo.provider} />
                  <span>{debugInfo.provider ? 'Created' : 'Missing'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span>Contract Service:</span>
                <div className="flex items-center space-x-2">
                  <StatusIcon condition={debugInfo.contracts?.initialized} />
                  <span>{debugInfo.contracts?.initialized ? 'Initialized' : 'Not initialized'}</span>
                </div>
              </div>

              {debugInfo.contracts && (
                <div className="ml-4 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span>Disaster Relief:</span>
                    <StatusIcon condition={debugInfo.contracts.disasterRelief} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>USDC:</span>
                    <StatusIcon condition={debugInfo.contracts.usdc} />
                  </div>
                </div>
              )}

              {debugInfo.error && (
                <div className="p-2 text-xs text-red-700 border border-red-200 rounded bg-red-50">
                  Error: {debugInfo.error}
                </div>
              )}

              {debugInfo.timestamp && (
                <div className="pt-2 text-xs text-gray-500 border-t">
                  Last updated: {new Date(debugInfo.timestamp).toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </>
  )
}

export default WalletDebugger
