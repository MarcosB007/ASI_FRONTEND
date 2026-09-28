import { useEffect } from "react";
import { IconoCerrar } from "./Iconos.jsx";

// Ventana modal genérica: se cierra con Escape o clic en el fondo
export const Modal = ({ titulo, onCerrar, children, pie, ancho = false }) => {
    useEffect(() => {
        const alTeclear = (e) => e.key === "Escape" && onCerrar();
        document.addEventListener("keydown", alTeclear);
        return () => document.removeEventListener("keydown", alTeclear);
    }, [onCerrar]);

    return (
        <div className="modal-fondo" onMouseDown={(e) => e.target === e.currentTarget && onCerrar()}>
            <div className={`modal${ancho ? " modal-ancho" : ""}`} role="dialog" aria-modal="true" aria-label={titulo}>
                <header className="modal-cabecera">
                    <h2>{titulo}</h2>
                    <button type="button" className="btn-icono" onClick={onCerrar} aria-label="Cerrar">
                        <IconoCerrar />
                    </button>
                </header>
                <div className="modal-cuerpo">{children}</div>
                {pie && <footer className="modal-pie">{pie}</footer>}
            </div>
        </div>
    );
};

export default Modal;
