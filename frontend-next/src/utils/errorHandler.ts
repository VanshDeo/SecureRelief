/**
 * Comprehensive Error Handling Utility
 * Provides standardized error handling and user feedback across the application
 */

import toast from 'react-hot-toast'
import { showActionToast } from '../components/UI/ActionToast'

// Error categories
export const ERROR_CATEGORIES = {
  WALLET: 'wallet',
  NETWORK: 'network',
  CONTRACT: 'contract',
  API: 'api',
  VALIDATION: 'validation',
  PERMISSION: 'permission',
  TRANSACTION: 'transaction'
}

// Error severity levels
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
}

// Common error codes and messages
export const ERROR_CODES = {
  // Wallet errors
  WALLET_NOT_CONNECTED: {
    code: 'WALLET_NOT_CONNECTED',
    message: 'Please connect your wallet to continue',
    category: ERROR_CATEGORIES.WALLET,
    severity: ERROR_SEVERITY.MEDIUM,
    action: 'Connect Wallet'
  },
  WALLET_CONNECTION_REJECTED: {
    code: 'WALLET_CONNECTION_REJECTED',
    message: 'Wallet connection was rejected by user',
    category: ERROR_CATEGORIES.WALLET,
    severity: ERROR_SEVERITY.LOW
  },
  WRONG_NETWORK: {
    code: 'WRONG_NETWORK',
    message: 'Please switch to Avalanche Fuji Testnet',
    category: ERROR_CATEGORIES.NETWORK,
    severity: ERROR_SEVERITY.MEDIUM,
    action: 'Switch Network'
  },

  // Contract errors
  INSUFFICIENT_FUNDS: {
    code: 'INSUFFICIENT_FUNDS',
    message: 'Insufficient funds for this transaction',
    category: ERROR_CATEGORIES.CONTRACT,
    severity: ERROR_SEVERITY.HIGH
  },
  TRANSACTION_REJECTED: {
    code: 'TRANSACTION_REJECTED',
    message: 'Transaction was rejected by user',
    category: ERROR_CATEGORIES.TRANSACTION,
    severity: ERROR_SEVERITY.LOW
  },
  CONTRACT_CALL_FAILED: {
    code: 'CONTRACT_CALL_FAILED',
    message: 'Smart contract interaction failed',
    category: ERROR_CATEGORIES.CONTRACT,
    severity: ERROR_SEVERITY.HIGH
  },

  // Permission errors
  ADMIN_REQUIRED: {
    code: 'ADMIN_REQUIRED',
    message: 'Admin privileges required for this action',
    category: ERROR_CATEGORIES.PERMISSION,
    severity: ERROR_SEVERITY.MEDIUM
  },
  VENDOR_REQUIRED: {
    code: 'VENDOR_REQUIRED',
    message: 'Vendor privileges required for this action',
    category: ERROR_CATEGORIES.PERMISSION,
    severity: ERROR_SEVERITY.MEDIUM
  },

  // API errors
  API_UNAVAILABLE: {
    code: 'API_UNAVAILABLE',
    message: 'Backend service is temporarily unavailable',
    category: ERROR_CATEGORIES.API,
    severity: ERROR_SEVERITY.LOW
  },
  API_TIMEOUT: {
    code: 'API_TIMEOUT',
    message: 'Request timed out. Please try again.',
    category: ERROR_CATEGORIES.API,
    severity: ERROR_SEVERITY.MEDIUM
  },

  // Validation errors
  INVALID_INPUT: {
    code: 'INVALID_INPUT',
    message: 'Please check your input and try again',
    category: ERROR_CATEGORIES.VALIDATION,
    severity: ERROR_SEVERITY.LOW
  },
  REQUIRED_FIELD: {
    code: 'REQUIRED_FIELD',
    message: 'This field is required',
    category: ERROR_CATEGORIES.VALIDATION,
    severity: ERROR_SEVERITY.LOW
  }
}

/**
 * Enhanced error handler class
 */
