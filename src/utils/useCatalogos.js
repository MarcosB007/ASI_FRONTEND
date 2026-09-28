import { useEffect, useState } from "react";
import { getCargos, getSectores } from "../api/asiApi";
import { conGuion } from "./formato.js";

const listaDe = (res) => (Array.isArray(res.data) ? res.data : []);

// Sectores y cargos de la empresa: sirven para armar los desplegables del formulario
// de empleados y para mostrar sus nombres en las tablas (en vez de un número)
export const useCatalogos = () => {
    const [sectores, setSectores] = useState([]);
    const [cargos, setCargos] = useState([]);

    useEffect(() => {
        getSectores().then((res) => setSectores(listaDe(res))).catch(() => setSectores([]));
        getCargos().then((res) => setCargos(listaDe(res))).catch(() => setCargos([]));
    }, []);

    const opcionesSector = sectores.map((s) => ({ valor: s.idSECTOR, etiqueta: s.nombre }));
    const opcionesCargo = cargos.map((c) => ({ valor: c.idCARGO, etiqueta: c.nombre }));

    const nombreSector = (id) => sectores.find((s) => s.idSECTOR === id)?.nombre ?? conGuion(id);
    const nombreCargo = (id) => cargos.find((c) => c.idCARGO === id)?.nombre ?? conGuion(id);

    return { opcionesSector, opcionesCargo, nombreSector, nombreCargo };
};
