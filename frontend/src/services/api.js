// Axios HTTP client for making API requests to backend
import axios from 'axios';

// Create a pre-configured Axios client instance
// Uses VITE_API_URL from environment variables in production, or fallback to relative /api for local dev proxy
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
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