export class ErrorHandler {
  constructor() {
    this.errorLog = []
    this.maxLogSize = 100
  }

  /**
   * Parse and categorize error
   */
  parseError(error) {
    if (typeof error === 'string') {
      return {
        code: 'UNKNOWN_ERROR',
        message: error,
        category: ERROR_CATEGORIES.API,
        severity: ERROR_SEVERITY.MEDIUM,
        originalError: error
      }
    }

    // Check for common error patterns
    const errorMessage = error?.message?.toLowerCase() || ''
    const errorCode = error?.code || ''

    // Wallet/MetaMask errors
    if (errorCode === 4001 || errorMessage.includes('user rejected')) {
      return ERROR_CODES.TRANSACTION_REJECTED
    }

    if (errorCode === -32002 || errorMessage.includes('already pending')) {
      return {
        code: 'TRANSACTION_PENDING',
        message: 'A transaction is already pending. Please wait.',
        category: ERROR_CATEGORIES.TRANSACTION,
        severity: ERROR_SEVERITY.LOW
      }
    }

    if (errorMessage.includes('insufficient funds')) {
      return ERROR_CODES.INSUFFICIENT_FUNDS
    }

    if (errorMessage.includes('network') || errorMessage.includes('chain')) {
      return ERROR_CODES.WRONG_NETWORK
    }

    // Contract errors
    if (errorMessage.includes('revert') || errorMessage.includes('execution reverted')) {
      return {
        ...ERROR_CODES.CONTRACT_CALL_FAILED,
        message: this.extractRevertReason(error) || ERROR_CODES.CONTRACT_CALL_FAILED.message
      }
    }

    // API errors
    if (error?.response?.status >= 500) {
      return {
        code: 'SERVER_ERROR',
        message: 'Server error occurred. Please try again later.',
        category: ERROR_CATEGORIES.API,
        severity: ERROR_SEVERITY.HIGH
      }
    }

    if (error?.response?.status === 404) {
      return {
        code: 'NOT_FOUND',
        message: 'Requested resource not found',
        category: ERROR_CATEGORIES.API,
        severity: ERROR_SEVERITY.MEDIUM
      }
    }

    if (error?.response?.status === 401 || error?.response?.status === 403) {
      return {
        code: 'UNAUTHORIZED',
        message: 'Access denied. Please check your permissions.',
        category: ERROR_CATEGORIES.PERMISSION,
        severity: ERROR_SEVERITY.HIGH
      }
    }

    // Network/timeout errors
    if (error?.code === 'NETWORK_ERROR' || errorMessage.includes('timeout')) {
      return ERROR_CODES.API_TIMEOUT
    }

    // Default unknown error
    return {
      code: 'UNKNOWN_ERROR',
      message: error?.message || 'An unexpected error occurred',
      category: ERROR_CATEGORIES.API,
      severity: ERROR_SEVERITY.MEDIUM,
      originalError: error
    }
  }

  /**
   * Extract revert reason from contract error
   */
  extractRevertReason(error) {
    const message = error?.message || ''

    // Try to extract custom revert messages
    const revertMatch = message.match(/revert (.+?)(?:\s|$)/)
    if (revertMatch) {
      return revertMatch[1]
    }

    // Common revert reasons
    if (message.includes('OnlyAdmin')) {
      return 'Only administrators can perform this action'
    }
    if (message.includes('OnlyVendor')) {
      return 'Only verified vendors can perform this action'
    }
    if (message.includes('InsufficientFunds')) {
      return 'Insufficient funds for this operation'
    }
    if (message.includes('ZoneNotActive')) {
      return 'This disaster zone is not currently active'
    }
    if (message.includes('VoucherExpired')) {
      return 'This voucher has expired'
    }
    if (message.includes('VoucherAlreadyUsed')) {
      return 'This voucher has already been used'
    }

    return null
  }

  /**
   * Handle error with appropriate user feedback
   */
  handleError(error, context = {}) {
    const parsedError = this.parseError(error)

    // Log error for debugging
    this.logError({
      ...parsedError,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    })

    // Show user-friendly notification
    this.showErrorNotification(parsedError, context)

    return parsedError
  }

