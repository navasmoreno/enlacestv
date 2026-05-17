import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import ChanelService from '@/services/chanel.service';
import { Logger, errorHandler } from '@/utils/errorHandler';
import { ValidatorUtil } from '@/utils/validators';
import { OPERATION_STATUS, CACHE_DURATION } from '@/utils/constants';

const chanelService = new ChanelService();

export const useChanelsStore = defineStore('chanels', () => {
  const chanels = ref([]);
  const status = ref(OPERATION_STATUS.IDLE);
  const error = ref(null);
  const lastFetchTime = ref(null);

  // Computed
  const isLoading = computed(() => status.value === OPERATION_STATUS.LOADING);

  const chanelsByCountry = computed(() => {
    return (countryId) => chanels.value.filter(c => c.data.country.id === countryId);
  });

  // Métodos
  async function fetchChanels(force = false) {
    if (!force && lastFetchTime.value && Date.now() - lastFetchTime.value < CACHE_DURATION.CHANELS) {
      Logger.debug('Chanels using cache');
      return chanels.value;
    }

    status.value = OPERATION_STATUS.LOADING;
    error.value = null;

    try {
      const items = await errorHandler.tryAsync(
        () => chanelService.getItems(force),
        'fetchChanels'
      );
      chanels.value = items;
      lastFetchTime.value = Date.now();
      status.value = OPERATION_STATUS.SUCCESS;
      Logger.info(`Loaded ${items.length} chanels`);
      return items;
    } catch (err) {
      status.value = OPERATION_STATUS.ERROR;
      error.value = err.message;
      throw err;
    }
  }

  async function addChanel(chanelData) {
    const validation = ValidatorUtil.validateChanel(chanelData);
    if (!validation.isValid) {
      throw new Error(`Chanel validation failed: ${validation.errors.join(', ')}`);
    }

    try {
      const result = await errorHandler.tryAsync(
        () => chanelService.addDoc(chanelData),
        'addChanel'
      );
      Logger.info('Chanel added successfully', chanelData);
      await fetchChanels(true);
      return result;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  }

  async function updateChanel(chanelId, chanelData) {
    try {
      const result = await errorHandler.tryAsync(
        () => chanelService.updateDoc(chanelId, chanelData),
        'updateChanel'
      );
      await fetchChanels(true);
      Logger.info(`Chanel ${chanelId} updated`);
      return result;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  }

  async function deleteChanel(chanelId) {
    try {
      await errorHandler.tryAsync(
        () => chanelService.deleteDoc(chanelId),
        'deleteChanel'
      );
      chanels.value = chanels.value.filter(c => c.id !== chanelId);
      Logger.info(`Chanel ${chanelId} deleted`);
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  }

  function clearError() {
    error.value = null;
  }

  function reset() {
    chanels.value = [];
    status.value = OPERATION_STATUS.IDLE;
    error.value = null;
    lastFetchTime.value = null;
  }

  return {
    chanels,
    status,
    error,
    isLoading,
    chanelsByCountry,
    fetchChanels,
    addChanel,
    updateChanel,
    deleteChanel,
    clearError,
    reset,
  };
});
