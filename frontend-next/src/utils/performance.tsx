/**
 * Performance Optimization Utilities
 * Provides monitoring, optimization helpers, and performance tracking
 */

import { forwardRef, Profiler } from 'react';

// Performance monitoring and analytics
export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
    this.isEnabled = process.env.NODE_ENV === 'development' || 
                    localStorage.getItem('performance-debug') === 'true';
  }

  // Mark performance timing
  mark(name) {
    if (this.isEnabled && performance.mark) {
      performance.mark(`${name}-start`);
    }
  }

  // Measure performance between marks
  measure(name, startMark = null) {
    if (!this.isEnabled || !performance.measure) return null;

    try {
      const measureName = `${name}-measure`;
      const startMarkName = startMark || `${name}-start`;
      
      performance.measure(measureName, startMarkName);
      const entry = performance.getEntriesByName(measureName)[0];
      
      this.metrics.set(name, {
        duration: entry.duration,
        timestamp: Date.now(),
        name
      });

      if (this.isEnabled) {
        console.log(`⚡ ${name}: ${entry.duration.toFixed(2)}ms`);
      }

      return entry.duration;
    } catch (error) {
      console.warn('Performance measurement failed:', error);
      return null;
    }
  }

  // Track component render time
  trackComponentRender(componentName, renderFn) {
    return (...args) => {
      this.mark(`component-${componentName}`);
      const result = renderFn(...args);
      this.measure(`component-${componentName}`);
      return result;
    };
  }

  // Memory usage monitoring
  getMemoryUsage() {
    if (performance.memory) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
      };
    }
    return null;
  }

  // FPS monitoring
  startFPSMonitoring(callback) {
    let frames = 0;
    let lastTime = performance.now();

    const measureFPS = (currentTime) => {
      frames++;
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime));
        callback(fps);
        frames = 0;
        lastTime = currentTime;
      }
      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
  }

  // Core Web Vitals tracking
  trackWebVitals() {
    // Largest Contentful Paint
    this.observePerformanceEntry('largest-contentful-paint', (entry) => {
      console.log('LCP:', entry.renderTime || entry.loadTime);
    });

    // First Input Delay
    this.observePerformanceEntry('first-input', (entry) => {
      console.log('FID:', entry.processingStart - entry.startTime);
    });

    // Cumulative Layout Shift
    let clsValue = 0;
    this.observePerformanceEntry('layout-shift', (entry) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        console.log('CLS:', clsValue);
      }
    });
  }

  observePerformanceEntry(type, callback) {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(callback);
      });
      
      try {
        observer.observe({ type, buffered: true });
        this.observers.set(type, observer);
      } catch (error) {
        console.warn(`Failed to observe ${type}:`, error);
      }
    }
  }

  // Get all collected metrics
  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  // Clear metrics
  clearMetrics() {
    this.metrics.clear();
    if (performance.clearMeasures) {
      performance.clearMeasures();
    }
    if (performance.clearMarks) {
      performance.clearMarks();
    }
  }

  // Cleanup observers
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Image optimization utilities
export const ImageOptimizer = {
  // Create optimized image URLs with WebP support
  getOptimizedImageUrl(src, options = {}) {
    const {
      width,
      height,
      quality = 80,
      format = 'auto'
    } = options;

    // For external CDNs that support optimization
    if (src.includes('cloudinary.com')) {
      const params = [];
      if (width) params.push(`w_${width}`);
      if (height) params.push(`h_${height}`);
      params.push(`q_${quality}`);
      params.push('f_auto');
      
      return src.replace('/upload/', `/upload/${params.join(',')}/`);
    }

    // For other images, return as-is (could integrate with other CDNs)
    return src;
  },

  // Generate responsive image sources
  generateResponsiveSources(src, sizes = [320, 640, 1024, 1280]) {
    return sizes.map(size => ({
      srcSet: this.getOptimizedImageUrl(src, { width: size }),
      media: `(max-width: ${size}px)`
    }));
  },

  // Preload critical images
  preloadImage(src, options = {}) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      if (options.crossOrigin) {
        img.crossOrigin = options.crossOrigin;
      }
      
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  },

  // Lazy load images with Intersection Observer
  lazyLoad(imageElement, options = {}) {
    const {
      threshold = 0.1,
      rootMargin = '50px'
    } = options;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.dataset.src;
            
            if (src) {
              img.src = src;
              img.removeAttribute('data-src');
              observer.unobserve(img);
            }
          }
        });
      }, { threshold, rootMargin });

      observer.observe(imageElement);
      return () => observer.unobserve(imageElement);
    }
    
    // Fallback for browsers without Intersection Observer
    imageElement.src = imageElement.dataset.src;
    return () => {};
  }
};

