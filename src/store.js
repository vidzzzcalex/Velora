/* ============================================================
   VELORA — State Management (Reactive Store)
   ============================================================ */

class Store {
  constructor(initialState = {}) {
    this._state = { ...initialState };
    this._listeners = new Map();
    this._idCounter = 0;
  }

  get state() {
    return this._state;
  }

  get(key) {
    return this._state[key];
  }

  set(key, value) {
    const prev = this._state[key];
    if (prev === value) return;
    this._state[key] = value;
    this._notify(key, value, prev);
  }

  update(key, updater) {
    const prev = this._state[key];
    const next = typeof updater === 'function' ? updater(prev) : updater;
    if (prev === next) return;
    this._state[key] = next;
    this._notify(key, next, prev);
  }

  subscribe(key, callback) {
    if (!this._listeners.has(key)) {
      this._listeners.set(key, new Map());
    }
    const id = ++this._idCounter;
    this._listeners.get(key).set(id, callback);
    return () => {
      const listeners = this._listeners.get(key);
      if (listeners) listeners.delete(id);
    };
  }

  _notify(key, value, prev) {
    const listeners = this._listeners.get(key);
    if (listeners) {
      listeners.forEach(cb => {
        try { cb(value, prev); } catch (e) { console.error('Store listener error:', e); }
      });
    }
  }

  reset(key) {
    delete this._state[key];
    this._notify(key, undefined, this._state[key]);
  }

  getSnapshot() {
    return { ...this._state };
  }
}

export const store = new Store({
  user: null,
  isAuthenticated: false,
  currentPage: 'landing',
  sidebarCollapsed: false,
  notifications: [],
  unreadCount: 0,
  journeys: [],
  savedPlaces: [],
  recentSearches: [],
  fleetData: [],
  incidents: [],
  aiMessages: [],
  mapCenter: [28.6139, 77.2090],
  mapZoom: 12,
  weather: null,
  carbonSaved: 0,
  rewardPoints: 0,
  isLoading: false,
  offline: !navigator.onLine,
  aiPanelOpen: false,
  journeyResults: [],
  communityReports: [],
  emergencyActive: false,
  settings: {
    largeText: false,
    highContrast: false,
    reducedMotion: false,
    notifications: true,
    shareLiveJourney: false,
    language: 'en',
  },
});

export default store;
