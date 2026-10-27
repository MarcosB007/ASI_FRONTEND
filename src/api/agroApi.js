import api from './axios';

// Cada recurso expone listar/crear/actualizar/baja(/alta) con la forma que usa <ModuloCrud>
const recurso = (ruta, { baja = 'patch', alta = true } = {}) => ({
    listar: (params) => api.get(`/${ruta}`, { params }),
    crear: (datos) => api.post(`/${ruta}`, datos),
    actualizar: (id, datos) => api.put(`/${ruta}/${id}`, datos),
    baja: (id) => (baja === 'delete' ? api.delete(`/${ruta}/${id}`) : api.patch(`/${ruta}/${id}/baja`)),
    ...(alta ? { alta: (id) => api.patch(`/${ruta}/${id}/alta`) } : {}),
});

export const fincasApi = recurso('fincas');
export const lotesApi = recurso('lotes');
export const ciclosApi = recurso('ciclos');
export const clientesApi = { ...recurso('clientes'), historial: (id) => api.get(`/clientes/${id}/historial`) };
export const proveedoresApi = { ...recurso('proveedores'), historial: (id) => api.get(`/proveedores/${id}/historial`) };
export const usuariosApi = recurso('usuarios');

// Estos se eliminan de verdad (no tienen alta)
export const produccionApi = recurso('produccion', { baja: 'delete', alta: false });
export const gastosApi = recurso('gastos', { baja: 'delete', alta: false });
export const ventasApi = recurso('ventas', { baja: 'delete', alta: false });

// Encargados de una finca
export const getEncargados = () => api.get('/encargados');
export const getEncargadosDeFinca = (id) => api.get(`/fincas/${id}/encargados`);
export const setEncargadosDeFinca = (id, ids) => api.put(`/fincas/${id}/encargados`, { ids });

// Catálogos
export const getCultivos = () => api.get('/cultivos');
export const createCultivo = (nombre) => api.post('/cultivos', { nombre });
export const getCategoriasGasto = () => api.get('/categorias-gasto');

// Finanzas
export const getDashboard = (params) => api.get('/dashboard', { params });
export const getRentabilidad = (params) => api.get('/rentabilidad', { params });

// Recuperación de contraseña
export const olvidePassword = (identificador) => api.post('/olvide-password', { identificador });
export const restablecerPassword = (token, password) => api.post('/restablecer-password', { token, password });
