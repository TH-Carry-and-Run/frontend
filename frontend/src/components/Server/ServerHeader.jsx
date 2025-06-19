import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅을 임포트
import '../../components/styles/ServerPage.css';

const ServerHeader = () => {
  const navigate = useNavigate();

  const goToLogin = () => {
    console.log('Navigating to /login');
    navigate('/login'); // 로그인 페이지로 이동하도록 설정
  };

  return (
    <header className="header">
      <h2 className="hed-left">TCAR</h2>
      <div className="hed-right">
        <button className="hed-btn">🔍</button>
        <button className="hed-btn">🌐</button>
        <button className="hed-btn">🔔</button>
        <button className="hed-btn" onClick={goToLogin}>👤</button> {/* 로그인 페이지로 가게 설정 */}
      </div>
    </header>
  );
};

export default ServerHeader;
