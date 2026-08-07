import api from './api';

const getCities = async () => {
    const response = await api.get('/cities');
    return response.data;
};

const getAdminCities = async (params = {}) => {
    const response = await api.get('/admin/cities', { params });
    return response.data;
};

const getCity = async (id) => {
    const response = await api.get(`/admin/cities/${id}`);
    return response.data;
};

const createCity = async (data) => {
    const response = await api.post('/admin/cities', data);
    return response.data;
};

const updateCity = async (id, data) => {
    const response = await api.put(`/admin/cities/${id}`, data);
    return response.data;
};

const deleteCity = async (id) => {
    const response = await api.delete(`/admin/cities/${id}`);
    return response.data;
};

export default {
    getCities,
    getAdminCities,
    getCity,
    createCity,
    updateCity,
    deleteCity,
};
