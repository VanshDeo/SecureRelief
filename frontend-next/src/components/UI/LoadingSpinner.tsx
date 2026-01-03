import React from 'react'
import { motion } from 'framer-motion'

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'avalanche', 
  className = '',
  text = '',
  inline = false,
  'aria-label': ariaLabel
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const colorClasses = {
    avalanche: 'border-avalanche-500',
    white: 'border-white',
    gray: 'border-gray-500',
    success: 'border-success-500',
    warning: 'border-warning-500'
  }

  const Container = inline ? 'span' : 'div';
  const containerClasses = inline 
    ? 'inline-flex items-center gap-2' 
    : 'flex flex-col items-center justify-center';

  return (
    <Container 
      className={`${containerClasses} ${className}`}
      role="status"
      aria-live="polite"
      aria-label={ariaLabel || text || 'Loading content'}
    >
      <motion.div
        className={`
          ${sizeClasses[size]} 
          border-4 
          ${colorClasses[color]} 
          border-t-transparent 
          rounded-full
        `}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
        aria-hidden="true"
      />
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`mt-3 text-sm ${
            color === 'white' ? 'text-white' : 'text-gray-600'
          } ${inline ? 'mt-0' : 'mt-3'}`}
        >
          {text}
        </motion.p>
      )}
    </Container>
  )
}

export default LoadingSpinner
