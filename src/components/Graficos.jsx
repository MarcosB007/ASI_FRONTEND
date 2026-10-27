import { moneda, monedaCorta, nombreMes } from "../utils/formato.js";

const Leyenda = ({ items }) => (
    <ul className="leyenda">
        {items.map((i) => (
            <li key={i.texto}>
                <span className={`leyenda-marca ${i.clase}`} /> {i.texto}
            </li>
        ))}
    </ul>
);

// Valor "redondo" para el techo del eje: 1, 2, 2.5, 5 o 10 × potencia de 10
const techo = (max) => {
    if (max <= 0) return 1;
    const exp = 10 ** Math.floor(Math.log10(max));
    return [1, 2, 2.5, 5, 10].map((m) => m * exp).find((v) => v >= max);
};

/** Ingresos vs gastos mes a mes. Sin ingresos (rol Encargado) muestra solo gastos. */
export const BarrasMensuales = ({ serie, conIngresos = true }) => {
    if (!serie.length) return <p className="estado-vacio">Todavía no hay movimientos en este período.</p>;

    const ancho = 640;
    const alto = 260;
    const m = { izq: 64, der: 12, arr: 12, abajo: 32 };
    const area = { w: ancho - m.izq - m.der, h: alto - m.arr - m.abajo };
    const max = techo(Math.max(...serie.flatMap((s) => [s.gastos ?? 0, conIngresos ? (s.ingresos ?? 0) : 0])));
    const y = (v) => m.arr + area.h - (v / max) * area.h;
    const grupo = area.w / serie.length;
    const barra = Math.min(26, (grupo - 14) / (conIngresos ? 2 : 1));
    const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max);

    return (
        <figure className="grafico">
            <Leyenda items={[...(conIngresos ? [{ texto: "Ingresos", clase: "marca-ingreso" }] : []), { texto: "Gastos", clase: "marca-gasto" }]} />
            <svg viewBox={`0 0 ${ancho} ${alto}`} role="img" aria-label="Ingresos y gastos por mes">
                {ticks.map((t) => (
                    <g key={t}>
                        <line x1={m.izq} x2={ancho - m.der} y1={y(t)} y2={y(t)} className="grafico-grilla" />
                        <text x={m.izq - 8} y={y(t) + 4} textAnchor="end" className="grafico-eje">{monedaCorta(t)}</text>
                    </g>
                ))}
                {serie.map((s, i) => {
                    const x0 = m.izq + i * grupo + (grupo - barra * (conIngresos ? 2 : 1) - (conIngresos ? 2 : 0)) / 2;
                    const barras = [
                        ...(conIngresos ? [{ v: s.ingresos ?? 0, clase: "barra-ingreso", nombre: "Ingresos" }] : []),
                        { v: s.gastos ?? 0, clase: "barra-gasto", nombre: "Gastos" },
                    ];
                    return (
                        <g key={s.mes}>
                            {barras.map((b, j) => (
                                <rect
                                    key={b.nombre}
                                    x={x0 + j * (barra + 2)}
                                    y={y(b.v)}
                                    width={barra}
                                    height={Math.max(0, m.arr + area.h - y(b.v))}
                                    rx="4"
                                    className={b.clase}
                                >
                                    <title>{`${nombreMes(s.mes)} · ${b.nombre}: ${moneda(b.v)}`}</title>
                                </rect>
                            ))}
                            <text x={m.izq + i * grupo + grupo / 2} y={alto - 10} textAnchor="middle" className="grafico-eje">
                                {nombreMes(s.mes)}
                            </text>
                        </g>
                    );
                })}
            </svg>
            <details className="grafico-tabla">
                <summary>Ver como tabla</summary>
                <table className="tabla">
                    <thead>
                        <tr>
                            <th>Mes</th>
                            {conIngresos && <th className="col-numero">Ingresos</th>}
                            <th className="col-numero">Gastos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {serie.map((s) => (
                            <tr key={s.mes}>
                                <td>{nombreMes(s.mes)}</td>
                                {conIngresos && <td className="col-numero">{moneda(s.ingresos)}</td>}
                                <td className="col-numero">{moneda(s.gastos)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </details>
        </figure>
    );
};

/**
 * Barras horizontales con el valor al lado. Si hay valores negativos, el cero queda en el medio
 * y las pérdidas van hacia la izquierda con otro color (y el signo "−" en el número).
 */
export const BarrasHorizontales = ({ items, formato = moneda, vacio = "Sin datos para mostrar." }) => {
    if (!items.length) return <p className="estado-vacio">{vacio}</p>;

    const pos = Math.max(0, ...items.map((i) => i.valor));
    const neg = Math.max(0, ...items.map((i) => -i.valor));
    const total = pos + neg || 1;
    const cero = (neg / total) * 100;

    return (
        <ul className="barras-h">
            {items.map((i) => {
                const ancho = (Math.abs(i.valor) / total) * 100;
                return (
                    <li key={i.nombre}>
                        <span className="barras-h-nombre">{i.nombre}</span>
                        <span className="barras-h-pista" role="img" aria-label={`${i.nombre}: ${formato(i.valor)}`}>
                            <span className="barras-h-cero" style={{ left: `${cero}%` }} />
                            <span
                                className={`barras-h-barra ${i.valor < 0 ? "barra-perdida" : "barra-ganancia"}`}
                                style={i.valor < 0 ? { right: `${100 - cero}%`, width: `${ancho}%` } : { left: `${cero}%`, width: `${ancho}%` }}
                            />
                        </span>
                        <span className="barras-h-valor">{formato(i.valor)}</span>
                    </li>
                );
            })}
        </ul>
    );
};
