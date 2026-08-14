import api from './api';

const getPlaces = async (params = {}) => {
    const response = await api.get('/admin/places', { params });
    return response.data;
};

const getPlace = async (id) => {
    const response = await api.get(`/admin/places/${id}`);
    return response.data;
};

const createPlace = async (data) => {
    const response = await api.post(
        '/admin/places',
        data,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );

    return response.data;
};

const updatePlace = async (id, data) => {
    const response = await api.post(
        `/admin/places/${id}?_method=PUT`,
        data,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );

    return response.data;
};

const deletePlace = async (id) => {
    const response = await api.delete(`/admin/places/${id}`);
    return response.data;
};

export default {
    getPlaces,
    getPlace,
    createPlace,
    updatePlace,
    deletePlace,
};
