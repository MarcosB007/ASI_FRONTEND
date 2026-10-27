// Iconos SVG simples, heredan el color del texto (currentColor)
const Icono = ({ children, size = 20 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        {children}
    </svg>
);

const hacer = (contenido) => (p) => <Icono {...p}>{contenido}</Icono>;

export const IconoHoja = hacer(
    <>
        <path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15" />
        <path d="M5 19c3-5 6-8 10-10" />
    </>
);
export const IconoPanel = hacer(
    <>
        <rect x="3" y="3" width="7.5" height="9" rx="1.5" />
        <rect x="13.5" y="3" width="7.5" height="5" rx="1.5" />
        <rect x="13.5" y="11" width="7.5" height="10" rx="1.5" />
        <rect x="3" y="15" width="7.5" height="6" rx="1.5" />
    </>
);
export const IconoFinca = hacer(
    <>
        <path d="M3 11 12 4l9 7" />
        <path d="M5 10v10h14V10" />
        <path d="M10 20v-6h4v6" />
    </>
);
export const IconoLote = hacer(
    <>
        <path d="M3 6h18v12H3z" />
        <path d="M3 10h18M3 14h18M9 6v12M15 6v12" />
    </>
);
export const IconoCultivo = hacer(
    <>
        <path d="M12 21V9" />
        <path d="M12 13c-4 0-6-2.5-6-6 4 0 6 2.5 6 6Z" />
        <path d="M12 11c0-3 2-5 6-5 0 3-2 5-6 5Z" />
    </>
);
export const IconoProduccion = hacer(
    <>
        <path d="M3 17h13V8H3z" />
        <path d="M16 11h3l2 3v3h-5" />
        <circle cx="7" cy="18" r="1.6" />
        <circle cx="17.5" cy="18" r="1.6" />
    </>
);
export const IconoGasto = hacer(
    <>
        <path d="M4 7h13a3 3 0 0 1 3 3v8H4z" />
        <path d="M4 7l2-3h9" />
        <circle cx="15.5" cy="13.5" r="1.5" />
    </>
);
export const IconoVenta = hacer(
    <>
        <path d="M12 3v18" />
        <path d="M16.5 7.5C15.5 6.3 14 6 12 6c-2.5 0-4 1.2-4 3s1.5 2.5 4 3 4 1.2 4 3-1.5 3-4 3c-2 0-3.6-.5-4.7-1.8" />
    </>
);
export const IconoRentabilidad = hacer(
    <>
        <path d="M4 20h16" />
        <path d="M6 16v-4M11 16V8M16 16v-6" />
        <path d="m5 7 5-3 4 2 5-3" />
    </>
);
export const IconoClientes = hacer(
    <>
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        <path d="M16 5.5a3 3 0 0 1 0 5.5" />
        <path d="M18 14.4c1.8.8 3 2.6 3 5.6" />
    </>
);
export const IconoProveedores = hacer(
    <>
        <path d="M2 6h11v10H2z" />
        <path d="M13 9h4l4 3.5V16h-8z" />
        <circle cx="6.5" cy="17.5" r="1.8" />
        <circle cx="17" cy="17.5" r="1.8" />
    </>
);
export const IconoUsuarios = hacer(
    <>
        <circle cx="12" cy="8" r="3.4" />
        <path d="M4.5 20c0-4 3.4-7 7.5-7s7.5 3 7.5 7" />
        <path d="M8.5 5.5C9 3.8 10.4 3 12 3s3 .8 3.5 2.5" />
    </>
);
export const IconoBuscar = hacer(
    <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m20 20-4.2-4.2" />
    </>
);
export const IconoMas = hacer(<path d="M12 5v14M5 12h14" />);
export const IconoEditar = hacer(
    <>
        <path d="M4 20h4L19 9a2.1 2.1 0 0 0-4-4L4 16z" />
        <path d="m13.5 6.5 4 4" />
    </>
);
export const IconoBaja = hacer(
    <>
        <path d="M4 7h16" />
        <path d="M9 7V4h6v3" />
        <path d="M6.5 7 7.5 20h9l1-13" />
    </>
);
export const IconoAlta = hacer(
    <>
        <path d="M4 12a8 8 0 1 0 3-6.2" />
        <path d="M4 4v4h4" />
    </>
);
export const IconoSalir = hacer(
    <>
        <path d="M10 4H5v16h5" />
        <path d="M14 8l4 4-4 4M18 12H9" />
    </>
);
export const IconoMenu = hacer(<path d="M4 7h16M4 12h16M4 17h16" />);
export const IconoCerrar = hacer(<path d="M6 6l12 12M18 6 6 18" />);
export const IconoHistorial = hacer(
    <>
        <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" />
        <path d="M9.5 8h5M9.5 12h5" />
    </>
);
export const IconoEquipo = hacer(
    <>
        <circle cx="8" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.4" />
        <path d="M2.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
        <path d="M15 14.2c3 0 6 1.3 6 4.8" />
    </>
);
