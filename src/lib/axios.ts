// src/lib/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://jovial-dango-21aac7.netlify.app/', // Change to your backend URL in production
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add request/response interceptors (for auth later)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
