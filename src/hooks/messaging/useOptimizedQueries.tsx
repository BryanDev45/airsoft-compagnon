
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';

/**
 * Hook for intelligent error handling and query optimization
 */
export const useOptimizedQueries = () => {
  const queryClient = useQueryClient();
  const errorCountRef = useRef<Map<string, number>>(new Map());
  const lastErrorTimeRef = useRef<Map<string, number>>(new Map());

  const shouldRetry = useCallback((failureCount: number, error: any, queryKey: string) => {
    const now = Date.now();
    const errorCount = errorCountRef.current.get(queryKey) || 0;
    const lastErrorTime = lastErrorTimeRef.current.get(queryKey) || 0;

    // Reset error count if enough time has passed
    if (now - lastErrorTime > 300000) { // 5 minutes
      errorCountRef.current.set(queryKey, 0);
    }

    // Don't retry RLS errors
    if (error?.message?.includes('row-level security')) {
      console.warn(`RLS error for query ${queryKey}:`, error.message);
      return false;
    }

    // Don't retry auth errors
    if (error?.message?.includes('JWT') || error?.code === 'PGRST301') {
      console.warn(`Auth error for query ${queryKey}:`, error.message);
      return false;
    }

    // Exponential backoff with max attempts
    if (failureCount < 3 && errorCount < 5) {
      errorCountRef.current.set(queryKey, errorCount + 1);
      lastErrorTimeRef.current.set(queryKey, now);
      return true;
    }

    return false;
  }, []);

  const getRetryDelay = useCallback((attemptIndex: number) => {
    return Math.min(1000 * Math.pow(2, attemptIndex), 30000);
  }, []);

  const optimizedQueryConfig = useCallback((queryKey: string, baseConfig: any = {}) => ({
    ...baseConfig,
    retry: (failureCount: number, error: any) => shouldRetry(failureCount, error, queryKey),
    retryDelay: getRetryDelay,
    staleTime: baseConfig.staleTime || 30000,
    gcTime: baseConfig.gcTime || 300000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  }), [shouldRetry, getRetryDelay]);

  return {
    optimizedQueryConfig,
    shouldRetry,
    getRetryDelay
  };
};
