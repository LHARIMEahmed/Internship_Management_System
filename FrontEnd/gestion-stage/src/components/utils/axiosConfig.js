// src/utils/axiosConfig.js
import axios from 'axios';

const API_URL = 'http://localhost:8080';

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token expiration
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 Unauthorized and not a retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token (if you have a refresh token endpoint)
        // const refreshResponse = await axiosInstance.post('/auth/refresh');
        // const newToken = refreshResponse.data.token;
        // localStorage.setItem('authToken', newToken);
        // originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        // return axiosInstance(originalRequest);
        
        // Or simply logout user if no refresh token mechanism
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      } catch (refreshError) {
        // If refresh fails, logout
        localStorage.removeItem('authToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;