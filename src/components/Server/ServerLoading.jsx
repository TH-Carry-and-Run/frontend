// src/components/Server/ServerLoading.jsx
import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

const ServerLoading = ({ showToast }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const serverData = location.state?.serverData;

  // 중복 호출 방지용 플래그
  const startedRef = useRef(false);

  useEffect(() => {
    if (!serverData) {
      console.error("ServerLoading: 서버 생성 정보가 없습니다.");
      showToast("잘못된 접근입니다. 서버 생성 페이지로 돌아갑니다.", "warning");
      navigate('/createserver');
      return;
    }

    if (startedRef.current) return; // 중복 실행 방지
    startedRef.current = true;

    // 언마운트 시 요청 취소
    const controller = new AbortController();

    const sanitize = (msg = "") => {
      let s = String(msg);
      // IP 마스킹
      s = s.replace(/\b\d{1,3}(\.\d{1,3}){3}\b(:\d+)?/g, "[IP 숨김]");
      // URL 마스킹 (프로토콜/도메인/포트)
      s = s.replace(/\bhttps?:\/\/[^\s/]+/gi, "[URL 숨김]");
      return s;
    };

    const createServer = async () => {
      try {
        showToast("서버 생성 요청 중입니다…", "info");

        const payload = {
          os: serverData.os,
          version: serverData.version,
        };

        const response = await axiosInstance.post(
          "/api/container/create",
          payload,
          { signal: controller.signal }
        );

        const { presignedUrl, podName, podNamespace } = response.data || {};

        if (presignedUrl && podName && podNamespace) {
          showToast("웹 터미널로 연결 중…", "success");
          navigate("/terminal", {
            state: { presignedUrl, podName, podNamespace }
          });
        } else {
          throw new Error("필수 정보를 받지 못했습니다. (presignedUrl/podName/podNamespace)");
        }
      } catch (err) {
        if (controller.signal.aborted) return; // 취소된 경우 무시
        console.error("서버 생성 실패:", err);
        const rawMsg =
          err.response?.data?.message ||
          err.message ||
          "서버 생성 중 오류가 발생했습니다.";
        const sanitizedMsg = sanitize(rawMsg);

        showToast(`서버 생성 실패: ${sanitizedMsg}`, "error");
        navigate(-1); // 직전 페이지로
      }
    };

    createServer();

    return () => controller.abort();
  }, [serverData, navigate, showToast]);

  // 인라인 스타일 유지 (CSS 파일 없이 동작)
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
      borderTop: '6px solid #4f46e5',
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
        to { transform: rotate(360deg); }
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