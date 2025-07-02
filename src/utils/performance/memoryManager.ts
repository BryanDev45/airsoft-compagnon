// Memory management utilities for large datasets

export class LRUCache<T> {
  private cache = new Map<string, { value: T; timestamp: number }>();
  private maxSize: number;
  private maxAge: number;

  constructor(maxSize: number = 100, maxAge: number = 300000) { // 5 minutes default
    this.maxSize = maxSize;
    this.maxAge = maxAge;
  }

  set(key: string, value: T): void {
    const now = Date.now();
    
    // Remove expired entries
    this.cleanup();
    
    // Remove oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, { value, timestamp: now });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    const now = Date.now();
    if (now - entry.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }
    
    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, entry);
    
    return entry.value;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.maxAge) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Global cache instances for commonly used data
export const gamesCache = new LRUCache(50, 600000); // 10 minutes
export const profilesCache = new LRUCache(200, 300000); // 5 minutes
export const geocodingCache = new LRUCache(100, 3600000); // 1 hour

// Memory usage monitoring
export const getMemoryUsage = (): { used: number; total: number } => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
      total: Math.round(memory.totalJSHeapSize / 1024 / 1024)
    };
  }
  return { used: 0, total: 0 };
};