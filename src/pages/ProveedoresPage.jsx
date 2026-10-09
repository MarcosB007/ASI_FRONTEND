import { useState } from "react";
import { bajaProveedor, createProveedor, getProveedores, updateProveedor } from "../api/asiApi";
import { historialProveedor } from "../utils/ejemplos.js";
import { useEmpleados } from "../utils/useEmpleados.js";
import { OPCIONES_ESTADO } from "../utils/estado.js";
import { useAuth } from "../context/AuthContext.jsx";
import EstadoChip from "./EstadoChip.jsx";
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

export const ProveedoresPage = () => {
    const { esAdmin } = useAuth();
    const { opciones, nombreEmpleado } = useEmpleados();
    const [proveedorHistorial, setProveedorHistorial] = useState(null);

    const columnas = [
        { titulo: "Nombre", clave: "nombre" },
        { titulo: "Email", clave: "email" },
        { titulo: "Dirección", clave: "direccion" },
        { titulo: "A cargo", clave: "EMPLEADO_idEMPLEADO", formato: nombreEmpleado },
        // El USER solo ve proveedores activos, así que la columna Estado es solo para el ADMIN
        ...(esAdmin ? [{ titulo: "Estado", clave: "estado", formato: (estado) => <EstadoChip estado={estado} /> }] : []),
    ];

    const campos = [
        { name: "nombre", label: "Nombre", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "direccion", label: "Dirección", completo: true },
        {
            name: "EMPLEADO_idEMPLEADO",
            label: "Empleado a cargo",
            type: "select",
            vacio: "Elegí un empleado",
            numerico: true,
            required: true,
            opciones,
        },
        {
            name: "estado",
            label: "Estado",
            type: "select",
            vacio: "Elegí un estado",
            numerico: true,
            required: true,
            porDefecto: 1,
            opciones: OPCIONES_ESTADO,
        },
    ];

    return (
        <>
            <ModuloCrud
                titulo="Proveedores"
                singular="Proveedor"
                descripcion={
                    esAdmin
                        ? "Quienes te abastecen de insumos y servicios."
                        : "Los proveedores que tenés a cargo, con el historial de compras."
                }
                columnas={columnas}
                campos={campos}
                idClaves={ID_CLAVES}
                api={api}
                soloLectura={!esAdmin}
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
