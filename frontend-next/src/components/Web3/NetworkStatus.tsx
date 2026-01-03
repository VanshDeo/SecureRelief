import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, Settings } from 'lucide-react'
import { useWeb3Store } from '../../store/web3Store'

const NetworkStatus = () => {
  const { isConnected, chainId, switchToAvalanche } = useWeb3Store()
  const [isChecking, setIsChecking] = useState(false)
  
  const AVALANCHE_FUJI_CHAIN_ID = 43113
  const isOnCorrectNetwork = chainId === AVALANCHE_FUJI_CHAIN_ID
  
  const handleSwitchNetwork = async () => {
    setIsChecking(true)
    try {
      await switchToAvalanche()
    } catch (error) {
      console.error('Failed to switch network:', error)
    } finally {
      setIsChecking(false)
    }
  }

  if (!isConnected) {
    return null
  }

  if (isOnCorrectNetwork) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200"
      >
        <CheckCircle className="h-4 w-4" />
        <span className="text-sm font-medium">Avalanche Fuji</span>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center space-x-3 text-orange-600 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200"
    >
      <AlertTriangle className="h-4 w-4" />
      <span className="text-sm font-medium">Wrong Network</span>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSwitchNetwork}
        disabled={isChecking}
        className="flex items-center space-x-1 px-2 py-1 bg-orange-100 hover:bg-orange-200 rounded text-orange-700 text-xs font-medium transition-colors"
      >
        {isChecking ? (
          <div className="w-3 h-3 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
        ) : (
          <Settings className="h-3 w-3" />
        )}
        <span>Switch</span>
      </motion.button>
    </motion.div>
  )
}

export default NetworkStatus
