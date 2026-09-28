import { bajaEmpleado, createEmpleado, getEmpleados, updateEmpleado } from "../api/asiApi";
import { useCatalogos } from "../utils/useCatalogos.js";
import ModuloCrud from "./ModuloCrud.jsx";

const api = {
    listar: getEmpleados,
    crear: createEmpleado,
    actualizar: updateEmpleado,
    baja: bajaEmpleado,
};

export const EmpleadosPage = () => {
    const { opcionesSector, opcionesCargo, nombreSector, nombreCargo } = useCatalogos();

    const columnas = [
        { titulo: "Apellido", clave: "apellido" },
        { titulo: "Nombre", clave: "nombre" },
        { titulo: "DNI", clave: "dni" },
        { titulo: "Email", clave: "email" },
        {
            titulo: "Sector",
            clave: "SECTOR_idSECTOR",
            formato: (id) => <span className="chip">{nombreSector(id)}</span>,
        },
        { titulo: "Cargo", clave: "CARGO_idCARGO", formato: nombreCargo },
    ];

    // username y password solo se piden al crear: el backend no los modifica al editar
    const campos = [
        { name: "nombre", label: "Nombre", required: true },
        { name: "apellido", label: "Apellido", required: true },
        {
            name: "dni",
            label: "DNI",
            required: true,
            inputMode: "numeric",
            pattern: "[0-9]{7,9}",
            title: "Solo números, entre 7 y 9 dígitos",
        },
        { name: "fecha_nac", label: "Fecha de nacimiento", type: "date", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "domicilio", label: "Domicilio" },
        {
            name: "SECTOR_idSECTOR",
            label: "Sector",
            type: "select",
            vacio: "Elegí un sector",
            numerico: true,
            required: true,
            opciones: opcionesSector,
        },
        {
            name: "CARGO_idCARGO",
            label: "Cargo",
            type: "select",
            vacio: "Elegí un cargo",
            numerico: true,
            required: true,
            opciones: opcionesCargo,
        },
        { name: "username", label: "Usuario", required: true, soloAlCrear: true },
        { name: "password", label: "Contraseña", type: "password", required: true, soloAlCrear: true, minLength: 6 },
    ];

    return (
        <ModuloCrud
            titulo="Empleados"
            singular="Empleado"
            descripcion="El equipo que trabaja en el campo, con su sector y su cargo."
            columnas={columnas}
            campos={campos}
            idClaves={["idEMPLEADO", "id"]}
            api={api}
            nombreDe={(f) => `${f.nombre ?? ""} ${f.apellido ?? ""}`.trim()}
        />
    );
};

export default EmpleadosPage;
