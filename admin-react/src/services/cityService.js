import api from './api';

const getAll = async () => {
    const { data } = await api.get('/admin/cities');
    return data.cities;
};

const getById = async (id) => {
    const { data } = await api.get(`/admin/cities/${id}`);
    return data.city;
};

const create = async (cityData) => {
    const { data } = await api.post('/admin/cities', cityData);
    return data;
};

const update = async (id, cityData) => {
    const { data } = await api.put(`/admin/cities/${id}`, cityData);
    return data;
};

const remove = async (id) => {
    const { data } = await api.delete(`/admin/cities/${id}`);
    return data;
};

export default {
    getAll,
    getById,
    create,
    update,
    remove,
};
