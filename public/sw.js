/* ============================================================
   VELORA — Service Worker (PWA & Offline Support)
   ============================================================ */

const CACHE_VERSION = 'velora-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const ASSETS_CACHE = `${CACHE_VERSION}-assets`;
const API_CACHE = `${CACHE_VERSION}-api`;

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500;600;700&display=swap',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
];

const API_ROUTES = [
  '/api/',
];

// ─── Install: Pre-cache critical assets ───
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('SW: Pre-cache failed for some assets', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// ─── Activate: Clean old caches ───
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('velora-') && !name.includes(CACHE_VERSION))
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// ─── Fetch: Cache strategies ───
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip extension requests that aren't our domain
  if (!url.origin.startsWith('https://fonts.') && 
      !url.origin.startsWith('https://unpkg.com') &&
      !url.origin.includes(self.location.origin)) {
    return;
  }

  // API requests: Network First, fallback to cache
  if (API_ROUTES.some(route => url.pathname.startsWith(route))) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  // Leaflet/static CDN assets: Cache First
  if (url.origin.includes('unpkg.com') || url.origin.includes('fonts.')) {
    event.respondWith(cacheFirst(request, ASSETS_CACHE));
    return;
  }

  // HTML/Navigation requests: Network First
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    return;
  }

  // Static assets (JS, CSS, images): Cache First
  event.respondWith(cacheFirst(request, STATIC_CACHE));
});

// ─── Strategy: Cache First ───
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'offline', 
      message: 'You are offline. Some features may be unavailable.',
      cached: false,
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// ─── Strategy: Network First ───
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;

    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineCache = await caches.match('/');
      if (offlineCache) return offlineCache;
    }

    return new Response(JSON.stringify({
      error: 'offline',
      message: 'You are offline. This content is not available.',
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// ─── Background Sync ───
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-reports') {
    event.waitUntil(syncReports());
  }
  if (event.tag === 'sync-journeys') {
    event.waitUntil(syncJourneys());
  }
});

async function syncReports() {
  const cache = await caches.open(DYNAMIC_CACHE);
  const requests = await cache.matchAll('/api/reports/pending');
  // Process pending reports
}

async function syncJourneys() {
  // Sync offline journey data
}

// ─── Push Notifications ───
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    const options = {
      body: data.message,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      vibrate: [200, 100, 200],
      data: { url: data.url || '/' },
      actions: [
        { action: 'view', title: 'View' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'VELORA', options)
    );
  } catch (e) {
    console.warn('SW: Push notification error', e);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;
  
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      const client = windowClients.find(c => c.url.includes(self.location.origin));
      if (client) {
        client.navigate(url);
        client.focus();
      } else {
        clients.openWindow(url);
      }
    })
  );
});
