import { useEffect, useMemo, useState } from "react";
import { getRentabilidad } from "../api/agroApi";
import { mensajesDeError } from "../api/axios";
import { BarrasHorizontales } from "../components/Graficos.jsx";
import { Filtros, sinVacios } from "../components/Piezas.jsx";
import { moneda, porcentaje } from "../utils/formato.js";
import { aOpciones, useLista } from "../utils/useLista.js";
import { activos, cargarFincas } from "../utils/catalogos.js";

const AGRUPACIONES = [
    { valor: "cultivo", etiqueta: "Por cultivo" },
    { valor: "finca", etiqueta: "Por finca" },
    { valor: "lote", etiqueta: "Por lote" },
    { valor: "campania", etiqueta: "Por campaña" },
];

export const RentabilidadPage = () => {
    const [agrupar, setAgrupar] = useState("cultivo");
    const [filtro, setFiltro] = useState({});
    const [datos, setDatos] = useState(null);
    const [error, setError] = useState("");
    const fincas = useLista(cargarFincas);

    const clave = JSON.stringify({ ...sinVacios(filtro), agrupar });
    useEffect(() => {
        let vivo = true;
        getRentabilidad(JSON.parse(clave))
            .then((res) => {
                if (!vivo) return;
                setError("");
                setDatos(res.data);
            })
            .catch((e) => vivo && setError(mensajesDeError(e)[0]));
        return () => {
            vivo = false;
        };
    }, [clave]);

    const barras = useMemo(() => (datos?.grupos ?? []).map((g) => ({ nombre: g.nombre, valor: g.ganancia })), [datos]);
    const t = datos?.totales;

    return (
        <section className="contenedor modulo">
            <div className="modulo-cabecera">
                <div>
                    <h1>Rentabilidad</h1>
                    <p className="texto-suave">Ganancia = ingresos − gastos. Compará cómo te fue según cómo lo mires.</p>
                </div>
            </div>

            <div className="tarjeta filtros filtros-solos">
                <div className="segmentos" role="group" aria-label="Agrupar resultados">
                    {AGRUPACIONES.map((a) => (
                        <button
                            key={a.valor}
                            type="button"
                            className={`segmento${agrupar === a.valor ? " activo" : ""}`}
                            aria-pressed={agrupar === a.valor}
                            onClick={() => setAgrupar(a.valor)}
                        >
                            {a.etiqueta}
                        </button>
                    ))}
                </div>
                <Filtros
                    valores={filtro}
                    onCambiar={setFiltro}
                    selects={[{ name: "finca", label: "Finca", todos: "Todas las fincas", opciones: aOpciones(activos(fincas), "idFINCA", "nombre") }]}
                />
            </div>

            {error && <p className="mensaje mensaje-error">{error}</p>}
            {!datos && !error && <p className="estado-vacio">Cargando…</p>}

            {datos && (
                <>
                    <div className="kpis">
                        <div className="kpi tarjeta"><span className="kpi-titulo">Ingresos</span><strong className="kpi-valor">{moneda(t.ingresos)}</strong></div>
                        <div className="kpi tarjeta"><span className="kpi-titulo">Gastos</span><strong className="kpi-valor">{moneda(t.gastos)}</strong></div>
                        <div className={`kpi tarjeta ${t.ganancia >= 0 ? "kpi-ganancia" : "kpi-perdida"}`}>
                            <span className="kpi-titulo">{t.ganancia >= 0 ? "Ganancia" : "Pérdida"}</span>
                            <strong className="kpi-valor">{moneda(t.ganancia)}</strong>
                        </div>
                        <div className="kpi tarjeta">
                            <span className="kpi-titulo">Rentabilidad</span>
                            <strong className="kpi-valor">{porcentaje(t.rentabilidad_pct)}</strong>
                            <small className="kpi-detalle">Ganancia sobre lo gastado</small>
                        </div>
                    </div>

                    {datos.grupos.length === 0 ? (
                        <p className="tarjeta estado-vacio">Todavía no hay gastos ni ventas cargados para calcular la rentabilidad.</p>
                    ) : (
                        <div className="paneles">
                            <article className="tarjeta panel-grafico">
                                <h2>Ganancia</h2>
                                <BarrasHorizontales items={barras} />
                            </article>
                            <article className="tarjeta panel-grafico panel-ancho">
                                <h2>Detalle</h2>
                                <div className="tabla-scroll">
                                    <table className="tabla">
                                        <thead>
                                            <tr>
                                                <th>{AGRUPACIONES.find((a) => a.valor === agrupar).etiqueta.replace("Por ", "").replace(/^./, (c) => c.toUpperCase())}</th>
                                                <th className="col-numero">Ingresos</th>
                                                <th className="col-numero">Gastos</th>
                                                <th className="col-numero">Ganancia</th>
                                                <th className="col-numero">Rentabilidad</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {datos.grupos.map((g) => (
                                                <tr key={g.clave}>
                                                    <td data-etiqueta="Nombre">{g.nombre}</td>
                                                    <td data-etiqueta="Ingresos" className="col-numero">{moneda(g.ingresos)}</td>
                                                    <td data-etiqueta="Gastos" className="col-numero">{moneda(g.gastos)}</td>
                                                    <td data-etiqueta="Ganancia" className={`col-numero ${g.ganancia < 0 ? "texto-perdida" : ""}`}>
                                                        {g.ganancia < 0 ? "▼ " : ""}{moneda(g.ganancia)}
                                                    </td>
                                                    <td data-etiqueta="Rentabilidad" className="col-numero">{porcentaje(g.rentabilidad_pct)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </article>
                        </div>
                    )}
                </>
            )}
        </section>
    );
};

export default RentabilidadPage;
