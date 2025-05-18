
/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.

// Import Workbox
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

workbox.setConfig({ debug: false });

workbox.core.setCacheNameDetails({
  prefix: 'realty-events',
  suffix: 'v1',
  precache: 'app-shell',
  runtime: 'runtime',
});

// Use precaching for app shell resources
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

// Cache CSS, JS, and Web Worker requests with a Stale While Revalidate strategy
workbox.routing.registerRoute(
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'worker',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'assets',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Cache images with a Cache First strategy
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
    ],
  })
);

// Handle API requests with a Network First strategy
workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new workbox.strategies.NetworkFirst({
    cacheName: 'api-responses',
    networkTimeoutSeconds: 10, // Fall back to cache if API doesn't respond within 10 seconds
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 1 day
      }),
    ],
  })
);

// Handle navigation requests with a Network First strategy
workbox.routing.registerRoute(
  ({ request }) => request.mode === 'navigate',
  new workbox.strategies.NetworkFirst({
    cacheName: 'navigations',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 24 * 60 * 60, // 1 day
      }),
    ],
  })
);

// Show offline page when network is not available
workbox.routing.setCatchHandler(({ event }) => {
  if (event.request.mode === 'navigate') {
    return caches.match('/offline.html');
  }
  return Response.error();
});

// Background sync for offline form submissions
workbox.routing.registerRoute(
  ({ url }) => url.pathname.endsWith('/submit-form'),
  async ({ url, event }) => {
    try {
      return await fetch(event.request);
    } catch (error) {
      // Register a background sync if offline
      const bgSync = new workbox.backgroundSync.BackgroundSyncPlugin('forms-queue', {
        maxRetentionTime: 24 * 60, // Retry for up to 24 hours
      });
      await bgSync.queueRequest({
        request: event.request,
      });
      return new Response('Offline form submitted. It will be sent when you are back online.', {
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  }
);

// Skip the waiting phase
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Add offline analytics support
workbox.routing.registerRoute(
  /.*analytics\.com\/collect.*/, 
  new workbox.strategies.NetworkOnly({
    plugins: [
      new workbox.backgroundSync.BackgroundSyncPlugin('analytics', {
        maxRetentionTime: 24 * 60, // Retry for up to 24 hours
      }),
    ],
  })
);

// Periodically update caches
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-cached-content') {
    event.waitUntil(updateCachedContent());
  }
});

async function updateCachedContent() {
  // This would be where you update specific cached content
  const cache = await caches.open('updated-content');
  // Example: update homepage
  await cache.add('/');
}
