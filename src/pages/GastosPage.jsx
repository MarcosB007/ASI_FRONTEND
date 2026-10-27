import { useMemo, useState } from "react";
import { getCategoriasGasto, gastosApi } from "../api/agroApi";
import { useAuth } from "../context/AuthContext.jsx";
import ModuloCrud from "../components/ModuloCrud.jsx";
import { Filtros, sinVacios } from "../components/Piezas.jsx";
import { formatearFecha, hoy, moneda } from "../utils/formato.js";
import { aOpciones, useLista } from "../utils/useLista.js";
import { activos, cargarCiclos, cargarFincas, cargarLotes, cargarProveedores } from "../utils/catalogos.js";

export const GastosPage = () => {
    const { puedeGestionar } = useAuth();
    const [filtro, setFiltro] = useState({});
    const fincas = useLista(cargarFincas);
    const lotes = useLista(cargarLotes);
    const ciclos = useLista(cargarCiclos);
    const proveedores = useLista(cargarProveedores);
    const categorias = useLista(getCategoriasGasto);

    const opcionesFinca = useMemo(() => aOpciones(activos(fincas), "idFINCA", "nombre"), [fincas]);
    const opcionesCategoria = useMemo(() => aOpciones(categorias, "idCATEGORIA", "nombre"), [categorias]);
    const opcionesProveedor = useMemo(() => aOpciones(activos(proveedores), "idPROVEEDOR", "nombre"), [proveedores]);

    const columnas = [
        { titulo: "Fecha", clave: "fecha", formato: formatearFecha },
        { titulo: "Concepto", clave: "concepto" },
        { titulo: "Categoría", clave: "categoria" },
        { titulo: "Finca", clave: "finca" },
        { titulo: "Lote / cultivo", clave: "lote", formato: (v, f) => (v ? (f.cultivo ? `${v} · ${f.cultivo}` : v) : "General") },
        { titulo: "Proveedor", clave: "proveedor" },
        { titulo: "Importe", clave: "importe", numero: true, formato: (v) => moneda(v) },
    ];

    // Lote y cultivo dependen de la finca elegida; el cultivo, además, del lote
    const campos = [
        { name: "fecha", label: "Fecha", type: "date", required: true, porDefecto: hoy },
        { name: "importe", label: "Importe ($)", type: "number", min: 0, step: "0.01", required: true },
        { name: "concepto", label: "Concepto", required: true, completo: true, placeholder: "Ej: Compra de semillas de soja" },
        { name: "CATEGORIA_idCATEGORIA", label: "Categoría", type: "select", numerico: true, required: true, opciones: opcionesCategoria, vacio: "Elegí una categoría" },
        { name: "FINCA_idFINCA", label: "Finca", type: "select", numerico: true, required: true, opciones: opcionesFinca, vacio: "Elegí una finca" },
        { name: "LOTE_idLOTE", label: "Lote (opcional)", type: "select", numerico: true, depende: ["FINCA_idFINCA"], vacio: "Todos / general",
          opciones: (v) => aOpciones(activos(lotes).filter((l) => String(l.FINCA_idFINCA) === String(v.FINCA_idFINCA)), "idLOTE", "nombre") },
        { name: "CICLO_idCICLO", label: "Cultivo (opcional)", type: "select", numerico: true, depende: ["FINCA_idFINCA", "LOTE_idLOTE"], vacio: "Sin cultivo específico",
          ayuda: "Si lo elegís, el gasto cuenta para el costo de ese cultivo.",
          opciones: (v) =>
              aOpciones(
                  ciclos.filter((c) => c.estado !== "CANCELADO" && String(c.FINCA_idFINCA) === String(v.FINCA_idFINCA) && (!v.LOTE_idLOTE || String(c.LOTE_idLOTE) === String(v.LOTE_idLOTE))),
                  "idCICLO",
                  (c) => `${c.cultivo} · ${c.lote} · ${c.campania}`
              ) },
        { name: "PROVEEDOR_idPROVEEDOR", label: "Proveedor (opcional)", type: "select", numerico: true, opciones: opcionesProveedor, vacio: "Sin proveedor" },
        { name: "observaciones", label: "Observaciones", type: "textarea", completo: true },
    ];

    return (
        <ModuloCrud
            titulo="Gastos"
            singular="Gasto"
            descripcion="Todo lo que gastás en tus fincas, por categoría, lote o cultivo."
            columnas={columnas}
            campos={campos}
            idClaves={["idGASTO"]}
            api={gastosApi}
            nombreDe={(g) => g.concepto}
            permisos={{ baja: puedeGestionar }}
            bajaFisica
            params={sinVacios(filtro)}
            filtros={
                <Filtros
                    valores={filtro}
                    onCambiar={setFiltro}
                    selects={[
                        { name: "finca", label: "Finca", todos: "Todas", opciones: opcionesFinca },
                        { name: "categoria", label: "Categoría", todos: "Todas", opciones: opcionesCategoria },
                    ]}
                />
            }
            resumen={(filas) => (
                <span>
                    Total gastado: <strong>{moneda(filas.reduce((s, g) => s + g.importe, 0))}</strong>
                </span>
            )}
        />
    );
};

export default GastosPage;
