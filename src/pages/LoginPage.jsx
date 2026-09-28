import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { IconoHoja } from "./Iconos.jsx";

export const LoginPage = () => {
    const { signIn, errors } = useAuth();
    const [datos, setDatos] = useState({ username: "", password: "" });
    const [enviando, setEnviando] = useState(false);

    const cambiar = (e) => setDatos((d) => ({ ...d, [e.target.name]: e.target.value }));

    const enviar = async (e) => {
        e.preventDefault();
        setEnviando(true);
        await signIn(datos); // si sale bien, RutaPublica redirige
        setEnviando(false);
    };

    return (
        <section className="auth">
            <form className="auth-tarjeta" onSubmit={enviar}>
                <span className="marca-icono marca-icono-grande">
                    <IconoHoja size={28} />
                </span>
                <h1>Ingresar</h1>
                <p className="texto-suave">Accedé al panel de gestión de tu campo.</p>

                <div className="campo">
                    <label htmlFor="username">Usuario</label>
                    <input id="username" name="username" value={datos.username} onChange={cambiar} autoComplete="username" required autoFocus />
                </div>
                <div className="campo">
                    <label htmlFor="password">Contraseña</label>
                    <input id="password" name="password" type="password" value={datos.password} onChange={cambiar} autoComplete="current-password" required />
                </div>

                {errors.map((m) => (
                    <p key={m} className="mensaje mensaje-error" role="alert">
                        {m}
                    </p>
                ))}

                <button type="submit" className="btn btn-primario btn-bloque btn-grande" disabled={enviando}>
                    {enviando ? "Ingresando…" : "Ingresar"}
                </button>
                <p className="auth-pie">
                    ¿Todavía no tenés cuenta? <Link to="/register">Registrate</Link>
                </p>
            </form>
        </section>
    );
};

export default LoginPage;
