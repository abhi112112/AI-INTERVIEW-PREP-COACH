// Axios HTTP client for making API requests to backend
import axios from 'axios';

// Create a pre-configured Axios client instance
const API = axios.create({
  baseURL: '/api', // Uses Vite proxy configured to http://localhost:5000
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically attaches JWT Bearer token to Authorization headers if present in localStorage
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
