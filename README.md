# TuAgro · Frontend

Panel de gestión del campo con tres módulos: **clientes**, **proveedores** y **empleados**.
React 19 + Vite + React Router + Axios, sin librerías de UI (CSS propio en `src/styles`).
Tipografías: Inter y Plus Jakarta Sans (instaladas con `@fontsource`, funcionan sin internet).

## Puesta en marcha

```bash
npm install
npm run dev
```

El frontend espera el backend en `http://localhost:3000`. Si está en otra dirección, copiá
`.env.example` a `.env` y cambiá `VITE_API_URL`. El backend debe permitir el origen
`http://localhost:5173` en CORS.

## Qué hace cada módulo

- **Clientes:** listado, alta, edición y baja. Cada cliente tiene un botón *Historial* con sus compras.
- **Proveedores:** igual que clientes, más el **rubro** (Semillas, Combustibles, etc.) y su historial de compras.
- **Empleados:** el sector y el cargo se eligen de listas que vienen del backend (`/sectores` y `/cargos`).

> Los historiales de compras usan **datos de ejemplo** (`src/utils/ejemplos.js`): el backend todavía no guarda
> compras ni ventas. Cuando exista el endpoint, se reemplazan por los datos reales.

## Estructura

```
src/
├── api/
│   ├── axios.js      instancia de Axios (URL base, JWT en cada request, manejo de 401)
│   ├── auth.js       login/registro y manejo de la sesión (cookie con el token)
│   └── asiApi.js     endpoints de clientes, proveedores, empleados, sectores y cargos
├── context/
│   └── AuthContext.jsx   sesión del usuario (signIn, signUp, logout, user, isAuthenticated)
├── pages/            pantallas y componentes de pantalla
│   ├── HomePage, LoginPage, RegisterPage, AdministracionPage (panel)
│   ├── ClientesPage, ProveedoresPage, EmpleadosPage   (configuración de cada módulo)
│   ├── ModuloCrud.jsx    listado + búsqueda + alta/edición + baja, compartido por los 3 módulos
│   ├── HistorialModal, BotonHistorial   historial de compras
│   └── Header, Footer, Modal, Iconos, NotFoundPage
├── routes/
│   └── AppRouter.jsx     rutas públicas y rutas protegidas por sesión
├── styles/               base (colores y tipografía), layout, home y módulos
├── utils/                formato, rubros, ejemplos y hooks para cargar sectores/cargos/empleados
└── config.js             URL del backend y nombre de la marca
```

## Notas

- Para cambiar el nombre que aparece en el encabezado, editá `MARCA` en `src/config.js`.
- Los colores están todos en `src/styles/base.css` (escala `--verde-50` a `--verde-950`).
- Para agregar un módulo nuevo alcanza con sumar sus endpoints en `asiApi.js`, una página que
  configure `ModuloCrud` (columnas y campos) y una ruta en `AppRouter.jsx`.
