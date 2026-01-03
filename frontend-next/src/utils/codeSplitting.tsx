
/**
 * Code Splitting Utilities
 * Provides lazy loading and route-based code splitting components
 */

import { Suspense, lazy, forwardRef, useState, useRef, useEffect } from 'react';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import ErrorBoundary from '@/components/UI/ErrorBoundary';
import { performanceMonitor } from '@/utils/performance.jsx';

// Simple fallback loading component if LoadingSpinner fails
const SimpleFallback = ({ message = "Loading..." }) => (
  <div className="flex items-center justify-center p-4">
    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    <span className="ml-2 text-gray-600">{message}</span>
  </div>
);

/**
 * Higher-order component for lazy loading with enhanced error handling
 */
export const withLazyLoading = (
  importFn,
  options = {}
) => {
  const {
    fallback = <SimpleFallback message="Loading component..." />,
    onError = null,
    retryCount = 3,
    retryDelay = 1000,
    chunkName = 'lazy-component'
  } = options;

  // Enhanced lazy component with retry logic
  const LazyComponent = lazy(async () => {
    let retries = 0;
    
    const loadWithRetry = async () => {
      try {
        performanceMonitor.mark(`lazy-load-${chunkName}`);
        const module = await importFn();
        performanceMonitor.measure(`lazy-load-${chunkName}`);
        return module;
      } catch (error) {
        retries++;
        
        if (retries <= retryCount) {
          console.warn(`Lazy loading failed, retrying... (${retries}/${retryCount})`);
          await new Promise(resolve => setTimeout(resolve, retryDelay * retries));
          return loadWithRetry();
        }
        
        if (onError) {
          onError(error);
        }
        throw error;
      }
    };

    return loadWithRetry();
  });

  // Return wrapped component with Suspense and ErrorBoundary
  return forwardRef((props, ref) => (
    <ErrorBoundary
      fallback={
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 text-red-500">
            <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Failed to load component</h3>
          <p className="mb-4 text-gray-600">There was an error loading this part of the application.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700"
          >
            Reload Page
          </button>
        </div>
      }
      onError={(error, errorInfo) => {
        console.error('Lazy component error:', error, errorInfo);
        if (onError) onError(error);
      }}
    >
      <Suspense fallback={fallback}>
        <LazyComponent {...props} ref={ref} />
      </Suspense>
    </ErrorBoundary>
  ));
};

/**
 * Route-based lazy loading for React Router
 */
export const createLazyRoute = (importFn, options = {}) => {
  const Component = withLazyLoading(importFn, {
    fallback: (
      <div className="flex items-center justify-center min-h-screen">
        <SimpleFallback message="Loading page..." />
      </div>
    ),
    ...options
  });

  return Component;
};

/**
 * Preload route component for faster navigation
 */
export const preloadRoute = (importFn, priority = 'low') => {
  if (typeof importFn !== 'function') {
    console.warn('preloadRoute expects a function that returns a dynamic import');
    return;
  }

  // Use requestIdleCallback for low priority preloading
  const preload = () => {
    try {
      importFn().catch(error => {
        console.warn('Route preload failed:', error);
      });
    } catch (error) {
      console.warn('Route preload error:', error);
    }
  };

  if (priority === 'high') {
    // High priority - preload immediately
    preload();
  } else if (priority === 'medium') {
    // Medium priority - preload after a short delay
    setTimeout(preload, 100);
  } else {
    // Low priority - preload when browser is idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(preload, { timeout: 5000 });
    } else {
      setTimeout(preload, 2000);
    }
  }
};

/**
 * Component-level code splitting
 */
