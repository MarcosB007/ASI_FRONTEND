import { useState } from "react";
import { bajaCliente, createCliente, getClientes, updateCliente } from "../api/asiApi";
import { historialCliente } from "../utils/ejemplos.js";
import { useEmpleados } from "../utils/useEmpleados.js";
import HistorialModal from "./HistorialModal.jsx";
import BotonHistorial from "./BotonHistorial.jsx";
import ModuloCrud from "./ModuloCrud.jsx";

const api = {
    listar: getClientes,
    crear: createCliente,
    actualizar: updateCliente,
    baja: bajaCliente,
};

const ID_CLAVES = ["idCLIENTE", "id"];

export const ClientesPage = () => {
    const { opciones, nombreEmpleado } = useEmpleados();
    const [clienteHistorial, setClienteHistorial] = useState(null);

    const columnas = [
        { titulo: "Nombre", clave: "nombre" },
        { titulo: "Apellido", clave: "apellido" },
        { titulo: "Email", clave: "email" },
        { titulo: "A cargo", clave: "EMPLEADO_idEMPLEADO", formato: nombreEmpleado },
    ];

    // El backend solo permite elegir el empleado a cargo al crear (al editar no lo modifica)
    const campos = [
        { name: "nombre", label: "Nombre", required: true },
        { name: "apellido", label: "Apellido", required: true },
        { name: "email", label: "Email", type: "email", completo: true },
        {
            name: "EMPLEADO_idEMPLEADO",
            label: "Empleado a cargo",
            type: "select",
            vacio: "Elegí un empleado",
            numerico: true,
            required: true,
            soloAlCrear: true,
            completo: true,
            opciones,
        },
    ];

    return (
        <>
            <ModuloCrud
                titulo="Clientes"
                singular="Cliente"
                descripcion="Quienes te compran la producción, con el historial de lo que compraron."
                columnas={columnas}
                campos={campos}
                idClaves={ID_CLAVES}
                api={api}
                nombreDe={(f) => `${f.nombre ?? ""} ${f.apellido ?? ""}`.trim()}
                accionesExtra={(fila) => (
                    <BotonHistorial
                        descripcion={`Ver historial de compras de ${fila.nombre ?? ""} ${fila.apellido ?? ""}`}
                        onClick={() => setClienteHistorial(fila)}
                    />
                )}
            />

            {clienteHistorial && (
                <HistorialModal
                    nombre={`${clienteHistorial.nombre ?? ""} ${clienteHistorial.apellido ?? ""}`.trim()}
                    subtitulo="Cliente"
                    filas={historialCliente(clienteHistorial.idCLIENTE ?? clienteHistorial.id)}
                    onCerrar={() => setClienteHistorial(null)}
                />
            )}
        </>
    );
};

export default ClientesPage;
