import { useEffect, useState } from 'react';

// Carga una lista del backend (para desplegables y filtros). Si falla, queda vacía.
export const useLista = (cargar, activo = true) => {
    const [datos, setDatos] = useState([]);

    useEffect(() => {
        if (!activo) return;
        let vivo = true;
        cargar()
            .then((res) => vivo && setDatos(Array.isArray(res.data) ? res.data : []))
            .catch(() => vivo && setDatos([]));
        return () => {
            vivo = false;
        };
    }, [cargar, activo]);

    return datos;
};

// { valor, etiqueta } para los <select>
export const aOpciones = (lista, claveId, etiqueta) =>
    lista.map((f) => ({ valor: f[claveId], etiqueta: typeof etiqueta === 'function' ? etiqueta(f) : f[etiqueta] }));
