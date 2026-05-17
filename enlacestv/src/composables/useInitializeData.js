import { useLinksStore } from '@/stores/links';
import { useChanelsStore } from '@/stores/chanels';
import { useCountriesStore } from '@/stores/countries';
import { useResolutionsStore } from '@/stores/resolutions';
import { ref } from 'vue';

/**
 * Composable para cargar todos los datos iniciales de la aplicación
 */
export function useInitializeData() {
  const linksStore = useLinksStore();
  const chanelsStore = useChanelsStore();
  const countriesStore = useCountriesStore();
  const resolutionsStore = useResolutionsStore();

  const isLoading = ref(false);
  const errors = ref({});

  const initializeAll = async () => {
    isLoading.value = true;
    errors.value = {};

    try {
      // Cargar en paralelo
      await Promise.all([
        countriesStore.fetchCountries(),
        chanelsStore.fetchChanels(),
        linksStore.fetchLinks(),
        resolutionsStore.fetchResolutions(),
      ]);
    } catch (error) {
      errors.value.general = error.message;
      console.error('Error initializing data:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const refreshAll = async () => {
    isLoading.value = true;
    errors.value = {};

    try {
      await Promise.all([
        countriesStore.fetchCountries(true),
        chanelsStore.fetchChanels(true),
        linksStore.fetchLinks(true),
        resolutionsStore.fetchResolutions(true),
      ]);
    } catch (error) {
      errors.value.general = error.message;
      console.error('Error refreshing data:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const resetAll = () => {
    linksStore.reset();
    chanelsStore.reset();
    countriesStore.reset();
    resolutionsStore.reset();
    errors.value = {};
  };

  return {
    isLoading,
    errors,
    initializeAll,
    refreshAll,
    resetAll,
  };
}
