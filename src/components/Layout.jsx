import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { MARCA } from "../config";
import { ROLES } from "../utils/formato.js";
import {
    IconoCerrar, IconoClientes, IconoCultivo, IconoFinca, IconoGasto, IconoHoja, IconoLote, IconoMenu,
    IconoPanel, IconoProduccion, IconoProveedores, IconoRentabilidad, IconoSalir, IconoUsuarios, IconoVenta,
} from "./Iconos.jsx";

// roles: quién ve el enlace. Sin "roles" lo ven todos.
const GRUPOS = [
    {
        titulo: null,
        enlaces: [{ to: "/panel", texto: "Panel", Icono: IconoPanel }],
    },
    {
        titulo: "Mi campo",
        enlaces: [
            { to: "/fincas", texto: "Fincas", Icono: IconoFinca },
            { to: "/lotes", texto: "Lotes", Icono: IconoLote },
            { to: "/cultivos", texto: "Cultivos", Icono: IconoCultivo },
        ],
    },
    {
        titulo: "Actividad",
        enlaces: [
            { to: "/produccion", texto: "Producción", Icono: IconoProduccion },
            { to: "/gastos", texto: "Gastos", Icono: IconoGasto },
            { to: "/ventas", texto: "Ventas", Icono: IconoVenta, roles: ["ADMIN", "PRODUCTOR"] },
        ],
    },
    {
        titulo: "Resultados",
        enlaces: [{ to: "/rentabilidad", texto: "Rentabilidad", Icono: IconoRentabilidad, roles: ["ADMIN", "PRODUCTOR"] }],
    },
    {
        titulo: "Contactos",
        enlaces: [
            { to: "/clientes", texto: "Clientes", Icono: IconoClientes, roles: ["ADMIN", "PRODUCTOR"] },
            { to: "/proveedores", texto: "Proveedores", Icono: IconoProveedores },
        ],
    },
    {
        titulo: "Administración",
        enlaces: [{ to: "/usuarios", texto: "Usuarios", Icono: IconoUsuarios, roles: ["ADMIN"] }],
    },
];

export const Marca = ({ to = "/" }) => (
    <Link to={to} className="marca">
        <span className="marca-icono">
            <IconoHoja size={22} />
        </span>
        <span>
            <strong>{MARCA.nombre}</strong>
            <small>{MARCA.descripcion}</small>
        </span>
    </Link>
);

// Estructura de la parte privada: menú lateral + contenido
export const AppShell = () => {
    const { user, rol, logout } = useAuth();
    const [abierto, setAbierto] = useState(false);
    const { pathname } = useLocation();
    const [rutaPrevia, setRutaPrevia] = useState(pathname);

    // Al navegar se cierra el menú en celulares
    if (rutaPrevia !== pathname) {
        setRutaPrevia(pathname);
        setAbierto(false);
    }

    const nombre = [user?.nombre, user?.apellido].filter(Boolean).join(" ") || user?.username || "Usuario";

    return (
        <div className="shell">
            <header className="shell-barra">
                <button type="button" className="btn-icono" onClick={() => setAbierto(true)} aria-label="Abrir menú">
                    <IconoMenu />
                </button>
                <Marca to="/panel" />
            </header>

            {abierto && <div className="shell-fondo" onClick={() => setAbierto(false)} />}

            <aside className={`shell-menu${abierto ? " abierto" : ""}`}>
                <div className="shell-menu-cabecera">
                    <Marca to="/panel" />
                    <button type="button" className="btn-icono shell-cerrar" onClick={() => setAbierto(false)} aria-label="Cerrar menú">
                        <IconoCerrar />
                    </button>
                </div>

                <nav className="shell-nav">
                    {GRUPOS.map((g) => {
                        const enlaces = g.enlaces.filter((e) => !e.roles || e.roles.includes(rol));
                        if (!enlaces.length) return null;
                        return (
                            <div key={g.titulo ?? "inicio"} className="shell-grupo">
                                {g.titulo && <span className="shell-grupo-titulo">{g.titulo}</span>}
                                {enlaces.map(({ to, texto, Icono }) => (
                                    <NavLink key={to} to={to} className={({ isActive }) => `enlace-nav${isActive ? " activo" : ""}`}>
                                        <Icono size={20} /> {texto}
                                    </NavLink>
                                ))}
                            </div>
                        );
                    })}
                </nav>

                <div className="shell-usuario">
                    <span className="shell-usuario-datos">
                        <strong>{nombre}</strong>
                        <small>{ROLES[rol] ?? rol}</small>
                    </span>
                    <button type="button" className="btn btn-secundario btn-chico" onClick={logout}>
                        <IconoSalir size={16} /> Salir
                    </button>
                </div>
            </aside>

            <main className="shell-contenido">
                <Outlet />
            </main>
        </div>
    );
};

// Estructura de las páginas públicas (portada, ingreso, registro)
export const LayoutPublico = () => {
    const { isAuthenticated } = useAuth();
    return (
        <div className="app">
            <header className="header">
                <div className="header-interior contenedor">
                    <Marca />
                    <nav className="header-nav">
                        {isAuthenticated ? (
                            <Link to="/panel" className="btn btn-primario btn-chico">Ir al panel</Link>
                        ) : (
                            <>
                                <Link to="/register" className="enlace-nav">Crear cuenta</Link>
                                <Link to="/login" className="btn btn-primario btn-chico">Ingresar</Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>
            <main className="app-contenido">
                <Outlet />
            </main>
            <footer className="footer">
                <div className="contenedor footer-interior">
                    <span>
                        <strong>{MARCA.nombre}</strong> · {MARCA.descripcion}
                    </span>
                    <span>© {new Date().getFullYear()} Todos los derechos reservados</span>
                </div>
            </footer>
        </div>
    );
};
