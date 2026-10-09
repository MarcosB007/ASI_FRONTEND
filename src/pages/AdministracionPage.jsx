import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getClientes, getEmpleados, getProveedores } from "../api/asiApi";
import { useAuth } from "../context/AuthContext.jsx";
import { IconoClientes, IconoEmpleados, IconoProveedores } from "./Iconos.jsx";

// soloAdmin: el módulo solo lo ve el rol ADMIN.
// tituloUser / enlaceUser: cómo se muestra para el rol USER, que únicamente consulta lo que tiene a cargo.
const MODULOS = [
    {
        clave: "clientes",
        to: "/clientes",
        titulo: "Clientes",
        tituloUser: "Mis clientes",
        Icono: IconoClientes,
        cargar: getClientes,
    },
    {
        clave: "proveedores",
        to: "/proveedores",
        titulo: "Proveedores",
        tituloUser: "Mis proveedores",
        Icono: IconoProveedores,
        cargar: getProveedores,
    },
    {
        clave: "empleados",
        to: "/empleados",
        titulo: "Empleados",
        Icono: IconoEmpleados,
        cargar: getEmpleados,
        soloAdmin: true,
    },
];

// El ADMIN recibe también los registros inactivos (estado 0): no se cuentan en el resumen
const contarActivos = (lista) => lista.filter((f) => Number(f.estado ?? 1) !== 0).length;

export const AdministracionPage = () => {
    const { user, esAdmin } = useAuth();
    const [cantidades, setCantidades] = useState({});

    // Cada rol ve solo sus módulos: el USER no ve ni consulta Empleados
    const modulos = useMemo(() => MODULOS.filter((m) => esAdmin || !m.soloAdmin), [esAdmin]);

    // Si un módulo falla (por ejemplo, ruta no disponible) solo ese contador queda en "—"
    useEffect(() => {
        let activo = true;
        Promise.allSettled(modulos.map((m) => m.cargar())).then((resultados) => {
            if (!activo) return;
            setCantidades(
                Object.fromEntries(
                    modulos.map((m, i) => [
                        m.clave,
                        resultados[i].status === "fulfilled" && Array.isArray(resultados[i].value.data)
                            ? contarActivos(resultados[i].value.data)
                            : null,
                    ])
                )
            );
        });
        return () => {
            activo = false;
        };
    }, [modulos]);

    const nombre = user?.nombre ?? user?.username;

    return (
        <section className="contenedor modulo">
            <div className="modulo-cabecera">
                <div>
                    <h1>{nombre ? `Hola, ${nombre}` : esAdmin ? "Panel de administración" : "Mi panel"}</h1>
                    <p className="texto-suave">
                        {esAdmin
                            ? "Un resumen de lo que tenés cargado en el sistema."
                            : "Un resumen de los clientes y proveedores que tenés a cargo."}
                    </p>
                </div>
                <span className={`chip ${esAdmin ? "chip-ok" : ""}`}>{esAdmin ? "Administrador" : "Usuario"}</span>
            </div>

            <div className="grilla-modulos">
                {modulos.map(({ clave, to, titulo, tituloUser, Icono }) => (
                    <Link key={clave} to={to} className="tarjeta tarjeta-modulo">
                        <span className="modulo-icono">
                            <Icono size={28} />
                        </span>
                        <span className="cifra">{cantidades[clave] ?? "—"}</span>
                        <h3>{esAdmin ? titulo : tituloUser}</h3>
                        <p className="texto-suave enlace-flecha">{esAdmin ? "Ver y administrar →" : "Ver →"}</p>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default AdministracionPage;
