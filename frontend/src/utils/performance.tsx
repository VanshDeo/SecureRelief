'use client';

/**
 * Performance Optimization Utilities
 * Next.js + TypeScript safe (client-only)
 */

import React, { forwardRef, Profiler, ComponentType } from 'react';

/* =========================
   Types
========================= */

type MetricEntry = {
  name: string;
  duration: number;
  timestamp: number;
};

type FPSCallback = (fps: number) => void;

/* =========================
   Performance Monitor
========================= */

export class PerformanceMonitor {
  private metrics: Map<string, MetricEntry> = new Map();
  private observers: Map<string, PerformanceObserver> = new Map();
  private isEnabled: boolean;

  constructor() {
    this.isEnabled =
      process.env.NODE_ENV === 'development' &&
      typeof window !== 'undefined' &&
      (localStorage.getItem('performance-debug') === 'true' ||
        process.env.NODE_ENV === 'development');
  }

  /* ---------- Timing ---------- */

  mark(name: string) {
    if (!this.isEnabled || typeof performance === 'undefined') return;
    performance.mark(`${name}-start`);
  }

  measure(name: string, startMark?: string): number | null {
    if (!this.isEnabled || typeof performance === 'undefined') return null;

    try {
      const measureName = `${name}-measure`;
      performance.measure(measureName, startMark || `${name}-start`);
      const entry = performance.getEntriesByName(measureName)[0];

      if (!entry) return null;

      this.metrics.set(name, {
        name,
        duration: entry.duration,
        timestamp: Date.now(),
      });

      console.log(`⚡ ${name}: ${entry.duration.toFixed(2)}ms`);
      return entry.duration;
    } catch {
      return null;
    }
  }

  /* ---------- Memory ---------- */

  getMemoryUsage() {
    const perf = performance as any;
    if (!perf?.memory) return null;

    return {
      used: Math.round(perf.memory.usedJSHeapSize / 1024 / 1024),
      total: Math.round(perf.memory.totalJSHeapSize / 1024 / 1024),
      limit: Math.round(perf.memory.jsHeapSizeLimit / 1024 / 1024),
    };
  }

  /* ---------- FPS ---------- */

  startFPSMonitoring(callback: FPSCallback) {
    if (typeof window === 'undefined') return;

    let frames = 0;
    let lastTime = performance.now();

    const measureFPS = (time: number) => {
      frames++;
      if (time >= lastTime + 1000) {
        callback(Math.round((frames * 1000) / (time - lastTime)));
        frames = 0;
        lastTime = time;
      }
      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
  }

  /* ---------- Web Vitals ---------- */

  trackWebVitals() {
    if (typeof window === 'undefined') return;

    this.observe('largest-contentful-paint', (e: any) =>
      console.log('LCP:', e.renderTime || e.loadTime)
    );

    this.observe('first-input', (e: any) =>
      console.log('FID:', e.processingStart - e.startTime)
    );

    let cls = 0;
    this.observe('layout-shift', (e: any) => {
      if (!e.hadRecentInput) {
        cls += e.value;
        console.log('CLS:', cls);
      }
    });
  }

  private observe(type: string, callback: (entry: any) => void) {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window))
      return;

    try {
      const observer = new PerformanceObserver(list =>
        list.getEntries().forEach(callback)
      );
      observer.observe({ type, buffered: true });
      this.observers.set(type, observer);
    } catch {}
  }

  /* ---------- Cleanup ---------- */

  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  clearMetrics() {
    this.metrics.clear();
    performance.clearMarks?.();
    performance.clearMeasures?.();
  }

  disconnect() {
    this.observers.forEach(o => o.disconnect());
    this.observers.clear();
  }
}

/* =========================
   Image Optimizer
========================= */

export const ImageOptimizer = {
  getOptimizedImageUrl(
    src: string,
    options: { width?: number; height?: number; quality?: number } = {}
  ) {
    const { width, height, quality = 80 } = options;

    if (src.includes('cloudinary.com')) {
      const params = [
        width && `w_${width}`,
        height && `h_${height}`,
        `q_${quality}`,
        'f_auto',
      ].filter(Boolean);

      return src.replace('/upload/', `/upload/${params.join(',')}/`);
    }

    return src;
  },

  generateResponsiveSources(
    src: string,
    sizes: number[] = [320, 640, 1024, 1280]
  ) {
    return sizes.map((size) => ({
      srcSet: this.getOptimizedImageUrl(src, { width: size }),
      media: `(max-width: ${size}px)`,
    }));
  },

  preloadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') return reject();
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  },
};


/* =========================
   React Optimizer
========================= */

export const ReactOptimizer = {
  withProfiler<P>(
    Component: ComponentType<P>,
    id: string
  ): ComponentType<P> {
    if (process.env.NODE_ENV !== 'development') {
      return Component;
    }

    const ProfiledComponent = (props: P) => (
      <Profiler
        id={id}
        onRender={(_, phase, duration) => {
          console.log(`⚛️ ${id} (${phase}): ${duration.toFixed(2)}ms`);
        }}
      >
        <Component {...props} />
      </Profiler>
    );

    ProfiledComponent.displayName = `WithProfiler(${Component.displayName || Component.name || 'Component'})`;

    return ProfiledComponent;
  },
};

/* =========================
   Network Optimizer
========================= */

export const NetworkOptimizer = {
  preload(url: string, as: 'script' | 'style' | 'image' = 'script') {
    if (typeof document === 'undefined') return;
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = as;
    link.href = url;
    document.head.appendChild(link);
  },
};

/* =========================
   Initialization
========================= */

export const initializePerformanceMonitoring = () => {
  if (typeof window === 'undefined') return null;

  const monitor = new PerformanceMonitor();

  window.addEventListener('load', () => {
    setTimeout(() => {
      monitor.trackWebVitals();

      if (process.env.NODE_ENV === 'development') {
        const memory = monitor.getMemoryUsage();
        if (memory) {
          console.log(`🧠 Memory: ${memory.used}MB / ${memory.total}MB`);
        }
      }
    }, 1000);
  });

  return monitor;
};

/* =========================
   Singleton
========================= */

export const performanceMonitor =
  typeof window !== 'undefined' ? new PerformanceMonitor() : null;
