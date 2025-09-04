// Conditional import based on build mode
let useRegisterSW: any = null;

// Only import PWA register in non-APK mode
if (!import.meta.env.APK_MODE) {
  try {
    // Dynamic import will be resolved at build time
    import('virtual:pwa-register/preact').then(pwaModule => {
      useRegisterSW = pwaModule.useRegisterSW;
    }).catch(e => {
      console.warn('PWA register not available:', e);
    });
  } catch (e) {
    console.warn('PWA register import failed:', e);
  }
}

export interface CacheInfo {
  totalEntries: number;
  cacheSize: number;
  static: {
    entries: number;
    size: number;
    items: Array<{
      url: string;
      cachedDate: string | null;
      size: number;
      valid: boolean;
    }>;
  };
  media: {
    entries: number;
    size: number;
    items: Array<{
      url: string;
      cachedDate: string | null;
      size: number;
      valid: boolean;
    }>;
  };
}

export const usePWA = () => {
  // In APK mode, return a mock PWA hook
  if (import.meta.env.APK_MODE) {
    return {
      needRefresh: [false, () => {}],
      offlineReady: [false, () => {}],
      updateServiceWorker: () => {}
    };
  }
  
  // If PWA is not loaded yet, return mock until it's ready
  if (!useRegisterSW) {
    return {
      needRefresh: [false, () => {}],
      offlineReady: [false, () => {}],
      updateServiceWorker: () => {}
    };
  }
  
  return useRegisterSW({
    onNeedRefresh() {
      console.log('PWA: Update available');
      window.dispatchEvent(new CustomEvent('sw-update-available'));
    },
    onOfflineReady() {
      console.log('PWA: Ready to work offline');
    },
  });
};

export const clearMediaCache = async (_pattern?: string): Promise<void> => {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    const mediaCaches = cacheNames.filter(name => name.includes('m4k-media'));
    await Promise.all(mediaCaches.map(name => caches.delete(name)));
  }
};

export const clearStaticCache = async (_pattern?: string): Promise<void> => {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    const staticCaches = cacheNames.filter(name => 
      name.includes('workbox') || name.includes('m4k-static') || name.includes('m4k-fonts')
    );
    await Promise.all(staticCaches.map(name => caches.delete(name)));
  }
};

export const clearAllCache = async (pattern?: string): Promise<void> => {
  await Promise.all([clearMediaCache(pattern), clearStaticCache(pattern)]);
};

export const getMediaCacheInfo = async (): Promise<CacheInfo> => {
  const info: CacheInfo = {
    totalEntries: 0,
    cacheSize: 0,
    static: { entries: 0, size: 0, items: [] },
    media: { entries: 0, size: 0, items: [] }
  };
  
  if (!('caches' in window)) return info;
  
  const cacheNames = await caches.keys();
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const size = parseInt(response.headers.get('content-length') || '0');
        const item = {
          url: request.url,
          cachedDate: null,
          size,
          valid: true
        };
        
        if (cacheName.includes('media')) {
          info.media.entries++;
          info.media.size += size;
          info.media.items.push(item);
        } else {
          info.static.entries++;
          info.static.size += size;
          info.static.items.push(item);
        }
      }
    }
  }
  
  info.totalEntries = info.static.entries + info.media.entries;
  info.cacheSize = info.static.size + info.media.size;
  
  return info;
};

export const onServiceWorkerUpdate = (callback: () => void): (() => void) => {
  window.addEventListener('sw-update-available', callback);
  
  return () => {
    window.removeEventListener('sw-update-available', callback);
  };
};