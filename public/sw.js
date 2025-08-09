// Service Worker pour le cache complet (médias + assets)
const CACHE_VERSION = 'v1';
const STATIC_CACHE_NAME = `m4k-static-${CACHE_VERSION}`;
const MEDIA_CACHE_NAME = `m4k-media-${CACHE_VERSION}`;
const MEDIA_CACHE_DURATION = 60 * 60 * 1000; // 1 heure en millisecondes

// Fichiers statiques à pré-cacher
const STATIC_ASSETS = [
  '/',
  '/index.html',
  // Les assets seront ajoutés dynamiquement
];

console.log('Service Worker: Loading with static assets to precache:', STATIC_ASSETS);

// Types de fichiers médias à mettre en cache (API)
const MEDIA_EXTENSIONS = [
  // Images
  'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico',
  // Vidéos
  'mp4', 'webm', 'ogg', 'avi', 'mov', 'wmv', 'flv', 'm4v',
  // Documents
  'pdf',
  // Audio
  'mp3', 'wav', 'ogg', 'm4a', 'aac'
];

// Types de fichiers assets à mettre en cache (statiques)
const ASSET_EXTENSIONS = [
  // Scripts et styles
  'js', 'css', 'mjs', 'ts',
  // Images statiques
  'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico',
  // Polices
  'woff', 'woff2', 'ttf', 'eot',
  // Autres assets
  'json', 'xml'
];

/**
 * Détermine le type de cache pour une URL
 */
function getCacheType(url) {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const hostname = urlObj.hostname;
    
    // CDN externes - Cache tous les fichiers avec extensions valides
    const currentDomain = self.location.hostname;
    if (hostname !== currentDomain && hostname !== 'localhost') {
      // fonts.m4k.fr : cache tout peu importe l'extension
      if (hostname === 'fonts.m4k.fr') {
        return 'static';
      }
      
      // Autres CDN : cache selon l'extension
      const filename = pathname.split('/').pop() || '';
      const extension = filename.split('.').pop()?.toLowerCase() || '';
      
      if (ASSET_EXTENSIONS.includes(extension)) {
        return 'static';
      }
    }
    
    // Assets statiques
    if (pathname.startsWith('/assets/') || pathname === '/' || pathname === '/index.html') {
      const filename = pathname.split('/').pop() || '';
      const extension = filename.split('.').pop()?.toLowerCase() || '';
      
      if (!filename || ASSET_EXTENSIONS.includes(extension) || pathname === '/' || pathname === '/index.html') {
        return 'static';
      }
    }
    
    // Médias de l'API
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

/**
 * Vérifie si une URL d'asset statique doit être mise en cache
 */
function shouldCacheStatic(url) {
  return getCacheType(url) === 'static';
}

/**
 * Vérifie si une URL de média doit être mise en cache
 */
function shouldCacheMedia(url) {
  return getCacheType(url) === 'media';
}

/**
 * Vérifie si un élément du cache est encore valide
 */
function isCacheValid(cachedResponse) {
  if (!cachedResponse) return false;
  
  const cachedDate = cachedResponse.headers.get('sw-cached-date');
  if (!cachedDate) return false;
  
  const cacheTime = parseInt(cachedDate);
  const now = Date.now();
  
  return (now - cacheTime) < MEDIA_CACHE_DURATION;
}

/**
 * Ajoute les métadonnées de cache à la réponse
 */
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

// Installation du service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Ouvre les caches
      caches.open(STATIC_CACHE_NAME),
      caches.open(MEDIA_CACHE_NAME),
      // Pré-cache les assets statiques critiques
      caches.open(STATIC_CACHE_NAME).then(cache => {
        console.log('Service Worker: Pre-caching static assets...', STATIC_ASSETS);
        return cache.addAll(STATIC_ASSETS).then(() => {
          console.log('Service Worker: Pre-cache completed successfully');
          // Vérifie que index.html est bien en cache
          return cache.match('/index.html').then(response => {
            console.log('Service Worker: index.html cached?', !!response);
          });
        }).catch(error => {
          console.error('Service Worker: Pre-cache failed', error);
          // Essaie de cacher au moins index.html individuellement
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
      // Force l'activation immédiate
      return self.skipWaiting();
    })
  );
});

