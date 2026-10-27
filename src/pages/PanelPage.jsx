import { useEffect, useMemo, useState } from "react";
import { getDashboard } from "../api/agroApi";
import { mensajesDeError } from "../api/axios";
import { useAuth } from "../context/AuthContext.jsx";
import { BarrasHorizontales, BarrasMensuales } from "../components/Graficos.jsx";
import { Filtros, sinVacios } from "../components/Piezas.jsx";
import { IconoCultivo, IconoFinca, IconoGasto, IconoProduccion, IconoRentabilidad, IconoVenta } from "../components/Iconos.jsx";
import { moneda, numero } from "../utils/formato.js";
import { aOpciones, useLista } from "../utils/useLista.js";
import { activos, cargarFincas } from "../utils/catalogos.js";

const Dato = ({ Icono, titulo, valor, detalle, clase = "" }) => (
    <div className={`kpi tarjeta ${clase}`}>
        <span className="kpi-icono"><Icono size={24} /></span>
        <span className="kpi-titulo">{titulo}</span>
        <strong className="kpi-valor">{valor}</strong>
        {detalle && <small className="kpi-detalle">{detalle}</small>}
    </div>
);

export const PanelPage = () => {
    const { user } = useAuth();
    const [filtro, setFiltro] = useState({});
    const [datos, setDatos] = useState(null);
    const [error, setError] = useState("");
    const fincas = useLista(cargarFincas);

    const clave = JSON.stringify(sinVacios(filtro));
    useEffect(() => {
        let vivo = true;
        getDashboard(JSON.parse(clave))
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

    const k = datos?.kpis;
    const verDinero = k && k.ingresos !== null;
    const gananciaPositiva = k && k.ganancia >= 0;

    const porCultivo = useMemo(() => (datos?.por_cultivo ?? []).map((c) => ({ nombre: c.cultivo, valor: c.ganancia })), [datos]);
    const porCategoria = useMemo(() => (datos?.gastos_por_categoria ?? []).map((c) => ({ nombre: c.categoria, valor: c.total })), [datos]);

    return (
        <section className="contenedor modulo">
            <div className="modulo-cabecera">
                <div>
                    <h1>Hola, {user?.nombre ?? user?.username}</h1>
                    <p className="texto-suave">Así viene tu actividad. Podés filtrar por finca y por período.</p>
                </div>
            </div>

            <div className="tarjeta filtros filtros-solos">
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
                        <Dato Icono={IconoFinca} titulo="Fincas" valor={k.fincas} detalle={`${k.lotes} ${k.lotes === 1 ? "lote" : "lotes"}`} />
                        <Dato Icono={IconoCultivo} titulo="Hectáreas cultivadas" valor={numero(k.hectareas_cultivadas)} detalle="Cultivos sembrados o en desarrollo" />
                        <Dato Icono={IconoProduccion} titulo="Producción" valor={`${numero(k.produccion_tn)} tn`} detalle="En el período" />
                        {verDinero && <Dato Icono={IconoVenta} titulo="Ingresos" valor={moneda(k.ingresos)} detalle="Ventas" />}
                        <Dato Icono={IconoGasto} titulo="Gastos" valor={moneda(k.gastos)} />
                        {verDinero && (
                            <Dato
                                Icono={IconoRentabilidad}
                                titulo={gananciaPositiva ? "Ganancia" : "Pérdida"}
                                valor={moneda(k.ganancia)}
                                detalle={gananciaPositiva ? "Ingresos − gastos" : "Gastaste más de lo que ingresó"}
                                clase={gananciaPositiva ? "kpi-ganancia" : "kpi-perdida"}
                            />
                        )}
                    </div>

                    <div className="paneles">
                        <article className="tarjeta panel-grafico panel-ancho">
                            <h2>{verDinero ? "Ingresos y gastos por mes" : "Gastos por mes"}</h2>
                            <BarrasMensuales serie={datos.serie_mensual} conIngresos={verDinero} />
                        </article>

                        {verDinero && (
                            <article className="tarjeta panel-grafico">
                                <h2>Ganancia por cultivo</h2>
                                <BarrasHorizontales items={porCultivo} vacio="Cargá gastos y ventas ligados a un cultivo para compararlos." />
                            </article>
                        )}

                        <article className="tarjeta panel-grafico">
                            <h2>En qué gastás</h2>
                            <BarrasHorizontales items={porCategoria} vacio="Todavía no hay gastos cargados." />
                        </article>
                    </div>
                </>
            )}
        </section>
    );
};

export default PanelPage;
