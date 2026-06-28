/* ============================================================
   VELORA — API Service Layer
   ============================================================ */

import store from './store.js';
import { generateId } from './utils.js';

class ApiService {
  constructor() {
    this._cache = new Map();
    this._pending = new Map();
  }

  async request(config) {
    const {
      url,
      method = 'GET',
      data = null,
      timeout = 10000,
      retries = 2,
      cacheKey = null,
      cacheTTL = 30000,
      signal = null,
    } = config;

    // Check cache
    if (cacheKey && method === 'GET') {
      const cached = this._cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < cacheTTL) {
        return cached.data;
      }
    }

    // Deduplicate pending requests
    const requestKey = `${method}:${url}:${cacheKey || ''}`;
    if (this._pending.has(requestKey)) {
      return this._pending.get(requestKey);
    }

    const execute = async (attempt) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const options = {
          method,
          headers: {
            'Content-Type': 'application/json',
            'X-VELORA-Client': 'web/1.0',
          },
          signal: signal || controller.signal,
        };

        if (data && method !== 'GET') {
          options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new ApiError(
            `Request failed with status ${response.status}`,
            response.status,
            await response.json().catch(() => null)
          );
        }

        const result = await response.json();

        // Cache successful responses
        if (cacheKey && method === 'GET') {
          this._cache.set(cacheKey, { data: result, timestamp: Date.now() });
        }

        return result;
      } catch (error) {
        if (error.name === 'AbortError') {
          throw new ApiError('Request timed out. Please check your connection and try again.', 408);
        }
        if (attempt < retries) {
          await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000));
          return execute(attempt + 1);
        }
        throw error;
      }
    };

    const promise = execute(0);
    this._pending.set(requestKey, promise);
    
    try {
      return await promise;
    } finally {
      this._pending.delete(requestKey);
    }
  }

  clearCache(pattern = null) {
    if (!pattern) {
      this._cache.clear();
      return;
    }
    for (const key of this._cache.keys()) {
      if (key.includes(pattern)) this._cache.delete(key);
    }
  }

  invalidate(key) {
    this._cache.delete(key);
  }
}

class ApiError extends Error {
  constructor(message, status, body = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

export const api = new ApiService();
export { ApiError };
export default api;
