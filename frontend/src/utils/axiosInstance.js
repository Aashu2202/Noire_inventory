import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '';
const axiosInstance = axios.create({
    baseURL: baseURL.endsWith('/api') ? baseURL : `${baseURL.replace(/\/$/, '')}/api`,
});

axiosInstance.interceptors.request.use(
    (config) => {
        // Double check how you stored the user object
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user && user.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;