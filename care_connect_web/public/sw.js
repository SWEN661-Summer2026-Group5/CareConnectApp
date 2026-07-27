/* CareConnect service worker — Cache First app shell.
   Bump CACHE_NAME whenever the precached shell changes; the activate handler
   deletes every cache that does not match the current name. */

const CACHE_NAME = 'careconnect-v1';

const APP_SHELL = ['/', '/index.html', '/home', '/tasks'];

// Install: precache the app shell.
// Each URL is added individually rather than via cache.addAll, which is atomic:
// a single 404 there would reject the whole install and leave nothing cached.
// /home and /tasks are client-side routes with no file behind them, so they only
// resolve on a host that falls back to index.html.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(
        APP_SHELL.map((url) =>
          cache.add(new Request(url, { cache: 'reload' })).catch((err) => {
            console.warn(`[sw] could not precache ${url}:`, err);
          }),
        ),
      ),
    ),
  );
  self.skipWaiting();
});

// Activate: drop caches from previous versions, then take over open pages.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

// Fetch: Cache First. A cached response wins outright; otherwise go to the
// network and store a copy for next time. When the network is unavailable,
// navigations fall back to the cached shell so client-side routes still open
// offline.
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only GETs are cacheable, and only our own origin is ours to cache.
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          // Opaque/error responses are passed through but never cached.
          if (response && response.ok && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          if (request.mode === 'navigate') {
            const shell =
              (await caches.match('/index.html')) ?? (await caches.match('/'));
            if (shell) return shell;
          }
          return Response.error();
        });
    }),
  );
});
