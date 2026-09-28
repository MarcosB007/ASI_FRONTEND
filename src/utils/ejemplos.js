import { ITEMS_GENERICOS, ITEMS_POR_RUBRO } from "./rubros.js";

// HISTORIALES DE EJEMPLO
// El backend todavía no guarda compras ni ventas. Estos historiales se generan a partir
// del id del cliente/proveedor (siempre dan lo mismo para el mismo id) para mostrar
// cómo va a verse la pantalla. Cuando exista el endpoint real, se reemplazan por él.

const VENTAS_A_CLIENTES = [
    { producto: "Soja", unidad: "tn", precio: 335000, cantidad: [12, 60] },
    { producto: "Maíz", unidad: "tn", precio: 192000, cantidad: [15, 70] },
    { producto: "Trigo", unidad: "tn", precio: 224000, cantidad: [10, 50] },
    { producto: "Girasol", unidad: "tn", precio: 385000, cantidad: [8, 35] },
    { producto: "Cebada", unidad: "tn", precio: 201000, cantidad: [10, 40] },
];

// Generador pseudoaleatorio simple: mismo id, mismos resultados
const aleatorio = (semilla) => {
    let s = ((semilla + 1) * 48271) % 2147483647;
    return () => {
        s = (s * 48271) % 2147483647;
        return s / 2147483647;
    };
};

const fechaHaceDias = (dias) => {
    const d = new Date();
    d.setDate(d.getDate() - dias);
    return d.toISOString().slice(0, 10);
};

const generarHistorial = (id, catalogo, prefijo) => {
    const azar = aleatorio(Number(id) || 1);
    const operaciones = 4 + Math.floor(azar() * 3);
    let dias = 4 + Math.floor(azar() * 12);
    const inicio = Math.floor(azar() * catalogo.length);

    return Array.from({ length: operaciones }, (_, i) => {
        // Los productos van rotando para que el ejemplo no repita siempre lo mismo
        const item = catalogo[(inicio + i) % catalogo.length];
        const [min, max] = item.cantidad;
        const cantidad = min + Math.floor(azar() * (max - min + 1));
        const fila = {
            fecha: fechaHaceDias(dias),
            comprobante: `${prefijo}-0001-${String(1000 + Math.floor(azar() * 8999))}`,
            detalle: item.producto,
            cantidad: `${cantidad.toLocaleString("es-AR")} ${item.unidad}`,
            total: Math.round((cantidad * item.precio) / 1000) * 1000,
            estado: i === 0 && azar() > 0.5 ? "Pendiente" : "Pagado",
        };
        dias += 18 + Math.floor(azar() * 25);
        return fila;
    });
};

export const historialCliente = (id) => generarHistorial(id, VENTAS_A_CLIENTES, "V");

export const historialProveedor = (id, rubro) =>
    generarHistorial(id, ITEMS_POR_RUBRO[rubro] ?? ITEMS_GENERICOS, "C");
