/**
 * Simple caching utility for Cloudflare Workers
 * Uses Cloudflare KV for persistent caching
 */

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  tags?: string[]; // Cache tags for invalidation
}

/**
 * Get value from cache
 */
export const getCache = async (
  kv: KVNamespace | undefined,
  key: string
): Promise<string | null> => {
  if (!kv) return null;
  try {
    return await kv.get(key);
  } catch (error) {
    console.error(`Cache get error for key ${key}:`, error);
    return null;
  }
};

/**
 * Set value in cache
 */
export const setCache = async (
  kv: KVNamespace | undefined,
  key: string,
  value: string,
  options?: CacheOptions
): Promise<void> => {
  if (!kv) return;
  try {
    const ttl = options?.ttl || 3600; // Default 1 hour
    await kv.put(key, value, { expirationTtl: ttl });
  } catch (error) {
    console.error(`Cache set error for key ${key}:`, error);
  }
};

/**
 * Delete value from cache
 */
export const deleteCache = async (kv: KVNamespace | undefined, key: string): Promise<void> => {
  if (!kv) return;
  try {
    await kv.delete(key);
  } catch (error) {
    console.error(`Cache delete error for key ${key}:`, error);
  }
};

/**
 * Generate cache key from parts
 */
export const cacheKey = (...parts: (string | number | null | undefined)[]): string => {
  return parts.filter(Boolean).join(":");
};

/**
 * Cache wrapper for async functions
 */
export const withCache = async <T>(
  kv: KVNamespace | undefined,
  key: string,
  fn: () => Promise<T>,
  options?: CacheOptions
): Promise<T> => {
  // Try to get from cache
  const cached = await getCache(kv, key);
  if (cached) {
    try {
      return JSON.parse(cached) as T;
    } catch {
      // Invalid cache, continue to fetch
    }
  }

  // Fetch and cache
  const result = await fn();
  await setCache(kv, key, JSON.stringify(result), options);
  return result;
};

