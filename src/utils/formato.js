// Las fechas llegan como "1990-05-10T03:00:00.000Z": se toma solo la parte de día
// para evitar que la zona horaria del navegador la corra un día
export const formatearFecha = (valor) => {
    if (!valor) return '—';
    const [anio, mes, dia] = String(valor).slice(0, 10).split('-');
    return `${dia}/${mes}/${anio}`;
};

export const conGuion = (valor) =>
    valor === null || valor === undefined || valor === '' ? '—' : valor;

const formatoMoneda = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
});

export const moneda = (valor) => formatoMoneda.format(valor);
