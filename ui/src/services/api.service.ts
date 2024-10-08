import axios from 'axios'
const api = axios.create({
    baseURL: 'http://localhost:5190',
});

// Intercept each request to add the Authorization header

api.interceptors.request.use(config => {
    const token = getToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});
export default api;

export const getToken = () => localStorage.getItem('token');
