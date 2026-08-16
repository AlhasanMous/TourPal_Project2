import api from './api';

const matchingService = {
    // =========================
    // Admin Tourist Matches
    // =========================

    getMatches: async (params = {}) => {
        const response = await api.get('/admin/matching', {
            params,
        });

        return response.data;
    },
};

export default matchingService;
