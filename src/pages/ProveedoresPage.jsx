import { useCallback, useMemo, useState } from "react";
import { proveedoresApi } from "../api/agroApi";
import { useAuth } from "../context/AuthContext.jsx";
import ModuloCrud from "../components/ModuloCrud.jsx";
import { ChipEstado, HistorialModal } from "../components/Piezas.jsx";
import { IconoHistorial } from "../components/Iconos.jsx";
import { aOpciones, useLista } from "../utils/useLista.js";
import { activos, cargarUsuarios } from "../utils/catalogos.js";

const RUBROS = ["Semillas", "Fertilizantes", "Agroquímicos", "Combustible", "Maquinaria", "Transporte", "Servicios", "Otros"];

export const ProveedoresPage = () => {
    const { esAdmin, puedeGestionar } = useAuth();
    const [historial, setHistorial] = useState(null);
    const usuarios = useLista(cargarUsuarios, esAdmin);
    const productores = useMemo(
        () => aOpciones(activos(usuarios).filter((u) => u.rol === "PRODUCTOR"), "idUSUARIO", (u) => `${u.nombre} ${u.apellido}`),
        [usuarios]
    );
    const cargarHistorial = useCallback(() => proveedoresApi.historial(historial.idPROVEEDOR), [historial]);

    const columnas = [
        { titulo: "Proveedor", clave: "nombre" },
        { titulo: "Rubro", clave: "rubro" },
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
        { name: "rubro", label: "Rubro", type: "select", opciones: RUBROS.map((r) => ({ valor: r, etiqueta: r })), vacio: "Sin rubro" },
        { name: "cuit", label: "CUIT", inputMode: "numeric" },
        { name: "telefono", label: "Teléfono", type: "tel" },
        { name: "email", label: "Email", type: "email" },
    ];

    return (
        <>
            <ModuloCrud
                titulo="Proveedores"
                singular="Proveedor"
                descripcion="A quiénes les comprás. Mirá todo lo que gastaste con cada uno."
                columnas={columnas}
                campos={campos}
                idClaves={["idPROVEEDOR"]}
                api={proveedoresApi}
                nombreDe={(p) => p.nombre}
                permisos={{ crear: puedeGestionar, editar: puedeGestionar, baja: puedeGestionar }}
                accionesExtra={(p) =>
                    puedeGestionar && (
                        <button type="button" className="btn-icono btn-icono-historial" title="Historial de gastos" aria-label={`Historial de ${p.nombre}`} onClick={() => setHistorial(p)}>
                            <IconoHistorial />
                        </button>
                    )
                }
            />
            {historial && <HistorialModal cargar={cargarHistorial} onCerrar={() => setHistorial(null)} />}
        </>
    );
};

export default ProveedoresPage;
