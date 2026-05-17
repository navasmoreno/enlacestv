import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import NewLinkService from '@/services/newlink.service';
import { Logger, errorHandler } from '@/utils/errorHandler';
import { ValidatorUtil } from '@/utils/validators';
import { OPERATION_STATUS, CACHE_DURATION } from '@/utils/constants';

export const useNewLinksStore = defineStore('newlinks', () => {
  const newlinks = ref([]);
  const status = ref(OPERATION_STATUS.IDLE);
  const error = ref(null);
  const lastFetchTime = ref(null);

  // Computed
  const isLoading = computed(() => status.value === OPERATION_STATUS.LOADING);

  // Métodos
  async function fetchNewLinks(force = false) {
    if (!force && lastFetchTime.value && Date.now() - lastFetchTime.value < CACHE_DURATION.LINKS) {
      Logger.debug('NewLinks using cache');
      return newlinks.value;
    }

    status.value = OPERATION_STATUS.LOADING;
    error.value = null;

    try {
      const items = await errorHandler.tryAsync(
        () => NewLinkService.getItems(force),
        'fetchNewLinks'
      );
      newlinks.value = items;
      lastFetchTime.value = Date.now();
      status.value = OPERATION_STATUS.SUCCESS;
      Logger.info(`Loaded ${items.length} new links suggestions`);
      return items;
    } catch (err) {
      status.value = OPERATION_STATUS.ERROR;
      error.value = err.message;
      throw err;
    }
  }

  async function addNewLink(linkData) {
    const validation = ValidatorUtil.validateLink(linkData);
    if (!validation.isValid) {
      throw new Error(`NewLink validation failed: ${validation.errors.join(', ')}`);
    }

    try {
      const result = await errorHandler.tryAsync(
        () => NewLinkService.addDoc(linkData),
        'addNewLink'
      );
      Logger.info('New link suggestion added successfully', linkData);
      await fetchNewLinks(true);
      return result;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  }

  async function deleteNewLink(newLinkId) {
    try {
      await errorHandler.tryAsync(
        () => NewLinkService.deleteDoc(newLinkId),
        'deleteNewLink'
      );
      newlinks.value = newlinks.value.filter(nl => nl.id !== newLinkId);
      Logger.info(`New link ${newLinkId} deleted`);
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  }

  async function approveNewLink(newLinkId, linkData) {
    // Este método movería un nuevo link sugerido a la colección de links
    try {
      await errorHandler.tryAsync(
        () => NewLinkService.deleteDoc(newLinkId),
        'approveNewLink'
      );
      newlinks.value = newlinks.value.filter(nl => nl.id !== newLinkId);
      Logger.info(`New link ${newLinkId} approved and moved to links`);
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  }

  function clearError() {
    error.value = null;
  }

  function reset() {
    newlinks.value = [];
    status.value = OPERATION_STATUS.IDLE;
    error.value = null;
    lastFetchTime.value = null;
  }

  return {
    newlinks,
    status,
    error,
    isLoading,
    fetchNewLinks,
    addNewLink,
    deleteNewLink,
    approveNewLink,
    clearError,
    reset,
  };
});
