/**
 * Optimized Image Component
 * Provides responsive images with lazy loading, WebP support, and performance monitoring
 */

import { useState, useRef, useEffect, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { ImageOptimizer, performanceMonitor } from '@/utils/performance.jsx';
import { SkeletonCard as Skeleton } from '@/components/UI/Skeleton';

/**
 * Enhanced Image component with optimization features
 */
export const OptimizedImage = ({
  src,
  alt = '',
  width = undefined,
  height = undefined,
  quality = 80,
  className = '',
  loading = 'lazy',
  sizes = '',
  placeholder = 'blur',
  blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==',
  fallback = null,
  onLoad = null,
  onError = null,
  priority = false,
  responsive = true,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!loading || loading === 'eager' || priority);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Generate responsive image sources
  const responsiveSources = responsive ?
    ImageOptimizer.generateResponsiveSources(src, [320, 640, 1024, 1280]) :
    [];

  // Get optimized image URL
  const optimizedSrc = ImageOptimizer.getOptimizedImageUrl(src, {
    width,
    height,
    quality
  });

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (loading === 'eager' || priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
      observerRef.current = observer;
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, priority, isInView]);

  // Preload critical images
  useEffect(() => {
    if (priority) {
      ImageOptimizer.preloadImage(optimizedSrc)
        .then(() => setIsLoaded(true))
        .catch(() => setHasError(true));
    }
  }, [optimizedSrc, priority]);

  // Handle image load
  const handleLoad = (event) => {
    performanceMonitor.mark(`image-load-${alt || 'image'}`);
    setIsLoaded(true);
    if (onLoad) onLoad(event);
    performanceMonitor.measure(`image-load-${alt || 'image'}`);
  };

  // Handle image error
  const handleError = (event) => {
    setHasError(true);
    setIsLoaded(false);
    if (onError) onError(event);
    console.warn(`Failed to load image: ${src}`);
  };

  // Render placeholder while loading
  const renderPlaceholder = () => {
    if (placeholder === 'blur' && blurDataURL) {
      return (
        <img
          src={blurDataURL}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover filter blur-sm transition-opacity duration-300 ${isLoaded ? 'opacity-0' : 'opacity-100'
            }`}
          aria-hidden="true"
        />
      );
    }

    if (placeholder === 'skeleton') {
      return (
        <div className={`absolute inset-0 transition-opacity duration-300 ${isLoaded ? 'opacity-0' : 'opacity-100'
          }`}>
          <Skeleton className="w-full h-full" />
        </div>
      );
    }

    return null;
  };

  // Render error state
  if (hasError) {
    if (fallback) {
      return fallback;
    }

    return (
      <div
        className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}
        style={{ width, height }}
        {...props}
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
        <span className="sr-only">Failed to load image: {alt}</span>
      </div>
    );
  }

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
      {...props}
    >
      {/* Placeholder */}
      {!isLoaded && renderPlaceholder()}

      {/* Main image */}
      {isInView && (
        <>
          {responsive && responsiveSources.length > 0 ? (
            <picture>
              {responsiveSources.map((source, index) => (
                <source
                  key={index}
                  srcSet={source.srcSet}
                  media={source.media}
                  type="image/webp"
                />
              ))}
              <motion.img
                src={optimizedSrc}
                alt={alt}
                className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                loading={loading as "lazy" | "eager"}
                sizes={sizes}
                onLoad={handleLoad}
                onError={handleError}
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoaded ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </picture>
          ) : (
            <motion.img
              src={optimizedSrc}
              alt={alt}
              className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              loading={loading as "lazy" | "eager"}
              sizes={sizes}
              onLoad={handleLoad}
              onError={handleError}
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoaded ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </>
      )}
    </div>
  );
};

/**
 * Progressive JPEG/WebP image component
 */
export const ProgressiveImage = ({
  src,
  lowQualitySrc,
  alt = '',
  className = '',
  ...props
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [lowQualityLoaded, setLowQualityLoaded] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {/* Low quality image */}
      {lowQualitySrc && (
        <img
          src={lowQualitySrc}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover filter blur-sm transition-opacity duration-500 ${imageLoaded ? 'opacity-0' : 'opacity-100'
            }`}
          onLoad={() => setLowQualityLoaded(true)}
          aria-hidden="true"
        />
      )}

      {/* High quality image */}
      <motion.img
        src={src}
        alt={alt}
        className="object-cover w-full h-full"
        onLoad={() => setImageLoaded(true)}
        initial={{ opacity: 0 }}
        animate={{ opacity: imageLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        {...props}
      />
    </div>
  );
};

/**
 * Image with aspect ratio preservation
 */
export const AspectRatioImage = ({
  src,
  alt = '',
  aspectRatio = '16/9',
  objectFit = 'cover',
  className = '',
  ...props
}) => {
  return (
    <div
      className={`relative w-full ${className}`}
      style={{ aspectRatio }}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-${objectFit}`}
        {...props}
      />
    </div>
  );
};

/**
 * Hero image with gradient overlay
 */
export const HeroImage = ({
  src,
  alt = '',
  children,
  overlayColor = 'black',
  overlayOpacity = 0.4,
  className = '',
  ...props
}) => {
  return (
    <div className={`relative ${className}`}>
      <OptimizedImage
        src={src}
        alt={alt}
        priority
        className="absolute inset-0 object-cover w-full h-full"
        {...props}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent to-current"
        style={{
          color: overlayColor,
          opacity: overlayOpacity
        }}
      />

      {/* Content */}
      {children && (
        <div className="relative z-10 flex items-center justify-center h-full">
          {children}
        </div>
      )}
    </div>
  );
};

/**
 * Image gallery with lazy loading
 */
export const ImageGallery = ({
  images = [],
  columns = 3,
  gap = 4,
  className = '',
  onImageClick = null
}) => {
  return (
    <div
      className={`grid gap-${gap} ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
      }}
    >
      {images.map((image, index) => (
        <motion.div
          key={image.id || index}
          className="cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onImageClick && onImageClick(image, index)}
        >
          <AspectRatioImage
            src={image.src}
            alt={image.alt || `Gallery image ${index + 1}`}
            aspectRatio="1/1"
            className="overflow-hidden transition-shadow rounded-lg shadow-md hover:shadow-lg"
          />
        </motion.div>
      ))}
    </div>
  );
};

/**
 * Avatar image with fallback
 */
export const Avatar = ({
  src,
  alt = '',
  size = 'md',
  fallback = null,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20'
  };

  const defaultFallback = (
    <div className={`flex items-center justify-center bg-gray-300 text-gray-600 ${sizeClasses[size]} rounded-full`}>
      <svg className="w-1/2 h-1/2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    </div>
  );

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      fallback={fallback || defaultFallback}
      {...props}
    />
  );
};

export default OptimizedImage;
