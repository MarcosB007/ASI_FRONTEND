import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getClientes, getEmpleados, getProveedores } from "../api/asiApi";
import { useAuth } from "../context/AuthContext.jsx";
import { IconoClientes, IconoEmpleados, IconoProveedores } from "./Iconos.jsx";

const MODULOS = [
    { clave: "clientes", to: "/clientes", titulo: "Clientes", Icono: IconoClientes, cargar: getClientes },
    { clave: "proveedores", to: "/proveedores", titulo: "Proveedores", Icono: IconoProveedores, cargar: getProveedores },
    { clave: "empleados", to: "/empleados", titulo: "Empleados", Icono: IconoEmpleados, cargar: getEmpleados },
];

export const AdministracionPage = () => {
    const { user } = useAuth();
    const [cantidades, setCantidades] = useState({});

    // Si un módulo falla (por ejemplo, ruta no disponible) solo ese contador queda en "—"
    useEffect(() => {
        let activo = true;
        Promise.allSettled(MODULOS.map((m) => m.cargar())).then((resultados) => {
            if (!activo) return;
            setCantidades(
                Object.fromEntries(
                    MODULOS.map((m, i) => [
                        m.clave,
                        resultados[i].status === "fulfilled" && Array.isArray(resultados[i].value.data)
                            ? resultados[i].value.data.length
                            : null,
                    ])
                )
            );
        });
        return () => {
            activo = false;
        };
    }, []);

    const nombre = user?.nombre ?? user?.username;

    return (
        <section className="contenedor modulo">
            <div className="modulo-cabecera">
                <div>
                    <h1>{nombre ? `Hola, ${nombre}` : "Panel de administración"}</h1>
                    <p className="texto-suave">Un resumen de lo que tenés cargado en el sistema.</p>
                </div>
            </div>

            <div className="grilla-modulos">
                {MODULOS.map(({ clave, to, titulo, Icono }) => (
                    <Link key={clave} to={to} className="tarjeta tarjeta-modulo">
                        <span className="modulo-icono">
                            <Icono size={28} />
                        </span>
                        <span className="cifra">{cantidades[clave] ?? "—"}</span>
                        <h3>{titulo}</h3>
                        <p className="texto-suave enlace-flecha">Ver y administrar →</p>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default AdministracionPage;
