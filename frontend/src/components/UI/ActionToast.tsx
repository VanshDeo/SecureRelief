'use client';

import React from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Professional Action Toast Component
 * Provides actionable error messages with buttons
 */
const ActionToast = ({ message, action, onAction, onDismiss, severity = 'error' }) => {
  const getSeverityStyles = () => {
    switch (severity) {
      case 'error':
        return {
          container: 'bg-red-50 border-red-200',
          text: 'text-red-800',
          button: 'bg-red-600 hover:bg-red-700 text-white',
          dismissButton: 'text-red-400 hover:text-red-600'
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200',
          text: 'text-yellow-800',
          button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
          dismissButton: 'text-yellow-400 hover:text-yellow-600'
        };
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200',
          text: 'text-blue-800',
          button: 'bg-blue-600 hover:bg-blue-700 text-white',
          dismissButton: 'text-blue-400 hover:text-blue-600'
        };
      default:
        return {
          container: 'bg-gray-50 border-gray-200',
          text: 'text-gray-800',
          button: 'bg-gray-600 hover:bg-gray-700 text-white',
          dismissButton: 'text-gray-400 hover:text-gray-600'
        };
    }
  };

  const styles = getSeverityStyles();

  return (
    <div className={`${styles.container} border rounded-lg p-4 shadow-lg max-w-md`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 mr-3">
          <p className={`${styles.text} text-sm font-medium leading-5`}>
            {message}
          </p>
        </div>

        <button
          onClick={onDismiss}
          className={`${styles.dismissButton} flex-shrink-0 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors`}
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {action && onAction && (
        <div className="flex justify-end mt-3">
          <button
            onClick={() => {
              onAction();
              onDismiss();
            }}
            className={`${styles.button} px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50`}
          >
            {action}
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Show actionable toast notification
 */
export const showActionToast = (message, { action, onAction, severity = 'error', duration = 6000 }) => {
  return toast.custom(
    (t) => (
      <ActionToast
        message={message}
        action={action}
        onAction={onAction}
        onDismiss={() => toast.dismiss(t.id)}
        severity={severity}
      />
    ),
    {
      duration,
      position: 'top-right'
    }
  );
};

export default ActionToast;
