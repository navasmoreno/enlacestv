import { ref } from 'vue';
import { Logger } from '@/utils/errorHandler';

/**
 * Composable para manejar modales
 */
export function useModal() {
  const isOpen = ref(false);
  const isLoading = ref(false);
  const error = ref(null);
  const data = ref(null);

  const open = (initialData = null) => {
    data.value = initialData;
    isOpen.value = true;
    error.value = null;
  };

  const close = () => {
    isOpen.value = false;
    setTimeout(() => {
      data.value = null;
      error.value = null;
    }, 300); // Esperar a la animación de cierre
  };

  const setLoading = (loading) => {
    isLoading.value = loading;
  };

  const setError = (errorMessage) => {
    error.value = errorMessage;
    Logger.warn('Modal error:', errorMessage);
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    isOpen,
    isLoading,
    error,
    data,
    open,
    close,
    setLoading,
    setError,
    clearError,
  };
}
