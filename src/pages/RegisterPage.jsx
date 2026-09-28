import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCatalogos } from "../utils/useCatalogos.js";
import { IconoHoja } from "./Iconos.jsx";

const VACIO = {
    nombre: "",
    apellido: "",
    dni: "",
    fecha_nac: "",
    email: "",
    domicilio: "",
    SECTOR_idSECTOR: "",
    CARGO_idCARGO: "",
    username: "",
    password: "",
};

export const RegisterPage = () => {
    const { signUp, errors } = useAuth();
    const { opcionesSector, opcionesCargo } = useCatalogos();
    const [datos, setDatos] = useState(VACIO);
    const [enviando, setEnviando] = useState(false);

    const cambiar = (e) => setDatos((d) => ({ ...d, [e.target.name]: e.target.value }));

    const enviar = async (e) => {
        e.preventDefault();
        setEnviando(true);
        await signUp({
            ...datos,
            SECTOR_idSECTOR: Number(datos.SECTOR_idSECTOR),
            CARGO_idCARGO: Number(datos.CARGO_idCARGO),
            domicilio: datos.domicilio || null,
        });
        setEnviando(false); // si sale bien, RutaPublica redirige al panel
    };

    const campo = (name, label, props = {}) => (
        <div className={`campo${props.completo ? " campo-completo" : ""}`}>
            <label htmlFor={name}>{label}</label>
            <input id={name} name={name} value={datos[name]} onChange={cambiar} required={name !== "domicilio"} {...props} />
        </div>
    );

    const selector = (name, label, vacio, opciones) => (
        <div className="campo">
            <label htmlFor={name}>{label}</label>
            <select id={name} name={name} value={datos[name]} onChange={cambiar} required>
                <option value="">{vacio}</option>
                {opciones.map((o) => (
                    <option key={o.valor} value={o.valor}>
                        {o.etiqueta}
                    </option>
                ))}
            </select>
        </div>
    );

    return (
        <section className="auth">
            <form className="auth-tarjeta auth-tarjeta-ancha" onSubmit={enviar}>
                <span className="marca-icono marca-icono-grande">
                    <IconoHoja size={30} />
                </span>
                <h1>Crear cuenta</h1>
                <p className="texto-suave">Registrate como empleado para acceder al sistema.</p>

                <div className="formulario">
                    {campo("nombre", "Nombre")}
                    {campo("apellido", "Apellido")}
                    {campo("dni", "DNI", { inputMode: "numeric", pattern: "[0-9]{7,9}", title: "Solo números, entre 7 y 9 dígitos" })}
                    {campo("fecha_nac", "Fecha de nacimiento", { type: "date" })}
                    {campo("email", "Email", { type: "email", completo: true })}
                    {campo("domicilio", "Domicilio", { completo: true })}
                    {selector("SECTOR_idSECTOR", "Sector", "Elegí un sector", opcionesSector)}
                    {selector("CARGO_idCARGO", "Cargo", "Elegí un cargo", opcionesCargo)}
                    {campo("username", "Usuario", { autoComplete: "username" })}
                    {campo("password", "Contraseña", { type: "password", minLength: 6, autoComplete: "new-password" })}
                </div>

                {errors.map((m) => (
                    <p key={m} className="mensaje mensaje-error" role="alert">
                        {m}
                    </p>
                ))}

                <button type="submit" className="btn btn-primario btn-bloque btn-grande" disabled={enviando}>
                    {enviando ? "Creando cuenta…" : "Crear cuenta"}
                </button>
                <p className="auth-pie">
                    ¿Ya tenés cuenta? <Link to="/login">Ingresá</Link>
                </p>
            </form>
        </section>
    );
};

export default RegisterPage;
