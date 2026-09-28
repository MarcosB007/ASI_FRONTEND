import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { MARCA } from "../config";
import {
    IconoClientes,
    IconoEmpleados,
    IconoHoja,
    IconoMenu,
    IconoCerrar,
    IconoPanel,
    IconoProveedores,
    IconoSalir,
} from "./Iconos.jsx";

const ENLACES = [
    { to: "/panel", texto: "Panel", Icono: IconoPanel },
    { to: "/clientes", texto: "Clientes", Icono: IconoClientes },
    { to: "/proveedores", texto: "Proveedores", Icono: IconoProveedores },
    { to: "/empleados", texto: "Empleados", Icono: IconoEmpleados },
];

export const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const [abierto, setAbierto] = useState(false);

    const cerrarMenu = () => setAbierto(false);

    const salir = () => {
        cerrarMenu();
        logout();
    };

    const nombre = user?.nombre ?? user?.username ?? "Usuario";

    return (
        <header className="header">
            <div className="header-interior contenedor">
                <Link to="/" className="marca" onClick={cerrarMenu}>
                    <span className="marca-icono">
                        <IconoHoja size={22} />
                    </span>
                    <span>
                        <strong>{MARCA.nombre}</strong>
                        <small>{MARCA.descripcion}</small>
                    </span>
                </Link>

                <button
                    type="button"
                    className="btn-icono header-menu"
                    onClick={() => setAbierto((a) => !a)}
                    aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
                    aria-expanded={abierto}
                >
                    {abierto ? <IconoCerrar /> : <IconoMenu />}
                </button>

                <nav className={`header-nav${abierto ? " abierto" : ""}`}>
                    {isAuthenticated ? (
                        <>
                            {ENLACES.map(({ to, texto, Icono }) => (
                                <NavLink
                                    key={to}
                                    to={to}
                                    onClick={cerrarMenu}
                                    className={({ isActive }) => `enlace-nav${isActive ? " activo" : ""}`}
                                >
                                    <Icono size={18} /> {texto}
                                </NavLink>
                            ))}
                            <span className="header-usuario">
                                <span className="header-usuario-nombre">{nombre}</span>
                                <button type="button" className="btn btn-secundario btn-chico" onClick={salir}>
                                    <IconoSalir size={16} /> Salir
                                </button>
                            </span>
                        </>
                    ) : (
                        <>
                            <NavLink to="/" end onClick={cerrarMenu} className={({ isActive }) => `enlace-nav${isActive ? " activo" : ""}`}>
                                Inicio
                            </NavLink>
                            <Link to="/login" className="btn btn-primario btn-chico" onClick={cerrarMenu}>
                                Ingresar
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
