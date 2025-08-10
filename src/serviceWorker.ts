/**
 * Service Worker Manager pour le cache des médias
 */

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

class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private isSupported = 'serviceWorker' in navigator;

  /**
   * Initialise et enregistre le service worker
   */
  async init(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('Service Workers are not supported in this browser');
      return false;
    }

    try {
      console.log('ServiceWorkerManager: Registering service worker...');
      
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      // Écoute les mises à jour
      this.registration.addEventListener('updatefound', () => {
        console.log('ServiceWorkerManager: Update found');
        const newWorker = this.registration?.installing;
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('ServiceWorkerManager: New version available');
              // Notifie l'application qu'une nouvelle version est disponible
              this.notifyUpdate();
            }
          });
        }
      });

      // Écoute les messages du service worker (notamment les mises à jour HTML)
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('ServiceWorkerManager: Received message from SW:', event.data);
        const { type, url } = event.data || {};
        
        if (type === 'HTML_UPDATE_AVAILABLE') {
          console.log('ServiceWorkerManager: HTML update available for:', url);
          this.notifyHtmlUpdate(url);
        } else {
          console.log('ServiceWorkerManager: Unknown message type:', type);
        }
      });

      console.log('ServiceWorkerManager: Registered successfully', this.registration.scope);
      
      // Force une vérification de mise à jour après l'enregistrement
      setTimeout(() => {
        console.log('ServiceWorkerManager: Forcing update check...');
        this.registration?.update();
      }, 1000);
      
      return true;
    } catch (error) {
      console.error('ServiceWorkerManager: Registration failed', error);
      return false;
    }
  }

  /**
   * Envoie une commande au service worker
   */
  private async sendMessage(type: string, payload?: any): Promise<any> {
    if (!this.registration?.active) {
      throw new Error('Service worker not active');
    }

    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        if (event.data.success) {
          resolve(event.data.data);
        } else {
          reject(new Error(event.data.error || 'Unknown error'));
        }
      };

      this.registration!.active!.postMessage(
        { type, payload },
        [messageChannel.port2]
      );
    });
  }

  /**
   * Nettoie le cache avec un pattern et type optionnels
   */
  async clearCache(pattern?: string, cacheType?: 'static' | 'media'): Promise<void> {
    await this.sendMessage('CLEAR_CACHE', { pattern, cacheType });
    console.log('ServiceWorkerManager: Cache cleared', { pattern: pattern || 'all', type: cacheType || 'both' });
  }

  /**
   * Récupère les informations sur le cache
   */
  async getCacheInfo(): Promise<CacheInfo> {
    return await this.sendMessage('GET_CACHE_INFO');
  }

  /**
   * Force la mise à jour du service worker
   */
  async update(): Promise<void> {
    if (!this.registration) {
      throw new Error('Service worker not registered');
    }

    await this.registration.update();
  }

  /**
   * Désinstalle le service worker
   */
  async unregister(): Promise<boolean> {
    if (!this.registration) {
      return false;
    }

    const result = await this.registration.unregister();
    this.registration = null;
    
    console.log('ServiceWorkerManager: Unregistered', result);
    return result;
  }

  /**
   * Notifie l'application qu'une mise à jour est disponible
   */
  private notifyUpdate() {
    // Émet un événement personnalisé
    window.dispatchEvent(new CustomEvent('sw-update-available'));
  }

  /**
   * Notifie l'application qu'une mise à jour HTML est disponible
   */
  private notifyHtmlUpdate(url: string) {
    // Émet un événement personnalisé avec l'URL concernée
    window.dispatchEvent(new CustomEvent('sw-html-update-available', { 
      detail: { url } 
    }));
  }

  /**
   * Vérifie si le service worker est actif
   */
  get isActive(): boolean {
    return !!this.registration?.active;
  }

  /**
   * Vérifie si les service workers sont supportés
   */
  get supported(): boolean {
    return this.isSupported;
  }
}

// Instance singleton
export const serviceWorkerManager = new ServiceWorkerManager();

/**
 * Initialise le service worker au démarrage de l'application
 */
export const initServiceWorker = async () => {
  const success = await serviceWorkerManager.init();
  if (success) {
    console.log('Service Worker initialized successfully');
    
    // Active la mise à jour automatique de l'HTML
    enableAutoHtmlUpdate();
    console.log('Auto HTML update enabled');
  } else {
    console.warn('Service Worker initialization failed');
  }
};

/**
 * Nettoie le cache des médias
 */
export const clearMediaCache = async (pattern?: string): Promise<void> => {
  return await serviceWorkerManager.clearCache(pattern, 'media');
};

/**
 * Nettoie le cache des assets statiques
 */
export const clearStaticCache = async (pattern?: string): Promise<void> => {
  return await serviceWorkerManager.clearCache(pattern, 'static');
};

/**
 * Nettoie tout le cache
 */
export const clearAllCache = async (pattern?: string): Promise<void> => {
  return await serviceWorkerManager.clearCache(pattern);
};

/**
 * Récupère les informations sur le cache
 */
export const getMediaCacheInfo = async (): Promise<CacheInfo> => {
  return await serviceWorkerManager.getCacheInfo();
};

/**
 * Hook pour détecter les mises à jour du service worker
 */
export const onServiceWorkerUpdate = (callback: () => void): (() => void) => {
  window.addEventListener('sw-update-available', callback);
  
  return () => {
    window.removeEventListener('sw-update-available', callback);
  };
};

/**
 * Hook pour détecter les mises à jour HTML avec possibilité de rechargement automatique
 */
export const onHtmlUpdate = (
  callback?: (url: string) => void,
  autoReload: boolean = true
): (() => void) => {
  const handler = (event: CustomEvent) => {
    const { url } = event.detail || {};
    console.log('ServiceWorkerManager: HTML update detected for:', url);
    
    // Appelle le callback si fourni
    if (callback) {
      callback(url);
    }
    
    // Rechargement automatique si activé
    if (autoReload) {
      console.log('ServiceWorkerManager: Auto-reloading page due to HTML update');
      // Petit délai pour permettre aux logs de s'afficher
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  window.addEventListener('sw-html-update-available', handler as EventListener);
  
  return () => {
    window.removeEventListener('sw-html-update-available', handler as EventListener);
  };
};

/**
 * Active la mise à jour automatique de l'HTML (rechargement de la page)
 */
export const enableAutoHtmlUpdate = (): (() => void) => {
  return onHtmlUpdate(
    (url) => console.log('ServiceWorkerManager: HTML updated automatically for:', url),
    true // autoReload = true
  );
};