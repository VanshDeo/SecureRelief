import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Download, 
  Settings, 
  CreditCard, 
  Shield,
  ExternalLink,
  CheckCircle
} from 'lucide-react'
import Modal from '../UI/Modal'

const WalletSetupGuide = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0)
  
  const steps = [
    {
      title: 'Install MetaMask',
      icon: Download,
      description: 'Download and install the MetaMask browser extension',
      details: [
        'Visit metamask.io and click "Download"',
        'Add the extension to your browser',
        'Create a new wallet or import existing one',
        'Write down your seed phrase safely'
      ],
      action: {
        text: 'Download MetaMask',
        url: 'https://metamask.io/download/'
      }
    },
    {
      title: 'Add Avalanche Network',
      icon: Settings,
      description: 'Configure MetaMask to connect to Avalanche Fuji testnet',
      details: [
        'Open MetaMask and click the network dropdown',
        'Select "Add Network" or "Custom RPC"',
        'Enter the Avalanche Fuji network details',
        'Save and switch to the new network'
      ],
      networkDetails: {
        'Network Name': 'Avalanche Fuji Testnet',
        'RPC URL': 'https://api.avax-test.network/ext/bc/C/rpc',
        'Chain ID': '43113',
        'Currency Symbol': 'AVAX',
        'Block Explorer': 'https://testnet.snowtrace.io/'
      }
    },
    {
      title: 'Get Test AVAX',
      icon: CreditCard,
      description: 'Get free test tokens to interact with the platform',
      details: [
        'Visit the Avalanche Fuji faucet',
        'Connect your wallet',
        'Request test AVAX tokens',
        'Wait for tokens to appear in your wallet'
      ],
      action: {
        text: 'Get Test AVAX',
        url: 'https://faucet.avax.network/'
      }
    },
    {
      title: 'Connect to Platform',
      icon: Shield,
      description: 'Connect your wallet to the Disaster Relief platform',
      details: [
        'Click "Connect Wallet" on our platform',
        'Select MetaMask from the options',
        'Approve the connection request',
        'Start using the platform features'
      ]
    }
  ]
  
  const currentStepData = steps[currentStep]
  const Icon = currentStepData.icon
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Wallet Setup Guide"
      size="lg"
    >
      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <motion.div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${index <= currentStep 
                    ? 'bg-avalanche-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                  }
                `}
                whileHover={{ scale: 1.1 }}
                onClick={() => setCurrentStep(index)}
              >
                {index < currentStep ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </motion.div>
              {index < steps.length - 1 && (
                <div className={`
                  w-16 h-1 mx-2 rounded
                  ${index < currentStep ? 'bg-avalanche-500' : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>
        
        {/* Current Step Content */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-avalanche-100 rounded-full flex items-center justify-center">
              <Icon className="h-8 w-8 text-avalanche-600" />
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {currentStepData.title}
            </h3>
            <p className="text-gray-600 mt-1">
              {currentStepData.description}
            </p>
          </div>
        </div>
        
        {/* Step Details */}
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Instructions:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              {currentStepData.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ol>
          </div>
          
          {/* Network Details for Step 2 */}
          {currentStepData.networkDetails && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-3">Network Configuration:</h4>
              <div className="space-y-2 text-sm">
                {Object.entries(currentStepData.networkDetails).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-blue-700 font-medium">{key}:</span>
                    <span className="text-blue-800 font-mono text-xs">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Action Button */}
          {currentStepData.action && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.open(currentStepData.action.url, '_blank')}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>{currentStepData.action.text}</span>
            </motion.button>
          )}
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="btn-secondary disabled:opacity-50"
          >
            Previous
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1)
              } else {
                onClose()
              }
            }}
            className="btn-primary"
          >
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
          </motion.button>
        </div>
      </div>
    </Modal>
  )
}

export default WalletSetupGuide
