import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8000/api', // Adjust if your server runs on a different port
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptors
axiosClient.interceptors.request.use(
    (config) => {
        // Add auth token if available
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle errors globally (e.g., 401 Unauthorized)
        if (error.response && error.response.status === 401) {
            // Typically redirect to login or clear token
            localStorage.removeItem('token');
            // window.location.href = '/login'; // Optional: Use with caution
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
