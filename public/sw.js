const VERSION = 'v2';
const STATIC_CACHE_NAME = `m4k-static-${VERSION}`;
const MEDIA_CACHE_NAME = `m4k-media-${VERSION}`;
const MEDIA_CACHE_DURATION = 60 * 60 * 1000;

const STATIC_ASSETS = [
  '/',
  '/index.html'
];

console.log('Service Worker: Loading with static assets to precache:', STATIC_ASSETS);

const MEDIA_EXTENSIONS = [
  'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico',
  'mp4', 'webm', 'ogg', 'avi', 'mov', 'wmv', 'flv', 'm4v',
  'pdf',
  'mp3', 'wav', 'ogg', 'm4a', 'aac'
];

const ASSET_EXTENSIONS = [
  'js', 'css', 'mjs', 'ts',
  'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico',
  'woff', 'woff2', 'ttf', 'eot',
  'json', 'xml'
];

function getCacheType(url) {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const hostname = urlObj.hostname;
    
    const currentDomain = self.location.hostname;
    if (hostname !== currentDomain && hostname !== 'localhost') {
      if (hostname === 'fonts.m4k.fr') {
        return 'static';
      }
      
      const filename = pathname.split('/').pop() || '';
      const extension = filename.split('.').pop()?.toLowerCase() || '';
      
      if (ASSET_EXTENSIONS.includes(extension)) {
        return 'static';
      }
    }
    
    if (pathname.startsWith('/assets/') || pathname === '/' || pathname === '/index.html') {
      const filename = pathname.split('/').pop() || '';
      const extension = filename.split('.').pop()?.toLowerCase() || '';
      
      if (!filename || ASSET_EXTENSIONS.includes(extension) || pathname === '/' || pathname === '/index.html') {
        return 'static';
      }
    }
    
    if (pathname.includes('/files/')) {
      const filename = pathname.split('/').pop() || '';
      const extension = filename.split('.').pop()?.toLowerCase() || '';
      
      if (MEDIA_EXTENSIONS.includes(extension)) {
        return 'media';
      }
    }
    
    return null;
  } catch (e) {
    return null;
  }
}

function shouldCacheStatic(url) {
  return getCacheType(url) === 'static';
}

function shouldCacheMedia(url) {
  return getCacheType(url) === 'media';
}

function isCacheValid(cachedResponse) {
  if (!cachedResponse) return false;
  
  const cachedDate = cachedResponse.headers.get('sw-cached-date');
  if (!cachedDate) return false;
  
  const cacheTime = parseInt(cachedDate);
  const now = Date.now();
  
  return (now - cacheTime) < MEDIA_CACHE_DURATION;
}

