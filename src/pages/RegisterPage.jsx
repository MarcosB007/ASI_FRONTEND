import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { IconoHoja } from "../components/Iconos.jsx";

const VACIO = { nombre: "", apellido: "", email: "", username: "", password: "" };

export const RegisterPage = () => {
    const { signUp, errors } = useAuth();
    const [datos, setDatos] = useState(VACIO);
    const [enviando, setEnviando] = useState(false);

    const cambiar = (e) => setDatos((d) => ({ ...d, [e.target.name]: e.target.value }));

    const enviar = async (e) => {
        e.preventDefault();
        setEnviando(true);
        await signUp(datos);
        setEnviando(false); // si sale bien, RutaPublica redirige al panel
    };

    const campo = (name, label, props = {}) => (
        <div className={`campo${props.completo ? " campo-completo" : ""}`}>
            <label htmlFor={name}>{label}</label>
            <input id={name} name={name} value={datos[name]} onChange={cambiar} required {...props} />
        </div>
    );

    return (
        <section className="auth">
            <form className="auth-tarjeta auth-tarjeta-ancha" onSubmit={enviar}>
                <span className="marca-icono marca-icono-grande">
                    <IconoHoja size={30} />
                </span>
                <h1>Crear cuenta</h1>
                <p className="texto-suave">Registrate como productor y empezá a cargar tus fincas.</p>

                <div className="formulario">
                    {campo("nombre", "Nombre")}
                    {campo("apellido", "Apellido")}
                    {campo("email", "Email", { type: "email", completo: true })}
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