// Activation du service worker
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
      // Prend le contrôle immédiatement
      return self.clients.claim();
    })
  );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = request.url;
  
  console.log('Service Worker: Intercepting request:', request.method, url, 'destination:', request.destination);
  
  // Ne traite que les requêtes GET
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
      // Stratégie Stale While Revalidate pour index.html
      console.log('Service Worker: Intercepting HTML request with SWR:', url);
      
      event.respondWith(
        caches.open(STATIC_CACHE_NAME)
          .then(cache => {
            return cache.match(request)
              .then(cachedResponse => {
                // Fetch nouvelle version en arrière-plan
                const fetchPromise = fetch(request)
                  .then(response => {
                    if (response.ok) {
                      // Compare le contenu pour détecter les changements
                      if (cachedResponse) {
                        Promise.all([
                          cachedResponse.clone().text(),
                          response.clone().text()
                        ]).then(([cachedContent, newContent]) => {
                          if (cachedContent !== newContent) {
                            console.log('Service Worker: HTML content changed, updating cache and notifying clients');
                            cache.put(request, response.clone());
                            // Notifie les clients qu'une mise à jour est disponible
                            self.clients.matchAll().then(clients => {
                              clients.forEach(client => {
                                client.postMessage({
                                  type: 'HTML_UPDATE_AVAILABLE',
                                  url: url
                                });
                              });
                            });
                          }
                        }).catch(error => {
                          console.warn('Service Worker: Error comparing HTML content:', error);
                          cache.put(request, response.clone());
                        });
                      } else {
                        // Première mise en cache
                        cache.put(request, response.clone());
                        console.log('Service Worker: HTML cached for first time:', url);
                      }
                    }
                    return response;
                  })
                  .catch(error => {
                    console.error('Service Worker: HTML fetch failed (offline?):', url, error);
                    
                    // Si on a un cache, on le retourne
                    if (cachedResponse) {
                      return cachedResponse;
                    }
                    
                    // Pour SPA, essaie de servir index.html depuis le cache
                    return cache.match('/index.html').then(indexResponse => {
                      if (indexResponse) {
                        console.log('Service Worker: Serving cached index.html for SPA route offline');
                        return indexResponse;
                      }
                      
                      // Si pas d'index.html en cache, retourne une page d'erreur
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
                
                // Retourne immédiatement le cache si disponible, sinon attend le fetch
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
      // Stratégie Cache First pour tous les autres assets statiques (CDN, locaux)
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
                
                // Télécharge et met en cache
                console.log('Service Worker: Fetching and caching static (Cache First):', url);
                return fetch(request)
                  .then(response => {
                    if (response.ok) {
                      cache.put(request, response.clone());
                      console.log('Service Worker: Static cached successfully (Cache First):', url);
                    }
                    return response;
                  })
                  .catch(error => {
                    console.error('Service Worker: Static fetch failed (offline?):', url, error);
                    
                    // Pour les routes de navigation (SPA), essaie de servir index.html depuis le cache
                    if (request.destination === 'document') {
                      console.log('Service Worker: Navigation failed offline, trying to serve index.html from cache');
                      return cache.match('/index.html').then(indexResponse => {
                        if (indexResponse) {
                          console.log('Service Worker: Serving cached index.html for SPA route');
                          return indexResponse;
                        }
                        
                        // Si pas d'index.html en cache, retourne une page d'erreur
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
                      // Pour les autres ressources, retourne une erreur 503 appropriée
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
    // Stratégie Stale While Revalidate pour les médias
    console.log('Service Worker: Intercepting media request:', url);
    
    event.respondWith(
      caches.open(MEDIA_CACHE_NAME)
        .then(cache => {
          return cache.match(request)
            .then(cachedResponse => {
              // Vérifie si le cache est encore valide
              if (isCacheValid(cachedResponse)) {
                console.log('Service Worker: Serving media from cache:', url);
                return cachedResponse;
              }
              
              // Télécharge et met en cache
              console.log('Service Worker: Fetching and caching media:', url);
              return fetch(request)
                .then(response => {
                  if (response.ok) {
                    // Clone la réponse pour la mettre en cache
                    const responseToCache = addCacheMetadata(response.clone());
                    cache.put(request, responseToCache);
                    
                    console.log('Service Worker: Media cached successfully:', url);
                  }
                  return response;
                })
                .catch(error => {
                  console.error('Service Worker: Media fetch failed (offline?):', url, error);
                  
                  // Retourne le cache expiré si disponible
                  if (cachedResponse) {
                    console.log('Service Worker: Serving expired media cache as fallback:', url);
                    return cachedResponse;
                  }
                  
                  // Pour les médias, retourne une réponse d'erreur appropriée
                  return new Response('Média indisponible hors ligne', {
                    status: 503,
                    statusText: 'Service Unavailable'
                  });
                });
            });
        })
    );
  }
  
  // Gestion spéciale pour les routes SPA (navigation)
  if (request.destination === 'document') {
    console.log('Service Worker: Document request detected, handling as SPA route:', url);
    
    event.respondWith(
      fetch(request).catch(error => {
        console.error('Service Worker: SPA route fetch failed (offline?):', url, error);
        
        // Pour les routes SPA, sert toujours index.html depuis le cache
        console.log('Service Worker: SPA route offline, serving index.html from cache');
        return caches.open(STATIC_CACHE_NAME).then(cache => {
          return cache.match('/index.html').then(indexResponse => {
            if (indexResponse) {
              console.log('Service Worker: Serving cached index.html for SPA route:', url);
              return indexResponse;
            }
            
            // Essaie aussi de chercher avec une requête vers la racine
            return cache.match('/').then(rootResponse => {
              if (rootResponse) {
                console.log('Service Worker: Serving cached root for SPA route:', url);
                return rootResponse;
              }
              
              // Si pas d'index.html en cache, retourne une page d'erreur
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
    // Pour les autres requêtes non-cachées (API, etc.)
    event.respondWith(
      fetch(request).catch(error => {
        console.error('Service Worker: Non-cached request failed (offline?):', url, error);
        
        // Pour les requêtes API, retourne une erreur JSON
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
        
        // Pour les autres, retourne une erreur générique
        return new Response('Service temporairement indisponible', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      })
    );
  }
});

// Message handler pour les commandes depuis l'application
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

/**
 * Nettoie le cache avec un pattern optionnel
 */
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

/**
 * Récupère les informations sur le cache
 */
async function getCacheInfo() {
  const info = {
    totalEntries: 0,
    cacheSize: 0,
    static: { entries: 0, size: 0, items: [] },
    media: { entries: 0, size: 0, items: [] }
  };
  
  // Cache statique
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
          cachedDate: null, // Assets statiques n'ont pas d'expiration
          size: size,
          valid: true
        });
      }
    }
  } catch (e) {
    console.warn('Error reading static cache:', e);
  }
  
  // Cache média
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