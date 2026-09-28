import { Link } from "react-router-dom";

export const NotFoundPage = () => (
    <section className="auth">
        <div className="auth-tarjeta">
            <h1>Página no encontrada</h1>
            <p className="texto-suave">La dirección que buscás no existe.</p>
            <Link to="/" className="btn btn-primario btn-bloque">
                Volver al inicio
            </Link>
        </div>
    </section>
);

export default NotFoundPage;
