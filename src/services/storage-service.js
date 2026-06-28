/* ============================================================
   VELORA — Storage & Offline Service
   ============================================================ */

class StorageService {
  constructor() {
    this._prefix = 'velora_';
    this._memory = new Map();
    this._online = navigator.onLine;

    window.addEventListener('online', () => {
      this._online = true;
      this._syncPending();
    });

    window.addEventListener('offline', () => {
      this._online = false;
    });
  }

  get isOnline() {
    return this._online;
  }

  get(key) {
    const fullKey = this._prefix + key;
    try {
      const stored = localStorage.getItem(fullKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed._expiry && Date.now() > parsed._expiry) {
          localStorage.removeItem(fullKey);
          return null;
        }
        return parsed._data;
      }
    } catch (e) {
      // Fall back to memory
    }
    return this._memory.get(key) || null;
  }

  set(key, value, ttl = null) {
    const fullKey = this._prefix + key;
    const data = {
      _data: value,
      _expiry: ttl ? Date.now() + ttl : null,
      _timestamp: Date.now(),
    };
    try {
      localStorage.setItem(fullKey, JSON.stringify(data));
    } catch (e) {
      this._memory.set(key, value);
    }
  }

  remove(key) {
    try {
      localStorage.removeItem(this._prefix + key);
    } catch (e) { /* ignore */ }
    this._memory.delete(key);
  }

  clear() {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(this._prefix));
      keys.forEach(k => localStorage.removeItem(k));
    } catch (e) { /* ignore */ }
    this._memory.clear();
  }

  // Queue actions for when offline
  queueAction(action) {
    const queue = this.get('_actionQueue') || [];
    queue.push({
      ...action,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      timestamp: Date.now(),
    });
    this.set('_actionQueue', queue);
  }

  getQueuedActions() {
    return this.get('_actionQueue') || [];
  }

  removeQueuedAction(id) {
    const queue = this.get('_actionQueue') || [];
    this.set('_actionQueue', queue.filter(a => a.id !== id));
  }

  async _syncPending() {
    const actions = this.getQueuedActions();
    for (const action of actions) {
      try {
        // Attempt to process each queued action
        if (action.type === 'report') {
          // Would send to API
        }
        this.removeQueuedAction(action.id);
      } catch (e) {
        console.warn('Failed to sync action:', action.id);
      }
    }
  }

  // Cache recent routes for offline access
  cacheRecentRoute(journey) {
    const routes = this.get('cachedRoutes') || [];
    routes.unshift({
      ...journey,
      cachedAt: Date.now(),
    });
    // Keep last 10 routes
    if (routes.length > 10) routes.pop();
    this.set('cachedRoutes', routes, 7 * 24 * 60 * 60 * 1000); // 7 days
  }

  getCachedRoutes() {
    return this.get('cachedRoutes') || [];
  }

  // User preferences
  savePreferences(prefs) {
    this.set('preferences', {
      ...prefs,
      updatedAt: Date.now(),
    });
  }

  loadPreferences() {
    return this.get('preferences') || {};
  }

  // Recent searches
  addRecentSearch(query) {
    const searches = this.get('recentSearches') || [];
    const existing = searches.findIndex(s => s.toLowerCase() === query.toLowerCase());
    if (existing >= 0) searches.splice(existing, 1);
    searches.unshift(query);
    if (searches.length > 8) searches.pop();
    this.set('recentSearches', searches);
  }

  getRecentSearches() {
    return this.get('recentSearches') || [];
  }

  // Saved places
  savePlace(place) {
    const places = this.get('savedPlaces') || [];
    places.push({
      ...place,
      id: Date.now().toString(36),
      savedAt: Date.now(),
    });
    this.set('savedPlaces', places);
  }

  getSavedPlaces() {
    return this.get('savedPlaces') || [];
  }

  removePlace(id) {
    const places = this.get('savedPlaces') || [];
    this.set('savedPlaces', places.filter(p => p.id !== id));
  }
}

export const storageService = new StorageService();
export default storageService;
