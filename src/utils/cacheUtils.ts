
/**
 * Utility functions for caching data to reduce database queries
 */

// Cache duration constants (in milliseconds)
export const CACHE_DURATIONS = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 24 * 60 * 60 * 1000, // 24 hours
};

/**
 * Save data to localStorage with expiration
 */
export const setStorageWithExpiry = (key: string, value: any, ttl: number) => {
  const item = {
    value,
    expiry: new Date().getTime() + ttl,
  };
  
  try {
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Get data from localStorage and check for expiration
 */
export const getStorageWithExpiry = (key: string) => {
  try {
    const itemStr = localStorage.getItem(key);
    
    // If the key doesn't exist, return null
    if (!itemStr) {
      return null;
    }
    
    const item = JSON.parse(itemStr);
    const now = new Date().getTime();
    
    // Check if the item is expired
    if (now > item.expiry) {
      // If expired, remove the item from storage and return null
      localStorage.removeItem(key);
      return null;
    }
    
    return item.value;
  } catch (error) {
    console.error('Error retrieving from localStorage:', error);
    return null;
  }
};

/**
 * Clear specific cache item
 */
export const clearCacheItem = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing cache item:', error);
  }
};

/**
 * Clear all cache items with a specific prefix
 */
export const clearCacheByPrefix = (prefix: string) => {
  try {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing cache by prefix:', error);
  }
};

/**
 * Generate a cache key based on parameters
 */
export const generateCacheKey = (baseKey: string, params: Record<string, any> = {}) => {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc, key) => {
      acc[key] = params[key];
      return acc;
    }, {} as Record<string, any>);
  
  return `${baseKey}_${JSON.stringify(sortedParams)}`;
};
