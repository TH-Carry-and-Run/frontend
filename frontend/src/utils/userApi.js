// src/utils/authApi.js
import { request } from './request';

// 회원가입
export const join = async (state, formData, image) => {
  return await request('user', {
    method: 'POST',
    body: JSON.stringify({ user: { ...state, ...formData, image } }),
  });
};

// 이미 존재하는 이메일(또는 계정)인지 검사
export const validateForm = async (id, formData) => {
  return await request(`user/${id}valid`, {
    method: 'POST',
    body: JSON.stringify({ user: { [id]: formData[id] } }),
  });
};

export const auth = () => {
  return !!localStorage.getItem('accessToken'); // 로그인 되어 있으면 true
};
