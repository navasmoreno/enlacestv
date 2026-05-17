# Arquitectura del Proyecto - EnlacesTV

## 🏗️ Estructura General

Este documento describe la nueva arquitectura mejorada del proyecto, implementada para resolver problemas de gestión de estado, manejo de errores y separación de responsabilidades.

---

## 📁 Estructura de Carpetas

```
src/
├── components/          # Componentes Vue reutilizables
│   ├── ModalAlert.vue
│   ├── ModalLinkAdd.vue        # TODO: Refactorizar en componentes más pequeños
│   └── ...
├── composables/         # Lógica reutilizable (NEW)
│   ├── useLinkFeedback.js      # Manejo de votos (upvote/downvote)
│   ├── useInitializeData.js    # Inicialización de datos
│   └── useModal.js             # Lógica de modales
├── services/            # Capa de servicios
│   ├── firebase.service.js     # Singleton de Firebase (mejorado)
│   ├── services-base.js        # Clase base para servicios (mejorada)
│   ├── link.service.js         # Singleton
│   ├── chanel.service.js       # Singleton
│   ├── country.service.js      # Singleton
│   ├── resolution.service.js   # Singleton
│   └── newlink.service.js      # Singleton
├── stores/              # Estado global con Pinia (NEW)
│   ├── links.js         # Store para enlaces
│   ├── chanels.js       # Store para canales
│   ├── countries.js     # Store para países
│   ├── resolutions.js   # Store para resoluciones
│   └── newlinks.js      # Store para enlaces sugeridos
├── utils/               # Utilidades y helpers (NEW)
│   ├── errorHandler.js  # Sistema centralizado de errores
│   ├── validators.js    # Validadores de datos
│   └── constants.js     # Constantes de la aplicación
├── views/               # Vistas principales
├── style/               # Estilos SCSS
└── main.js              # Punto de entrada (actualizado con Pinia)
```

---

## 🔄 Flujo de Datos

### Antes (Problemático)
```
Componente Vue
    ↓
Instancia de Servicio
    ↓
Nueva instancia de FirebaseService
    ↓
Firebase
```

**Problemas:**
- Múltiples instancias de servicios
- Sin estado global
- Cookies para persistencia (limitadas)
- Difícil de debuggear

### Ahora (Mejorado)
```
Componente Vue
    ↓
Composable (useXXX)
    ↓
Store Pinia
    ↓
Singleton Service
    ↓
Singleton Firebase
    ↓
Firebase
```

**Beneficios:**
- Una sola instancia de cada servicio
- Estado global sincronizado
- Reactividad automática
- Fácil de debuggear

---

## 🛠️ Componentes Principales

### 1. **Sistema de Errores** (`utils/errorHandler.js`)

```javascript
import { AppError, errorHandler, Logger } from '@/utils/errorHandler';

// Lanzar error personalizado
throw new AppError('CUSTOM_CODE', 'Mensaje de error', 500, { detalles });

// Usar manejo automático
try {
  await errorHandler.tryAsync(() => miOperacion(), 'Contexto de operación');
} catch (error) {
  // Error ya fue logeado y procesado
}

// Logging centralizado
Logger.info('Mensaje', datos);
Logger.warn('Advertencia', datos);
Logger.error('Error', error);
Logger.debug('Debug en desarrollo', datos);
```

### 2. **Validadores** (`utils/validators.js`)

```javascript
import { ValidatorUtil } from '@/utils/validators';

// Validar links
const result = ValidatorUtil.validateLink(linkData);
if (!result.isValid) {
  console.log(result.errors); // ['URL de enlace inválida', ...]
}

// Validar países
const countryValidation = ValidatorUtil.validateCountry(countryData);

// Validar canales
const chanelValidation = ValidatorUtil.validateChanel(chanelData);
```

### 3. **Servicios (Singleton Pattern)**

Cada servicio es un singleton que se instancia una sola vez:

```javascript
// link.service.js
class LinkService extends ServicesBase {
  static instance = null;
  
  constructor() {
    if (LinkService.instance) return LinkService.instance;
    super('link');
    LinkService.instance = this;
  }
}

export default new LinkService();
```

**Métodos disponibles:**
- `getItems(force)` - Obtener todos los elementos (con caché)
- `getDoc(id)` - Obtener un documento específico
- `addDoc(data)` - Agregar nuevo documento
- `updateDoc(id, data)` - Actualizar documento completo
- `updateDocAttribute(id, field, value)` - Actualizar un atributo
- `deleteDoc(id)` - Eliminar documento

### 4. **Stores Pinia**

Cada store maneja el estado de una colección:

```javascript
import { useLinksStore } from '@/stores/links';

export default {
  setup() {
    const linksStore = useLinksStore();
    
    return {
      links: linksStore.links,
      isLoading: linksStore.isLoading,
      error: linksStore.error,
      fetchLinks: linksStore.fetchLinks,
      addLink: linksStore.addLink,
      updateLinkFeedback: linksStore.updateLinkFeedback,
      deleteLink: linksStore.deleteLink,
    };
  }
}
```

**Estado (ref):**
- `links` - Array de links
- `status` - Estado de carga (idle, loading, success, error)
- `error` - Mensaje de error
- `lastFetchTime` - Timestamp del último fetch

**Getters (computed):**
- `isLoading` - ¿Está cargando?
- `linksByChanel(chanelId)` - Links filtrados por canal
- `linksByCountry(countryId)` - Links filtrados por país

