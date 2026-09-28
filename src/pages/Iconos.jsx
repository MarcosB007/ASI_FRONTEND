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

export const IconoHoja = (p) => (
    <Icono {...p}>
        <path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15" />
        <path d="M5 19c3-5 6-8 10-10" />
    </Icono>
);

export const IconoClientes = (p) => (
    <Icono {...p}>
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        <path d="M16 5.5a3 3 0 0 1 0 5.5" />
        <path d="M18 14.4c1.8.8 3 2.6 3 5.6" />
    </Icono>
);

export const IconoProveedores = (p) => (
    <Icono {...p}>
        <path d="M2 6h11v10H2z" />
        <path d="M13 9h4l4 3.5V16h-8z" />
        <circle cx="6.5" cy="17.5" r="1.8" />
        <circle cx="17" cy="17.5" r="1.8" />
    </Icono>
);

export const IconoEmpleados = (p) => (
    <Icono {...p}>
        <circle cx="12" cy="8" r="3.4" />
        <path d="M4.5 20c0-4 3.4-7 7.5-7s7.5 3 7.5 7" />
        <path d="M8.5 5.5C9 3.8 10.4 3 12 3s3 .8 3.5 2.5" />
    </Icono>
);

export const IconoPanel = (p) => (
    <Icono {...p}>
        <rect x="3" y="3" width="7.5" height="9" rx="1.5" />
        <rect x="13.5" y="3" width="7.5" height="5" rx="1.5" />
        <rect x="13.5" y="11" width="7.5" height="10" rx="1.5" />
        <rect x="3" y="15" width="7.5" height="6" rx="1.5" />
    </Icono>
);

export const IconoBuscar = (p) => (
    <Icono {...p}>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m20 20-4.2-4.2" />
    </Icono>
);

export const IconoMas = (p) => (
    <Icono {...p}>
        <path d="M12 5v14M5 12h14" />
    </Icono>
);

export const IconoEditar = (p) => (
    <Icono {...p}>
        <path d="M4 20h4L19 9a2.1 2.1 0 0 0-4-4L4 16z" />
        <path d="m13.5 6.5 4 4" />
    </Icono>
);

export const IconoBaja = (p) => (
    <Icono {...p}>
        <path d="M4 7h16" />
        <path d="M9 7V4h6v3" />
        <path d="M6.5 7 7.5 20h9l1-13" />
    </Icono>
);

export const IconoSalir = (p) => (
    <Icono {...p}>
        <path d="M10 4H5v16h5" />
        <path d="M14 8l4 4-4 4M18 12H9" />
    </Icono>
);

export const IconoMenu = (p) => (
    <Icono {...p}>
        <path d="M4 7h16M4 12h16M4 17h16" />
    </Icono>
);

export const IconoHistorial = (p) => (
    <Icono {...p}>
        <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" />
        <path d="M9.5 8h5M9.5 12h5" />
    </Icono>
);

export const IconoCerrar = (p) => (
    <Icono {...p}>
        <path d="M6 6l12 12M18 6 6 18" />
    </Icono>
);
