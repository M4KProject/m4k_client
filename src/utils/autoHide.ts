import { setCss } from 'fluxio';

/**
 * Auto-hide UI elements based on user interaction
 * Pure functional approach using setCss for animations
 */

let hideTimeoutId: ReturnType<typeof setTimeout> | null = null;
let isInitialized = false;
let hideTimeout = 10000; // 10 secondes par défaut

const INTERACTION_EVENTS = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'click', 'wheel'];

/**
 * Gestionnaire d'interaction utilisateur
 */
const handleUserInteraction = () => {
  showAutoHide();
  resetHideTimer();
};

/**
 * Affiche tous les éléments avec la classe autoHide
 */
const showAutoHide = () => {
  setCss('autoHide', {
    '': {
      opacity: 1,
      pointerEvents: 'auto',
      transition: 'opacity 0.3s ease-in-out',
    },
  });
};

/**
 * Cache tous les éléments avec la classe autoHide
 */
const hideAutoHide = () => {
  setCss('autoHide', {
    '': {
      opacity: 0,
      pointerEvents: 'none',
      transition: 'opacity 0.3s ease-in-out',
    },
  });
};

/**
 * Remet à zéro le timer de masquage
 */
const resetHideTimer = () => {
  if (hideTimeoutId) {
    clearTimeout(hideTimeoutId);
  }

  hideTimeoutId = setTimeout(() => {
    hideAutoHide();
    hideTimeoutId = null;
  }, hideTimeout);
};

/**
 * Initialise le système auto-hide global
 * À appeler une fois au démarrage de l'application
 */
export const addAutoHideListener = () => {
  if (isInitialized) return;

  hideTimeout = 10000;
  isInitialized = true;

  console.debug('AutoHide: Initializing with timeout', hideTimeout);

  // Ajoute les event listeners
  INTERACTION_EVENTS.forEach((eventType) => {
    document.addEventListener(eventType, handleUserInteraction, { passive: true });
  });

  // État initial
  hideAutoHide();

  console.debug('AutoHide: Initialized successfully');
};

/**
 * Affiche temporairement les éléments autoHide
 */
export const showAutoHideElements = () => {
  showAutoHide();
  resetHideTimer();
};

/**
 * Cache immédiatement les éléments autoHide
 */
export const hideAutoHideElements = () => {
  if (hideTimeoutId) {
    clearTimeout(hideTimeoutId);
    hideTimeoutId = null;
  }
  hideAutoHide();
};

/**
 * Nettoie le système auto-hide
 */
export const removeAutoHideListener = () => {
  if (!isInitialized) return;

  INTERACTION_EVENTS.forEach((eventType) => {
    document.removeEventListener(eventType, handleUserInteraction);
  });

  if (hideTimeoutId) {
    clearTimeout(hideTimeoutId);
    hideTimeoutId = null;
  }

  // Supprime le CSS
  setCss('autoHide', null);

  isInitialized = false;
  console.debug('AutoHide: Destroyed');
};
