import { useCallback, useEffect, useMemo, useState } from "react";
import { mensajesDeError } from "../api/axios";
import { conGuion } from "../utils/formato.js";
import Modal from "./Modal.jsx";
import { IconoBaja, IconoBuscar, IconoEditar, IconoMas } from "./Iconos.jsx";

// Cada tabla del backend nombra distinto su clave primaria (idEMPLEADO, idPROVEEDOR...)
const obtenerId = (fila, claves) => claves.map((c) => fila[c]).find((v) => v !== undefined);

const valorInicial = (campo, fila) => {
    const valor = fila?.[campo.name] ?? "";
    return campo.type === "date" ? String(valor).slice(0, 10) : String(valor);
};

// Si el registro tiene un valor que no está en la lista (por ejemplo un rubro viejo),
// se agrega igual para que no se pierda al editar
const opcionesDe = (campo, actual) =>
    actual && !campo.opciones.some((o) => String(o.valor) === String(actual))
        ? [...campo.opciones, { valor: actual, etiqueta: actual }]
        : campo.opciones;

// Convierte lo escrito en el formulario al cuerpo que espera el backend
const armarPayload = (campos, valores) =>
    Object.fromEntries(
        campos.map((campo) => {
            const texto = String(valores[campo.name] ?? "").trim();
            if (texto === "") return [campo.name, null];
            const esNumero = campo.type === "number" || campo.numerico;
            return [campo.name, esNumero ? Number(texto) : texto];
        })
    );

