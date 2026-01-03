/**
 * Enhanced Toast Notification System
 * Professional toast notifications with actions and animations
 */

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  X,
  ExternalLink
} from 'lucide-react'
import { errorHandler } from '../../utils/errorHandler'

const TOAST_TYPES = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-600',
    textColor: 'text-green-800'
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconColor: 'text-red-600',
    textColor: 'text-red-800'
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    iconColor: 'text-yellow-600',
    textColor: 'text-yellow-800'
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
    textColor: 'text-blue-800'
  }
}

const Toast = ({ 
  id,
  type = 'info', 
  title, 
  message, 
  action,
  actionLabel,
  onAction,
  onDismiss,
  duration = 5000,
  persistent = false,
  txHash,
  showTimestamp = true
}) => {
  const config = TOAST_TYPES[type] || TOAST_TYPES.info
  const Icon = config.icon

  React.useEffect(() => {
    if (!persistent && duration > 0) {
      const timer = setTimeout(() => {
        onDismiss?.()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, persistent, onDismiss])

  const handleExploreTransaction = () => {
    if (txHash) {
      const url = `https://testnet.snowtrace.io/tx/${txHash}`
      window.open(url, '_blank')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      className={`
        max-w-md w-full border rounded-lg shadow-lg p-4 mb-4
        ${config.bgColor} ${config.borderColor}
      `}
    >
      <div className="flex items-start">
        <Icon className={`w-5 h-5 ${config.iconColor} mt-0.5 flex-shrink-0`} />
        
        <div className="flex-1 ml-3">
          {title && (
            <h4 className={`text-sm font-semibold ${config.textColor}`}>
              {title}
            </h4>
          )}
          
          <p className={`text-sm ${config.textColor} ${title ? 'mt-1' : ''}`}>
            {message}
          </p>

          {showTimestamp && (
            <p className="mt-1 text-xs text-gray-500">
              {new Date().toLocaleTimeString()}
            </p>
          )}

          {/* Action buttons */}
          <div className="flex items-center mt-3 space-x-2">
            {(action || onAction) && (
              <button
                onClick={onAction || action}
                className={`
                  text-xs font-medium px-3 py-1 rounded border
                  ${config.textColor} hover:bg-white transition-colors
                `}
              >
                {actionLabel || 'Take Action'}
              </button>
            )}

            {txHash && (
              <button
                onClick={handleExploreTransaction}
                className={`
                  text-xs font-medium px-3 py-1 rounded border
                  ${config.textColor} hover:bg-white transition-colors
                  flex items-center space-x-1
                `}
              >
                <ExternalLink className="w-3 h-3" />
                <span>View TX</span>
              </button>
            )}
          </div>
        </div>

        {/* Dismiss button */}
        <button
          onClick={onDismiss}
          className={`ml-2 ${config.iconColor} hover:opacity-70 transition-opacity`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar for non-persistent toasts */}
      {!persistent && duration > 0 && (
        <motion.div
          className="h-1 mt-3 overflow-hidden bg-gray-200 rounded-full"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
        >
          <div className={`h-full ${config.iconColor.replace('text-', 'bg-')}`} />
        </motion.div>
      )}
    </motion.div>
  )
}

// Toast container component
const ToastContainer = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed z-50 space-y-2 top-4 right-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onDismiss={() => onDismiss(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Enhanced toast hook
export const useToast = () => {
  const [toasts, setToasts] = React.useState([])

  const addToast = React.useCallback((toast) => {
    const id = Date.now() + Math.random()
    const newToast = { id, ...toast }
    
    setToasts(prev => [...prev, newToast])
    
    return id
  }, [])

  const removeToast = React.useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const clearAllToasts = React.useCallback(() => {
    setToasts([])
  }, [])

  // Enhanced toast methods
  const toast = React.useMemo(() => ({
    success: (message, options = {}) => addToast({
      type: 'success',
      message,
      ...options
    }),
    
    error: (message, options = {}) => addToast({
      type: 'error',
      message,
      persistent: true, // Errors should be persistent by default
      ...options
    }),
    
    warning: (message, options = {}) => addToast({
      type: 'warning',
      message,
      ...options
    }),
    
    info: (message, options = {}) => addToast({
      type: 'info',
      message,
      ...options
    }),

    // Specialized toast for transactions
    transaction: (txHash, message, options = {}) => addToast({
      type: 'success',
      title: 'Transaction Submitted',
      message: message || 'Your transaction has been submitted to the blockchain',
      txHash,
      persistent: true,
      actionLabel: 'View on Explorer',
      ...options
    }),

    // Specialized toast for errors with retry action
    errorWithRetry: (message, retryAction, options = {}) => addToast({
      type: 'error',
      message,
      actionLabel: 'Retry',
      onAction: retryAction,
      persistent: true,
      ...options
    })
  }), [addToast])

  return {
    toasts,
    toast,
    removeToast,
    clearAllToasts,
    ToastContainer: () => (
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    )
  }
}

export default Toast
