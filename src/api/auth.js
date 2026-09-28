import Cookies from 'js-cookie';
import axios from './axios';

//ENDPOINTS PARA LA AUTENTICACION
export const registerRequest = (user) => axios.post('/register', user);
export const loginRequest = (user) => axios.post('/login', user);

// El JWT del backend dura 1 hora, la cookie también
const OPCIONES_COOKIE = { expires: 1 / 24, sameSite: 'strict' };

export const guardarSesion = (token, user) => {
    Cookies.set('token', token, OPCIONES_COOKIE);
    Cookies.set('user', JSON.stringify(user), OPCIONES_COOKIE);
};

export const borrarSesion = () => {
    Cookies.remove('token');
    Cookies.remove('user');
};

export const leerToken = () => Cookies.get('token') ?? null;

export const leerUsuario = () => {
    try {
        return JSON.parse(Cookies.get('user'));
    } catch {
        return null;
    }
};

// El backend no expone /verify: se lee el payload del JWT y se controla el vencimiento acá
export const decodificarToken = (token) => {
    try {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    } catch {
        return null;
    }
};

export const tokenVigente = (token) => {
    const payload = token ? decodificarToken(token) : null;
    if (!payload) return false;
    return !payload.exp || payload.exp * 1000 > Date.now();
};
