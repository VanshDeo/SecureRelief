import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Lazy loading image component with progressive enhancement
 */
export const LazyImage = ({
  src,
  alt,
  className = '',
  placeholderSrc = null,
  blurDataURL = null,
  onLoad = () => {},
  onError = () => {},
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad();
  };

  const handleError = () => {
    setIsError(true);
    onError();
  };

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      <AnimatePresence>
        {/* Placeholder/blur background */}
        {(!isLoaded || isError) && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-200 dark:bg-gray-700"
            style={{
              backgroundImage: blurDataURL ? `url(${blurDataURL})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(5px)',
              transform: 'scale(1.1)' // Prevent blur edge artifacts
            }}
          />
        )}

        {/* Loading placeholder */}
        {!isLoaded && !isError && isInView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-8 h-8 border-2 border-gray-300 rounded-full border-t-blue-500 animate-spin" />
          </motion.div>
        )}

        {/* Error state */}
        {isError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800"
          >
            <div className="text-center text-gray-500 dark:text-gray-400">
              <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <p className="text-xs">Failed to load</p>
            </div>
          </motion.div>
        )}

        {/* Actual image */}
        {isInView && (
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            src={src}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className="object-cover w-full h-full"
            loading="lazy"
            {...props}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Code splitting component with lazy loading and error boundaries
 */
export const LazyComponent = ({ 
  loader, 
  fallback = null, 
  onError = null,
  retryable = true,
  className = ''
}) => {
  const [Component, setComponent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const loadComponent = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const module = await loader();
      const LoadedComponent = module.default || module;
      
      setComponent(() => LoadedComponent);
    } catch (err) {
      setError(err);
      if (onError) onError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComponent();
  }, [retryCount]);

  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
    }
  };

  if (isLoading) {
    return fallback || (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-2 border-2 border-blue-500 rounded-full border-t-transparent animate-spin" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading component...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <div className="mb-2 text-red-500">
            <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
            Failed to load component
          </p>
          {retryable && retryCount < maxRetries && (
            <button
              onClick={handleRetry}
              className="px-4 py-2 text-sm text-white transition-colors bg-blue-500 rounded hover:bg-blue-600"
            >
              Retry ({maxRetries - retryCount} left)
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!Component) {
    return null;
  }

  return <Component />;
};

/**
 * Hook for intersection observer (used for lazy loading)
 */
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [hasIntersected, options]);

  return { elementRef, isIntersecting, hasIntersected };
};

/**
 * Optimized image with WebP support and responsive sizing
 */
export const OptimizedImage = ({
  src,
  alt,
  sizes = '100vw',
  className = '',
  priority = false,
  ...props
}) => {
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  const [supportsWebP, setSupportsWebP] = useState(null);

  useEffect(() => {
    // Check WebP support
    const checkWebPSupport = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    };

    setSupportsWebP(checkWebPSupport());
  }, []);

  const imageSrc = supportsWebP ? webpSrc : src;

  if (priority) {
    // For above-the-fold images, load immediately
    return (
      <img
        src={imageSrc}
        alt={alt}
        sizes={sizes}
        className={className}
        loading="eager"
        {...props}
      />
    );
  }

  return (
    <LazyImage
      src={imageSrc}
      alt={alt}
      className={className}
      {...props}
    />
  );
};

export default {
  LazyImage,
  LazyComponent,
  OptimizedImage,
  useIntersectionObserver
};
