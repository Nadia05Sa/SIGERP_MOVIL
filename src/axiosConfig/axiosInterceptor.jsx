import axios from 'axios';
import { Alert } from 'react-native';
import { URL_SIGERP } from "./config";

const api = axios.create({
    baseURL: URL_SIGERP,
    headers: { 
        'Content-Type': 'application/json'
    }
});

// Interceptores de respuesta para manejar errores
api.interceptors.response.use(
    response => response,
    error => {
        const status = error.response ? error.response.status : null;
        const errorMessages = {
            400: 'Solicitud incorrecta.',
            404: 'Recurso no encontrado.',
            500: 'Error del servidor, intenta más tarde.',
        };

        if (errorMessages[status]) {
            Alert.alert('Error', errorMessages[status]);
        }
        return Promise.reject(error);
    }
);

export const doGet = async (url, params = {}) => {
    try {
        const response = await api.get(url, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const doPost = async (url, data) => {
    try {
        const response = await api.post(url, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const doPut = async (url, data) => {
    try {
        const response = await api.put(url, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const doPatch = async (url, data) => {
    try {
        const response = await api.patch(url, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const doDelete = async (url) => {
    try {
        const response = await api.delete(url);
        return response.data;
    } catch (error) {
        throw error;
    }
};


// Función para autenticar al empleado
export const authenticate = async (correo, contrasena, id, estado, mesas) => {
    try {
        const response = await api.post(`/empleado/login/${id}`, {
            correo,
            contrasena, 
            estado,
            mesas
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};


export default api;
