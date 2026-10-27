import { useMemo, useState } from "react";
import { getCultivos, ventasApi } from "../api/agroApi";
import ModuloCrud from "../components/ModuloCrud.jsx";
import { Filtros, sinVacios } from "../components/Piezas.jsx";
import { UNIDADES, formatearFecha, hoy, moneda, numero } from "../utils/formato.js";
import { aOpciones, useLista } from "../utils/useLista.js";
import { activos, cargarCiclos, cargarClientes, cargarFincas, etiquetaCiclo } from "../utils/catalogos.js";

export const VentasPage = () => {
    const [filtro, setFiltro] = useState({});
    const fincas = useLista(cargarFincas);
    const ciclos = useLista(cargarCiclos);
    const clientes = useLista(cargarClientes);
    const cultivos = useLista(getCultivos);

    const opcionesCiclo = useMemo(
        () => aOpciones(ciclos.filter((c) => c.estado !== "CANCELADO"), "idCICLO", etiquetaCiclo),
        [ciclos]
    );

    const columnas = [
        { titulo: "Fecha", clave: "fecha", formato: formatearFecha },
        { titulo: "Cultivo", clave: "cultivo" },
        { titulo: "Finca / lote", clave: "lote", formato: (v, f) => `${f.finca} · ${v}` },
        { titulo: "Comprador", clave: "cliente" },
        { titulo: "Cantidad", clave: "cantidad", numero: true, formato: (v, f) => `${numero(v)} ${f.unidad.toLowerCase()}` },
        { titulo: "Precio unitario", clave: "precio_unitario", numero: true, formato: (v) => moneda(v) },
        { titulo: "Total", clave: "total", numero: true, formato: (v) => <strong>{moneda(v)}</strong> },
    ];

    const campos = [
        { name: "CICLO_idCICLO", label: "Cultivo vendido", type: "select", numerico: true, required: true, completo: true,
          opciones: opcionesCiclo, vacio: "Elegí el cultivo (lote y campaña)" },
        { name: "cantidad", label: "Cantidad", type: "number", min: 0, step: "0.01", required: true },
        { name: "unidad", label: "Unidad", type: "select", opciones: UNIDADES, vacio: "Toneladas (tn)" },
        { name: "precio_unitario", label: "Precio por unidad ($)", type: "number", min: 0, step: "0.01", required: true,
          ayuda: "El total se calcula solo: cantidad × precio." },
        { name: "fecha", label: "Fecha", type: "date", required: true, porDefecto: hoy },
        { name: "CLIENTE_idCLIENTE", label: "Comprador (opcional)", type: "select", numerico: true, completo: true,
          opciones: aOpciones(activos(clientes), "idCLIENTE", "nombre"), vacio: "Sin comprador" },
        { name: "observaciones", label: "Observaciones", type: "textarea", completo: true },
    ];

    return (
        <ModuloCrud
            titulo="Ventas"
            singular="Venta"
            genero="a"
            descripcion="Lo que vendiste y a quién. El importe total se calcula automáticamente."
            columnas={columnas}
            campos={campos}
            idClaves={["idVENTA"]}
            api={ventasApi}
            nombreDe={(v) => `${v.cultivo} del ${formatearFecha(v.fecha)}`}
            bajaFisica
            params={sinVacios(filtro)}
            filtros={
                <Filtros
                    valores={filtro}
                    onCambiar={setFiltro}
                    selects={[
                        { name: "finca", label: "Finca", todos: "Todas", opciones: aOpciones(activos(fincas), "idFINCA", "nombre") },
                        { name: "cultivo", label: "Cultivo", todos: "Todos", opciones: aOpciones(cultivos, "idCULTIVO", "nombre") },
                    ]}
                />
            }
            resumen={(filas) => (
                <span>
                    Ingresos por ventas: <strong>{moneda(filas.reduce((s, v) => s + v.total, 0))}</strong>
                </span>
            )}
        />
    );
};

export default VentasPage;
