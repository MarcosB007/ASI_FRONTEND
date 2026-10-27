import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { MARCA } from "../config";
import { IconoFinca, IconoGasto, IconoRentabilidad, IconoVenta } from "../components/Iconos.jsx";

const PASOS = [
    {
        titulo: "Cargá tu campo",
        texto: "Registrá tus fincas, lotes y qué sembraste en cada uno, campaña por campaña.",
        Icono: IconoFinca,
    },
    {
        titulo: "Anotá gastos y ventas",
        texto: "Semillas, combustible, mano de obra, cosechas y ventas: todo en un mismo lugar.",
        Icono: IconoGasto,
    },
    {
        titulo: "Mirá cuánto ganás",
        texto: "AgroPulse calcula tu ganancia y rentabilidad por finca, lote y cultivo.",
        Icono: IconoRentabilidad,
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
                            Sabé cuánto <span>rinde tu campo.</span>
                        </h1>
                        <p>
                            {MARCA.nombre} te ayuda a llevar la producción, los gastos y las ventas de tus fincas, y te dice
                            en un vistazo si estás ganando o perdiendo.
                        </p>
                        <div className="hero-acciones">
                            <Link to={isAuthenticated ? "/panel" : "/register"} className="btn btn-claro btn-grande">
                                {isAuthenticated ? "Ir al panel" : "Crear mi cuenta"}
                            </Link>
                            {!isAuthenticated && (
                                <Link to="/login" className="btn btn-borde-claro btn-grande">
                                    Ya tengo cuenta
                                </Link>
                            )}
                        </div>
                    </div>
                    <Campo />
                </div>
            </section>

            <section className="contenedor seccion">
                <h2>Simple, en tres pasos</h2>
                <p className="texto-suave seccion-intro">Pensado para productores y empresas del NOA.</p>
                <div className="grilla-modulos">
                    {PASOS.map(({ titulo, texto, Icono }, i) => (
                        <div key={titulo} className="tarjeta tarjeta-modulo">
                            <span className="modulo-icono">
                                <Icono size={28} />
                            </span>
                            <h3>
                                {i + 1}. {titulo}
                            </h3>
                            <p className="texto-suave">{texto}</p>
                        </div>
                    ))}
                </div>
                <p className="home-nota">
                    <IconoVenta size={20} /> Cultivos como soja, maíz, poroto, caña de azúcar, limón y más.
                </p>
            </section>
        </>
    );
};

export default HomePage;