function addCacheMetadata(response) {
  const headers = new Headers(response.headers);
  headers.set('sw-cached-date', Date.now().toString());
  headers.set('sw-cached', 'true');
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers
  });
}

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME),
      caches.open(MEDIA_CACHE_NAME),
      caches.open(STATIC_CACHE_NAME).then(cache => {
        console.log('Service Worker: Pre-caching static assets...', STATIC_ASSETS);
        return cache.addAll(STATIC_ASSETS).then(() => {
          console.log('Service Worker: Pre-cache completed successfully');
          return cache.match('/index.html').then(response => {
            console.log('Service Worker: index.html cached?', !!response);
          });
        }).catch(error => {
          console.error('Service Worker: Pre-cache failed', error);
          return Promise.all(STATIC_ASSETS.map(url => {
            return cache.add(url).then(() => {
              console.log('Service Worker: Successfully cached', url);
            }).catch(err => {
              console.warn('Service Worker: Failed to cache', url, err);
            });
          }));
        });
      })
    ]).then(() => {
      console.log('Service Worker: Installation complete');
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(cacheName => 
            !cacheName.startsWith('m4k-static-') && 
            !cacheName.startsWith('m4k-media-') ||
            (cacheName !== STATIC_CACHE_NAME && cacheName !== MEDIA_CACHE_NAME)
          )
          .map(cacheName => {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => {
      console.log('Service Worker: Activated');
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = request.url;
  
  console.log('Service Worker: Intercepting request:', request.method, url, 'destination:', request.destination);
  
  if (request.method !== 'GET') {
    console.log('Service Worker: Ignoring non-GET request:', request.method);
    return;
  }
  
  const cacheType = getCacheType(url);
  console.log('Service Worker: Cache type determined:', cacheType, 'for', url);
  
  if (cacheType === 'static') {
    const urlObj = new URL(url);
    const isIndexHtml = urlObj.pathname === '/' || urlObj.pathname === '/index.html';
    
    if (isIndexHtml) {
      console.log('Service Worker: Intercepting HTML request with SWR:', url);
      
      event.respondWith(
        caches.open(STATIC_CACHE_NAME)
          .then(cache => {
            return cache.match(request)
              .then(cachedResponse => {
                const fetchPromise = fetch(request)
                  .then(async response => {
                    if (response.status === 206) {
                      console.log('Service Worker: Skipping cache for partial response:', url);
                      return response;
                    }
                    if (response.ok) {
                      if (cachedResponse) {
                        try {
                          const [cachedContent, newContent] = await Promise.all([
                            cachedResponse.clone().text(),
                            response.clone().text()
                          ]);
                          
                          console.log('Service Worker: Comparing HTML content', {
                            cachedLength: cachedContent.length,
                            newLength: newContent.length,
                            same: cachedContent === newContent
                          });
                          
                          if (cachedContent !== newContent) {
                            console.log('Service Worker: HTML content changed, updating cache and notifying clients');
                            await cache.put(request, response.clone());
                            
                            const clients = await self.clients.matchAll();
                            console.log('Service Worker: Notifying', clients.length, 'clients');
                            clients.forEach(client => {
                              client.postMessage({
                                type: 'HTML_UPDATE_AVAILABLE',
                                url: url
                              });
                            });
                          } else {
                            console.log('Service Worker: HTML content unchanged');
                          }
                        } catch (error) {
                          console.warn('Service Worker: Error comparing HTML content:', error);
                          await cache.put(request, response.clone());
                        }
                      } else {
                        await cache.put(request, response.clone());
                        console.log('Service Worker: HTML cached for first time:', url);
                      }
                    } else {
                      console.warn('Service Worker: HTML fetch returned non-OK status:', response.status);
                    }
                    return response;
                  })
                  .catch(error => {
                    console.error('Service Worker: HTML fetch failed (offline?):', url, error);
                    
                    if (cachedResponse) {
                      return cachedResponse;
                    }
                    
                    return cache.match('/index.html').then(indexResponse => {
                      if (indexResponse) {
                        console.log('Service Worker: Serving cached index.html for SPA route offline');
                        return indexResponse;
                      }
                      
                      return new Response(
                        '<!DOCTYPE html><html><head><title>Hors ligne</title></head><body><h1>Application non disponible hors ligne</h1><p><button onclick="window.location.reload()">Réessayer</button></p></body></html>',
                        { 
                          status: 200,
                          statusText: 'OK',
                          headers: { 'Content-Type': 'text/html' }
                        }
                      );
                    });
                  });
                
                if (cachedResponse) {
                  console.log('Service Worker: Serving HTML from cache (SWR):', url);
                  return cachedResponse;
                } else {
                  console.log('Service Worker: No cache available, waiting for fetch:', url);
                  return fetchPromise;
                }
              });
          })
      );
    } else {
      console.log('Service Worker: Intercepting static asset request (Cache First):', url);
      
      event.respondWith(
        caches.open(STATIC_CACHE_NAME)
          .then(cache => {
            return cache.match(request)
              .then(cachedResponse => {
                if (cachedResponse) {
                  console.log('Service Worker: Serving static from cache (Cache First):', url);
                  return cachedResponse;
                }
                
                console.log('Service Worker: Fetching and caching static (Cache First):', url);
                return fetch(request)
                  .then(response => {
                    if (response.status === 206) {
                      console.log('Service Worker: Skipping cache for partial response:', url);
                      return response;
                    }
                    if (response.ok) {
                      cache.put(request, response.clone());
                      console.log('Service Worker: Static cached successfully (Cache First):', url);
                    }
                    return response;
                  })
                  .catch(error => {
                    console.error('Service Worker: Static fetch failed (offline?):', url, error);
                    
                    if (request.destination === 'document') {
                      console.log('Service Worker: Navigation failed offline, trying to serve index.html from cache');
                      return cache.match('/index.html').then(indexResponse => {
                        if (indexResponse) {
                          console.log('Service Worker: Serving cached index.html for SPA route');
                          return indexResponse;
                        }
                        
                        return new Response(
                          '<!DOCTYPE html><html><head><title>Hors ligne</title></head><body><h1>Application non disponible hors ligne</h1><p><button onclick="window.location.reload()">Réessayer</button></p></body></html>',
                          { 
                            status: 200,
                            statusText: 'OK',
                            headers: { 'Content-Type': 'text/html' }
                          }
                        );
                      });
                    } else {
                      console.log('Service Worker: Returning 503 for failed static resource:', url);
                      return new Response('Ressource temporairement indisponible', {
                        status: 503,
                        statusText: 'Service Unavailable',
                        headers: { 'Content-Type': 'text/plain' }
                      });
                    }
                  });
              });
          })
      );
    }
    
  } else if (cacheType === 'media') {
    console.log('Service Worker: Intercepting media request:', url);
    
    event.respondWith(
      caches.open(MEDIA_CACHE_NAME)
        .then(cache => {
          return cache.match(request)
            .then(cachedResponse => {
              if (isCacheValid(cachedResponse)) {
                console.log('Service Worker: Serving media from cache:', url);
                return cachedResponse;
              }
              
              console.log('Service Worker: Fetching and caching media:', url);
              return fetch(request)
                .then(response => {
                  if (response.status === 206) {
                    console.log('Service Worker: Skipping cache for partial response:', url);
                    return response;
                  }
                  if (response.ok) {
                    const responseToCache = addCacheMetadata(response.clone());
                    cache.put(request, responseToCache);
                    
                    console.log('Service Worker: Media cached successfully:', url);
                  }
                  return response;
                })
                .catch(error => {
                  console.error('Service Worker: Media fetch failed (offline?):', url, error);
                  
                  if (cachedResponse) {
                    console.log('Service Worker: Serving expired media cache as fallback:', url);
                    return cachedResponse;
                  }
                  
                  return new Response('Média indisponible hors ligne', {
                    status: 503,
                    statusText: 'Service Unavailable'
                  });
                });
            });
        })
    );
  }
  
  if (request.destination === 'document') {
    console.log('Service Worker: Document request detected, handling as SPA route:', url);
    
    event.respondWith(
      fetch(request).catch(error => {
        console.error('Service Worker: SPA route fetch failed (offline?):', url, error);
        
        console.log('Service Worker: SPA route offline, serving index.html from cache');
        return caches.open(STATIC_CACHE_NAME).then(cache => {
          return cache.match('/index.html').then(indexResponse => {
            if (indexResponse) {
              console.log('Service Worker: Serving cached index.html for SPA route:', url);
              return indexResponse;
            }
            
            return cache.match('/').then(rootResponse => {
              if (rootResponse) {
                console.log('Service Worker: Serving cached root for SPA route:', url);
                return rootResponse;
              }
              
              console.log('Service Worker: No cached HTML found, serving offline page');
              return new Response(
                '<!DOCTYPE html><html><head><title>Hors ligne</title></head><body><h1>Application non disponible hors ligne</h1><p>Impossible de charger la page <code>' + url + '</code></p><p><button onclick="window.location.reload()">Réessayer</button></p></body></html>',
                { 
                  status: 200,
                  statusText: 'OK',
                  headers: { 'Content-Type': 'text/html' }
                }
              );
            });
          });
        });
      })
    );
  } else if (!cacheType) {
    event.respondWith(
      fetch(request).catch(error => {
        console.error('Service Worker: Non-cached request failed (offline?):', url, error);
        
        if (request.headers.get('accept')?.includes('application/json')) {
          return new Response(
            JSON.stringify({ 
              error: 'Service temporairement indisponible', 
              offline: true 
            }), 
            {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }
        
        return new Response('Service temporairement indisponible', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      })
    );
  }
});

self.addEventListener('message', (event) => {
  const { type, payload } = event.data || {};
  
  switch (type) {
    case 'CLEAR_CACHE':
      clearCache(payload?.pattern, payload?.cacheType).then(() => {
        event.ports[0]?.postMessage({ success: true });
      }).catch(error => {
        event.ports[0]?.postMessage({ success: false, error: error.message });
      });
      break;
      
    case 'GET_CACHE_INFO':
      getCacheInfo().then(info => {
        event.ports[0]?.postMessage({ success: true, data: info });
      });
      break;
      
    default:
      console.log('Service Worker: Unknown message type:', type);
  }
});

async function clearCache(pattern, cacheType) {
  const cacheNames = [];
  
  if (!cacheType || cacheType === 'static') {
    cacheNames.push(STATIC_CACHE_NAME);
  }
  if (!cacheType || cacheType === 'media') {
    cacheNames.push(MEDIA_CACHE_NAME);
  }
  
  let totalDeleted = 0;
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    const toDelete = requests.filter(request => {
      if (!pattern) return true;
      return request.url.includes(pattern);
    });
    
    await Promise.all(
      toDelete.map(request => cache.delete(request))
    );
    
    totalDeleted += toDelete.length;
    console.log(`Service Worker: Cleared ${toDelete.length} entries from ${cacheName}`);
  }
  
  console.log(`Service Worker: Total cleared ${totalDeleted} cache entries`);
}

async function getCacheInfo() {
  const info = {
    totalEntries: 0,
    cacheSize: 0,
    static: { entries: 0, size: 0, items: [] },
    media: { entries: 0, size: 0, items: [] }
  };
  
  try {
    const staticCache = await caches.open(STATIC_CACHE_NAME);
    const staticRequests = await staticCache.keys();
    
    info.static.entries = staticRequests.length;
    
    for (const request of staticRequests) {
      const response = await staticCache.match(request);
      if (response) {
        const size = parseInt(response.headers.get('content-length') || '0');
        info.static.size += size;
        info.static.items.push({
          url: request.url,
          cachedDate: null,
          size: size,
          valid: true
        });
      }
    }
  } catch (e) {
    console.warn('Error reading static cache:', e);
  }
  
  try {
    const mediaCache = await caches.open(MEDIA_CACHE_NAME);
    const mediaRequests = await mediaCache.keys();
    
    info.media.entries = mediaRequests.length;
    
    for (const request of mediaRequests) {
      const response = await mediaCache.match(request);
      if (response) {
        const cachedDate = response.headers.get('sw-cached-date');
        const size = parseInt(response.headers.get('content-length') || '0');
        
        info.media.size += size;
        info.media.items.push({
          url: request.url,
          cachedDate: cachedDate ? new Date(parseInt(cachedDate)).toISOString() : null,
          size: size,
          valid: isCacheValid(response)
        });
      }
    }
  } catch (e) {
    console.warn('Error reading media cache:', e);
  }
  
  info.totalEntries = info.static.entries + info.media.entries;
  info.cacheSize = info.static.size + info.media.size;
  
  return info;
}