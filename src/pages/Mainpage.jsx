import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Nav/Navbar';
import "../components/styles/Mainpage.css";
import { FaServer, FaComments, FaQuestionCircle, FaBullhorn, FaRocket, FaShieldAlt } from 'react-icons/fa';

function MainPage() {
  const navigate = useNavigate();

  // 각 버튼 클릭 시 이동할 경로를 함수로 관리
  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="main-page-container">
      <Navbar />
      <main className="main-content">
        
        {/* --- 대표 영역 (Hero Section) --- */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to TCAR Cloud</h1>
            <p className="hero-subtitle">가장 빠르고 안정적인 클라우드 개발 환경을 경험해보세요.</p>
            <button className="hero-button" onClick={() => handleNavigate('/signup')}>
              지금 시작하기
            </button>
          </div>
        </section>

        {/* --- 핵심 기능 소개 영역 --- */}
        <section className="features-section">
          <h2 className="section-title">주요 기능</h2>
          <div className="features-grid">
            <div className="feature-card" onClick={() => handleNavigate('/serverpage')}>
              <FaServer className="feature-icon" />
              <h3 className="feature-title">MyServer</h3>
              <p className="feature-description">클릭 몇 번으로 나만의 가상 서버를 생성하고 관리하세요.</p>
            </div>
            <div className="feature-card" onClick={() => handleNavigate('/posts')}>
              <FaComments className="feature-icon" />
              <h3 className="feature-title">자유게시판</h3>
              <p className="feature-description">다른 사용자들과 자유롭게 정보를 공유하고 소통하는 공간입니다.</p>
            </div>
            <div className="feature-card" onClick={() => handleNavigate('/qna')}>
              <FaQuestionCircle className="feature-icon" />
              <h3 className="feature-title">Q&A</h3>
              <p className="feature-description">궁금한 점을 질문하고 전문가 및 동료 개발자에게 답변을 받으세요.</p>
            </div>
            <div className="feature-card" onClick={() => handleNavigate('/notice')}>
              <FaBullhorn className="feature-icon" />
              <h3 className="feature-title">공지사항</h3>
              <p className="feature-description">TCAR의 최신 소식과 중요한 업데이트를 가장 먼저 확인하세요.</p>
            </div>
            <div className="feature-card">
              <FaRocket className="feature-icon" />
              <h3 className="feature-title">빠른 속도</h3>
              <p className="feature-description">최신 인프라를 통해 지연 없는 개발 환경을 제공합니다.</p>
            </div>
            <div className="feature-card">
              <FaShieldAlt className="feature-icon" />
              <h3 className="feature-title">강력한 보안</h3>
              <p className="feature-description">여러분의 소중한 데이터를 안전하게 보호하는 보안 시스템입니다.</p>
            </div>
          </div>
        </section>

        {/* --- 행동 유도 영역 --- */}
        <section className="cta-section">
          <h2 className="cta-title">지금 바로 당신의 프로젝트를 시작해보세요</h2>
          <button className="cta-button" onClick={() => handleNavigate('/serverpage')}>
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