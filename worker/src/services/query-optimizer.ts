/**
 * Query optimization utilities for database queries
 */

/**
 * Batch database queries to reduce round trips
 */
export const batchQueries = async <T>(
  queries: Array<() => Promise<T>>,
  batchSize: number = 10
): Promise<T[]> => {
  const results: T[] = [];

  for (let i = 0; i < queries.length; i += batchSize) {
    const batch = queries.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map((query) => query()));
    results.push(...batchResults);
  }

  return results;
};

/**
 * Memoize database query results (simple in-memory cache)
 * For production, use Cloudflare KV or Durable Objects
 */
const queryCache = new Map<string, { data: any; expiresAt: number }>();

export const memoizeQuery = async <T>(
  key: string,
  query: () => Promise<T>,
  ttl: number = 60 // seconds
): Promise<T> => {
  const cached = queryCache.get(key);
  const now = Math.floor(Date.now() / 1000);

  if (cached && cached.expiresAt > now) {
    return cached.data as T;
  }

  const result = await query();
  queryCache.set(key, {
    data: result,
    expiresAt: now + ttl,
  });

  // Clean up expired entries periodically
  if (queryCache.size > 1000) {
    for (const [k, v] of queryCache.entries()) {
      if (v.expiresAt <= now) {
        queryCache.delete(k);
      }
    }
  }

  return result;
};

/**
 * Clear query cache
 */
export const clearQueryCache = (pattern?: string): void => {
  if (pattern) {
    for (const key of queryCache.keys()) {
      if (key.includes(pattern)) {
        queryCache.delete(key);
      }
    }
  } else {
    queryCache.clear();
  }
};

