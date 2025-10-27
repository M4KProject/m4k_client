const CACHE_VERSION = 1;
const CACHE_PREFIX = 'm4kCache';
const CACHE_NAME = CACHE_PREFIX + CACHE_VERSION;
const PRECACHE_URLS = [];
const MO = 1024 * 1024;
const CACHE_SIZE = 100 * MO;
const CACHE_ORIGINS = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names.map((name) => {
          if (name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.pathname.includes('/api/realtime')) {
    return;
  }

  if (url.pathname === '/' || url.pathname.endsWith('.html')) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  const isExternalCache = CACHE_ORIGINS.some((origin) => url.origin === origin);
  const isMediaFile = url.pathname.startsWith('/api/files/');
  const isVideo = /\.(webm|mp4|mov|avi)$/i.test(url.pathname);

  if (isExternalCache) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (isMediaFile && !isVideo) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (isMediaFile && isVideo) {
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(request));
  }
});

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then(async (response) => {
    if (response.ok) {
      const responseToCache = response.clone();
      const cachedResponse = await cache.match(request);

      if (cachedResponse) {
        const cachedText = await cachedResponse.text();
        const newText = await response.clone().text();

        if (cachedText !== newText) {
          await cache.put(request, responseToCache);
          self.clients.matchAll().then((clients) => {
            clients.forEach((client) => client.navigate(client.url));
          });
        }
      } else {
        await cache.put(request, responseToCache);
      }
    }
    return response;
  });

  return cached || fetchPromise;
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response.clone());
      await cleanCacheBySize();
    }
    return response;
  } catch (error) {
    throw error;
  }
}

async function cleanCacheBySize() {
  const cache = await caches.open(CACHE_NAME);
  const requests = await cache.keys();

  let totalSize = 0;
  const entries = [];

  for (const request of requests) {
    const response = await cache.match(request);
    if (response) {
      const blob = await response.blob();
      const size = blob.size;
      totalSize += size;
      entries.push({ request, size, date: new Date(response.headers.get('date') || 0) });
    }
  }

  if (totalSize > CACHE_SIZE) {
    entries.sort((a, b) => a.date - b.date);

    for (const entry of entries) {
      if (totalSize <= CACHE_SIZE) break;
      await cache.delete(entry.request);
      totalSize -= entry.size;
    }
  }
}
