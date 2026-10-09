// Muestra el estado (1 / 0) de un registro como una etiqueta de color
export const EstadoChip = ({ estado }) => {
    const activo = Number(estado) === 1;
    return <span className={`chip ${activo ? "chip-ok" : "chip-pendiente"}`}>{activo ? "Activo" : "Inactivo"}</span>;
};

export default EstadoChip;
