import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import CountryService from '@/services/country.service';
import { Logger, errorHandler } from '@/utils/errorHandler';
import { ValidatorUtil } from '@/utils/validators';
import { OPERATION_STATUS, CACHE_DURATION } from '@/utils/constants';

const countryService = new CountryService();

export const useCountriesStore = defineStore('countries', () => {
  const countries = ref([]);
  const status = ref(OPERATION_STATUS.IDLE);
  const error = ref(null);
  const lastFetchTime = ref(null);

  // Computed
  const isLoading = computed(() => status.value === OPERATION_STATUS.LOADING);

  const countriesSorted = computed(() => {
    return [...countries.value].sort((a, b) =>
      (a.data.label || a.data.id).localeCompare(b.data.label || b.data.id)
    );
  });

  // Métodos
  async function fetchCountries(force = false) {
    if (!force && lastFetchTime.value && Date.now() - lastFetchTime.value < CACHE_DURATION.COUNTRIES) {
      Logger.debug('Countries using cache');
      return countries.value;
    }

    status.value = OPERATION_STATUS.LOADING;
    error.value = null;

    try {
      const items = await errorHandler.tryAsync(
        () => countryService.getItems(force),
        'fetchCountries'
      );
      countries.value = items;
      lastFetchTime.value = Date.now();
      status.value = OPERATION_STATUS.SUCCESS;
      Logger.info(`Loaded ${items.length} countries`);
      return items;
    } catch (err) {
      status.value = OPERATION_STATUS.ERROR;
      error.value = err.message;
      throw err;
    }
  }

  async function addCountry(countryData) {
    const validation = ValidatorUtil.validateCountry(countryData);
    if (!validation.isValid) {
      throw new Error(`Country validation failed: ${validation.errors.join(', ')}`);
    }

    try {
      const result = await errorHandler.tryAsync(
        () => countryService.addDoc(countryData),
        'addCountry'
      );
      Logger.info('Country added successfully', countryData);
      await fetchCountries(true);
      return result;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  }

  async function updateCountry(countryId, countryData) {
    try {
      const result = await errorHandler.tryAsync(
        () => countryService.updateDoc(countryId, countryData),
        'updateCountry'
      );
      await fetchCountries(true);
      Logger.info(`Country ${countryId} updated`);
      return result;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  }

  async function deleteCountry(countryId) {
    try {
      await errorHandler.tryAsync(
        () => countryService.deleteDoc(countryId),
        'deleteCountry'
      );
      countries.value = countries.value.filter(c => c.id !== countryId);
      Logger.info(`Country ${countryId} deleted`);
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  }

  function getCountryById(countryId) {
    return countries.value.find(c => c.id === countryId);
  }

  function clearError() {
    error.value = null;
  }

  function reset() {
    countries.value = [];
    status.value = OPERATION_STATUS.IDLE;
    error.value = null;
    lastFetchTime.value = null;
  }

  return {
    countries,
    status,
    error,
    isLoading,
    countriesSorted,
    fetchCountries,
    addCountry,
    updateCountry,
    deleteCountry,
    getCountryById,
    clearError,
    reset,
  };
});
