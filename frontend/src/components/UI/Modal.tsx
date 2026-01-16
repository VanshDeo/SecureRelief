'use client';

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react'
import { useFocusTrap, useKeyboardNavigation } from '../../hooks/useAccessibility'

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  type = 'default',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
  overlayClassName = '',
  contentClassName = '',
  ...props
}) => {
  const focusTrapRef = useFocusTrap(isOpen);

  const keyboardNavRef = useKeyboardNavigation({
    onEscape: closeOnEscape ? onClose : undefined,
    enabled: isOpen
  });

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl'
  }

  const typeConfig = {
    default: {
      iconColor: 'text-gray-400',
      borderColor: 'border-gray-200'
    },
    success: {
      icon: CheckCircle,
      iconColor: 'text-success-500',
      borderColor: 'border-success-200'
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-warning-500',
      borderColor: 'border-warning-200'
    },
    error: {
      icon: AlertCircle,
      iconColor: 'text-red-500',
      borderColor: 'border-red-200'
    },
    info: {
      icon: Info,
      iconColor: 'text-blue-500',
      borderColor: 'border-blue-200'
    }
  }

  const config = typeConfig[type]
  const Icon = config.icon

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          ref={keyboardNavRef}
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby={title ? 'modal-title' : undefined}
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity ${overlayClassName}`}
            onClick={handleOverlayClick}
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="flex items-center justify-center min-h-full p-4">
            <motion.div
              ref={focusTrapRef}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, type: 'spring', stiffness: 300, damping: 30 }}
              className={`
                relative w-full ${sizeClasses[size]} 
                bg-white dark:bg-gray-800 rounded-xl shadow-xl 
                border ${config.borderColor} dark:border-gray-700
                max-h-[90vh] overflow-hidden
                ${contentClassName}
              `}
              {...props}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    {Icon && (
                      <Icon className={`h-6 w-6 ${config.iconColor} mr-3`} aria-hidden="true" />
                    )}
                    <h3
                      id="modal-title"
                      className="text-lg font-semibold text-gray-900 dark:text-white"
                    >
                      {title}
                    </h3>
                  </div>

                  {showCloseButton && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onClose}
                      className="p-2 text-gray-400 transition-colors duration-200 rounded-lg  hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5" aria-hidden="true" />
                    </motion.button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className={`p-6 overflow-y-auto max-h-[calc(90vh-140px)] ${className}`}>
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default Modal
