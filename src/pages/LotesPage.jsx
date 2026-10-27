import { useMemo, useState } from "react";
import { lotesApi } from "../api/agroApi";
import { useAuth } from "../context/AuthContext.jsx";
import ModuloCrud from "../components/ModuloCrud.jsx";
import { ChipEstado, Filtros, sinVacios } from "../components/Piezas.jsx";
import { numero } from "../utils/formato.js";
import { aOpciones, useLista } from "../utils/useLista.js";
import { activos, cargarFincas } from "../utils/catalogos.js";

export const LotesPage = () => {
    const { puedeGestionar } = useAuth();
    const [filtro, setFiltro] = useState({});
    const fincas = useLista(cargarFincas);
    const opcionesFinca = useMemo(() => aOpciones(activos(fincas), "idFINCA", "nombre"), [fincas]);

    const columnas = [
        { titulo: "Lote", clave: "nombre" },
        { titulo: "Finca", clave: "finca" },
        { titulo: "Superficie (ha)", clave: "superficie", numero: true, formato: (v) => numero(v) },
        { titulo: "Estado", clave: "estado", formato: (v) => <ChipEstado valor={v} /> },
    ];

    const campos = [
        { name: "FINCA_idFINCA", label: "Finca", type: "select", numerico: true, required: true, soloAlCrear: true, opciones: opcionesFinca, vacio: "Elegí una finca", completo: true },
        { name: "nombre", label: "Nombre del lote", required: true, placeholder: "Ej: Lote 3" },
        { name: "superficie", label: "Superficie (ha)", type: "number", min: 0, step: "0.01", required: true,
          ayuda: "La suma de los lotes no puede superar la superficie de la finca." },
    ];

    return (
        <ModuloCrud
            titulo="Lotes"
            singular="Lote"
            descripcion="Las parcelas de cada finca, donde sembrás tus cultivos."
            columnas={columnas}
            campos={campos}
            idClaves={["idLOTE"]}
            api={lotesApi}
            nombreDe={(l) => `${l.finca} · ${l.nombre}`}
            permisos={{ crear: puedeGestionar, editar: puedeGestionar, baja: puedeGestionar }}
            params={sinVacios(filtro)}
            filtros={
                <Filtros
                    valores={filtro}
                    onCambiar={setFiltro}
                    fechas={false}
                    selects={[{ name: "finca", label: "Finca", todos: "Todas las fincas", opciones: opcionesFinca }]}
                />
            }
        />
    );
};

export default LotesPage;
