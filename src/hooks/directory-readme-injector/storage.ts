/**
 * Directory README Injector Storage
 *
 * Caching for injected READMEs to avoid re-injection.
 * Adapted from oh-my-claudecode.
 */

import { CACHE_TTL_MS } from './constants.js';
import type { ReadmeInfo } from './types.js';

/**
 * Cache entry
 */
interface CacheEntry {
  readmes: ReadmeInfo[];
  injectedAt: number;
}

/**
 * In-memory cache for injected READMEs by session
 */
const sessionCache = new Map<string, Map<string, CacheEntry>>();

/**
 * Get cache for a session
 */
function getSessionCache(sessionId: string): Map<string, CacheEntry> {
  if (!sessionCache.has(sessionId)) {
    sessionCache.set(sessionId, new Map());
  }
  return sessionCache.get(sessionId)!;
}

/**
 * Check if README was already injected for this session/directory
 */
export function wasInjected(sessionId: string, directory: string): boolean {
  const cache = getSessionCache(sessionId);
  const entry = cache.get(directory);

  if (!entry) return false;

  // Check TTL
  if (Date.now() - entry.injectedAt > CACHE_TTL_MS) {
    cache.delete(directory);
    return false;
  }

  return true;
}

/**
 * Record that README was injected
 */
export function recordInjection(
  sessionId: string,
  directory: string,
  readmes: ReadmeInfo[]
): void {
  const cache = getSessionCache(sessionId);
  cache.set(directory, {
    readmes,
    injectedAt: Date.now()
  });
}

/**
 * Get previously injected READMEs
 */
export function getInjectedReadmes(sessionId: string, directory: string): ReadmeInfo[] | null {
  const cache = getSessionCache(sessionId);
  const entry = cache.get(directory);

  if (!entry || Date.now() - entry.injectedAt > CACHE_TTL_MS) {
    return null;
  }

  return entry.readmes;
}

/**
 * Clear session cache
 */
export function clearSessionCache(sessionId: string): void {
  sessionCache.delete(sessionId);
}

/**
 * Clean up stale caches
 */
export function cleanupStaleCaches(): void {
  const now = Date.now();

  for (const [sessionId, cache] of sessionCache) {
    for (const [dir, entry] of cache) {
      if (now - entry.injectedAt > CACHE_TTL_MS) {
        cache.delete(dir);
      }
    }
    if (cache.size === 0) {
      sessionCache.delete(sessionId);
    }
  }
}
