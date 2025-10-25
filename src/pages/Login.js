import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "../components/styles/Login.css"; 
import axiosInstance from "../utils/axiosInstance";

// --- props로 showToast 함수를 받도록 수정 ---
export default function Login({ showToast }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [pwValid, setPasswordValid] = useState(false);
  const navigate = useNavigate();

  const handleEmail = (e) => {
    const value = e.target.value;
    setEmail(value);
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,}$/;
    setEmailValid(regex.test(value));
  };
  
  const handlePw = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordValid(value.length >= 8);
  };
  
  const onClickConfirmButton = async () => {
    try {
      const response = await axiosInstance.post(`/api/users/login`, { email, password });
      const token = response.headers['authorization']?.replace('Bearer ', '');

      if (token) {
        localStorage.setItem('accessToken', token);
        // --- alert()를 showToast()로 교체 ---
        showToast("로그인에 성공했습니다!");
        navigate('/main');
      } else {
        // --- alert()를 showToast()로 교체 ---
        showToast("로그인에 실패했습니다. 토큰이 없습니다.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      // --- alert()를 showToast()로 교체 ---
      showToast("이메일 또는 비밀번호가 일치하지 않습니다.");
    }
  };
  
  const notAllow = !(emailValid && pwValid);

  return (
    <div className="login-page">
      <div className="login-form-container">
        <div className="input-group">
          <label className="inputTitle">Email</label>
          <input
            type="text"
            className="input"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmail}
          />
          <div className="errorMessageWrap">
            {!emailValid && email.length > 0 && (
              <div>Please enter a valid email.</div>
            )}
          </div>
        </div>

        <div className="input-group">
          <label className="inputTitle">Password</label>
          <input
            type="password"
            className="input"
            placeholder="Enter your password"
            value={password}
            onChange={handlePw}
          />
        </div>

        <div className="button-group">
          <button 
            className="auth-button login-button"
            onClick={onClickConfirmButton}
            disabled={notAllow}
          >
            Log In
          </button>
          <button 
            className="auth-button signup-button"
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </button>
        </div>

        <a href="#" className="forgot-password-link">Forgot Password?</a>
      </div>
    </div>
  );
}