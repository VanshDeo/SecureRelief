'use client';

/**
 * Comprehensive Error Handling Utility
 * Next.js + TypeScript safe (client-only)
 */

import toast from 'react-hot-toast';
import { showActionToast } from '../components/UI/ActionToast';

/* =========================
   Types & Constants
========================= */

type ErrorCategory =
  | 'wallet'
  | 'network'
  | 'contract'
  | 'api'
  | 'validation'
  | 'permission'
  | 'transaction';

type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export const ERROR_CATEGORIES: Record<string, ErrorCategory> = {
  WALLET: 'wallet',
  NETWORK: 'network',
  CONTRACT: 'contract',
  API: 'api',
  VALIDATION: 'validation',
  PERMISSION: 'permission',
  TRANSACTION: 'transaction',
};

export const ERROR_SEVERITY: Record<string, ErrorSeverity> = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

export interface AppError {
  code: string;
  message: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  action?: string;
  originalError?: unknown;
}

interface ErrorContext {
  onAction?: () => void;
  [key: string]: any;
}

interface LoggedError extends AppError {
  timestamp: string;
  context?: ErrorContext;
  userAgent?: string;
  url?: string;
}

/* =========================
   Error Codes
========================= */

export const ERROR_CODES: Record<string, AppError> = {
  WALLET_NOT_CONNECTED: {
    code: 'WALLET_NOT_CONNECTED',
    message: 'Please connect your wallet to continue',
    category: 'wallet',
    severity: 'medium',
    action: 'Connect Wallet',
  },

  TRANSACTION_REJECTED: {
    code: 'TRANSACTION_REJECTED',
    message: 'Transaction was rejected by user',
    category: 'transaction',
    severity: 'low',
  },

  WRONG_NETWORK: {
    code: 'WRONG_NETWORK',
    message: 'Please switch to Avalanche Fuji Testnet',
    category: 'network',
    severity: 'medium',
    action: 'Switch Network',
  },

  INSUFFICIENT_FUNDS: {
    code: 'INSUFFICIENT_FUNDS',
    message: 'Insufficient funds for this transaction',
    category: 'contract',
    severity: 'high',
  },

  API_TIMEOUT: {
    code: 'API_TIMEOUT',
    message: 'Request timed out. Please try again.',
    category: 'api',
    severity: 'medium',
  },
};

/* =========================
   Error Handler Class
========================= */

export class ErrorHandler {
  private errorLog: LoggedError[] = [];
  private readonly maxLogSize = 100;

  /* ---------- Error Parsing ---------- */

  parseError(error: unknown): AppError {
    if (typeof error === 'string') {
      return {
        code: 'UNKNOWN_ERROR',
        message: error,
        category: 'api',
        severity: 'medium',
        originalError: error,
      };
    }

    const err = error as any;
    const message = err?.message?.toLowerCase?.() || '';
    const code = err?.code;

    if (code === 4001 || message.includes('user rejected')) {
      return ERROR_CODES.TRANSACTION_REJECTED;
    }

    if (message.includes('insufficient funds')) {
      return ERROR_CODES.INSUFFICIENT_FUNDS;
    }

    if (message.includes('network') || message.includes('chain')) {
      return ERROR_CODES.WRONG_NETWORK;
    }

    if (err?.response?.status >= 500) {
      return {
        code: 'SERVER_ERROR',
        message: 'Server error occurred. Please try again later.',
        category: 'api',
        severity: 'high',
      };
    }

    if (err?.response?.status === 401 || err?.response?.status === 403) {
      return {
        code: 'UNAUTHORIZED',
        message: 'Access denied. Please check your permissions.',
        category: 'permission',
        severity: 'high',
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: err?.message || 'An unexpected error occurred',
      category: 'api',
      severity: 'medium',
      originalError: error,
    };
  }

  /* ---------- Main Handler ---------- */

  handleError(error: unknown, context: ErrorContext = {}): AppError {
    const parsed = this.parseError(error);

    this.logError({
      ...parsed,
      context,
      timestamp: new Date().toISOString(),
      userAgent:
        typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    });

    this.showErrorNotification(parsed, context);
    return parsed;
  }

  /* ---------- Notifications ---------- */

  private showErrorNotification(error: AppError, context: ErrorContext) {
    const { message, severity, action } = error;

    const duration = this.getToastDuration(severity);
    const style = this.getToastStyle(severity);

    if (action && context.onAction) {
      showActionToast(message, {
        action,
        onAction: context.onAction,
        severity: 'error',
        duration,
      });
    } else {
      toast.error(message, {
        duration,
        position: 'top-right',
        style,
      });
    }
  }

  showSuccess(message: string) {
    toast.success(message, { duration: 4000, position: 'top-right' });
  }

  showInfo(message: string) {
    toast(message, { duration: 3000, position: 'top-right', icon: 'ℹ️' });
  }

  showWarning(message: string) {
    toast(message, {
      duration: 5000,
      position: 'top-right',
      icon: '⚠️',
    });
  }

  /* ---------- Helpers ---------- */

  private getToastDuration(severity: ErrorSeverity): number {
    switch (severity) {
      case 'low':
        return 3000;
      case 'medium':
        return 5000;
      case 'high':
        return 7000;
      case 'critical':
        return 10000;
      default:
        return 4000;
    }
  }

  private getToastStyle(severity: ErrorSeverity) {
    if (severity === 'critical' || severity === 'high') {
      return {
        background: '#FEE2E2',
        color: '#991B1B',
        border: '1px solid #DC2626',
      };
    }
    return {};
  }

  /* ---------- Logging ---------- */

  private logError(error: LoggedError) {
    this.errorLog.unshift(error);
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.pop();
    }

    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Handler');
      console.error(error.message);
      console.error('Category:', error.category);
      console.error('Severity:', error.severity);
      console.error('Context:', error.context);
      console.groupEnd();
    }
  }

  getRecentErrors(count = 10): LoggedError[] {
    return this.errorLog.slice(0, count);
  }

  clearErrorLog() {
    this.errorLog = [];
  }
}

/* =========================
   Singleton + Helpers
========================= */

export const errorHandler = new ErrorHandler();

export const handleError = (error: unknown, context?: ErrorContext) =>
  errorHandler.handleError(error, context);

export const showSuccess = (message: string) =>
  errorHandler.showSuccess(message);

export const showInfo = (message: string) =>
  errorHandler.showInfo(message);

export const showWarning = (message: string) =>
  errorHandler.showWarning(message);

export default errorHandler;
