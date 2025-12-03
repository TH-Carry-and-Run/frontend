// src/pages/Mainpage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Nav/Navbar';
import "../components/styles/Mainpage.css";
import { FaServer, FaComments, FaQuestionCircle, FaBullhorn, FaRocket, FaShieldAlt } from 'react-icons/fa';

function MainPage({ showToast }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleNavigate = (path) => navigate(path);
  
  const refreshLoginState = () => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    refreshLoginState();
    const onStorage = (e) => {
      if (e.key === 'accessToken') refreshLoginState();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // 로그인 확인 후 이동 함수
  const requireLoginThen = (path) => {
    if (!isLoggedIn) {
      showToast?.("로그인이 필요합니다.", "warning");
      navigate('/login');
      return;
    }
    navigate(path);
  };

  // MyServer 카드 클릭 → ServerPage
  const handleMyServerClick = () => {
    requireLoginThen('/serverpage');
  };

  // 배너 / CTA 에서 바로 서버 생성
  const handleQuickCreate = () => {
    requireLoginThen('/createserver');
  };

  return (
    <div className="main-page-container">
      <Navbar />
      <main className="main-content">
        {/* --- Hero Section --- */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to TCAR Cloud</h1>
            <p className="hero-subtitle">가장 빠르고 안정적인 클라우드 개발 환경을 경험해보세요.</p>

            {isLoggedIn ? (
              <button className="hero-button" onClick={handleQuickCreate}>
                내 서버 만들기
              </button>
            ) : (
              <button className="hero-button" onClick={() => navigate('/login')}>
                로그인
              </button>
            )}
          </div>
        </section>

        {/* --- 주요 기능 --- */}
        <section className="features-section">
          <h2 className="section-title">주요 기능</h2>
          <div className="features-grid">
            <div className="feature-card" onClick={handleMyServerClick}>
              <FaServer className="feature-icon" />
              <h3 className="feature-title">MyServer</h3>
              <p className="feature-description">지금까지 만든 모든 서버를 한 눈에 관리하세요.</p>
            </div>
            
            {/* ▼ 자유게시판 클릭 시 PostListPage(/posts)로 이동 */}
            <div className="feature-card" onClick={() => requireLoginThen('/posts')}>
              <FaComments className="feature-icon" />
              <h3 className="feature-title">자유게시판</h3>
              <p className="feature-description">다른 사용자들과 자유롭게 정보를 공유하는 공간입니다.</p>
            </div>

            <div className="feature-card" onClick={() => requireLoginThen('/qna')}>
              <FaQuestionCircle className="feature-icon" />
              <h3 className="feature-title">Q&A</h3>
              <p className="feature-description">궁금한 점을 질문하고 답변을 받아보세요.</p>
            </div>
            <div className="feature-card" onClick={() => handleNavigate('/notice')}>
              <FaBullhorn className="feature-icon" />
              <h3 className="feature-title">공지사항</h3>
              <p className="feature-description">TCAR의 최신 소식을 확인하세요.</p>
            </div>
            <div className="feature-card">
              <FaRocket className="feature-icon" />
              <h3 className="feature-title">빠른 속도</h3>
              <p className="feature-description">최신 인프라로 지연 없는 개발 환경을 제공합니다.</p>
            </div>
            <div className="feature-card">
              <FaShieldAlt className="feature-icon" />
              <h3 className="feature-title">강력한 보안</h3>
              <p className="feature-description">안전한 서비스 운영을 위한 보안 시스템을 제공합니다.</p>
            </div>
          </div>
        </section>

        {/* --- CTA --- */}
        <section className="cta-section">
          <h2 className="cta-title">지금 바로 당신의 프로젝트를 시작해보세요</h2>
          <button className="cta-button" onClick={handleQuickCreate}>
            서버 생성하기
          </button>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2025 TCAR. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default MainPage;