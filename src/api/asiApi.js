import api from './axios';

// CLIENTES
export const getClientes = () => api.get('/clientes');
export const createCliente = (datos) => api.post('/clientes', datos);
export const updateCliente = (id, datos) => api.put(`/clientes/${id}`, datos);
export const bajaCliente = (id) => api.delete(`/clientes/${id}`); // baja lógica, aunque use DELETE

// PROVEEDORES
export const getProveedores = () => api.get('/proveedores');
export const createProveedor = (datos) => api.post('/proveedores', datos);
export const updateProveedor = (id, datos) => api.put(`/proveedores/${id}`, datos);
export const bajaProveedor = (id) => api.patch(`/proveedores/${id}/baja`);
export const altaProveedor = (id) => api.patch(`/proveedores/${id}/alta`);

// EMPLEADOS
// Crear un empleado usa POST /empleados (no /register): así no se pisa la sesión del admin
export const getEmpleados = () => api.get('/empleados');
export const getEmpleado = (id) => api.get(`/empleados/${id}`);
export const createEmpleado = (datos) => api.post('/empleados', datos);
export const updateEmpleado = (id, datos) => api.put(`/edit_empleado/${id}`, datos);
export const bajaEmpleado = (id) => api.patch(`/baja_empleado/${id}`);
export const altaEmpleado = (id) => api.patch(`/alta_empleado/${id}`);

// LISTAS PARA LOS DESPLEGABLES
export const getSectores = () => api.get('/sectores');
export const getCargos = () => api.get('/cargos');
