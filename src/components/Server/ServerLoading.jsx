// ServerLoading.jsx
import React from 'react';

const ServerLoading = () => {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: 'Pretendard, sans-serif',
    },
    spinner: {
      width: '60px',
      height: '60px',
      border: '6px solid #e0e0e0',
      borderTop: '6px solid #4f46e5', // 보라색 계열
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '20px',
    },
    text: {
      fontSize: '18px',
      color: '#333',
      fontWeight: '500',
    },
    keyframes: `
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  };

  return (
    <div style={styles.container}>
      <style>{styles.keyframes}</style>
      <div style={styles.spinner}></div>
      <p style={styles.text}>서버를 생성 중입니다...</p>
    </div>
  );
};

export default ServerLoading;