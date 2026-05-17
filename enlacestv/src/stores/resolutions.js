import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import ResolutionService from '@/services/resolution.service';
import { Logger, errorHandler } from '@/utils/errorHandler';
import { OPERATION_STATUS, CACHE_DURATION } from '@/utils/constants';

const resolutionService = new ResolutionService();

export const useResolutionsStore = defineStore('resolutions', () => {
  const resolutions = ref([]);
  const status = ref(OPERATION_STATUS.IDLE);
  const error = ref(null);
  const lastFetchTime = ref(null);

  // Computed
  const isLoading = computed(() => status.value === OPERATION_STATUS.LOADING);

  // Métodos
  async function fetchResolutions(force = false) {
    if (!force && lastFetchTime.value && Date.now() - lastFetchTime.value < CACHE_DURATION.RESOLUTIONS) {
      Logger.debug('Resolutions using cache');
      return resolutions.value;
    }

    status.value = OPERATION_STATUS.LOADING;
    error.value = null;

    try {
      const items = await errorHandler.tryAsync(
        () => resolutionService.getItems(force),
        'fetchResolutions'
      );
      resolutions.value = items;
      lastFetchTime.value = Date.now();
      status.value = OPERATION_STATUS.SUCCESS;
      Logger.info(`Loaded ${items.length} resolutions`);
      return items;
    } catch (err) {
      status.value = OPERATION_STATUS.ERROR;
      error.value = err.message;
      throw err;
    }
  }

  async function addResolution(resolutionData) {
    try {
      const result = await errorHandler.tryAsync(
        () => resolutionService.addDoc(resolutionData),
        'addResolution'
      );
      Logger.info('Resolution added successfully', resolutionData);
      await fetchResolutions(true);
      return result;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  }

  async function updateResolution(resolutionId, resolutionData) {
    try {
      const result = await errorHandler.tryAsync(
        () => resolutionService.updateDoc(resolutionId, resolutionData),
        'updateResolution'
      );
      await fetchResolutions(true);
      Logger.info(`Resolution ${resolutionId} updated`);
      return result;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  }

  async function deleteResolution(resolutionId) {
    try {
      await errorHandler.tryAsync(
        () => resolutionService.deleteDoc(resolutionId),
        'deleteResolution'
      );
      resolutions.value = resolutions.value.filter(r => r.id !== resolutionId);
      Logger.info(`Resolution ${resolutionId} deleted`);
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  }

  function clearError() {
    error.value = null;
  }

  function reset() {
    resolutions.value = [];
    status.value = OPERATION_STATUS.IDLE;
    error.value = null;
    lastFetchTime.value = null;
  }

  return {
    resolutions,
    status,
    error,
    isLoading,
    fetchResolutions,
    addResolution,
    updateResolution,
    deleteResolution,
    clearError,
    reset,
  };
});
