/**
 * GUÍA PRÁCTICA: Cómo migrar componentes a la nueva arquitectura
 * 
 * Este archivo muestra ejemplos de cómo actualizar componentes existentes
 * para usar Pinia stores y composables en lugar de lógica local.
 */

// ============================================================
// EJEMPLO 1: Componente Simple (Mostrar lista de links)
// ============================================================

// ANTES (Problemático)
export const ListLinksOLD = {
  data() {
    return {
      links: [],
      isLoading: false,
      error: null,
    };
  },
  async mounted() {
    this.isLoading = true;
    try {
      const service = new LinkService();
      this.links = await service.getItems();
    } catch (err) {
      this.error = err.message;
    } finally {
      this.isLoading = false;
    }
  },
};

// DESPUÉS (Correcto)
import { useLinksStore } from '@/stores/links';

export const ListLinksNEW = {
  setup() {
    const linksStore = useLinksStore();
    
    return {
      links: linksStore.links,
      isLoading: linksStore.isLoading,
      error: linksStore.error,
    };
  },
  async mounted() {
    // El store maneja todo internamente
    await this.linksStore.fetchLinks();
  },
};

// ============================================================
// EJEMPLO 2: Componente con Acciones (Agregar link)
// ============================================================

// ANTES (Problemático)
export const AddLinkOLD = {
  data() {
    return {
      formData: {},
      isSubmitting: false,
      message: null,
    };
  },
  methods: {
    async submitForm() {
      this.isSubmitting = true;
      this.message = null;
      
      try {
        // Validación manual
        if (!this.formData.link || !this.formData.chanel) {
          throw new Error('Faltan campos');
        }
        
        const service = new LinkService();
        await service.addDoc(this.formData);
        this.message = 'Link agregado!';
        this.formData = {};
      } catch (err) {
        this.message = `Error: ${err.message}`;
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};

// DESPUÉS (Correcto)
import { useLinksStore } from '@/stores/links';
import { ValidatorUtil } from '@/utils/validators';
import { ref } from 'vue';

export const AddLinkNEW = {
  setup() {
    const linksStore = useLinksStore();
    const formData = ref({});
    const isSubmitting = ref(false);
    
    const submitForm = async () => {
      isSubmitting.value = true;
      linksStore.clearError();
      
      try {
        // Validación centralizada
        const validation = ValidatorUtil.validateLink(formData.value);
        if (!validation.isValid) {
          throw new Error(validation.errors[0]);
        }
        
        // Store maneja la operación
        await linksStore.addLink(formData.value);
        formData.value = {};
        // Mostrar éxito al usuario
      } catch (err) {
        // El error ya está en linksStore.error
      } finally {
        isSubmitting.value = false;
      }
    };
    
    return {
      formData,
      isSubmitting,
      error: linksStore.error,
      submitForm,
    };
  },
};

// ============================================================
// EJEMPLO 3: Componente con Feedback (Votos)
// ============================================================

// ANTES (Problemático)
export const LinkVotesOLD = {
  props: ['linkId'],
  data() {
    return {
      link: null,
      isUpdating: false,
    };
  },
  methods: {
    async upvote() {
      this.isUpdating = true;
      try {
        const service = new LinkService();
        await service.updateDocAttribute(
          this.linkId,
          'feed_up',
          (this.link.feed_up || 0) + 1
        );
        this.link.feed_up = (this.link.feed_up || 0) + 1;
      } finally {
        this.isUpdating = false;
      }
    },
  },
  async mounted() {
    const service = new LinkService();
    this.link = await service.getDoc(this.linkId);
  },
};

// DESPUÉS (Correcto)
import { useLinkFeedback } from '@/composables/useLinkFeedback';
import { useLinksStore } from '@/stores/links';

export const LinkVotesNEW = {
  props: ['linkId'],
  setup(props) {
    const linksStore = useLinksStore();
    const { 
      incrementFeedbackUp, 
      incrementFeedbackDown,
      isUpdating,
      updateError,
    } = useLinkFeedback();
    
    const link = computed(() => 
      linksStore.links.find(l => l.id === props.linkId)
    );
    
    return {
      link,
      isUpdating,
      updateError,
      incrementFeedbackUp,
      incrementFeedbackDown,
    };
  },
};

// ============================================================
// EJEMPLO 4: Componente con Múltiples Stores
// ============================================================

// ANTES (Problemático - sin sincronización)
export const ManageLinkOLD = {
  data() {
    return {
      link: null,
      countries: [],
      chanels: [],
    };
  },
  async mounted() {
    const linkService = new LinkService();
    const countryService = new CountryService();
    const chanelService = new ChanelService();
    
    this.link = await linkService.getDoc(this.linkId);
    this.countries = await countryService.getItems();
    this.chanels = await chanelService.getItems();
  },
};

// DESPUÉS (Correcto - sincronizado y reactivo)
import { useLinksStore } from '@/stores/links';
import { useCountriesStore } from '@/stores/countries';
import { useChanelsStore } from '@/stores/chanels';
import { useInitializeData } from '@/composables/useInitializeData';

export const ManageLinkNEW = {
  setup() {
    const linksStore = useLinksStore();
    const countriesStore = useCountriesStore();
    const chanelsStore = useChanelsStore();
    const { initializeAll, isLoading } = useInitializeData();
    
    return {
      link: computed(() => linksStore.links[0]),
      countries: countriesStore.countries,
      chanels: chanelsStore.chanels,
      isLoading,
    };
  },
  async mounted() {
    // Una llamada que carga todo en paralelo
    await useInitializeData().initializeAll();
  },
};

// ============================================================
// EJEMPLO 5: Componente con Modales
// ============================================================

// ANTES (Problemático - estado disperso)
export const ModalOLD = {
  data() {
    return {
      isOpen: false,
      data: null,
      isLoading: false,
      error: null,
    };
  },
  methods: {
    open(item) {
      this.isOpen = true;
      this.data = item;
      this.error = null;
    },
    close() {
      this.isOpen = false;
      this.data = null;
    },
  },
};

// DESPUÉS (Correcto - lógica encapsulada)
import { useModal } from '@/composables/useModal';

export const ModalNEW = {
  setup() {
    const {
      isOpen,
      isLoading,
      error,
      data,
      open,
      close,
      setError,
      setLoading,
    } = useModal();
    
    return {
      isOpen,
      isLoading,
      error,
      data,
      open,
      close,
      setError,
      setLoading,
    };
  },
};

// ============================================================
// CHECKLIST DE MIGRACIÓN
// ============================================================

/*
Para cada componente, seguir estos pasos:

[ ] 1. Identificar datos que corresponden a stores
    - links, chanels, countries, resolutions, newlinks
    - status, loading, error (estos vienen del store)

[ ] 2. Reemplazar lógica de servicios por stores
    - new LinkService() → useLinksStore()
    - this.links = [...] → computed desde store

[ ] 3. Extraer lógica reutilizable a composables
    - Lógica de feedback → useLinkFeedback()
    - Lógica de modales → useModal()
    - Lógica de formularios → nuevo composable

[ ] 4. Usar ValidatorUtil para validación
    - Remover validación manual
    - Usar ValidatorUtil.validate...()

[ ] 5. Usar Logger para debugging
    - Logger.info(), Logger.warn(), Logger.error()

[ ] 6. Remover métodos de cookie
    - No se necesitan con Pinia

[ ] 7. Convertir setup() en Composition API
    - Si usa Options API, convertir a Composition API

[ ] 8. Probar en navegador
    - Ver que funcione
    - Verificar que no hay errores en consola
*/
