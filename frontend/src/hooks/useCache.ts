import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Cache store for API responses and expensive computations
 */
export const useCacheStore = create(
  persist(
    (set, get: any) => ({
      // Cache data structure: { [key]: { data, timestamp, ttl } }
      cache: {},

      // Set cache with TTL (time to live in milliseconds)
      setCache: (key, data, ttl = 5 * 60 * 1000) => {
        set(state => ({
          cache: {
            ...state.cache,
            [key]: {
              data,
              timestamp: Date.now(),
              ttl
            }
          }
        }));
      },

      // Get cache if not expired
      getCache: (key: any) => {
        const state = get();
        const cached = state.cache[key];

        if (!cached) return null;

        const isExpired = Date.now() - cached.timestamp > cached.ttl;

        if (isExpired) {
          // Remove expired cache
          set((state: any) => {
            const newCache = { ...state.cache };
            delete newCache[key];
            return { cache: newCache };
          });
          return null;
        }

        return cached.data;
      },

      // Clear specific cache
      clearCache: (key: any) => {
        set((state: any) => {
          const newCache = { ...state.cache };
          delete newCache[key];
          return { cache: newCache };
        });
      },

      // Clear all cache
      clearAllCache: () => {
        set({ cache: {} });
      },

      // Clear expired cache entries
      clearExpiredCache: () => {
        const state = get();
        const now = Date.now();
        const newCache = {};

        Object.entries(state.cache).forEach(([key, value]: any) => {
          if (now - value.timestamp <= value.ttl) {
            newCache[key] = value;
          }
        });

        set({ cache: newCache });
      }
    }),
    {
      name: 'api-cache-storage',
      // Only persist non-sensitive cache data
      partialize: (state: any) => ({
        cache: Object.fromEntries(
          Object.entries(state.cache).filter(([key]) =>
            !key.includes('sensitive') && !key.includes('private')
          )
        )
      })
    }
  )
);

/**
 * Custom hook for cached API calls
 */
export const useCachedQuery = (key: any, queryFn: any, options: any = {}) => {
  const {
    ttl = 5 * 60 * 1000, // 5 minutes default
    enabled = true,
    refetchOnMount = false,
    staleTime = 30 * 1000, // 30 seconds
  } = options;

  const { getCache, setCache } = useCacheStore() as any;
  const [data, setData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [isStale, setIsStale] = React.useState(false);

  const fetchData = React.useCallback(async (force = false) => {
    if (!enabled) return;

    // Check cache first
    const cached = getCache(key);
    if (cached && !force) {
      setData(cached);

      // Check if data is stale but still valid
      const cacheAge = Date.now() - cached.timestamp;
      setIsStale(cacheAge > staleTime);

      if (!refetchOnMount && !isStale) {
        return cached;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await queryFn();
      setData(result);
      setCache(key, result, ttl);
      setIsStale(false);
      return result;
    } catch (err) {
      setError(err);
      // Return cached data if available, even on error
      if (cached) {
        setData(cached);
        setIsStale(true);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [key, queryFn, enabled, ttl, refetchOnMount, staleTime, getCache, setCache]);

  // Initial fetch
  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = React.useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    isStale,
    refetch
  };
};

/**
 * Memory-based cache for component-level caching
 */
class MemoryCache {
  cache: Map<any, any>;
  maxSize: number;

  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    const isExpired = Date.now() > item.expiry;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    // Move to end (LRU)
    this.cache.delete(key);
    this.cache.set(key, item);
    return item.value;
  }

  set(key, value, ttl = 5 * 60 * 1000) {
    // Remove oldest if at max size
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl
    });
  }

  delete(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

// Global memory cache instance
export const memoryCache = new MemoryCache();

/**
 * React Query-like hook with caching
 */
export const useQuery = (key: any, queryFn: any, options: any = {}) => {
  const {
    enabled = true,
    retry = 3,
    retryDelay = 1000,
    cacheTime = 5 * 60 * 1000,
    staleTime = 0,
    refetchOnWindowFocus = false,
    refetchInterval = null
  } = options;

  const [state, setState] = React.useState({
    data: null,
    isLoading: true,
    isError: false,
    error: null,
    isSuccess: false,
    isStale: false
  });

  const retryCountRef = React.useRef(0);
  const intervalRef = React.useRef(null);

  const executeQuery = React.useCallback(async (isRefetch = false) => {
    if (!enabled) return;

    // Check memory cache first
    if (!isRefetch) {
      const cached = memoryCache.get(key);
      if (cached) {
        setState(prev => ({
          ...prev,
          data: cached,
          isLoading: false,
          isSuccess: true,
          isStale: false
        }));
        return;
      }
    }

    setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));

    try {
      const data = await queryFn();

      // Cache the result
      memoryCache.set(key, data, cacheTime);

      setState({
        data,
        isLoading: false,
        isError: false,
        error: null,
        isSuccess: true,
        isStale: false
      });

      retryCountRef.current = 0;
    } catch (error) {
      if (retryCountRef.current < retry) {
        retryCountRef.current++;
        setTimeout(() => executeQuery(isRefetch), retryDelay * retryCountRef.current);
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isError: true,
          error,
          isSuccess: false
        }));
      }
    }
  }, [key, queryFn, enabled, retry, retryDelay, cacheTime]);

  // Initial fetch
  React.useEffect(() => {
    executeQuery();
  }, [executeQuery]);

  // Refetch interval
  React.useEffect(() => {
    if (refetchInterval && enabled) {
      intervalRef.current = setInterval(() => {
        executeQuery(true);
      }, refetchInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refetchInterval, enabled, executeQuery]);

  // Window focus refetch
  React.useEffect(() => {
    if (!refetchOnWindowFocus) return;

    const handleFocus = () => {
      if (state.isSuccess && state.data) {
        executeQuery(true);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetchOnWindowFocus, state.isSuccess, state.data, executeQuery]);

  const refetch = React.useCallback(() => {
    return executeQuery(true);
  }, [executeQuery]);

  const invalidate = React.useCallback(() => {
    memoryCache.delete(key);
    executeQuery(true);
  }, [key, executeQuery]);

  return {
    ...state,
    refetch,
    invalidate
  };
};

export default {
  useCacheStore,
  useCachedQuery,
  useQuery,
  memoryCache
};
