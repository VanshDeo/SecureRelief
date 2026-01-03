import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useFocusTrap, useKeyboardNavigation } from '../../hooks/useAccessibility.jsx';

/**
 * Accessible modal component with focus management and animations
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
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
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    full: 'max-w-full'
  };

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

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

          {/* Modal container */}
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              ref={focusTrapRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, type: 'spring', stiffness: 300, damping: 30 }}
              className={`
                relative w-full ${sizeClasses[size]} bg-white dark:bg-gray-800 
                rounded-lg shadow-xl transform transition-all
                ${contentClassName}
              `}
              {...props}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  {title && (
                    <h2 
                      id="modal-title"
                      className="text-lg font-semibold text-gray-900 dark:text-white"
                    >
                      {title}
                    </h2>
                  )}
                  
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="
                        p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200
                        rounded-md hover:bg-gray-100 dark:hover:bg-gray-700
                        transition-colors focus:outline-none focus:ring-2 
                        focus:ring-blue-500 focus:ring-offset-2
                      "
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5" aria-hidden="true" />
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className={`p-6 ${className}`}>
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

/**
 * Modal hook for easier state management
 */
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = React.useState(initialState);

  const open = React.useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = React.useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen
  };
};

/**
 * Confirmation modal component
 */
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger' | 'warning' | 'info'
  loading = false,
  ...props
}) => {
  const variants = {
    danger: {
      icon: '⚠️',
      confirmButtonClass: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
    },
    warning: {
      icon: '⚠️',
      confirmButtonClass: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
    },
    info: {
      icon: 'ℹ️',
      confirmButtonClass: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
    }
  };

  const config = variants[variant];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      {...props}
    >
      <div className="text-center">
        <div className="text-4xl mb-4">{config.icon}</div>
        <p className="text-gray-700 dark:text-gray-300 mb-6">{message}</p>
        
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            disabled={loading}
            className="
              px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800
              rounded-md transition-colors focus:outline-none focus:ring-2
              focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50
            "
          >
            {cancelText}
          </button>
          
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`
              px-4 py-2 text-white rounded-md transition-colors
              focus:outline-none focus:ring-2 focus:ring-offset-2
              disabled:opacity-50 ${config.confirmButtonClass}
            `}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {confirmText}
              </div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default Modal;
