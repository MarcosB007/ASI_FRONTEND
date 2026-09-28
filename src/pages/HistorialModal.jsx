import { formatearFecha, moneda } from "../utils/formato.js";
import Modal from "./Modal.jsx";

// Historial de compras de un cliente o de un proveedor.
// Por ahora muestra datos de ejemplo (ver utils/ejemplos.js)
export const HistorialModal = ({ nombre, subtitulo, filas, onCerrar }) => {
    const total = filas.reduce((suma, f) => suma + f.total, 0);

    return (
        <Modal
            titulo="Historial de compras"
            ancho
            onCerrar={onCerrar}
            pie={
                <button type="button" className="btn btn-secundario" onClick={onCerrar}>
                    Cerrar
                </button>
            }
        >
            <div className="historial-titulo">
                <h3>{nombre}</h3>
                {subtitulo && <span className="chip">{subtitulo}</span>}
            </div>

            <p className="mensaje mensaje-aviso">
                <strong>Datos de ejemplo.</strong> Todavía no se guardan las compras en el sistema: esta pantalla muestra
                cómo se va a ver el historial.
            </p>

            <div className="resumen">
                <div className="resumen-dato">
                    <span>Total operado</span>
                    <strong>{moneda(total)}</strong>
                </div>
                <div className="resumen-dato">
                    <span>Operaciones</span>
                    <strong>{filas.length}</strong>
                </div>
                <div className="resumen-dato">
                    <span>Última compra</span>
                    <strong>{formatearFecha(filas[0]?.fecha)}</strong>
                </div>
            </div>

            <div className="tabla-scroll">
                <table className="tabla">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Comprobante</th>
                            <th>Detalle</th>
                            <th>Cantidad</th>
                            <th className="col-numero">Total</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filas.map((f) => (
                            <tr key={f.comprobante}>
                                <td data-etiqueta="Fecha">{formatearFecha(f.fecha)}</td>
                                <td data-etiqueta="Comprobante">{f.comprobante}</td>
                                <td data-etiqueta="Detalle">{f.detalle}</td>
                                <td data-etiqueta="Cantidad">{f.cantidad}</td>
                                <td data-etiqueta="Total" className="col-numero">
                                    {moneda(f.total)}
                                </td>
                                <td data-etiqueta="Estado">
                                    <span className={`chip ${f.estado === "Pagado" ? "chip-ok" : "chip-pendiente"}`}>{f.estado}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Modal>
    );
};

export default HistorialModal;
