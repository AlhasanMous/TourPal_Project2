import api from './api';

const transportService = {
    // =========================
    // Companies
    // =========================

    getCompanies: async (params = {}) => {
        const response = await api.get('/admin/transport/companies', {
            params,
        });

        return response.data;
    },

    createCompany: async (data) => {
        const response = await api.post(
            '/admin/transport/companies',
            data
        );

        return response.data;
    },

    updateCompany: async (id, data) => {
        const response = await api.put(
            `/admin/transport/companies/${id}`,
            data
        );

        return response.data;
    },

    deleteCompany: async (id) => {
        const response = await api.delete(
            `/admin/transport/companies/${id}`
        );

        return response.data;
    },

    // =========================
    // Routes
    // =========================

    getRoutes: async (params = {}) => {
        const response = await api.get('/admin/transport/routes', {
            params,
        });

        return response.data;
    },

    createRoute: async (data) => {
        const response = await api.post(
            '/admin/transport/routes',
            data
        );

        return response.data;
    },

    updateRoute: async (id, data) => {
        const response = await api.put(
            `/admin/transport/routes/${id}`,
            data
        );

        return response.data;
    },

    deleteRoute: async (id) => {
        const response = await api.delete(
            `/admin/transport/routes/${id}`
        );

        return response.data;
    },
};

export default transportService;