export const LazySection = ({ 
  children, 
  fallback = <SimpleFallback />,
  threshold = 0.1,
  rootMargin = '50px',
  triggerOnce = true 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return (
    <div ref={ref} className="min-h-[100px]">
      {isVisible ? children : fallback}
    </div>
  );
};

/**
 * Bundle splitting for large dependencies
 */
export const createAsyncChunk = (chunkName, dependencies) => {
  return async () => {
    performanceMonitor.mark(`chunk-${chunkName}`);
    
    try {
      // Load dependencies in parallel
      const modules = await Promise.all(
        dependencies.map(dep => dep())
      );
      
      performanceMonitor.measure(`chunk-${chunkName}`);
      
      // Return combined module
      return modules.reduce((combined, module) => ({
        ...combined,
        ...module
      }), {});
    } catch (error) {
      console.error(`Failed to load chunk ${chunkName}:`, error);
      throw error;
    }
  };
};

/**
 * Progressive feature loading
 */
export const ProgressiveFeature = ({ 
  feature, 
  fallback = null,
  enableCondition = true 
}) => {
  const [FeatureComponent, setFeatureComponent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enableCondition) return;

    setLoading(true);
    setError(null);

    feature()
      .then(module => {
        setFeatureComponent(() => module.default || module);
      })
      .catch(err => {
        console.error('Progressive feature loading failed:', err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [feature, enableCondition]);

  if (!enableCondition) {
    return fallback;
  }

  if (loading) {
    return fallback || <SimpleFallback />;
  }

  if (error) {
    return fallback;
  }

  return FeatureComponent ? <FeatureComponent /> : fallback;
};

/**
 * Micro-frontend loader
 */
export const MicroFrontend = ({ 
  name,
  url,
  fallback = <SimpleFallback />,
  onError = null 
}) => {
  const [Component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMicroFrontend = async () => {
      try {
        performanceMonitor.mark(`microfrontend-${name}`);
        
        // Dynamic import of micro-frontend
        const module = await import(/* @vite-ignore */ url);
        
        performanceMonitor.measure(`microfrontend-${name}`);
        setComponent(() => module.default || module);
      } catch (err) {
        console.error(`Failed to load micro-frontend ${name}:`, err);
        setError(err);
        if (onError) onError(err);
      } finally {
        setLoading(false);
      }
    };

    loadMicroFrontend();
  }, [name, url, onError]);

  if (loading) return fallback;
  if (error || !Component) return fallback;

  return <Component />;
};

/**
 * Resource-based code splitting
 */
export const ResourceLoader = ({ 
  resources,
  children,
  fallback = <SimpleFallback />
}) => {
  const [loadedResources, setLoadedResources] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResources = async () => {
      const resourceEntries = Object.entries(resources);
      const loadedEntries = await Promise.allSettled(
        resourceEntries.map(async ([key, loader]) => {
          try {
            const resource = await loader();
            return [key, resource];
          } catch (error) {
            console.error(`Failed to load resource ${key}:`, error);
            return [key, null];
          }
        })
      );

      const resourceMap = Object.fromEntries(
        loadedEntries
          .filter(result => result.status === 'fulfilled')
          .map(result => result.value)
          .filter(([key, value]) => value !== null)
      );

      setLoadedResources(resourceMap);
      setLoading(false);
    };

    loadResources();
  }, [resources]);

  if (loading) return fallback;

  return children(loadedResources);
};

// Export commonly used lazy-loaded components
export const LazyRoutes = {
  HomePage: createLazyRoute(() => import('@/pages/HomePage'), { chunkName: 'home' }),
  Login: createLazyRoute(() => import('@/pages/Login'), { chunkName: 'auth' }),
  Register: createLazyRoute(() => import('@/pages/Register'), { chunkName: 'auth' }),
  DonorDashboard: createLazyRoute(() => import('@/pages/DonorDashboard'), { chunkName: 'donor' }),
  AdminDashboard: createLazyRoute(() => import('@/pages/AdminDashboard'), { chunkName: 'admin' }),
  GovernmentDashboard: createLazyRoute(() => import('@/pages/GovernmentDashboard'), { chunkName: 'government' }),
  OracleDashboard: createLazyRoute(() => import('@/pages/OracleDashboard'), { chunkName: 'oracle' }),
  DisasterDetails: createLazyRoute(() => import('@/pages/DisasterDetails'), { chunkName: 'disaster-details' }),
  TransparencyPortal: createLazyRoute(() => import('@/pages/TransparencyPortal'), { chunkName: 'transparency' }),
  ProofGallery: createLazyRoute(() => import('@/pages/ProofGallery'), { chunkName: 'proof-gallery' }),
  APITestPage: createLazyRoute(() => import('@/pages/APITestPage'), { chunkName: 'dev-tools' })
};

// Preload critical routes
export const preloadCriticalRoutes = () => {
  // Preload most commonly accessed routes
  preloadRoute(() => import('@/pages/HomePage'), 'high');
  preloadRoute(() => import('@/pages/DonorDashboard'), 'medium');
  preloadRoute(() => import('@/pages/DisasterDetails'), 'medium');
};
