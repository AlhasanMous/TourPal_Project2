import api from './api';

const getUsers = async (params = {}) => {
    const { data } = await api.get('/admin/users', {
        params,
    });

    return data;
};

const getUser = async (id) => {
    const { data } = await api.get(`/admin/users/${id}`);

    return data;
};

const updateUser = async (id, userData) => {
    const { data } = await api.put(`/admin/users/${id}`, userData);

    return data;
};

const deleteUser = async (id) => {
    const { data } = await api.delete(`/admin/users/${id}`);

    return data;
};

const restoreUser = async (id) => {
    const { data } = await api.post(`/admin/users/${id}/restore`);

    return data;
};

const toggleVerification = async (id) => {
    const { data } = await api.post(
        `/admin/users/${id}/toggle-verification`
    );

    return data;
};

export default {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    restoreUser,
    toggleVerification,
};
