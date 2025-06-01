
import { useQueries } from '@tanstack/react-query';
import { globalQueryCache } from '@/utils/queryCache';

interface BatchedQuery {
  queryKey: string[];
  queryFn: () => Promise<any>;
  enabled?: boolean;
  cacheTTL?: number;
}

export const useBatchedQueries = (queries: BatchedQuery[]) => {
  return useQueries({
    queries: queries.map(({ queryKey, queryFn, enabled = true, cacheTTL = 5 * 60 * 1000 }) => ({
      queryKey,
      queryFn: () => globalQueryCache.get(queryKey.join('_'), queryFn, cacheTTL),
      enabled,
      staleTime: cacheTTL / 2,
      gcTime: cacheTTL,
      refetchOnWindowFocus: false,
    }))
  });
};
