import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import LinkService from '@/services/link.service';
import { Logger, errorHandler } from '@/utils/errorHandler';
import { ValidatorUtil } from '@/utils/validators';
import { OPERATION_STATUS, CACHE_DURATION } from '@/utils/constants';

const linkService = new LinkService();

export const useLinksStore = defineStore('links', () => {
  const links = ref([]);
  const status = ref(OPERATION_STATUS.IDLE);
  const error = ref(null);
  const lastFetchTime = ref(null);

  // Computed
  const isLoading = computed(() => status.value === OPERATION_STATUS.LOADING);

  const linksByChanel = computed(() => {
    return (chanelId) => links.value.filter(link => link.data.chanel.id === chanelId);
  });

  const linksByCountry = computed(() => {
    return (countryId) => {
      return links.value.filter(link => link.data.country.id === countryId);
    };
  });

  // Métodos
  async function fetchLinks(force = false) {
    if (!force && lastFetchTime.value && Date.now() - lastFetchTime.value < CACHE_DURATION.LINKS) {
      Logger.debug('Links usando cache');
      return links.value;
    }

    status.value = OPERATION_STATUS.LOADING;
    error.value = null;

    try {
      const items = await errorHandler.tryAsync(
        () => linkService.getItems(force),
        'fetchLinks'
      );
      links.value = items;
      lastFetchTime.value = Date.now();
      status.value = OPERATION_STATUS.SUCCESS;
      Logger.info(`Loaded ${items.length} links`);
      return items;
    } catch (err) {
      status.value = OPERATION_STATUS.ERROR;
      error.value = err.message;
      throw err;
    }
  }

  async function addLink(linkData) {
    const validation = ValidatorUtil.validateLink(linkData);
    if (!validation.isValid) {
      throw new Error(`Link validation failed: ${validation.errors.join(', ')}`);
    }

    try {
      const result = await errorHandler.tryAsync(
        () => linkService.addDoc(linkData),
        'addLink'
      );
      Logger.info('Link added successfully', linkData);
      await fetchLinks(true);
      return result;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  }

  async function updateLinkFeedback(linkId, feedbackType, increment = 1) {
    try {
      const link = links.value.find(l => l.id === linkId);
      if (!link) {
        throw new Error(`Link ${linkId} not found in store`);
      }

      const currentValue = link.data[feedbackType] || 0;
      await errorHandler.tryAsync(
        () => linkService.updateDocAttribute(linkId, feedbackType, currentValue + increment),
        `updateLinkFeedback - ${feedbackType}`
      );

      link.data[feedbackType] = currentValue + increment;
      Logger.info(`Updated ${feedbackType} for link ${linkId}`, { value: currentValue + increment });
      return link;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  }

  async function deleteLink(linkId) {
    try {
      await errorHandler.tryAsync(
        () => linkService.deleteDoc(linkId),
        'deleteLink'
      );
      links.value = links.value.filter(l => l.id !== linkId);
      Logger.info(`Link ${linkId} deleted`);
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  }

  function clearError() {
    error.value = null;
  }

  function reset() {
    links.value = [];
    status.value = OPERATION_STATUS.IDLE;
    error.value = null;
    lastFetchTime.value = null;
  }

  return {
    links,
    status,
    error,
    isLoading,
    linksByChanel,
    linksByCountry,
    fetchLinks,
    addLink,
    updateLinkFeedback,
    deleteLink,
    clearError,
    reset,
  };
});