const FormularioModal = ({ titulo, campos, fila, onCerrar, onGuardar }) => {
    const editando = Boolean(fila);
    const visibles = campos.filter((c) => !(editando && c.soloAlCrear));

    const [valores, setValores] = useState(() =>
        Object.fromEntries(visibles.map((c) => [c.name, valorInicial(c, fila)]))
    );
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState("");

    const cambiar = (nombre) => (e) => setValores((v) => ({ ...v, [nombre]: e.target.value }));

    const enviar = async (e) => {
        e.preventDefault();
        setEnviando(true);
        setError("");
        const mensaje = await onGuardar(armarPayload(visibles, valores));
        if (mensaje) {
            setError(mensaje);
            setEnviando(false);
        }
    };

    return (
        <Modal
            titulo={titulo}
            onCerrar={onCerrar}
            pie={
                <>
                    <button type="button" className="btn btn-secundario" onClick={onCerrar}>
                        Cancelar
                    </button>
                    <button type="submit" form="form-modulo" className="btn btn-primario" disabled={enviando}>
                        {enviando ? "Guardando…" : "Guardar"}
                    </button>
                </>
            }
        >
            <form id="form-modulo" className="formulario" onSubmit={enviar}>
                {visibles.map((campo, i) => {
                    const propsComunes = {
                        id: `campo-${campo.name}`,
                        autoFocus: i === 0,
                        value: valores[campo.name],
                        onChange: cambiar(campo.name),
                        required: campo.required,
                        placeholder: campo.placeholder,
                    };
                    return (
                        <div key={campo.name} className={`campo${campo.completo ? " campo-completo" : ""}`}>
                            <label htmlFor={propsComunes.id}>
                                {campo.label}
                                {campo.required && <span className="requerido"> *</span>}
                            </label>
                            {campo.type === "textarea" ? (
                                <textarea rows={3} {...propsComunes} />
                            ) : campo.type === "select" ? (
                                <select {...propsComunes}>
                                    <option value="">{campo.vacio ?? "Sin asignar"}</option>
                                    {opcionesDe(campo, valores[campo.name]).map((o) => (
                                        <option key={o.valor} value={o.valor}>
                                            {o.etiqueta}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={campo.type ?? "text"}
                                    min={campo.min}
                                    minLength={campo.minLength}
                                    pattern={campo.pattern}
                                    title={campo.title}
                                    inputMode={campo.inputMode}
                                    autoComplete={campo.type === "password" ? "new-password" : "off"}
                                    {...propsComunes}
                                />
                            )}
                        </div>
                    );
                })}
                {error && (
                    <p className="mensaje mensaje-error campo-completo" role="alert">
                        {error}
                    </p>
                )}
            </form>
        </Modal>
    );
};

/**
 * Listado + alta + edición + baja lógica para cualquier módulo.
 * `api` debe ser un objeto estable (definido fuera del componente) con:
 * listar(), crear(datos), actualizar(id, datos), baja(id)
 * `accionesExtra(fila)` permite sumar botones propios en cada fila (por ejemplo, el historial).
 */
export const ModuloCrud = ({
    titulo,
    singular,
    descripcion,
    columnas,
    campos,
    idClaves,
    api,
    nombreDe,
    accionesExtra,
}) => {
    const [filas, setFilas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [aviso, setAviso] = useState("");
    const [busqueda, setBusqueda] = useState("");
    const [formulario, setFormulario] = useState(null); // { fila } | null
    const [aBaja, setABaja] = useState(null);
    const [errorBaja, setErrorBaja] = useState("");

    const cargar = useCallback(async () => {
        setCargando(true);
        setError("");
        try {
            const res = await api.listar();
            setFilas(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            setError(mensajesDeError(e)[0]);
        } finally {
            setCargando(false);
        }
    }, [api]);

    useEffect(() => {
        cargar();
    }, [cargar]);

    useEffect(() => {
        if (!aviso) return;
        const timer = setTimeout(() => setAviso(""), 4000);
        return () => clearTimeout(timer);
    }, [aviso]);

    const visibles = useMemo(() => {
        const q = busqueda.trim().toLowerCase();
        if (!q) return filas;
        return filas.filter((f) => Object.values(f).join(" ").toLowerCase().includes(q));
    }, [filas, busqueda]);

    const guardar = async (payload) => {
        const fila = formulario.fila;
        const id = fila ? obtenerId(fila, idClaves) : null;
        if (fila && id === undefined) return "No se pudo identificar el registro a editar";

        try {
            await (fila ? api.actualizar(id, payload) : api.crear(payload));
        } catch (e) {
            return mensajesDeError(e)[0];
        }
        setFormulario(null);
        setAviso(fila ? `${singular} actualizado correctamente` : `${singular} creado correctamente`);
        cargar();
        return null;
    };

    const confirmarBaja = async () => {
        const id = obtenerId(aBaja, idClaves);
        if (id === undefined) {
            setErrorBaja("No se pudo identificar el registro");
            return;
        }
        try {
            await api.baja(id);
        } catch (e) {
            setErrorBaja(mensajesDeError(e)[0]);
            return;
        }
        setABaja(null);
        setAviso(`${singular} dado de baja`);
        cargar();
    };

    return (
        <section className="contenedor modulo">
            <div className="modulo-cabecera">
                <div>
                    <h1>{titulo}</h1>
                    <p className="texto-suave">{descripcion}</p>
                </div>
                <button type="button" className="btn btn-primario" onClick={() => setFormulario({ fila: null })}>
                    <IconoMas /> Nuevo {singular.toLowerCase()}
                </button>
            </div>

            {aviso && (
                <p className="mensaje mensaje-ok" role="status">
                    {aviso}
                </p>
            )}

            <div className="tarjeta">
                <div className="barra-herramientas">
                    <label className="buscador">
                        <IconoBuscar />
                        <input
                            type="search"
                            placeholder={`Buscar ${titulo.toLowerCase()}…`}
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </label>
                    {!cargando && !error && (
                        <span className="texto-suave">
                            {visibles.length} {visibles.length === 1 ? "registro" : "registros"}
                        </span>
                    )}
                </div>

                {cargando ? (
                    <p className="estado-vacio">Cargando…</p>
                ) : error ? (
                    <div className="estado-vacio">
                        <p className="mensaje mensaje-error">{error}</p>
                        <button type="button" className="btn btn-secundario" onClick={cargar}>
                            Reintentar
                        </button>
                    </div>
                ) : visibles.length === 0 ? (
                    <p className="estado-vacio">
                        {filas.length === 0
                            ? `Todavía no hay ${titulo.toLowerCase()} cargados.`
                            : "Ningún resultado coincide con la búsqueda."}
                    </p>
                ) : (
                    <div className="tabla-scroll">
                        <table className="tabla">
                            <thead>
                                <tr>
                                    {columnas.map((c) => (
                                        <th key={c.titulo}>{c.titulo}</th>
                                    ))}
                                    <th className="col-acciones">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibles.map((fila, i) => (
                                    <tr key={obtenerId(fila, idClaves) ?? i}>
                                        {columnas.map((c) => (
                                            <td key={c.titulo} data-etiqueta={c.titulo}>
                                                {c.formato ? c.formato(fila[c.clave], fila) : conGuion(fila[c.clave])}
                                            </td>
                                        ))}
                                        <td className="col-acciones">
                                            {accionesExtra?.(fila)}
                                            <button
                                                type="button"
                                                className="btn-icono"
                                                title="Editar"
                                                aria-label={`Editar ${nombreDe(fila)}`}
                                                onClick={() => setFormulario({ fila })}
                                            >
                                                <IconoEditar />
                                            </button>
                                            <button
                                                type="button"
                                                className="btn-icono btn-icono-peligro"
                                                title="Dar de baja"
                                                aria-label={`Dar de baja a ${nombreDe(fila)}`}
                                                onClick={() => {
                                                    setErrorBaja("");
                                                    setABaja(fila);
                                                }}
                                            >
                                                <IconoBaja />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {formulario && (
                <FormularioModal
                    titulo={`${formulario.fila ? "Editar" : "Nuevo"} ${singular.toLowerCase()}`}
                    campos={campos}
                    fila={formulario.fila}
                    onCerrar={() => setFormulario(null)}
                    onGuardar={guardar}
                />
            )}

            {aBaja && (
                <Modal
                    titulo={`Dar de baja ${singular.toLowerCase()}`}
                    onCerrar={() => setABaja(null)}
                    pie={
                        <>
                            <button type="button" className="btn btn-secundario" onClick={() => setABaja(null)}>
                                Cancelar
                            </button>
                            <button type="button" className="btn btn-peligro" onClick={confirmarBaja}>
                                Dar de baja
                            </button>
                        </>
                    }
                >
                    <p>
                        ¿Confirmás la baja de <strong>{nombreDe(aBaja)}</strong>?
                    </p>
                    <p className="texto-suave">
                        Es una baja lógica: el registro deja de aparecer en el listado pero no se borra de la base de datos.
                    </p>
                    {errorBaja && <p className="mensaje mensaje-error">{errorBaja}</p>}
                </Modal>
            )}
        </section>
    );
};

export default ModuloCrud;
