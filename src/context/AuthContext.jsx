import { createContext, useContext, useEffect, useState } from "react"
import {
    loginRequest,
    registerRequest,
    guardarSesion,
    borrarSesion,
    leerToken,
    leerUsuario,
    decodificarToken,
    tokenVigente,
} from "../api/auth";
import { mensajesDeError } from "../api/axios";

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth debería estar dentro de AuthProvider");
    return context;
};

//AL CARGAR LA APP SE RECUPERA LA SESION GUARDADA (SI EL TOKEN SIGUE VIGENTE)
const restaurarSesion = () => {
    const token = leerToken();

    if (tokenVigente(token)) {
        const { id, rol } = decodificarToken(token);
        return leerUsuario() ?? { id, rol };
    }
    borrarSesion();
    return null;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(restaurarSesion);
    const [errors, setErrors] = useState([]);
    const isAuthenticated = user !== null;

    //HACEMOS DESAPARECER CUALQUIER MENSAJE DE ERROR LUEGO DE 5 SEGUNDOS
    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => setErrors([]), 5000);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    const iniciarSesion = (token, userData) => {
        guardarSesion(token, userData);
        setUser(userData);
    };

    // signUp y signIn devuelven true/false para que la pantalla sepa si puede redirigir
    const signUp = async (datos) => {
        try {
            const res = await registerRequest(datos);
            iniciarSesion(res.data.token, res.data.user);
            return true;
        } catch (error) {
            setErrors(mensajesDeError(error));
            return false;
        }
    };

    const signIn = async (datos) => {
        try {
            const res = await loginRequest(datos);
            iniciarSesion(res.data.token, res.data.user);
            return true;
        } catch (error) {
            setErrors(mensajesDeError(error));
            return false;
        }
    };

    const logout = () => {
        borrarSesion();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                signUp,
                signIn,
                user,
                logout,
                isAuthenticated,
                errors,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
