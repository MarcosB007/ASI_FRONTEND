import { IconoHistorial } from "./Iconos.jsx";

// Botón "Historial" que se suma a cada fila de clientes y proveedores
export const BotonHistorial = ({ descripcion, onClick }) => (
    <button
        type="button"
        className="btn btn-secundario btn-chico btn-historial"
        title="Ver historial de compras"
        aria-label={descripcion}
        onClick={onClick}
    >
        <IconoHistorial size={18} /> Historial
    </button>
);

export default BotonHistorial;
