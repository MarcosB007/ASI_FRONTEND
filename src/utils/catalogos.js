import { ciclosApi, clientesApi, fincasApi, lotesApi, proveedoresApi, usuariosApi } from "../api/agroApi";

// Funciones estables (definidas fuera de los componentes) para usar con useLista
export const cargarFincas = () => fincasApi.listar();
export const cargarLotes = () => lotesApi.listar();
export const cargarCiclos = () => ciclosApi.listar();
export const cargarClientes = () => clientesApi.listar();
export const cargarProveedores = () => proveedoresApi.listar();
export const cargarUsuarios = () => usuariosApi.listar();

export const activos = (lista) => lista.filter((x) => x.estado !== 0);

// Rótulos legibles para los desplegables
export const etiquetaLote = (l) => `${l.finca} · ${l.nombre} (${l.superficie} ha)`;
export const etiquetaCiclo = (c) => `${c.cultivo} · ${c.finca} / ${c.lote} · ${c.campania}`;

// Campaña agrícola vigente: de julio a junio (ej: en octubre de 2026 → "2026/27")
export const campaniaActual = () => {
    const d = new Date();
    const inicio = d.getMonth() >= 6 ? d.getFullYear() : d.getFullYear() - 1;
    return `${inicio}/${String((inicio + 1) % 100).padStart(2, "0")}`;
};
