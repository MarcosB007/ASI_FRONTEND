import { useEffect, useState } from "react";
import { getEmpleados } from "../api/asiApi";
import { conGuion } from "./formato.js";

// Clientes y proveedores tienen un empleado a cargo: se cargan los empleados
// para elegirlo de una lista y para mostrar su nombre en las tablas
export const useEmpleados = () => {
    const [empleados, setEmpleados] = useState([]);

    useEffect(() => {
        getEmpleados()
            .then((res) => setEmpleados(Array.isArray(res.data) ? res.data : []))
            .catch(() => setEmpleados([]));
    }, []);

    const opciones = empleados.map((e) => ({ valor: e.idEMPLEADO, etiqueta: `${e.apellido}, ${e.nombre}` }));

    const nombreEmpleado = (id) => {
        const e = empleados.find((emp) => emp.idEMPLEADO === id);
        return e ? `${e.nombre} ${e.apellido}` : conGuion(id);
    };

    return { opciones, nombreEmpleado };
};