**Acciones:**
- `fetchLinks(force)` - Cargar links con caché
- `addLink(linkData)` - Agregar link validado
- `updateLinkFeedback(linkId, type, increment)` - Actualizar votos
- `deleteLink(linkId)` - Eliminar link
- `clearError()` - Limpiar errores
- `reset()` - Reinicializar estado

### 5. **Composables**

Abstraen lógica compleja para usarla en componentes:

```javascript
import { useLinkFeedback } from '@/composables/useLinkFeedback';

export default {
  setup() {
    const { 
      isUpdating, 
      updateError, 
      incrementFeedbackUp, 
      incrementFeedbackDown 
    } = useLinkFeedback();
    
    return {
      isUpdating,
      updateError,
      incrementFeedbackUp,
      incrementFeedbackDown,
    };
  }
}
```

**Composables disponibles:**
- `useLinkFeedback()` - Manejo de votos
- `useInitializeData()` - Inicialización de todos los datos
- `useModal()` - Lógica de modales

---

## 🚀 Uso en Componentes

### Ejemplo: Componente de Links

```vue
<script>
import { useLinksStore } from '@/stores/links';
import { useCountriesStore } from '@/stores/countries';
import { useLinkFeedback } from '@/composables/useLinkFeedback';

export default {
  setup() {
    const linksStore = useLinksStore();
    const countriesStore = useCountriesStore();
    const { incrementFeedbackUp } = useLinkFeedback();
    
    // El estado es reactivo automáticamente
    return {
      links: linksStore.links,
      countries: countriesStore.countries,
      isLoading: linksStore.isLoading,
      error: linksStore.error,
      incrementFeedbackUp,
    };
  },
  
  async mounted() {
    // Cargar datos al montar
    await this.linksStore.fetchLinks();
    await this.countriesStore.fetchCountries();
  }
}
</script>
```

---

## 📋 Caché y Sincronización

### Duración de Caché
```javascript
CACHE_DURATION: {
  LINKS: 5 minutos,
  CHANELS: 10 minutos,
  COUNTRIES: 1 hora,
  RESOLUTIONS: 1 hora,
}
```

### Refrescar Datos
```javascript
// Con caché (si no ha expirado, usa caché)
await linksStore.fetchLinks();

// Forzar refrescamiento
await linksStore.fetchLinks(true);
```

---

## ⚠️ Manejo de Errores

### Niveles de Error
1. **Nivel de Servicio** - `FirebaseService` captura y loga errores
2. **Nivel de Store** - Almacena error en estado y lo expone
3. **Nivel de Componente** - Muestra error al usuario

### Ejemplo Completo

```javascript
try {
  await linksStore.addLink(newLink);
  // Éxito
} catch (error) {
  // El error ya fue logeado automáticamente
  console.log(linksStore.error); // Acceder al mensaje
  showNotification(linksStore.error, 'error');
}
```

---

## 🔧 Instalación y Setup

### 1. Instalar dependencias
```bash
npm install
# o
yarn install
```

### 2. Variables de entorno (`.env`)
```
VUE_APP_APIKEY=...
VUE_APP_AUTHDOMAIN=...
# ... (ver .env.example)
```

### 3. Ejecutar en desarrollo
```bash
npm run serve
```

---

## 📚 Próximos Pasos (Recomendados)

### Corto Plazo
- [ ] Migrar a TypeScript para mayor seguridad de tipos
- [ ] Refactorizar `ModalLinkAdd.vue` en componentes más pequeños
- [ ] Crear tests unitarios para stores y servicios
- [ ] Implementar paginación en listas

### Mediano Plazo
- [ ] Backend Node.js/Express para lógica compleja
- [ ] Sistema de autenticación con roles
- [ ] Mejorar validación con Zod schemas
- [ ] Caché offline con Service Workers

### Largo Plazo
- [ ] Migrar Firestore a PostgreSQL
- [ ] CI/CD pipeline completo
- [ ] Documentación de API REST
- [ ] Tests E2E con Cypress

---

## 📊 Comparativa: Antes vs Después

| Aspecto | Antes | Después |
|--------|-------|---------|
| Gestión de Estado | Cookies + Variables locales | Pinia Store |
| Instancias de Servicios | Múltiples | Singleton |
| Manejo de Errores | Try/catch básico | Sistema centralizado |
| Lógica Reutilizable | Duplicada en componentes | Composables |
| Validación | Ninguna explícita | Validadores centralizados |
| Logging | Inconsistente | Logger estructurado |
| Caché | Limitado (5 min cookies) | Configurable por recurso |
| Reactividad | Manual | Automática (Vue 3) |

---

## 🐛 Debugging

### Ver logs en consola
```javascript
// En main.js, durante desarrollo
if (process.env.NODE_ENV === 'development') {
  window.__DEBUG__ = true;
}
```

### Inspeccionar Pinia en DevTools
1. Instalar [Vue DevTools](https://devtools.vuejs.org/)
2. En la pestaña "Pinia", ver y cambiar estado en tiempo real

### Ver estado global
```javascript
// En consola del navegador
import { useLinksStore } from '@/stores/links';
const store = useLinksStore();
console.log(store.$state);
```

---

## 📝 Notas Finales

- **Nunca instanciar servicios manualmente** - Usar imports directos
- **Siempre usar stores** - No duplicar estado en componentes
- **Validar datos antes de enviar** - Usar `ValidatorUtil`
- **Loguear contexto importante** - Usar `Logger`
- **Manejar errores en componentes** - Mostrar feedback al usuario

