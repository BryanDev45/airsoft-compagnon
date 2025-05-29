
/**
 * Utilitaires de cache optimisés pour réduire les appels à la base de données
 */

// Constantes de durée de cache (en millisecondes)
export const CACHE_DURATIONS = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 24 * 60 * 60 * 1000, // 24 heures
  VERY_LONG: 7 * 24 * 60 * 60 * 1000, // 7 jours
};

// Cache en mémoire pour les données fréquemment accédées
const memoryCache = new Map<string, { value: any; expiry: number }>();

/**
 * Sauvegarde des données avec expiration
 */
export const setStorageWithExpiry = (key: string, value: any, ttl: number) => {
  const item = {
    value,
    expiry: new Date().getTime() + ttl,
  };
  
  try {
    // Stocker en localStorage
    localStorage.setItem(key, JSON.stringify(item));
    
    // Stocker aussi en mémoire pour un accès plus rapide
    memoryCache.set(key, item);
    
    // Nettoyer le cache mémoire si il devient trop grand
    if (memoryCache.size > 100) {
      cleanupMemoryCache();
    }
  } catch (error) {
    console.error('Error saving to cache:', error);
    // Si localStorage est plein, essayer de nettoyer et réessayer
    if (error.name === 'QuotaExceededError') {
      cleanupExpiredStorage();
      try {
        localStorage.setItem(key, JSON.stringify(item));
      } catch (retryError) {
        console.error('Cache storage failed after cleanup:', retryError);
      }
    }
  }
};

/**
 * Récupération des données avec vérification d'expiration
 */
export const getStorageWithExpiry = (key: string) => {
  try {
    // Vérifier d'abord le cache mémoire
    const memItem = memoryCache.get(key);
    if (memItem) {
      const now = new Date().getTime();
      if (now <= memItem.expiry) {
        return memItem.value;
      } else {
        memoryCache.delete(key);
      }
    }
    
    // Sinon, vérifier localStorage
    const itemStr = localStorage.getItem(key);
    
    if (!itemStr) {
      return null;
    }
    
    const item = JSON.parse(itemStr);
    const now = new Date().getTime();
    
    // Vérifier si l'élément a expiré
    if (now > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    
    // Remettre en cache mémoire
    memoryCache.set(key, item);
    
    return item.value;
  } catch (error) {
    console.error('Error retrieving from cache:', error);
    return null;
  }
};

/**
 * Nettoyer le cache mémoire des éléments expirés
 */
const cleanupMemoryCache = () => {
  const now = new Date().getTime();
  for (const [key, item] of memoryCache.entries()) {
    if (now > item.expiry) {
      memoryCache.delete(key);
    }
  }
};

/**
 * Nettoyer localStorage des éléments expirés
 */
const cleanupExpiredStorage = () => {
  const now = new Date().getTime();
  const keysToRemove: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      try {
        const itemStr = localStorage.getItem(key);
        if (itemStr) {
          const item = JSON.parse(itemStr);
          if (item.expiry && now > item.expiry) {
            keysToRemove.push(key);
          }
        }
      } catch (error) {
        // Si on ne peut pas parser, supprimer l'élément
        keysToRemove.push(key);
      }
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
  console.log(`Cleaned up ${keysToRemove.length} expired cache items`);
};

/**
 * Supprimer un élément spécifique du cache
 */
export const clearCacheItem = (key: string) => {
  try {
    localStorage.removeItem(key);
    memoryCache.delete(key);
  } catch (error) {
    console.error('Error clearing cache item:', error);
  }
};

/**
 * Supprimer tous les éléments du cache avec un préfixe spécifique
 */
export const clearCacheByPrefix = (prefix: string) => {
  try {
    // Nettoyer localStorage
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Nettoyer memoryCache
    for (const key of memoryCache.keys()) {
      if (key.startsWith(prefix)) {
        memoryCache.delete(key);
      }
    }
    
    console.log(`Cleared ${keysToRemove.length} cache items with prefix: ${prefix}`);
  } catch (error) {
    console.error('Error clearing cache by prefix:', error);
  }
};

/**
 * Générer une clé de cache basée sur des paramètres
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

/**
 * Obtenir la taille actuelle du cache
 */
export const getCacheStats = () => {
  let localStorageSize = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          localStorageSize += value.length;
        }
      }
    }
  } catch (error) {
    console.error('Error calculating cache stats:', error);
  }
  
  return {
    memoryItems: memoryCache.size,
    localStorageItems: localStorage.length,
    localStorageSize: localStorageSize,
  };
};

// Nettoyer automatiquement le cache périodiquement
setInterval(() => {
  cleanupMemoryCache();
  cleanupExpiredStorage();
}, 10 * 60 * 1000); // Toutes les 10 minutes

// Nettoyer au démarrage
cleanupMemoryCache();
cleanupExpiredStorage();
