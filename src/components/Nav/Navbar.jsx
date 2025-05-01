import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  <nav className="navbar">
    <div className="nav-left">서버 대시보드</div>
    <div className="nav-right">
      <button className="nav-btn">🔔</button>
      <button className="nav-btn">🌐</button>
      <button className="nav-btn">👤</button>
    </div>
  </nav>

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="logo">TCAR</div>
        <div className="welcome">환영합니다</div>
      </div>

      <div className="navbar-center">
        <p>마이페이지</p>
      </div>

      <div className="navbar-right">
        {isLoggedIn ? (
          <>
            <input type="text" placeholder="검색" className="search-bar" />
            <Link to="/notifications" className="icon-button">🔔</Link>
            <Link to="/mypage" className="icon-button">👤</Link>
          </>
        ) : (
          <>
            <Link to="/login" className="icon-button login-button">로그인</Link>
          </>
        )}
        {/* 언어선택 버튼은 항상 표시 */}
        <Link to="/language" className="icon-button">🌐</Link>
      </div>

    </header>
  );
};

export default Navbar;