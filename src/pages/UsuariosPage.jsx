import { usuariosApi } from "../api/agroApi";
import ModuloCrud from "../components/ModuloCrud.jsx";
import { ChipEstado } from "../components/Piezas.jsx";
import { ROLES } from "../utils/formato.js";

const OPCIONES_ROL = Object.entries(ROLES).map(([valor, etiqueta]) => ({ valor, etiqueta }));

export const UsuariosPage = () => {
    const columnas = [
        { titulo: "Nombre", clave: "nombre", formato: (v, u) => `${u.nombre} ${u.apellido}` },
        { titulo: "Usuario", clave: "username" },
        { titulo: "Email", clave: "email" },
        { titulo: "Rol", clave: "rol", formato: (v) => ROLES[v] ?? v },
        { titulo: "Estado", clave: "estado", formato: (v) => <ChipEstado valor={v} /> },
    ];

    const campos = [
        { name: "nombre", label: "Nombre", required: true },
        { name: "apellido", label: "Apellido", required: true },
        { name: "email", label: "Email", type: "email", required: true, completo: true },
        { name: "username", label: "Usuario", required: true },
        { name: "rol", label: "Rol", type: "select", opciones: OPCIONES_ROL, required: true, vacio: "Elegí un rol" },
        { name: "password", label: "Contraseña", type: "password", minLength: 6, completo: true,
          ayuda: "Obligatoria al crear. Al editar, dejala vacía para no cambiarla." },
    ];

    return (
        <ModuloCrud
            titulo="Usuarios"
            singular="Usuario"
            descripcion="Quién puede entrar al sistema y con qué permisos."
            columnas={columnas}
            campos={campos}
            idClaves={["idUSUARIO"]}
            api={usuariosApi}
            nombreDe={(u) => `${u.nombre} ${u.apellido}`}
        />
    );
};

export default UsuariosPage;
