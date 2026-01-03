/**
 * Performance Dashboard
 * Development tool for monitoring application performance metrics
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { performanceMonitor } from '@/utils/performance.jsx';

const PerformanceDashboard = () => {
  interface Metric {
    timestamp: number;
    duration: number;
    [key: string]: any;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [metrics, setMetrics] = useState<Record<string, Metric>>({});
  const [fps, setFps] = useState(0);
  const [memory, setMemory] = useState(null);
  const [webVitals, setWebVitals] = useState({});

  // Update metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(performanceMonitor.getMetrics());
      setMemory(performanceMonitor.getMemoryUsage());
    }, 1000);

    // Start FPS monitoring
    performanceMonitor.startFPSMonitoring(setFps);

    return () => clearInterval(interval);
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const MetricCard = ({ title, value, unit = '', color = 'blue' }) => (
    <div className={`bg-white p-3 rounded-lg border-l-4 border-${color}-500 shadow-sm`}>
      <div className="text-xs font-medium tracking-wide text-gray-600 uppercase">
        {title}
      </div>
      <div className={`text-lg font-bold text-${color}-600`}>
        {value}{unit}
      </div>
    </div>
  );

  const MemoryBar = ({ used, total }) => {
    const percentage = (used / total) * 100;
    const getColor = () => {
      if (percentage < 50) return 'green';
      if (percentage < 75) return 'yellow';
      return 'red';
    };

    return (
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-600">
          <span>Memory Usage</span>
          <span>{used}MB / {total}MB</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div
            className={`bg-${getColor()}-500 h-2 rounded-full transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  const RecentMetrics = () => (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-gray-700">Recent Performance</h4>
      <div className="space-y-1 overflow-y-auto max-h-40">
        {Object.entries(metrics)
          .sort(([, a], [, b]) => b.timestamp - a.timestamp)
          .slice(0, 10)
          .map(([name, metric]) => (
            <div key={name} className="flex justify-between text-xs">
              <span className="text-gray-600 truncate">{name}</span>
              <span className={`font-mono ${metric.duration < 16 ? 'text-green-600' :
                metric.duration < 100 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                {metric.duration.toFixed(1)}ms
              </span>
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        className="fixed z-50 p-3 text-white bg-purple-600 rounded-full shadow-lg bottom-4 right-4 hover:bg-purple-700"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Performance Dashboard"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </motion.button>

      {/* Dashboard Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-4 right-4 z-40 w-80 bg-white rounded-lg shadow-xl border border-gray-200 max-h-[80vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 text-white bg-purple-600">
              <h3 className="font-semibold">Performance Dashboard</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-purple-200 hover:text-white"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <MetricCard
                  title="FPS"
                  value={fps}
                  color={fps >= 55 ? 'green' : fps >= 30 ? 'yellow' : 'red'}
                />
                <MetricCard
                  title="Components"
                  value={Object.keys(metrics).filter(key => key.startsWith('component-')).length}
                  color="blue"
                />
              </div>

              {/* Memory Usage */}
              {memory && (
                <div className="p-3 rounded-lg bg-gray-50">
                  <MemoryBar used={memory.used} total={memory.total} />
                </div>
              )}

              {/* Bundle Info */}
              <div className="p-3 rounded-lg bg-gray-50">
                <h4 className="mb-2 text-sm font-semibold text-gray-700">Bundle Info</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Mode:</span>
                    <span className="font-mono">{process.env.NODE_ENV}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hot Reload:</span>
                    <span className={`font-mono ${'text-red-600'}`}>
                      {'Disabled'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Metrics */}
              <RecentMetrics />

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    performanceMonitor.clearMetrics();
                    setMetrics({});
                  }}
                  className="w-full px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Clear Metrics
                </button>

                <button
                  onClick={() => {
                    const data = {
                      metrics,
                      memory,
                      fps,
                      timestamp: Date.now(),
                      userAgent: navigator.userAgent
                    };

                    const blob = new Blob([JSON.stringify(data, null, 2)], {
                      type: 'application/json'
                    });

                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `performance-report-${Date.now()}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="w-full px-3 py-2 text-sm text-purple-700 bg-purple-100 rounded hover:bg-purple-200"
                >
                  Export Report
                </button>
              </div>

              {/* Performance Tips */}
              <div className="p-3 rounded-lg bg-blue-50">
                <h4 className="mb-2 text-sm font-semibold text-blue-700">💡 Tips</h4>
                <ul className="space-y-1 text-xs text-blue-600">
                  <li>• Keep component renders under 16ms</li>
                  <li>• Maintain 60 FPS for smooth animations</li>
                  <li>• Monitor memory usage growth</li>
                  <li>• Use React DevTools Profiler</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PerformanceDashboard;
