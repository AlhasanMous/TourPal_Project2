import api from './api';

const getGuides = async (params = {}) => {
    const { data } = await api.get('/admin/guides', { params });
    return data;
};

const getGuide = async (id) => {
    const { data } = await api.get(`/admin/guides/${id}`);
    return data;
};

const createGuide = async (payload) => {
    const { data } = await api.post('/admin/guides', payload);
    return data;
};

const verifyGuide = async (id, action, rejectionReason = null) => {
    const body = { action };

    if (rejectionReason) {
        body.rejection_reason = rejectionReason;
    }

    const { data } = await api.post(`/admin/guides/${id}/verify`, body);
    return data;
};

const getPending = async (params = {}) => {
    const { data } = await api.get('/admin/guides/pending', { params });
    return data;
};

export default {
    getGuides,
    getGuide,
    createGuide,
    verifyGuide,
    getPending,
};
