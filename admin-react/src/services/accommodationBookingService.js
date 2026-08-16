import api from './api';

const accommodationBookingService = {
    // =========================
    // Accommodation Bookings
    // =========================

    getBookings: async (params = {}) => {
        const response = await api.get(
            '/admin/accommodation-bookings',
            { params }
        );

        return response.data;
    },

    getBookingById: async (id) => {
        const response = await api.get(
            `/admin/accommodation-bookings/${id}`
        );

        return response.data;
    },

    cancelBooking: async (id) => {
        const response = await api.patch(
            `/admin/accommodation-bookings/${id}/cancel`
        );

        return response.data;
    },
};

export default accommodationBookingService;
