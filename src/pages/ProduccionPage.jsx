import { useMemo, useState } from "react";
import { getCultivos, produccionApi } from "../api/agroApi";
import { useAuth } from "../context/AuthContext.jsx";
import ModuloCrud from "../components/ModuloCrud.jsx";
import { Filtros, sinVacios } from "../components/Piezas.jsx";
import { UNIDADES, formatearFecha, hoy, numero } from "../utils/formato.js";
import { aOpciones, useLista } from "../utils/useLista.js";
import { cargarCiclos, cargarFincas, etiquetaCiclo, activos } from "../utils/catalogos.js";

const A_TN = { TN: 1, KG: 0.001, QQ: 0.1 };

export const ProduccionPage = () => {
    const { puedeGestionar } = useAuth();
    const [filtro, setFiltro] = useState({});
    const fincas = useLista(cargarFincas);
    const ciclos = useLista(cargarCiclos);
    const cultivos = useLista(getCultivos);

    const opcionesCiclo = useMemo(
        () => aOpciones(ciclos.filter((c) => c.estado !== "CANCELADO"), "idCICLO", etiquetaCiclo),
        [ciclos]
    );

    const columnas = [
        { titulo: "Fecha", clave: "fecha_cosecha", formato: formatearFecha },
        { titulo: "Cultivo", clave: "cultivo" },
        { titulo: "Finca / lote", clave: "lote", formato: (v, f) => `${f.finca} · ${v}` },
        { titulo: "Campaña", clave: "campania" },
        { titulo: "Cantidad", clave: "cantidad", numero: true, formato: (v, f) => `${numero(v)} ${f.unidad.toLowerCase()}` },
        { titulo: "Rendimiento", clave: "rendimiento_ha", numero: true, formato: (v, f) => `${numero(v)} ${f.unidad.toLowerCase()}/ha` },
        { titulo: "Observaciones", clave: "observaciones" },
    ];

    const campos = [
        { name: "CICLO_idCICLO", label: "Cultivo cosechado", type: "select", numerico: true, required: true, completo: true,
          opciones: opcionesCiclo, vacio: "Elegí el cultivo (lote y campaña)" },
        { name: "cantidad", label: "Cantidad producida", type: "number", min: 0, step: "0.01", required: true },
        { name: "unidad", label: "Unidad", type: "select", opciones: UNIDADES, vacio: "Toneladas (tn)" },
        { name: "fecha_cosecha", label: "Fecha de cosecha", type: "date", required: true, porDefecto: hoy },
        { name: "observaciones", label: "Observaciones", type: "textarea", completo: true },
    ];

    return (
        <ModuloCrud
            titulo="Producción"
            singular="Producción"
            genero="a"
            descripcion="Lo que cosechaste. El rendimiento por hectárea se calcula solo."
            columnas={columnas}
            campos={campos}
            idClaves={["idPRODUCCION"]}
            api={produccionApi}
            nombreDe={(p) => `${p.cultivo} del ${formatearFecha(p.fecha_cosecha)}`}
            permisos={{ baja: puedeGestionar }}
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
            resumen={(filas) => {
                const tn = filas.reduce((s, f) => s + f.cantidad * A_TN[f.unidad], 0);
                return (
                    <span>
                        Producción total: <strong>{numero(tn)} tn</strong>
                    </span>
                );
            }}
        />
    );
};

export default ProduccionPage;
