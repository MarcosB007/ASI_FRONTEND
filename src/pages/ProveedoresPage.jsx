import { useState } from "react";
import { bajaProveedor, createProveedor, getProveedores, updateProveedor } from "../api/asiApi";
import { historialProveedor } from "../utils/ejemplos.js";
import { RUBROS } from "../utils/rubros.js";
import { useEmpleados } from "../utils/useEmpleados.js";
import HistorialModal from "./HistorialModal.jsx";
import BotonHistorial from "./BotonHistorial.jsx";
import ModuloCrud from "./ModuloCrud.jsx";

const api = {
    listar: getProveedores,
    crear: createProveedor,
    actualizar: updateProveedor,
    baja: bajaProveedor,
};

const ID_CLAVES = ["idPROVEEDOR", "id"];

const OPCIONES_RUBRO = RUBROS.map((r) => ({ valor: r, etiqueta: r }));

export const ProveedoresPage = () => {
    const { opciones, nombreEmpleado } = useEmpleados();
    const [proveedorHistorial, setProveedorHistorial] = useState(null);

    const columnas = [
        { titulo: "Nombre", clave: "nombre" },
        {
            titulo: "Rubro",
            clave: "rubro",
            formato: (rubro) => (rubro ? <span className="chip">{rubro}</span> : "—"),
        },
        { titulo: "Email", clave: "email" },
        { titulo: "A cargo", clave: "EMPLEADO_idEMPLEADO", formato: nombreEmpleado },
    ];

    const campos = [
        { name: "nombre", label: "Nombre", required: true },
        {
            name: "rubro",
            label: "Rubro",
            type: "select",
            vacio: "Elegí un rubro",
            required: true,
            opciones: OPCIONES_RUBRO,
        },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "direccion", label: "Dirección" },
        { name: "descripcion", label: "Descripción", type: "textarea", completo: true, placeholder: "Qué nos provee" },
        {
            name: "EMPLEADO_idEMPLEADO",
            label: "Empleado a cargo",
            type: "select",
            vacio: "Elegí un empleado",
            numerico: true,
            required: true,
            completo: true,
            opciones,
        },
    ];

    return (
        <>
            <ModuloCrud
                titulo="Proveedores"
                singular="Proveedor"
                descripcion="Quienes te abastecen de insumos y servicios, ordenados por rubro."
                columnas={columnas}
                campos={campos}
                idClaves={ID_CLAVES}
                api={api}
                nombreDe={(f) => f.nombre ?? ""}
                accionesExtra={(fila) => (
                    <BotonHistorial
                        descripcion={`Ver historial de compras a ${fila.nombre ?? ""}`}
                        onClick={() => setProveedorHistorial(fila)}
                    />
                )}
            />

            {proveedorHistorial && (
                <HistorialModal
                    nombre={proveedorHistorial.nombre ?? ""}
                    subtitulo={proveedorHistorial.rubro ?? "Proveedor"}
                    filas={historialProveedor(
                        proveedorHistorial.idPROVEEDOR ?? proveedorHistorial.id,
                        proveedorHistorial.rubro
                    )}
                    onCerrar={() => setProveedorHistorial(null)}
                />
            )}
        </>
    );
};

export default ProveedoresPage;
