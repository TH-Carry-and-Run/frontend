import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// --- 개발용 로그인/로그아웃 기능 (수정) ---

const devLogin = () => {
  const fakeToken = 'dev-mode-fake-access-token';
  localStorage.setItem('accessToken', fakeToken);
  console.log('%c[개발용] 🛠️ 임시 로그인 처리 완료. 페이지를 새로고침합니다.', 'color: #28a745; font-weight: bold;');
  // 페이지를 강제로 새로고침하여 로그인 상태를 확실하게 적용합니다.
  window.location.reload(); 
};

const devLogout = () => {
  localStorage.removeItem('accessToken');
  console.log('%c[개발용] 🛠️ 로그아웃 처리 완료. 페이지를 새로고침합니다.', 'color: #dc3545; font-weight: bold;');
  window.location.reload();
};

// 브라우저 콘솔에서 사용할 수 있도록 함수를 window 객체에 등록
window.devLogin = devLogin;
window.devLogout = devLogout;

console.log('%c[개발용] 🛠️ 로그인 헬퍼가 준비되었습니다.', 'color: #17a2b8;');
console.log('%c사용법: 콘솔에 devLogin() 또는 devLogout()을 입력하고 Enter를 누르세요.', 'color: #17a2b8;');

// --- (기존 코드는 그대로 유지) ---
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // StrictMode를 잠시 주석 처리하여 개발용 기능의 충돌을 방지합니다.
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);

reportWebVitals();
    

