import { useCallback, useMemo, useState } from "react";
import { ciclosApi, createCultivo, getCultivos } from "../api/agroApi";
import { mensajesDeError } from "../api/axios";
import { useAuth } from "../context/AuthContext.jsx";
import ModuloCrud from "../components/ModuloCrud.jsx";
import Modal from "../components/Modal.jsx";
import { ChipCiclo, Filtros, OPCIONES_CICLO, sinVacios } from "../components/Piezas.jsx";
import { IconoMas } from "../components/Iconos.jsx";
import { formatearFecha, numero } from "../utils/formato.js";
import { aOpciones, useLista } from "../utils/useLista.js";
import { activos, campaniaActual, cargarFincas, cargarLotes, etiquetaLote } from "../utils/catalogos.js";

// Cada "cultivo" de esta pantalla es un ciclo: un cultivo sembrado en un lote durante una campaña.
// Filtrando por lote se ve el historial de cultivos de ese lote.
const NuevoTipoModal = ({ onCerrar, onCreado }) => {
    const [nombre, setNombre] = useState("");
    const [error, setError] = useState("");

    const guardar = async (e) => {
        e.preventDefault();
        try {
            await createCultivo(nombre);
            onCreado();
        } catch (err) {
            setError(mensajesDeError(err)[0]);
        }
    };

    return (
        <Modal
            titulo="Nuevo tipo de cultivo"
            onCerrar={onCerrar}
            pie={
                <>
                    <button type="button" className="btn btn-secundario" onClick={onCerrar}>Cancelar</button>
                    <button type="submit" form="form-tipo" className="btn btn-primario">Guardar</button>
                </>
            }
        >
            <form id="form-tipo" onSubmit={guardar}>
                <div className="campo">
                    <label htmlFor="tipo">Nombre del cultivo</label>
                    <input id="tipo" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Garbanzo" required autoFocus />
                </div>
                {error && <p className="mensaje mensaje-error">{error}</p>}
            </form>
        </Modal>
    );
};

export const CultivosPage = () => {
    const { puedeGestionar } = useAuth();
    const [filtro, setFiltro] = useState({});
    const [nuevoTipo, setNuevoTipo] = useState(false);
    const [version, setVersion] = useState(0);

    const fincas = useLista(cargarFincas);
    const lotes = useLista(cargarLotes);
    const cargarTipos = useCallback(() => getCultivos(), [version]); // eslint-disable-line react-hooks/exhaustive-deps
    const tipos = useLista(cargarTipos);

    const opcionesFinca = useMemo(() => aOpciones(activos(fincas), "idFINCA", "nombre"), [fincas]);
    const lotesActivos = useMemo(() => activos(lotes), [lotes]);
    const opcionesLoteFiltro = useMemo(
        () => aOpciones(lotes.filter((l) => !filtro.finca || String(l.FINCA_idFINCA) === filtro.finca), "idLOTE", etiquetaLote),
        [lotes, filtro.finca]
    );
    const opcionesTipo = useMemo(() => aOpciones(tipos, "idCULTIVO", "nombre"), [tipos]);

    const columnas = [
        { titulo: "Cultivo", clave: "cultivo" },
        { titulo: "Finca / lote", clave: "lote", formato: (v, f) => `${f.finca} · ${v}` },
        { titulo: "Campaña", clave: "campania" },
        { titulo: "Superficie (ha)", clave: "superficie_cultivada", numero: true, formato: (v) => numero(v) },
        { titulo: "Siembra", clave: "fecha_siembra", formato: formatearFecha },
        { titulo: "Cosecha estimada", clave: "fecha_estimada_cosecha", formato: formatearFecha },
        { titulo: "Estado", clave: "estado", formato: (v) => <ChipCiclo valor={v} /> },
    ];

    const campos = [
        { name: "LOTE_idLOTE", label: "Lote", type: "select", numerico: true, required: true, completo: true,
          opciones: aOpciones(lotesActivos, "idLOTE", etiquetaLote), vacio: "Elegí un lote" },
        { name: "CULTIVO_idCULTIVO", label: "Cultivo", type: "select", numerico: true, required: true, opciones: opcionesTipo, vacio: "Elegí un cultivo" },
        { name: "campania", label: "Campaña", required: true, porDefecto: campaniaActual, placeholder: "2026/27" },
        { name: "superficie_cultivada", label: "Superficie cultivada (ha)", type: "number", min: 0, step: "0.01", required: true },
        { name: "estado", label: "Estado", type: "select", opciones: OPCIONES_CICLO, vacio: "Planificado" },
        { name: "fecha_siembra", label: "Fecha de siembra", type: "date" },
        { name: "fecha_estimada_cosecha", label: "Cosecha estimada", type: "date" },
        { name: "fecha_cosecha", label: "Fecha de cosecha", type: "date" },
    ];

    return (
        <>
            <ModuloCrud
                titulo="Cultivos"
                singular="Cultivo"
                descripcion="Qué sembraste en cada lote y cómo va. Filtrá por lote para ver su historial."
                columnas={columnas}
                campos={campos}
                idClaves={["idCICLO"]}
                api={ciclosApi}
                nombreDe={(c) => `${c.cultivo} · ${c.lote} (${c.campania})`}
                permisos={{ baja: puedeGestionar }}
                params={sinVacios(filtro)}
                filtros={
                    <>
                        <Filtros
                            valores={filtro}
                            onCambiar={(v) => setFiltro(v.finca !== filtro.finca ? { ...v, lote: "" } : v)}
                            fechas={false}
                            selects={[
                                { name: "finca", label: "Finca", todos: "Todas", opciones: opcionesFinca },
                                { name: "lote", label: "Lote", todos: "Todos", opciones: opcionesLoteFiltro },
                                { name: "estado", label: "Estado", todos: "Todos", opciones: OPCIONES_CICLO },
                            ]}
                        />
                        {puedeGestionar && (
                            <button type="button" className="btn btn-secundario btn-chico" onClick={() => setNuevoTipo(true)}>
                                <IconoMas size={16} /> Tipo de cultivo
                            </button>
                        )}
                    </>
                }
            />
            {nuevoTipo && (
                <NuevoTipoModal
                    onCerrar={() => setNuevoTipo(false)}
                    onCreado={() => {
                        setNuevoTipo(false);
                        setVersion((v) => v + 1);
                    }}
                />
            )}
        </>
    );
};

export default CultivosPage;
