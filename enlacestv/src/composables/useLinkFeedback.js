import { useLinksStore } from '@/stores/links';
import { LINK_FEEDBACK, FEEDBACK_INCREMENT } from '@/utils/constants';
import { ref } from 'vue';

/**
 * Composable para manejar feedback de links (votos arriba/abajo)
 */
export function useLinkFeedback() {
  const linksStore = useLinksStore();
  const isUpdating = ref(false);
  const updateError = ref(null);

  const incrementFeedbackUp = async (linkId) => {
    return updateFeedback(linkId, LINK_FEEDBACK.UP, FEEDBACK_INCREMENT);
  };

  const incrementFeedbackDown = async (linkId) => {
    return updateFeedback(linkId, LINK_FEEDBACK.DOWN, FEEDBACK_INCREMENT);
  };

  const updateFeedback = async (linkId, feedbackType, increment) => {
    isUpdating.value = true;
    updateError.value = null;

    try {
      await linksStore.updateLinkFeedback(linkId, feedbackType, increment);
      return true;
    } catch (error) {
      updateError.value = error.message;
      return false;
    } finally {
      isUpdating.value = false;
    }
  };

  const clearError = () => {
    updateError.value = null;
  };

  return {
    isUpdating,
    updateError,
    incrementFeedbackUp,
    incrementFeedbackDown,
    clearError,
  };
}
