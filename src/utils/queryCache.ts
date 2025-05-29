
/**
 * Système de cache global pour éviter les requêtes dupliquées
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class GlobalQueryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private pendingQueries = new Map<string, Promise<any>>();

  /**
   * Obtenir une donnée du cache ou exécuter la requête
   */
  async get<T>(
    key: string,
    queryFn: () => Promise<T>,
    ttl: number = 5 * 60 * 1000 // 5 minutes par défaut
  ): Promise<T> {
    // Vérifier si la requête est déjà en cours
    if (this.pendingQueries.has(key)) {
      console.log(`Waiting for pending query: ${key}`);
      return this.pendingQueries.get(key);
    }

    // Vérifier le cache
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      console.log(`Cache hit: ${key}`);
      return cached.data;
    }

    // Exécuter la requête
    console.log(`Cache miss, executing query: ${key}`);
    const queryPromise = queryFn();
    this.pendingQueries.set(key, queryPromise);

    try {
      const data = await queryPromise;
      
      // Mettre en cache le résultat
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
        ttl
      });

      return data;
    } finally {
      // Supprimer de la liste des requêtes en cours
      this.pendingQueries.delete(key);
    }
  }

  /**
   * Invalider une entrée du cache
   */
  invalidate(key: string): void {
    this.cache.delete(key);
    console.log(`Cache invalidated: ${key}`);
  }

  /**
   * Invalider toutes les entrées qui correspondent à un pattern
   */
  invalidatePattern(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
        console.log(`Cache invalidated by pattern: ${key}`);
      }
    }
  }

  /**
   * Nettoyer les entrées expirées
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp >= entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Obtenir la taille du cache
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Vider tout le cache
   */
  clear(): void {
    this.cache.clear();
    this.pendingQueries.clear();
    console.log('Cache cleared');
  }
}

// Instance singleton
export const globalQueryCache = new GlobalQueryCache();

// Nettoyer le cache périodiquement
setInterval(() => {
  globalQueryCache.cleanup();
}, 10 * 60 * 1000); // Toutes les 10 minutes
