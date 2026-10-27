import { useCallback, useEffect, useMemo, useState } from "react";
import { mensajesDeError } from "../api/axios";
import { conGuion } from "../utils/formato.js";
import Modal from "./Modal.jsx";
import { IconoAlta, IconoBaja, IconoBuscar, IconoEditar, IconoMas } from "./Iconos.jsx";

const obtenerId = (fila, claves) => claves.map((c) => fila[c]).find((v) => v !== undefined);

const valorInicial = (campo, fila) => {
    // porDefecto solo se usa al crear (puede ser una función, ej: la fecha de hoy)
    const porDefecto = typeof campo.porDefecto === "function" ? campo.porDefecto() : campo.porDefecto;
    const valor = fila ? (fila[campo.name] ?? "") : (porDefecto ?? "");
    return campo.type === "date" ? String(valor).slice(0, 10) : String(valor);
};

// campo.opciones puede ser una lista fija o una función de los valores del formulario
// (para desplegables que dependen de otro, como lote según la finca elegida)
const opcionesDe = (campo, valores) => {
    const lista = typeof campo.opciones === "function" ? campo.opciones(valores) : (campo.opciones ?? []);
    const actual = valores[campo.name];
    return actual && !lista.some((o) => String(o.valor) === String(actual))
        ? [...lista, { valor: actual, etiqueta: String(actual) }]
        : lista;
};

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

    // Al cambiar un campo se vacían los que dependen de él (campo.depende = ["finca", ...])
    const cambiar = (name) => (e) => {
        const nuevo = e.target.value;
        setValores((v) => {
            const siguiente = { ...v, [name]: nuevo };
            visibles.forEach((c) => {
                if (c.depende?.includes(name)) siguiente[c.name] = "";
            });
            return siguiente;
        });
    };

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
                                    {opcionesDe(campo, valores).map((o) => (
                                        <option key={o.valor} value={o.valor}>
                                            {o.etiqueta}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={campo.type ?? "text"}
                                    min={campo.min}
                                    step={campo.step}
                                    minLength={campo.minLength}
                                    pattern={campo.pattern}
                                    title={campo.title}
                                    inputMode={campo.inputMode}
                                    autoComplete={campo.type === "password" ? "new-password" : "off"}
                                    {...propsComunes}
                                />
                            )}
                            {campo.ayuda && <small className="texto-suave">{campo.ayuda}</small>}
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
 * Listado + alta + edición + baja para cualquier módulo.
 * `api` debe ser un objeto estable (definido fuera del componente) con:
 *   listar(params), crear(datos), actualizar(id, datos), baja(id) y, opcional, alta(id).
 * Si la fila trae `estado === 0` y hay `api.alta`, se muestra "Reactivar" en lugar de "Dar de baja".
 *
 * Props opcionales:
 *  - permisos: { crear, editar, baja } (todos true por defecto; el backend igual los valida)
 *  - bajaFisica: la baja borra el registro (cambia los textos de confirmación)
 *  - params: filtros que se envían a listar(); al cambiar, se vuelve a cargar
 *  - filtros: JSX con los controles de filtro (se muestra sobre la tabla)
 *  - resumen(filas): JSX con totales de lo que se ve en pantalla
 *  - accionesExtra(fila): botones propios por fila
 */
export const ModuloCrud = ({
    titulo,
    singular,
    genero = "o", // "o" → Nuevo / "a" → Nueva
    descripcion,
    columnas,
    campos,
    idClaves,
    api,
    nombreDe,
    accionesExtra,
    permisos = {},
    bajaFisica = false,
    params,
    filtros,
    resumen,
}) => {
    const { crear = true, editar = true, baja = true } = permisos;
    const [filas, setFilas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [aviso, setAviso] = useState("");
    const [busqueda, setBusqueda] = useState("");
    const [formulario, setFormulario] = useState(null); // { fila } | null
    const [aBaja, setABaja] = useState(null);
    const [errorBaja, setErrorBaja] = useState("");

    // params llega como objeto nuevo en cada render: se compara por contenido
    const clave = JSON.stringify(params ?? {});

    const cargar = useCallback(async () => {
        setCargando(true);
        setError("");
        try {
            const res = await api.listar(JSON.parse(clave));
            setFilas(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            setError(mensajesDeError(e)[0]);
        } finally {
            setCargando(false);
        }
    }, [api, clave]);

    useEffect(() => {
        cargar();
    }, [cargar]);

    useEffect(() => {
        if (!aviso) return;
        const timer = setTimeout(() => setAviso(""), 4000);
        return () => clearTimeout(timer);
    }, [aviso]);

    const hayAcciones = editar || baja || Boolean(accionesExtra);

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
        setAviso(`${singular} ${fila ? "actualizad" : "cread"}${genero} correctamente`);
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
        setAviso(bajaFisica ? `${singular} eliminad${genero}` : `${singular} dad${genero} de baja`);
        cargar();
    };

    const reactivar = async (fila) => {
        try {
            await api.alta(obtenerId(fila, idClaves));
            setAviso(`${singular} reactivad${genero}`);
            cargar();
        } catch (e) {
            setError(mensajesDeError(e)[0]);
        }
    };

    const verbo = bajaFisica ? "Eliminar" : "Dar de baja";

    return (
        <section className="contenedor modulo">
            <div className="modulo-cabecera">
                <div>
                    <h1>{titulo}</h1>
                    <p className="texto-suave">{descripcion}</p>
                </div>
                {crear && (
                    <button type="button" className="btn btn-primario" onClick={() => setFormulario({ fila: null })}>
                        <IconoMas /> {genero === "a" ? "Nueva" : "Nuevo"} {singular.toLowerCase()}
                    </button>
                )}
            </div>

            {aviso && (
                <p className="mensaje mensaje-ok" role="status">
                    {aviso}
                </p>
            )}

            <div className="tarjeta">
                {filtros && <div className="filtros">{filtros}</div>}
                <div className="barra-herramientas">
                    <label className="buscador">
                        <IconoBuscar />
                        <input
                            type="search"
                            placeholder={`Buscar en ${titulo.toLowerCase()}…`}
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

                {!cargando && !error && resumen && visibles.length > 0 && <div className="resumen-barra">{resumen(visibles)}</div>}

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
                                        <th key={c.titulo} className={c.numero ? "col-numero" : undefined}>
                                            {c.titulo}
                                        </th>
                                    ))}
                                    {hayAcciones && <th className="col-acciones">Acciones</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {visibles.map((fila, i) => {
                                    const inactiva = fila.estado === 0;
                                    return (
                                        <tr key={obtenerId(fila, idClaves) ?? i} className={inactiva ? "fila-inactiva" : undefined}>
                                            {columnas.map((c) => (
                                                <td key={c.titulo} data-etiqueta={c.titulo} className={c.numero ? "col-numero" : undefined}>
                                                    {c.formato ? c.formato(fila[c.clave], fila) : conGuion(fila[c.clave])}
                                                </td>
                                            ))}
                                            {hayAcciones && (
                                                <td className="col-acciones">
                                                    {accionesExtra?.(fila)}
                                                    {editar && (
                                                        <button
                                                            type="button"
                                                            className="btn-icono"
                                                            title="Editar"
                                                            aria-label={`Editar ${nombreDe(fila)}`}
                                                            onClick={() => setFormulario({ fila })}
                                                        >
                                                            <IconoEditar />
                                                        </button>
                                                    )}
                                                    {baja &&
                                                        (inactiva && api.alta ? (
                                                            <button
                                                                type="button"
                                                                className="btn-icono"
                                                                title="Reactivar"
                                                                aria-label={`Reactivar ${nombreDe(fila)}`}
                                                                onClick={() => reactivar(fila)}
                                                            >
                                                                <IconoAlta />
                                                            </button>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                className="btn-icono btn-icono-peligro"
                                                                title={verbo}
                                                                aria-label={`${verbo} ${nombreDe(fila)}`}
                                                                onClick={() => {
                                                                    setErrorBaja("");
                                                                    setABaja(fila);
                                                                }}
                                                            >
                                                                <IconoBaja />
                                                            </button>
                                                        ))}
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {formulario && (
                <FormularioModal
                    titulo={`${formulario.fila ? "Editar" : genero === "a" ? "Nueva" : "Nuevo"} ${singular.toLowerCase()}`}
                    campos={campos}
                    fila={formulario.fila}
                    onCerrar={() => setFormulario(null)}
                    onGuardar={guardar}
                />
            )}

            {aBaja && (
                <Modal
                    titulo={`${verbo} ${singular.toLowerCase()}`}
                    onCerrar={() => setABaja(null)}
                    pie={
                        <>
                            <button type="button" className="btn btn-secundario" onClick={() => setABaja(null)}>
                                Cancelar
                            </button>
                            <button type="button" className="btn btn-peligro" onClick={confirmarBaja}>
                                {verbo}
                            </button>
                        </>
                    }
                >
                    <p>
                        ¿Confirmás {bajaFisica ? "la eliminación" : "la baja"} de <strong>{nombreDe(aBaja)}</strong>?
                    </p>
                    <p className="texto-suave">
                        {bajaFisica
                            ? "Esta acción no se puede deshacer."
                            : "El registro queda inactivo y se conserva el historial. Podés reactivarlo cuando quieras."}
                    </p>
                    {errorBaja && <p className="mensaje mensaje-error">{errorBaja}</p>}
                </Modal>
            )}
        </section>
    );
};

export default ModuloCrud;
