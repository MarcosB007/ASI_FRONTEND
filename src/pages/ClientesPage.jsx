import { useCallback, useMemo, useState } from "react";
import { clientesApi } from "../api/agroApi";
import { useAuth } from "../context/AuthContext.jsx";
import ModuloCrud from "../components/ModuloCrud.jsx";
import { ChipEstado, HistorialModal } from "../components/Piezas.jsx";
import { IconoHistorial } from "../components/Iconos.jsx";
import { aOpciones, useLista } from "../utils/useLista.js";
import { activos, cargarUsuarios } from "../utils/catalogos.js";

export const ClientesPage = () => {
    const { esAdmin } = useAuth();
    const [historial, setHistorial] = useState(null);
    const usuarios = useLista(cargarUsuarios, esAdmin);
    const productores = useMemo(
        () => aOpciones(activos(usuarios).filter((u) => u.rol === "PRODUCTOR"), "idUSUARIO", (u) => `${u.nombre} ${u.apellido}`),
        [usuarios]
    );
    const cargarHistorial = useCallback(() => clientesApi.historial(historial.idCLIENTE), [historial]);

    const columnas = [
        { titulo: "Cliente", clave: "nombre" },
        { titulo: "CUIT", clave: "cuit" },
        { titulo: "Teléfono", clave: "telefono" },
        { titulo: "Email", clave: "email" },
        ...(esAdmin ? [{ titulo: "Productor", clave: "propietario" }] : []),
        { titulo: "Estado", clave: "estado", formato: (v) => <ChipEstado valor={v} /> },
    ];

    const campos = [
        ...(esAdmin
            ? [{ name: "USUARIO_idPROPIETARIO", label: "Productor", type: "select", numerico: true, required: true, soloAlCrear: true, opciones: productores, vacio: "Elegí un productor", completo: true }]
            : []),
        { name: "nombre", label: "Nombre o razón social", required: true, completo: true },
        { name: "cuit", label: "CUIT", inputMode: "numeric" },
        { name: "telefono", label: "Teléfono", type: "tel" },
        { name: "email", label: "Email", type: "email", completo: true },
    ];

    return (
        <>
            <ModuloCrud
                titulo="Clientes"
                singular="Cliente"
                descripcion="Quiénes te compran. Mirá el historial de ventas de cada uno."
                columnas={columnas}
                campos={campos}
                idClaves={["idCLIENTE"]}
                api={clientesApi}
                nombreDe={(c) => c.nombre}
                accionesExtra={(c) => (
                    <button type="button" className="btn-icono btn-icono-historial" title="Historial de ventas" aria-label={`Historial de ${c.nombre}`} onClick={() => setHistorial(c)}>
                        <IconoHistorial />
                    </button>
                )}
            />
            {historial && <HistorialModal cargar={cargarHistorial} onCerrar={() => setHistorial(null)} />}
        </>
    );
};

export default ClientesPage;
