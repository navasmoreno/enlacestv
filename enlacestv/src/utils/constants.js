/**
 * Constantes de la aplicación
 */

export const COLLECTIONS = {
  LINKS: process.env.VUE_APP_COLLECTION_LINKS_NAME || 'link',
  CHANELS: process.env.VUE_APP_COLLECTION_CHANELS_NAME || 'chanel',
  COUNTRIES: process.env.VUE_APP_COLLECTION_COUNTRIES_NAME || 'country',
  RESOLUTIONS: process.env.VUE_APP_COLLECTION_RESOLUTION_NAME || 'resolution',
};

export const OPERATION_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

export const CACHE_DURATION = {
  LINKS: 5 * 60 * 1000, // 5 minutos
  CHANELS: 10 * 60 * 1000, // 10 minutos
  COUNTRIES: 60 * 60 * 1000, // 1 hora
  RESOLUTIONS: 60 * 60 * 1000, // 1 hora
};

export const FEEDBACK_INCREMENT = 1;

export const LINK_FEEDBACK = {
  UP: 'feed_up',
  DOWN: 'feed_down',
};

export const MODAL_STATES = {
  CLOSED: 0,
  OPEN: 1,
  LOADING: 2,
};
