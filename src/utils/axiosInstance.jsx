// src/utils/axiosInstance.jsx

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api', // 여기에 공통 API prefix
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 전 토큰을 헤더에 자동으로 추가
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default axiosInstance;
