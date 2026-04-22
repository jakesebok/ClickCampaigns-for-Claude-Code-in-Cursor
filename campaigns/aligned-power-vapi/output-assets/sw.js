/**
 * VAPI Portal service worker — minimal shell caching + web push handler.
 * Keep narrow. Cache assessment flow HTML, the four ritual pages, and icons.
 */

const CACHE_VERSION = 'vapi-v1';
const CORE_URLS = [
  '/',
  '/dashboard',
  '/morning-checkin',
  '/evening-review',
  '/monthly-pulse',
  '/scorecard',
  '/manifest.webmanifest',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION);
    try { await cache.addAll(CORE_URLS); } catch (e) { /* best effort */ }
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)));
    self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Bypass API and Supabase
  if (url.pathname.startsWith('/api/') || url.hostname.endsWith('.supabase.co')) return;
  event.respondWith((async () => {
    try {
      const fresh = await fetch(req);
      if (fresh && fresh.status === 200) {
        const cache = await caches.open(CACHE_VERSION);
        cache.put(req, fresh.clone()).catch(() => {});
      }
      return fresh;
    } catch (e) {
      const cached = await caches.match(req);
      if (cached) return cached;
      return new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
    }
  })());
});

self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { data = { title: 'Aligned Performance', body: event.data && event.data.text ? event.data.text() : '' }; }
  const title = data.title || 'Aligned Performance Portal';
  const options = {
    body: data.body || '',
    icon: '/images/app-icon-192.png',
    badge: '/images/app-icon-192.png',
    data: { url: data.url || '/dashboard' },
    tag: data.tag || 'vapi',
    renotify: !!data.renotify,
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/dashboard';
  event.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of all) { if ('focus' in c) { c.navigate(url); return c.focus(); } }
    if (self.clients.openWindow) return self.clients.openWindow(url);
  })());
});
