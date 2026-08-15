import api from './api';

const getWorkspaces = async (params = {}) => {
    const response = await api.get('/admin/workspaces', { params });
    return response.data;
};

const getWorkspace = async (id) => {
    const response = await api.get(`/admin/workspaces/${id}`);
    return response.data;
};

const deleteWorkspace = async (id) => {
    const response = await api.delete(`/admin/workspaces/${id}`);
    return response.data;
};


export default {
    getWorkspaces,
    getWorkspace,
    deleteWorkspace,
};
