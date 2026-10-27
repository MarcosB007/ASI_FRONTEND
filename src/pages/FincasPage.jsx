import { useEffect, useMemo, useState } from "react";
import { fincasApi, getEncargados, getEncargadosDeFinca, setEncargadosDeFinca } from "../api/agroApi";
import { mensajesDeError } from "../api/axios";
import { useAuth } from "../context/AuthContext.jsx";
import ModuloCrud from "../components/ModuloCrud.jsx";
import Modal from "../components/Modal.jsx";
import { ChipEstado } from "../components/Piezas.jsx";
import { IconoEquipo } from "../components/Iconos.jsx";
import { numero } from "../utils/formato.js";
import { aOpciones, useLista } from "../utils/useLista.js";
import { activos, cargarUsuarios } from "../utils/catalogos.js";

// Elegir qué encargados pueden cargar datos en la finca
const EncargadosModal = ({ finca, onCerrar }) => {
    const [encargados, setEncargados] = useState(null);
    const [elegidos, setElegidos] = useState([]);
    const [error, setError] = useState("");
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        Promise.all([getEncargados(), getEncargadosDeFinca(finca.idFINCA)])
            .then(([todos, asignados]) => {
                setEncargados(todos.data);
                setElegidos(asignados.data);
            })
            .catch((e) => setError(mensajesDeError(e)[0]));
    }, [finca.idFINCA]);

    const alternar = (id) => setElegidos((e) => (e.includes(id) ? e.filter((x) => x !== id) : [...e, id]));

    const guardar = async () => {
        setGuardando(true);
        try {
            await setEncargadosDeFinca(finca.idFINCA, elegidos);
            onCerrar();
        } catch (e) {
            setError(mensajesDeError(e)[0]);
            setGuardando(false);
        }
    };

    return (
        <Modal
            titulo={`Encargados · ${finca.nombre}`}
            onCerrar={onCerrar}
            pie={
                <>
                    <button type="button" className="btn btn-secundario" onClick={onCerrar}>Cancelar</button>
                    <button type="button" className="btn btn-primario" onClick={guardar} disabled={guardando || !encargados}>
                        {guardando ? "Guardando…" : "Guardar"}
                    </button>
                </>
            }
        >
            <p className="texto-suave">Los encargados pueden cargar producción, gastos y cultivos solo en las fincas que elijas acá.</p>
            {error && <p className="mensaje mensaje-error">{error}</p>}
            {!encargados && !error && <p className="estado-vacio">Cargando…</p>}
            {encargados?.length === 0 && (
                <p className="mensaje mensaje-aviso">No hay usuarios con rol Encargado. Pedile al administrador que los cree.</p>
            )}
            <div className="lista-checks">
                {encargados?.map((u) => (
                    <label key={u.idUSUARIO} className="check">
                        <input type="checkbox" checked={elegidos.includes(u.idUSUARIO)} onChange={() => alternar(u.idUSUARIO)} />
                        <span>{u.nombre} {u.apellido} <small className="texto-suave">({u.username})</small></span>
                    </label>
                ))}
            </div>
        </Modal>
    );
};

export const FincasPage = () => {
    const { esAdmin, puedeGestionar } = useAuth();
    const [paraEncargados, setParaEncargados] = useState(null);
    const usuarios = useLista(cargarUsuarios, esAdmin);

    const productores = useMemo(
        () => aOpciones(activos(usuarios).filter((u) => u.rol === "PRODUCTOR"), "idUSUARIO", (u) => `${u.nombre} ${u.apellido}`),
        [usuarios]
    );

    const columnas = [
        { titulo: "Finca", clave: "nombre" },
        { titulo: "Ubicación", clave: "ubicacion" },
        { titulo: "Superficie (ha)", clave: "superficie_total", numero: true, formato: (v) => numero(v) },
        { titulo: "Lotes", clave: "cant_lotes", numero: true },
        ...(esAdmin ? [{ titulo: "Propietario", clave: "propietario" }] : []),
        { titulo: "Estado", clave: "estado", formato: (v) => <ChipEstado valor={v} /> },
    ];

    const campos = [
        ...(esAdmin
            ? [{ name: "USUARIO_idPROPIETARIO", label: "Propietario", type: "select", numerico: true, required: true, soloAlCrear: true, opciones: productores, vacio: "Elegí un productor", completo: true }]
            : []),
        { name: "nombre", label: "Nombre de la finca", required: true, completo: true, placeholder: "Ej: Finca San José" },
        { name: "ubicacion", label: "Ubicación", placeholder: "Localidad, departamento, provincia", completo: true },
        { name: "superficie_total", label: "Superficie total (ha)", type: "number", min: 0, step: "0.01", required: true },
        { name: "descripcion", label: "Descripción", type: "textarea", completo: true },
    ];

    return (
        <>
            <ModuloCrud
                titulo="Fincas"
                singular="Finca"
                genero="a"
                descripcion="Los campos que administrás. Cada finca se divide en lotes."
                columnas={columnas}
                campos={campos}
                idClaves={["idFINCA"]}
                api={fincasApi}
                nombreDe={(f) => f.nombre}
                permisos={{ crear: puedeGestionar, editar: puedeGestionar, baja: puedeGestionar }}
                accionesExtra={(f) =>
                    puedeGestionar && (
                        <button type="button" className="btn-icono btn-icono-historial" title="Encargados" aria-label={`Encargados de ${f.nombre}`} onClick={() => setParaEncargados(f)}>
                            <IconoEquipo />
                        </button>
                    )
                }
            />
            {paraEncargados && <EncargadosModal finca={paraEncargados} onCerrar={() => setParaEncargados(null)} />}
        </>
    );
};

export default FincasPage;
