import axios from 'axios';

const clearAuthData = () => {
    localStorage.removeItem('tourpal_token');
    localStorage.removeItem('tourpal_user');
};

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('tourpal_token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const token = localStorage.getItem('tourpal_token');

        if (error.response?.status === 401 && token) {
            clearAuthData();

            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;
