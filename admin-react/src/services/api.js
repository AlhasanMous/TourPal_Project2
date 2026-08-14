import axios from 'axios';

const clearAuthData = () => {
    localStorage.removeItem('tourpal_token');
    localStorage.removeItem('tourpal_user');
};

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api',
    headers: {
        Accept: 'application/json',
    },
});

// Let Axios set the correct Content-Type (with boundary for FormData)
api.interceptors.request.use((config) => {
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];

        // Laravel does not read _method from query string; append to body
        if (config.method === 'put' || config.method === 'PUT') {
            config.data.append('_method', 'PUT');
            config.method = 'post';
            config.url = config.url.replace(/\?_method=PUT/, '');
        }
    }

    return config;
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
