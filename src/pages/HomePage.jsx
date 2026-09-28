import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { MARCA } from "../config";
import { IconoClientes, IconoEmpleados, IconoProveedores } from "./Iconos.jsx";

const MODULOS = [
    {
        to: "/clientes",
        titulo: "Clientes",
        texto: "Quiénes te compran y qué compraron: cada cliente con su historial de operaciones.",
        Icono: IconoClientes,
    },
    {
        to: "/proveedores",
        titulo: "Proveedores",
        texto: "Tus proveedores ordenados por rubro: semillas, combustibles, maquinaria y más.",
        Icono: IconoProveedores,
    },
    {
        to: "/empleados",
        titulo: "Empleados",
        texto: "Tu equipo con su sector y su cargo, siempre a mano y actualizado.",
        Icono: IconoEmpleados,
    },
];

// Surcos de cultivo bajo un sol: decorativo
const Campo = () => (
    <svg className="hero-arte" viewBox="0 0 420 320" role="img" aria-label="Campo cultivado al amanecer">
        <defs>
            <clipPath id="marco-campo">
                <rect width="420" height="320" rx="28" />
            </clipPath>
        </defs>
        <g clipPath="url(#marco-campo)">
            <rect width="420" height="320" className="arte-cielo" />
            <circle cx="300" cy="86" r="48" className="arte-sol" />
            <path d="M0 150 Q110 108 210 140 T420 128 V320 H0Z" className="arte-loma" />
            {[0, 1, 2, 3, 4].map((i) => (
                <path
                    key={i}
                    d={`M${-40 + i * 20} ${320} Q${140 + i * 30} ${200 + i * 14} ${420} ${170 + i * 30}`}
                    className="arte-surco"
                    style={{ strokeWidth: 5 + i * 3 }}
                />
            ))}
        </g>
    </svg>
);

export const HomePage = () => {
    const { isAuthenticated } = useAuth();

    return (
        <>
            <section className="hero">
                <div className="contenedor hero-interior">
                    <div className="hero-texto">
                        <span className="etiqueta">{MARCA.descripcion}</span>
                        <h1>
                            Todo tu campo, <span>en un solo lugar.</span>
                        </h1>
                        <p>
                            {MARCA.nombre} reúne a tus clientes, proveedores y empleados en un sistema simple y hecho a medida,
                            para que dediques menos tiempo a los papeles y más tiempo al campo.
                        </p>
                        <div className="hero-acciones">
                            <Link to={isAuthenticated ? "/panel" : "/login"} className="btn btn-claro btn-grande">
                                {isAuthenticated ? "Ir al panel" : "Ingresar"}
                            </Link>
                        </div>
                    </div>
                    <Campo />
                </div>
            </section>

            <section className="contenedor seccion">
                <h2>Todo lo que necesitás</h2>
                <p className="texto-suave seccion-intro">Tres módulos pensados para el día a día de tu explotación.</p>
                <div className="grilla-modulos">
                    {MODULOS.map(({ to, titulo, texto, Icono }) => (
                        <Link key={to} to={isAuthenticated ? to : "/login"} className="tarjeta tarjeta-modulo">
                            <span className="modulo-icono">
                                <Icono size={28} />
                            </span>
                            <h3>{titulo}</h3>
                            <p className="texto-suave">{texto}</p>
                        </Link>
                    ))}
                </div>
            </section>
        </>
    );
};

export default HomePage;
