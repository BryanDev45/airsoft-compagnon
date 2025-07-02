// Query optimization utilities
export const optimizeQuery = (baseQuery: any) => {
  return baseQuery
    .abortSignal(AbortSignal.timeout(30000)) // 30 second timeout
    .limit(100) // Reasonable limit to prevent large queries
    .order('created_at', { ascending: false });
};

// Batch processing for large datasets
export const processBatch = async <T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number = 10
): Promise<R[]> => {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
    
    // Small delay between batches to prevent overwhelming the system
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
  
  return results;
};

// Cache key generator
export const generateCacheKey = (...parts: (string | number | boolean)[]): string => {
  return parts.filter(Boolean).join('_');
};

// Debounced function utility
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): T => {
  let timeoutId: NodeJS.Timeout;
  
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
};