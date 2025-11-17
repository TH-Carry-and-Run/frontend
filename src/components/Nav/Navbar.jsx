// src/components/Nav/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // navigate 추가
import LanguageSelector from './LanguageSelector';
import axiosInstance from '../../utils/axiosInstance'; // 로그아웃 API 호출용
import './Navbar.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // 페이지 이동용

  useEffect(() => {
    const token = localStorage.getItem("accessToken"); // 키 이름 통일
    setIsLoggedIn(!!token);
  }, []);

  // 로그아웃 함수 추가
  const handleLogout = async () => {
    try {
      await axiosInstance.post('/api/auth/logout'); // 로그아웃 호출

      // 토큰 및 로그인 관련 데이터 삭제
      localStorage.removeItem('accessToken');
      localStorage.removeItem('accessTokenExpiresAt');
      localStorage.removeItem('currentUser');

      alert('로그아웃 되었습니다.');
      setIsLoggedIn(false);
      navigate('/login'); // 로그인 페이지로 이동
    } catch (error) {
      console.error('Logout Error:', error);
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };

  return (
    <header className="navbar">
      {/* 왼쪽 영역 - 로고 */}
      <div className="navbar-left">
        <div className="logo">TCAR</div>
        <div className="welcome">환영합니다</div>
      </div>

      {/* 중앙 영역 */}
      <div className="navbar-center">
        <p>마이페이지</p>
      </div>

      {/* 오른쪽 영역 */}
      <div className="navbar-right">
        {isLoggedIn ? (
          <>
            <input type="text" placeholder="검색" className="search-bar" />
            <Link to="/notifications" className="icon-button">🔔</Link>
            <Link to="/mypage" className="icon-button">👤</Link>
            {/* 로그아웃 버튼 추가 */}
            <button onClick={handleLogout} className="icon-button logout-button">
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="icon-button login-button">로그인</Link>
          </>
        )}

        {/* 언어선택 버튼 항상 표시 */}
        <LanguageSelector />
      </div>
    </header>
  );
};

export default Navbar;