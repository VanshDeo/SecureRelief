'use client';

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  ExternalLink,
  Settings
} from 'lucide-react'
import { useWeb3Store } from '../../store/web3Store'
import Modal from '../UI/Modal'

const WalletStatusPanel = () => {
  const {
    isConnected,
    isConnecting,
    account,
    chainId,
    balance,
    contractService,
    connectWallet,
    switchToAvalanche
  } = useWeb3Store()

  const [showStatusModal, setShowStatusModal] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const AVALANCHE_FUJI = 43113
  const isCorrectNetwork = chainId === AVALANCHE_FUJI

  // Status determination
  const getConnectionStatus = () => {
    if (!window.ethereum) return 'no-provider'
    if (isConnecting) return 'connecting'
    if (!isConnected) return 'disconnected'
    if (!isCorrectNetwork) return 'wrong-network'
    if (!(contractService as any)?.initialized) return 'contract-error'
    return 'connected'
  }

  const status = getConnectionStatus()

  const statusConfig = {
    'no-provider': {
      icon: WifiOff,
      color: 'red',
      title: 'No Wallet Found',
      message: 'Please install MetaMask or another Web3 wallet',
      action: 'Install MetaMask',
      actionUrl: 'https://metamask.io/download/'
    },
    'connecting': {
      icon: RefreshCw,
      color: 'blue',
      title: 'Connecting...',
      message: 'Please check your wallet for connection request',
      action: null
    },
    'disconnected': {
      icon: WifiOff,
      color: 'gray',
      title: 'Wallet Disconnected',
      message: 'Connect your wallet to access all features',
      action: 'Connect Wallet'
    },
    'wrong-network': {
      icon: AlertTriangle,
      color: 'warning',
      title: 'Wrong Network',
      message: 'Please switch to Avalanche Fuji testnet',
      action: 'Switch Network'
    },
    'contract-error': {
      icon: AlertTriangle,
      color: 'warning',
      title: 'Contract Issues',
      message: 'Some features may be limited',
      action: 'Retry Connection'
    },
    'connected': {
      icon: CheckCircle,
      color: 'success',
      title: 'Connected',
      message: 'All systems operational',
      action: null
    }
  }

  const config = statusConfig[status]
  const Icon = config.icon

  const handleAction = async () => {
    setIsRefreshing(true)
    try {
      switch (status) {
        case 'no-provider':
          window.open((config as any).actionUrl, '_blank')
          break
        case 'disconnected':
          await connectWallet()
          break
        case 'wrong-network':
          await switchToAvalanche()
          break
        case 'contract-error':
          await connectWallet()
          break
      }
    } catch (error) {
      console.error('Action failed:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const getStatusColor = (color) => {
    const colors = {
      red: 'text-red-600 bg-red-50 border-red-200',
      blue: 'text-blue-600 bg-blue-50 border-blue-200',
      gray: 'text-gray-600 bg-gray-50 border-gray-200',
      warning: 'text-warning-600 bg-warning-50 border-warning-200',
      success: 'text-success-600 bg-success-50 border-success-200'
    }
    return colors[color] || colors.gray
  }

  const StatusIndicator = () => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setShowStatusModal(true)}
      className={`
        flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200
        ${getStatusColor(config.color)}
        hover:shadow-sm
      `}
    >
      <Icon className={`h-4 w-4 ${status === 'connecting' ? 'animate-spin' : ''}`} />
      <span className="text-sm font-medium">{config.title}</span>
    </motion.button>
  )

  return (
    <>
      <StatusIndicator />

      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Wallet Status"
        size="md"
      >
        <div className="space-y-6">
          {/* Status Display */}
          <div className={`p-4 rounded-lg border ${getStatusColor(config.color)}`}>
            <div className="flex items-center space-x-3">
              <Icon className={`h-6 w-6 ${status === 'connecting' ? 'animate-spin' : ''}`} />
              <div>
                <h3 className="font-semibold">{config.title}</h3>
                <p className="text-sm opacity-90">{config.message}</p>
              </div>
            </div>
          </div>

          {/* Connection Details */}
          {isConnected && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900">Connection Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Account:</span>
                  <span className="font-mono">
                    {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Network:</span>
                  <span className={chainId === AVALANCHE_FUJI ? 'text-success-600' : 'text-red-600'}>
                    {chainId === AVALANCHE_FUJI ? 'Avalanche Fuji' : `Chain ${chainId}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Balance:</span>
                  <span>{parseFloat(balance || '0').toFixed(4)} AVAX</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contracts:</span>
                  <span className={(contractService as any)?.initialized ? 'text-success-600' : 'text-red-600'}>
                    {(contractService as any)?.initialized ? 'Loaded' : 'Failed'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Troubleshooting Tips */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Troubleshooting Tips</h4>
            <div className="space-y-2 text-sm text-gray-600">
              {status === 'no-provider' && (
                <ul className="list-disc list-inside space-y-1">
                  <li>Install MetaMask browser extension</li>
                  <li>Refresh the page after installation</li>
                  <li>Enable the extension in your browser</li>
                </ul>
              )}

              {status === 'wrong-network' && (
                <ul className="list-disc list-inside space-y-1">
                  <li>Use the "Switch Network" button below</li>
                  <li>Or manually add Avalanche Fuji in MetaMask</li>
                  <li>Network ID: 43113</li>
                </ul>
              )}

              {status === 'contract-error' && (
                <ul className="list-disc list-inside space-y-1">
                  <li>Check your internet connection</li>
                  <li>Try refreshing the page</li>
                  <li>Disconnect and reconnect wallet</li>
                </ul>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {config.action && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAction}
                disabled={isRefreshing}
                className="flex-1 btn-primary flex items-center justify-center space-x-2"
              >
                {isRefreshing ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Settings className="h-4 w-4" />
                )}
                <span>{config.action}</span>
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.open('https://docs.avax.network/dapps/smart-contracts/get-funds-faucet', '_blank')}
              className="btn-secondary flex items-center space-x-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Get Test AVAX</span>
            </motion.button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default WalletStatusPanel
