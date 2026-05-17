# EnlacesTV

EnlacesTV es una aplicación Vue 3 para gestionar enlaces de Acestream, canales, países y resoluciones, usando Firebase como backend.

## 📌 Descripción

El proyecto ofrece:
- Navegación entre vistas públicas y paneles de administración.
- Gestión de enlaces, sugerencias y feedback de usuarios.
- CRUD completo para canales, países, resoluciones y links.
- Firebase Firestore como almacenamiento principal.
- Arquitectura modular con servicios, stores, composables y utilidades.

## 📁 Estructura del proyecto

```
/extra/Proyectos/enlacestv
├── docker-compose.yml
├── dockerfile
├── .env
├── README.md
├── enlacestv/
│   ├── package.json
│   ├── vue.config.js
│   ├── src/
│   │   ├── App.vue
│   │   ├── main.js
│   │   ├── assets/
│   │   ├── components/
│   │   ├── composables/         # Lógica reutilizable
│   │   ├── services/           # Capa de acceso a Firebase
│   │   ├── stores/             # Pinia para estado global
│   │   ├── utils/              # Validación, constantes y errores
│   │   ├── views/              # Vistas de la aplicación
│   │   └── style/
│   └── README.md
└── ARQUITECTURA.md
```

## 🚀 Configuración y ejecución

### Requisitos
- Node.js 24.x recomendado (el proyecto usa dependencias que no están testeadas con Node 26)
- npm o Yarn
- Docker (opcional)

### Instalación

```bash
cd /extra/Proyectos/enlacestv/enlacestv
npm install
```

### Ejecutar en desarrollo

```bash
npm run serve
```

### Ejecutar con Docker

```bash
cd /extra/Proyectos/enlacestv
docker-compose up --build
```

### Construcción para producción

```bash
cd /extra/Proyectos/enlacestv/enlacestv
npm run build
```

## 🔧 Dependencias principales

- Vue 3
- Vue Router 4
- Pinia
- Firebase
- Bulma
- Font Awesome
- Sass

## 🧩 Puntos clave de la arquitectura

- `src/main.js`: arranca la aplicación y registra Pinia, router y FontAwesome.
- `src/services/`: servicios que acceden a Firebase y encapsulan operaciones CRUD.
- `src/stores/`: stores con Pinia para contenido reactivo y caché.
- `src/composables/`: lógica reutilizable para feedback, modales e inicialización.
- `src/utils/`: utilidades de validación y manejo de errores.

## 📘 Documentación adicional

- `enlacestv/ARQUITECTURA.md` - Detalles de la arquitectura del frontend.
- `enlacestv/MIGRATION_GUIDE.md` - Guía para migrar componentes a la nueva estructura.
- `enlacestv/SETUP_ACTIVATION.md` - Pasos recomendados para activar los cambios.
- `enlacestv/CHANGELOG.js` - Cambios recientes y mejoras.

## ⚠️ Notas importantes

- El archivo `.env` contiene variables de Firebase y no debe compartirse.
- La app usa rutas tanto públicas como de gestión (`/manage/*`).
- Se recomienda revisar y migrar las vistas existentes a stores y composables.

## ✅ Recomendaciones

- Usar Pinia como fuente única de verdad para datos.
- Validar los datos en `src/utils/validators.js` antes de guardar.
- Manejar errores desde `src/utils/errorHandler.js`.
- Separar componentes grandes en piezas más pequeñas.

---

Si necesitas, puedo también actualizar el `enlacestv/enlacestv/README.md` con información más específica del frontend.
