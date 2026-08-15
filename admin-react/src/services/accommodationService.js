import api from './api';

const accommodationService = {
    getAccommodations: async (params = {}) => {
        const response = await api.get('/admin/accommodations', {
            params,
        });

        return response.data;
    },

    getPendingAccommodations: async (params = {}) => {
        const response = await api.get('/admin/accommodations/pending', {
            params,
        });

        return response.data;
    },

    getAccommodation: async (id) => {
        const response = await api.get(`/admin/accommodations/${id}`);

        return response.data;
    },

    verifyAccommodation: async (id, data) => {
        const response = await api.post(
            `/admin/accommodations/${id}/verify`,
            data
        );

        return response.data;
    },
};

export default accommodationService;
