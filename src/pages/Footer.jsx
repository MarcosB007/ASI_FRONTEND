import { MARCA } from "../config";

export const Footer = () => (
    <footer className="footer">
        <div className="contenedor footer-interior">
            <span>
                <strong>{MARCA.nombre}</strong> · {MARCA.descripcion}
            </span>
            <span>© {new Date().getFullYear()} Todos los derechos reservados</span>
        </div>
    </footer>
);

export default Footer;