// Bundle size analyzer
export const BundleAnalyzer = {
  // Analyze import sizes
  analyzeImports() {
    if (process.env.NODE_ENV === 'development') {
      const navigationEntries = performance.getEntriesByType('navigation');
      const resourceEntries = performance.getEntriesByType('resource');
      
      console.group('📊 Bundle Analysis');
      console.log('Navigation timing:', navigationEntries[0]);
      console.log('Resource loading:', resourceEntries);
      console.groupEnd();
    }
  },

  // Track dynamic imports
  trackDynamicImport(moduleName) {
    return async (importFn) => {
      const monitor = new PerformanceMonitor();
      monitor.mark(`dynamic-import-${moduleName}`);
      
      try {
        const module = await importFn();
        monitor.measure(`dynamic-import-${moduleName}`);
        return module;
      } catch (error) {
        console.error(`Failed to load module ${moduleName}:`, error);
        throw error;
      }
    };
  }
};

// React optimization utilities
export const ReactOptimizer = {
  // Memoization helper with dependencies tracking
  createMemoizedSelector(selector, dependencies = []) {
    let lastDeps = null;
    let lastResult = null;
    
    return (...args) => {
      const currentDeps = dependencies.map(dep => 
        typeof dep === 'function' ? dep(...args) : dep
      );
      
      if (!lastDeps || !this.areDepEqual(lastDeps, currentDeps)) {
        lastResult = selector(...args);
        lastDeps = currentDeps;
      }
      
      return lastResult;
    };
  },

  areDepEqual(a, b) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => Object.is(item, b[index]));
  },

  // Component profiler wrapper
  withProfiler(Component, id) {
    if (process.env.NODE_ENV === 'development') {
      return forwardRef((props, ref) => (
        <Profiler
          id={id}
          onRender={(id, phase, actualDuration) => {
            console.log(`⚛️ ${id} (${phase}): ${actualDuration.toFixed(2)}ms`);
          }}
        >
          <Component {...props} ref={ref} />
        </Profiler>
      ));
    }
    return Component;
  }
};

// Network optimization
export const NetworkOptimizer = {
  // Prefetch resources
  prefetch(url, type = 'fetch') {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = type;
    link.href = url;
    document.head.appendChild(link);
  },

  // Preload critical resources
  preload(url, type = 'script') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = type;
    link.href = url;
    document.head.appendChild(link);
  },

  // Service Worker registration
  registerServiceWorker() {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('SW registered: ', registration);
          })
          .catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }
};

// Initialize performance monitoring
export const initializePerformanceMonitoring = () => {
  const monitor = new PerformanceMonitor();
  
  // Track page load performance
  window.addEventListener('load', () => {
    setTimeout(() => {
      monitor.trackWebVitals();
      BundleAnalyzer.analyzeImports();
      
      // Log memory usage in development
      if (monitor.isEnabled) {
        const memory = monitor.getMemoryUsage();
        if (memory) {
          console.log(`🧠 Memory: ${memory.used}MB / ${memory.total}MB`);
        }
      }
    }, 1000);
  });

  // Register service worker
  NetworkOptimizer.registerServiceWorker();

  return monitor;
};

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();
