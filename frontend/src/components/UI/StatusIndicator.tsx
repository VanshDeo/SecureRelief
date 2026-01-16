/**
 * Enhanced Status Indicator Component
 * Professional status indicators with animations and tooltips
 */

import React from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  XCircle, 
  Loader2,
  Info,
  AlertTriangle
} from 'lucide-react'

const STATUS_CONFIG = {
  success: {
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
    label: 'Success'
  },
  error: {
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300',
    label: 'Error'
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-300',
    label: 'Warning'
  },
  info: {
    icon: Info,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
    label: 'Info'
  },
  pending: {
    icon: Clock,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300',
    label: 'Pending'
  },
  loading: {
    icon: Loader2,
    color: 'text-avalanche-600',
    bgColor: 'bg-avalanche-100',
    borderColor: 'border-avalanche-300',
    label: 'Loading'
  }
}

const StatusIndicator = ({ 
  status = 'info', 
  message, 
  showLabel = false, 
  size = 'medium',
  animated = true,
  tooltip,
  className = ''
}) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.info
  const Icon = config.icon

  const sizeClasses = {
    small: {
      container: 'px-2 py-1',
      icon: 'w-4 h-4',
      text: 'text-sm'
    },
    medium: {
      container: 'px-3 py-2',
      icon: 'w-5 h-5',
      text: 'text-base'
    },
    large: {
      container: 'px-4 py-3',
      icon: 'w-6 h-6',
      text: 'text-lg'
    }
  }

  const currentSize = sizeClasses[size]

  const containerClass = `
    inline-flex items-center space-x-2 rounded-lg border
    ${config.bgColor} ${config.borderColor} ${currentSize.container} ${className}
  `

  const animationProps = animated ? {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.2 }
  } : {}

  const content = (
    <motion.div
      className={containerClass}
      title={tooltip}
      {...animationProps}
    >
      <Icon 
        className={`${config.color} ${currentSize.icon} ${status === 'loading' ? 'animate-spin' : ''}`}
      />
      {(showLabel || message) && (
        <span className={`${config.color} ${currentSize.text} font-medium`}>
          {message || config.label}
        </span>
      )}
    </motion.div>
  )

  return content
}

export default StatusIndicator

// Preset status components for common use cases
export const SuccessStatus = (props) => (
  <StatusIndicator status="success" {...props} />
)

export const ErrorStatus = (props) => (
  <StatusIndicator status="error" {...props} />
)

export const WarningStatus = (props) => (
  <StatusIndicator status="warning" {...props} />
)

export const LoadingStatus = (props) => (
  <StatusIndicator status="loading" animated={true} {...props} />
)

export const PendingStatus = (props) => (
  <StatusIndicator status="pending" {...props} />
)
