// src/utils/axiosInstance.js

import axios from 'axios';
import { BACKEND_URL } from "../config";


const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  // baseURL: 'http: 3.39.199.192:8080'
  withCredentials: false, // 토큰을 Authorization 헤더로 보낼 거면 false 유지
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },

});

// 요청 전 토큰을 헤더에 자동으로 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // 백엔드가 기대하는 형식: "Bearer <token>"
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 인증 만료 처리
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401 || status === 403) { // 403도 함께 처리 권장
      localStorage.removeItem('accessToken');
      localStorage.removeItem('accessTokenExpiresAt');
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;

// (선택) 로그아웃 헬퍼: 필요하면 import해서 사용
// export const logout = async () => {
//   try {
//     await axiosInstance.post('/api/auth/logout');
//   } catch (e) {
//     // 서버가 세션 정리 실패하더라도 클라이언트 상태는 정리
//     console.warn('Logout API failed, clearing local state anyway.', e);
//   } finally {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('accessTokenExpiresAt');
//     localStorage.removeItem('currentUser');
//     window.location.href = '/login';
//   }
// };