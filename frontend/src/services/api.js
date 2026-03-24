import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Backend expects "Bearer <token>" usually
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const mapKeys = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(v => mapKeys(v));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const newKey = key === 'User' ? 'user' : key;
      acc[newKey] = mapKeys(obj[key]);
      return acc;
    }, {});
  }
  return obj;
};

// Response interceptor to handle global errors like 401
api.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = mapKeys(response.data);
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
