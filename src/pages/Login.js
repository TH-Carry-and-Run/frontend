import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Login.css";
import Cookies from "js-cookie";
import { FaEnvelope, FaLock } from "react-icons/fa";

const URL = "http://192.168.1.5:8080/api"; // API 서버 URL

function Login({ onLogin }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${URL}/users/login`, formData);
      alert("로그인 성공!");
      Cookies.set("token", response.data.token, { expires: 1 });
      setIsLoggedIn(true);
      onLogin(); // 로그인 상태 업데이트
    } catch (error) {
      alert("로그인 실패! 이메일과 비밀번호를 확인하세요.");
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    setIsLoggedIn(false);
    alert("로그아웃 되었습니다.");
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <h2 className="login-title">LOGIN</h2>

        {isLoggedIn ? (
          <div className="logged-in-box">
            <p>로그인 유지 중</p>
            <button onClick={handleLogout} className="logout-btn">
              로그아웃
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <FaEnvelope className="icon" />
              <input
                type="email"
                name="email"
                placeholder="Email ID"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <FaLock className="icon" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="login-btn">
              LOGIN
            </button>
            <button className="signup-btn">REGISTER</button>
            <p className="forgot-password">Forgot password?</p>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
