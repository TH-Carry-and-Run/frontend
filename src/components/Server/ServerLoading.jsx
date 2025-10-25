// ServerLoading.jsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

const ServerLoading = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // --- CreateServer로부터 전달받은 serverData 추출 ---
  const serverData = location.state?.serverData;

  useEffect(() => {
    // --- serverData가 없으면 비정상 접근으로 간주하고 ServerPage로 이동 ---
    if (!serverData) {
      console.error("ServerLoading: 서버 생성 정보가 없습니다.");
      alert("잘못된 접근입니다. 서버 생성 페이지로 돌아갑니다."); // 사용자에게 알림
      navigate('/createserver');
      return;
    }

    const createServer = async () => {
      try {
        const payload = {
          os: serverData.os,
          version: serverData.version
        };
        const response = await axiosInstance.post("/api/container/create", payload);

        // --- 응답에서 presignedUrl, podName, podNamespace 추출 ---
        const { presignedUrl, podName, podNamespace } = response.data;

        if (presignedUrl && podName && podNamespace) {
          // --- 성공 시 정보와 함께 /terminal 페이지로 이동 ---
          navigate("/terminal", { 
            state: { 
              presignedUrl, 
              podName, 
              podNamespace 
            } 
          });
        } else {
          throw new Error("필수 정보를 받지 못했습니다. (presignedUrl, podName, podNamespace)");
        }
      } catch (error) {
        console.error("서버 생성 실패:", error);
        // --- 실패 시 사용자에게 알리고 이전 페이지(CreateServer)로 이동 ---
        const errorMsg = error.response?.data?.message || "서버 생성 중 오류가 발생했습니다.";
        alert(`서버 생성 실패: ${errorMsg}`); // alert 대신 showToast 사용 가능 (props로 받아야 함)
        navigate(-1); // navigate(-1)은 브라우저의 '뒤로 가기'와 동일
      }
    };

    createServer(); // 컴포넌트 마운트 시 API 호출 실행
  }, [serverData, navigate]); // navigate와 serverData를 의존성 배열에 추가
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