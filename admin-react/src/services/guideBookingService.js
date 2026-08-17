import api from './api';

const guideBookingService = {
    getBookings: async (params = {}) => {
        const response = await api.get('/admin/guide-bookings', {
            params,
        });

        return response.data;
    },

    getBooking: async (id) => {
        const response = await api.get(`/admin/guide-bookings/${id}`);

        return response.data;
    },

    cancelBooking: async (id) => {
        const response = await api.patch(
            `/admin/guide-bookings/${id}/cancel`
        );

        return response.data;
    },
};

export default guideBookingService;
