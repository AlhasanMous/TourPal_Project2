import api from './api';

const reviewService = {
    // =========================
    // Admin Reviews
    // =========================

    getReviews: async (params = {}) => {
        const response = await api.get('/admin/reviews', {
            params,
        });

        return response.data;
    },

    deleteReview: async (id) => {
        const response = await api.delete(
            `/admin/reviews/${id}`
        );

        return response.data;
    },
};

export default reviewService;
