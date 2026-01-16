import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<any>;
  showDetails?: boolean;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  onGoHome?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
}

/**
 * Error boundary component for catching and displaying errors gracefully
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
      hasError: true
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // In production, you might want to log to an error reporting service
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleGoHome = () => {
    if (this.props.onGoHome) {
      this.props.onGoHome();
    } else {
      window.location.href = '/';
    }
  };

  render() {
    if (this.state.hasError) {
      const { fallback: CustomFallback, showDetails = false } = this.props;

      if (CustomFallback) {
        return (
          <CustomFallback
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            onRetry={this.handleRetry}
            onGoHome={this.handleGoHome}
          />
        );
      }

      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onRetry={this.handleRetry}
          onGoHome={this.handleGoHome}
          showDetails={showDetails}
          retryCount={this.state.retryCount}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Default error fallback component with accessibility and animations
 */
const ErrorFallback = ({
  error,
  errorInfo,
  onRetry,
  onGoHome,
  showDetails = false,
  retryCount = 0
}) => {
  const maxRetries = 3;
  const canRetry = retryCount < maxRetries;

  return (
    <div
      className="flex items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900"
      role="alert"
      aria-live="assertive"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-6 text-center bg-white rounded-lg shadow-lg dark:bg-gray-800"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-4"
        >
          <div className="p-3 bg-red-100 rounded-full dark:bg-red-900/30">
            <AlertTriangle
              className="w-8 h-8 text-red-600 dark:text-red-400"
              aria-hidden="true"
            />
          </div>
        </motion.div>

        <h1 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
          Oops! Something went wrong
        </h1>

        <p className="mb-6 text-gray-600 dark:text-gray-400">
          We encountered an unexpected error. Don't worry, our team has been notified.
        </p>

        {showDetails && error && (
          <details className="mb-6 text-left">
            <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              Technical Details
            </summary>
            <div className="p-3 mt-2 overflow-auto font-mono text-xs text-gray-800 bg-gray-100 rounded dark:bg-gray-700 dark:text-gray-200 max-h-32">
              <p className="font-semibold">Error:</p>
              <p className="mb-2">{error.toString()}</p>
              {errorInfo?.componentStack && (
                <>
                  <p className="font-semibold">Component Stack:</p>
                  <pre className="whitespace-pre-wrap">{errorInfo.componentStack}</pre>
                </>
              )}
            </div>
          </details>
        )}

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          {canRetry && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRetry}
              className="flex items-center justify-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Retry loading the component"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              Try Again {retryCount > 0 && `(${maxRetries - retryCount} left)`}
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGoHome}
            className="flex items-center justify-center gap-2 px-4 py-2 text-white transition-colors bg-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            aria-label="Go back to home page"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            Go Home
          </motion.button>
        </div>

        {!canRetry && (
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Maximum retry attempts reached. Please refresh the page or contact support.
          </p>
        )}
      </motion.div>
    </div>
  );
};

/**
 * Hook for error handling in functional components
 */
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((error) => {
    setError(error);
    console.error('Error caught by useErrorHandler:', error);
  }, []);

  React.useEffect(() => {
    const handleUnhandledRejection = (event) => {
      handleError(new Error(`Unhandled promise rejection: ${event.reason}`));
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [handleError]);

  return { error, handleError, resetError };
};

/**
 * Higher-order component for wrapping components with error boundary
 */
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

export default ErrorBoundary;
