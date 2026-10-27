import { useState } from "react";
import { Link } from "react-router-dom";
import { olvidePassword, restablecerPassword } from "../api/agroApi";
import { mensajesDeError } from "../api/axios";
import { IconoHoja } from "../components/Iconos.jsx";

// Paso 1: pedir el código · Paso 2: ingresar el código y la nueva contraseña
export const RecuperarPage = () => {
    const [paso, setPaso] = useState(1);
    const [identificador, setIdentificador] = useState("");
    const [codigo, setCodigo] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [exito, setExito] = useState(false);
    const [enviando, setEnviando] = useState(false);

    const pedirCodigo = async (e) => {
        e.preventDefault();
        setEnviando(true);
        setError("");
        try {
            const res = await olvidePassword(identificador);
            // Sin servidor de correo, en desarrollo el backend devuelve el código para poder probar
            if (res.data.token_dev) setCodigo(res.data.token_dev);
            setPaso(2);
        } catch (err) {
            setError(mensajesDeError(err)[0]);
        }
        setEnviando(false);
    };

    const cambiarClave = async (e) => {
        e.preventDefault();
        setEnviando(true);
        setError("");
        try {
            await restablecerPassword(codigo.trim(), password);
            setExito(true);
        } catch (err) {
            setError(mensajesDeError(err)[0]);
        }
        setEnviando(false);
    };

    return (
        <section className="auth">
            <div className="auth-tarjeta">
                <span className="marca-icono marca-icono-grande">
                    <IconoHoja size={28} />
                </span>
                <h1>Recuperar contraseña</h1>

                {exito ? (
                    <>
                        <p className="mensaje mensaje-ok">Listo, tu contraseña fue actualizada.</p>
                        <Link to="/login" className="btn btn-primario btn-bloque btn-grande">
                            Ir a ingresar
                        </Link>
                    </>
                ) : paso === 1 ? (
                    <form onSubmit={pedirCodigo}>
                        <p className="texto-suave">Escribí tu usuario o email y te damos un código para elegir una contraseña nueva.</p>
                        <div className="campo">
                            <label htmlFor="identificador">Usuario o email</label>
                            <input id="identificador" value={identificador} onChange={(e) => setIdentificador(e.target.value)} required autoFocus />
                        </div>
                        {error && <p className="mensaje mensaje-error" role="alert">{error}</p>}
                        <button type="submit" className="btn btn-primario btn-bloque btn-grande" disabled={enviando}>
                            {enviando ? "Enviando…" : "Pedir código"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={cambiarClave}>
                        <p className="texto-suave">
                            Ingresá el código y tu nueva contraseña. El código vale 30 minutos.
                        </p>
                        <div className="campo">
                            <label htmlFor="codigo">Código</label>
                            <input id="codigo" value={codigo} onChange={(e) => setCodigo(e.target.value)} required />
                        </div>
                        <div className="campo">
                            <label htmlFor="nueva">Nueva contraseña</label>
                            <input id="nueva" type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required />
                        </div>
                        {error && <p className="mensaje mensaje-error" role="alert">{error}</p>}
                        <button type="submit" className="btn btn-primario btn-bloque btn-grande" disabled={enviando}>
                            {enviando ? "Guardando…" : "Cambiar contraseña"}
                        </button>
                    </form>
                )}
                <p className="auth-pie">
                    <Link to="/login">Volver a ingresar</Link>
                </p>
            </div>
        </section>
    );
};

export default RecuperarPage;
