// Las fechas llegan como "2026-05-10": se toma solo la parte de día para evitar corrimientos de zona horaria
export const formatearFecha = (valor) => {
    if (!valor) return '—';
    const [anio, mes, dia] = String(valor).slice(0, 10).split('-');
    return `${dia}/${mes}/${anio}`;
};

export const hoy = () => {
    const d = new Date();
    const dos = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
};

export const conGuion = (valor) =>
    valor === null || valor === undefined || valor === '' ? '—' : valor;

const formatoMoneda = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
});
export const moneda = (valor) => (valor === null || valor === undefined ? '—' : formatoMoneda.format(valor));

// Importes grandes en formato corto para los gráficos: $ 25 M, $ 480 mil
export const monedaCorta = (valor) => {
    const n = Math.abs(valor);
    const signo = valor < 0 ? '-' : '';
    if (n >= 1e6) return `${signo}$ ${(n / 1e6).toLocaleString('es-AR', { maximumFractionDigits: 1 })} M`;
    if (n >= 1e3) return `${signo}$ ${(n / 1e3).toLocaleString('es-AR', { maximumFractionDigits: 0 })} mil`;
    return `${signo}$ ${n.toLocaleString('es-AR')}`;
};

export const numero = (valor, decimales = 2) =>
    valor === null || valor === undefined
        ? '—'
        : Number(valor).toLocaleString('es-AR', { maximumFractionDigits: decimales });

export const porcentaje = (valor) => (valor === null || valor === undefined ? '—' : `${numero(valor, 1)} %`);

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export const nombreMes = (aaaamm) => {
    const [anio, mes] = aaaamm.split('-');
    return `${MESES[Number(mes) - 1]} ${anio.slice(2)}`;
};

export const ROLES = { ADMIN: 'Administrador', PRODUCTOR: 'Productor', ENCARGADO: 'Encargado' };
export const UNIDADES = [
    { valor: 'TN', etiqueta: 'Toneladas (tn)' },
    { valor: 'KG', etiqueta: 'Kilos (kg)' },
    { valor: 'QQ', etiqueta: 'Quintales (qq)' },
];
