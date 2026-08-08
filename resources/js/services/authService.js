import api from './api';

const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
};

const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    return data;
};

const logout = async () => {
    const { data } = await api.post('/auth/logout');
    return data;
};

const me = async () => {
    const { data } = await api.get('/auth/me');
    return data;
};

export default {
    login,
    register,
    logout,
    me,
};
