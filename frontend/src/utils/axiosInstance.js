// src/utils/axiosInstance.js

import axios from 'axios';
import { BACKEND_URL } from "../config";


const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: false
});

// 요청 전 토큰을 헤더에 자동으로 추가
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    console.log(token);
    if (token) {
      config.headers.Authorization = `${token}`;
      console.log("[axiosInstance] Authorization 헤더:", config.headers.Authorization);
    }
    return config;
  },
  error => Promise.reject(error)
);

// 401 오류(토큰 만료, 로그인 만료 등) 발생 시 토큰 자동 삭제 + 로그인 페이지로 강제 이동
axiosInstance.interceptors.response.use(
  res => res,
  err => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);


export default axiosInstance;