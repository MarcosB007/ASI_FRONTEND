import { useEffect, useState } from "react";
import { mensajesDeError } from "../api/axios";
import { formatearFecha, moneda, numero } from "../utils/formato.js";
import Modal from "./Modal.jsx";

// ---------- Etiquetas de estado
export const ChipEstado = ({ valor }) =>
    Number(valor) === 0 ? <span className="chip chip-inactivo">Inactivo</span> : <span className="chip chip-ok">Activo</span>;

const CICLOS = {
    PLANIFICADO: ["Planificado", "chip-pendiente"],
    SEMBRADO: ["Sembrado", "chip-ok"],
    EN_DESARROLLO: ["En desarrollo", "chip-ok"],
    COSECHADO: ["Cosechado", "chip-info"],
    CANCELADO: ["Cancelado", "chip-inactivo"],
};
export const ChipCiclo = ({ valor }) => {
    const [texto, clase] = CICLOS[valor] ?? [valor, ""];
    return <span className={`chip ${clase}`}>{texto}</span>;
};
export const OPCIONES_CICLO = Object.entries(CICLOS).map(([valor, [etiqueta]]) => ({ valor, etiqueta }));

// ---------- Filtros sobre las tablas
// selects: [{ name, label, opciones, todos }] · fechas: muestra desde/hasta
export const Filtros = ({ valores, onCambiar, selects = [], fechas = true }) => {
    const cambiar = (name) => (e) => onCambiar({ ...valores, [name]: e.target.value });
    const hayFiltros = Object.values(valores).some(Boolean);

    return (
        <>
            {selects.map((s) => (
                <label key={s.name} className="filtro">
                    <span>{s.label}</span>
                    <select value={valores[s.name] ?? ""} onChange={cambiar(s.name)}>
                        <option value="">{s.todos ?? "Todos"}</option>
                        {s.opciones.map((o) => (
                            <option key={o.valor} value={o.valor}>
                                {o.etiqueta}
                            </option>
                        ))}
                    </select>
                </label>
            ))}
            {fechas && (
                <>
                    <label className="filtro">
                        <span>Desde</span>
                        <input type="date" value={valores.desde ?? ""} onChange={cambiar("desde")} />
                    </label>
                    <label className="filtro">
                        <span>Hasta</span>
                        <input type="date" value={valores.hasta ?? ""} onChange={cambiar("hasta")} />
                    </label>
                </>
            )}
            {hayFiltros && (
                <button type="button" className="btn btn-secundario btn-chico" onClick={() => onCambiar({})}>
                    Limpiar filtros
                </button>
            )}
        </>
    );
};

// Quita los filtros vacíos antes de mandarlos al backend
export const sinVacios = (obj) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v));

// ---------- Historial de operaciones de un cliente o proveedor
export const HistorialModal = ({ cargar, onCerrar }) => {
    const [datos, setDatos] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let vivo = true;
        cargar()
            .then((res) => vivo && setDatos(res.data))
            .catch((e) => vivo && setError(mensajesDeError(e)[0]));
        return () => {
            vivo = false;
        };
    }, [cargar]);

    return (
        <Modal titulo={datos ? `Historial · ${datos.nombre}` : "Historial"} onCerrar={onCerrar} ancho>
            {error && <p className="mensaje mensaje-error">{error}</p>}
            {!datos && !error && <p className="estado-vacio">Cargando…</p>}
            {datos && (
                <>
                    <div className="resumen">
                        <div className="resumen-dato">
                            <span>Operaciones</span>
                            <strong>{datos.cantidad_operaciones}</strong>
                        </div>
                        <div className="resumen-dato">
                            <span>Total</span>
                            <strong>{moneda(datos.total)}</strong>
                        </div>
                    </div>
                    {datos.operaciones.length === 0 ? (
                        <p className="estado-vacio">Todavía no hay operaciones registradas.</p>
                    ) : (
                        <div className="tabla-scroll">
                            <table className="tabla">
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Detalle</th>
                                        <th>Finca</th>
                                        <th className="col-numero">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {datos.operaciones.map((o) => (
                                        <tr key={o.id}>
                                            <td data-etiqueta="Fecha">{formatearFecha(o.fecha)}</td>
                                            <td data-etiqueta="Detalle">
                                                {o.detalle}
                                                {o.cantidad !== undefined && (
                                                    <small className="texto-suave"> · {numero(o.cantidad)} {o.unidad.toLowerCase()} a {moneda(o.precio_unitario)}</small>
                                                )}
                                                {o.categoria && <small className="texto-suave"> · {o.categoria}</small>}
                                            </td>
                                            <td data-etiqueta="Finca">{o.finca}</td>
                                            <td data-etiqueta="Total" className="col-numero">{moneda(o.total)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </Modal>
    );
};
