import api from './api';

const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

const register = async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
};

const logout = async () => {
    const response = await api.post('/auth/logout');
    return response.data;
};

const me = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

export default { login, register, logout, me };
