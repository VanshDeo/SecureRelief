'use client';

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Wallet, AlertCircle, Download, HelpCircle } from 'lucide-react'
import { useWeb3Store } from '../../store/web3Store'
import LoadingSpinner from '../UI/LoadingSpinner'
import Modal from '../UI/Modal'
import WalletSetupGuide from './WalletSetupGuide'

const WalletConnection = () => {
  const { isConnecting, connectWallet } = useWeb3Store()
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [showSetupGuide, setShowSetupGuide] = useState(false)
  const [connectionError, setConnectionError] = useState(null)

  const walletOptions = [
    {
      name: 'MetaMask',
      description: 'Connect using MetaMask browser extension',
      icon: '/metamask-icon.svg',
      isInstalled: typeof window !== 'undefined' && typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask,
      installUrl: 'https://metamask.io/download/'
    },
    {
      name: 'Core Wallet',
      description: 'Avalanche native wallet with enhanced features',
      icon: '/core-wallet-icon.svg',
      isInstalled: typeof window !== 'undefined' && typeof window.avalanche !== 'undefined',
      installUrl: 'https://core.app/'
    },
    {
      name: 'WalletConnect',
      description: 'Connect using mobile wallet apps',
      icon: '/walletconnect-icon.svg',
      isInstalled: true, // WalletConnect is always available
      installUrl: null
    }
  ]

  const handleWalletSelect = async (wallet) => {
    try {
      setConnectionError(null)

      if (!wallet.isInstalled && wallet.installUrl) {
        window.open(wallet.installUrl, '_blank')
        return
      }

      console.log(`Attempting to connect with ${wallet.name}...`)
      await connectWallet()
      setShowWalletModal(false)
    } catch (error) {
      console.error('Wallet connection error:', error)
      setConnectionError(error.message || 'Failed to connect wallet')
    }
  }

  const ConnectButton = () => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setShowWalletModal(true)}
      disabled={isConnecting}
      className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isConnecting ? (
        <LoadingSpinner size="sm" color="white" aria-label="Connecting wallet" />
      ) : (
        <Wallet className="w-4 h-4" />
      )}
      <span>
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </span>
    </motion.button>
  )

  return (
    <>
      <ConnectButton />

      <Modal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        title="Connect Your Wallet"
        size="md"
      >
        <div className="space-y-4">
          <p className="mb-6 text-sm text-gray-600">
            Choose how you'd like to connect to the Avalanche Disaster Relief Network
          </p>

          {connectionError && (
            <div className="p-3 border border-red-200 rounded-lg bg-red-50">
              <p className="text-sm text-red-700">{connectionError}</p>
            </div>
          )}

          {walletOptions.map((wallet) => (
            <motion.button
              key={wallet.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleWalletSelect(wallet)}
              disabled={isConnecting}
              className={`
                w-full p-4 border border-gray-200 rounded-lg text-left transition-all duration-200
                ${wallet.isInstalled
                  ? 'hover:border-avalanche-300 hover:bg-avalanche-50'
                  : 'opacity-75 hover:border-gray-300'
                }
                ${isConnecting ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                    {wallet.icon ? (
                      <img
                        src={wallet.icon}
                        alt={wallet.name}
                        className="w-6 h-6"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const nextSibling = target.nextElementSibling as HTMLElement;
                          if (nextSibling) {
                            nextSibling.style.display = 'block';
                          }
                        }}
                      />
                    ) : null}
                    <Wallet className="w-6 h-6 text-gray-400" style={{ display: wallet.icon ? 'none' : 'block' }} />
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900">
                      {wallet.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {wallet.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  {!wallet.isInstalled ? (
                    <div className="flex items-center space-x-2 text-orange-600">
                      <Download className="w-4 h-4" />
                      <span className="text-sm font-medium">Install</span>
                    </div>
                  ) : isConnecting ? (
                    <LoadingSpinner size="sm" aria-label="Connecting" />
                  ) : (
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  )}
                </div>
              </div>
            </motion.button>
          ))}

          {/* Network Info */}
          <div className="p-4 mt-6 border border-blue-200 rounded-lg bg-blue-50">
            <div className="flex items-center mb-2 space-x-2">
              <AlertCircle className="w-5 h-5 text-blue-500" />
              <h4 className="font-medium text-blue-900">Network Information</h4>
            </div>
            <div className="space-y-1 text-sm text-blue-800">
              <p><strong>Network:</strong> Avalanche Fuji Testnet</p>
              <p><strong>Chain ID:</strong> 43113</p>
              <p><strong>Currency:</strong> AVAX (Test tokens)</p>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-4 text-center">
            <p className="mb-3 text-sm text-gray-500">
              New to crypto wallets?{' '}
              <button
                onClick={() => setShowSetupGuide(true)}
                className="font-medium underline text-avalanche-600 hover:text-avalanche-700"
              >
                Get step-by-step help
              </button>
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowSetupGuide(true)}
              className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Setup Guide</span>
            </motion.button>
          </div>
        </div>
      </Modal>

      {/* Wallet Setup Guide */}
      <WalletSetupGuide
        isOpen={showSetupGuide}
        onClose={() => setShowSetupGuide(false)}
      />
    </>
  )
}

export default WalletConnection
