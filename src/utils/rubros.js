// Rubros de proveedores, con ejemplos de lo que se les compra (los usa el historial de ejemplo)
// cantidad: [mínimo, máximo] por operación · precio: por unidad, en pesos
export const ITEMS_POR_RUBRO = {
    "Semillas": [
        { producto: "Semilla de soja (bolsa 40 kg)", unidad: "bolsas", precio: 96000, cantidad: [40, 200] },
        { producto: "Semilla de maíz (bolsa 60.000 semillas)", unidad: "bolsas", precio: 184000, cantidad: [20, 120] },
        { producto: "Semilla de trigo (bolsa 40 kg)", unidad: "bolsas", precio: 58000, cantidad: [50, 250] },
    ],
    "Fertilizantes y agroquímicos": [
        { producto: "Urea granulada", unidad: "tn", precio: 720000, cantidad: [2, 12] },
        { producto: "Herbicida glifosato (bidón 20 L)", unidad: "bidones", precio: 68000, cantidad: [10, 60] },
        { producto: "Fosfato diamónico", unidad: "tn", precio: 980000, cantidad: [2, 10] },
    ],
    "Maquinaria y repuestos": [
        { producto: "Kit de filtros y correas", unidad: "kits", precio: 145000, cantidad: [1, 4] },
        { producto: "Cubiertas para tractor", unidad: "unidades", precio: 850000, cantidad: [1, 4] },
        { producto: "Service de cosechadora", unidad: "servicios", precio: 1200000, cantidad: [1, 2] },
    ],
    "Combustibles": [
        { producto: "Gasoil a granel", unidad: "litros", precio: 1150, cantidad: [1500, 6000] },
        { producto: "Lubricante para motor", unidad: "bidones", precio: 92000, cantidad: [2, 10] },
    ],
    "Veterinaria y sanidad animal": [
        { producto: "Vacuna antiaftosa", unidad: "dosis", precio: 2800, cantidad: [100, 600] },
        { producto: "Antiparasitario (frasco 500 ml)", unidad: "frascos", precio: 32000, cantidad: [4, 20] },
        { producto: "Sales minerales (bolsa 25 kg)", unidad: "bolsas", precio: 24000, cantidad: [10, 60] },
    ],
    "Transporte y fletes": [
        { producto: "Flete de granos al puerto", unidad: "viajes", precio: 430000, cantidad: [2, 12] },
        { producto: "Flete de insumos", unidad: "viajes", precio: 180000, cantidad: [1, 5] },
    ],
    "Alimento balanceado": [
        { producto: "Alimento balanceado para bovinos", unidad: "bolsas", precio: 21000, cantidad: [30, 200] },
        { producto: "Alimento para aves", unidad: "bolsas", precio: 18500, cantidad: [30, 150] },
    ],
    "Servicios profesionales": [
        { producto: "Asesoramiento agronómico", unidad: "visitas", precio: 150000, cantidad: [1, 4] },
        { producto: "Análisis de suelo", unidad: "muestras", precio: 45000, cantidad: [2, 10] },
    ],
};

export const ITEMS_GENERICOS = [
    { producto: "Insumos varios", unidad: "compras", precio: 120000, cantidad: [1, 5] },
    { producto: "Servicio contratado", unidad: "servicios", precio: 200000, cantidad: [1, 3] },
];

export const RUBROS = [...Object.keys(ITEMS_POR_RUBRO), "Otros"];
