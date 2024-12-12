import axios from 'axios';
import { isTokenExpired, clearUserData } from './authUtils';

const api = axios.create({
  baseURL: 'http://localhost:5000', // adjust this to your API's URL
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      if (isTokenExpired(token)) {
        clearUserData();
        window.location.href = '/login?expired=true';
        return Promise.reject('Token expired');
      }
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        clearUserData();
        window.location.href = '/login?expired=true';
      } else if (error.response.status === 403) {
        alert('You do not have permission to perform this action');
      }
    }
    return Promise.reject(error);
  }
);

export default api;