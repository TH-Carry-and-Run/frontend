import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';
import axiosInstance from '../../utils/axiosInstance';
import './Navbar.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인 상태 확인
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/api/auth/logout');
      
      localStorage.removeItem('accessToken');
      localStorage.removeItem('accessTokenExpiresAt');
      localStorage.removeItem('currentUser');

      alert('로그아웃 되었습니다.');
      setIsLoggedIn(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout Error:', error);
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };

  return (
    <header className="navbar">
      {/* 왼쪽 영역 - 로고 */}
      <div className="navbar-left">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="logo">TCAR</div>
        </Link>
        <div className="welcome">환영합니다</div>
      </div>

      {/* 중앙 영역 (필요에 따라 변경 가능) */}
      <div className="navbar-center">
        {/* <p>마이페이지</p> <- 이 부분은 페이지마다 다를 수 있어 비워두거나 props로 처리하기도 함 */}
      </div>

      {/* 오른쪽 영역 */}
      <div className="navbar-right">
        {isLoggedIn ? (
          <>
            <input type="text" placeholder="검색" className="search-bar" />
            <Link to="/notifications" className="icon-button">🔔</Link>
            
            {/* ▼ 여기를 수정했습니다: /mypage -> /modify */}
            <Link to="/modify" className="icon-button">👤</Link>

            <button onClick={handleLogout} className="icon-button logout-button">
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="icon-button login-button">로그인</Link>
          </>
        )}

        <LanguageSelector />
      </div>
    </header>
  );
};

export default Navbar;