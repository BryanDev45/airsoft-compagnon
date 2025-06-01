
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { globalQueryCache } from '@/utils/queryCache';

export const useOptimizedQuery = <T,>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> & {
    cacheTTL?: number;
    enableGlobalCache?: boolean;
  }
) => {
  const { cacheTTL = 5 * 60 * 1000, enableGlobalCache = true, ...queryOptions } = options || {};
  
  return useQuery({
    queryKey,
    queryFn: enableGlobalCache 
      ? () => globalQueryCache.get(queryKey.join('_'), queryFn, cacheTTL)
      : queryFn,
    staleTime: cacheTTL / 2, // La moitié du TTL comme staleTime
    gcTime: cacheTTL,
    refetchOnWindowFocus: false,
    ...queryOptions
  });
};