  /**
   * Show error notification to user
   */
  showErrorNotification(error, context = {}) {
    const { severity, message, action } = error

    const toastOptions = {
      duration: this.getToastDuration(severity),
      position: 'top-right',
      style: this.getToastStyle(severity)
    }

    if (action && context.onAction) {
      // Use professional ActionToast for actionable errors
      showActionToast(message, {
        action,
        onAction: context.onAction,
        severity: 'error',
        duration: toastOptions.duration
      })
    } else {
      toast.error(message, toastOptions)
    }
  }

  /**
   * Show success notification
   */
  showSuccess(message, options = {}) {
    if (options.action && options.onAction) {
      showActionToast(message, {
        action: options.action,
        onAction: options.onAction,
        severity: 'info',
        duration: options.duration || 4000
      })
    } else {
      toast.success(message, {
        duration: 4000,
        position: 'top-right',
        ...options
      })
    }
  }

  /**
   * Show info notification
   */
  showInfo(message, options = {}) {
    if (options.action && options.onAction) {
      showActionToast(message, {
        action: options.action,
        onAction: options.onAction,
        severity: 'info',
        duration: options.duration || 3000
      })
    } else {
      toast(message, {
        duration: 3000,
        position: 'top-right',
        icon: 'ℹ️',
        ...options
      })
    }
  }

  /**
   * Show warning notification
   */
  showWarning(message, options = {}) {
    if (options.action && options.onAction) {
      showActionToast(message, {
        action: options.action,
        onAction: options.onAction,
        severity: 'warning',
        duration: options.duration || 5000
      })
    } else {
      toast(message, {
        duration: 5000,
        position: 'top-right',
        icon: '⚠️',
        style: {
          background: '#FEF3C7',
          color: '#92400E',
          border: '1px solid #F59E0B'
        },
        ...options
      })
    }
  }

  /**
   * Get toast duration based on severity
   */
  getToastDuration(severity) {
    switch (severity) {
      case ERROR_SEVERITY.LOW:
        return 3000
      case ERROR_SEVERITY.MEDIUM:
        return 5000
      case ERROR_SEVERITY.HIGH:
        return 7000
      case ERROR_SEVERITY.CRITICAL:
        return 10000
      default:
        return 4000
    }
  }

  /**
   * Get toast style based on severity
   */
  getToastStyle(severity) {
    switch (severity) {
      case ERROR_SEVERITY.CRITICAL:
        return {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '2px solid #DC2626',
          fontWeight: 'bold'
        }
      case ERROR_SEVERITY.HIGH:
        return {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #DC2626'
        }
      default:
        return {}
    }
  }

  /**
   * Log error for debugging and analytics
   */
  logError(errorData) {
    // Add to in-memory log
    this.errorLog.unshift(errorData)
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.pop()
    }

    // Console log in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Handler')
      console.error('Error:', errorData.message)
      console.error('Category:', errorData.category)
      console.error('Severity:', errorData.severity)
      console.error('Context:', errorData.context)
      if (errorData.originalError) {
        console.error('Original Error:', errorData.originalError)
      }
      console.groupEnd()
    }

    // TODO: Send to analytics service in production
    // this.sendToAnalytics(errorData)
  }

  /**
   * Get recent errors for debugging
   */
  getRecentErrors(count = 10) {
    return this.errorLog.slice(0, count)
  }

  /**
   * Clear error log
   */
  clearErrorLog() {
    this.errorLog = []
  }
}

// Create singleton instance
export const errorHandler = new ErrorHandler()

// Convenience functions
export const handleError = (error, context = {}) => errorHandler.handleError(error, context)
export const showSuccess = (message, options = {}) => errorHandler.showSuccess(message, options)
export const showInfo = (message, options = {}) => errorHandler.showInfo(message, options)
export const showWarning = (message, options = {}) => errorHandler.showWarning(message, options)

export default errorHandler
