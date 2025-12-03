import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaServer, FaMicrochip } from "react-icons/fa"; 
import TerminalBash from "../components/Terminal/TerminalBash.jsx";
import TerminalStatus from "../components/Terminal/TerminalStatus.jsx";
import "../components/Terminal/Terminal.css";

const Terminal = ({ showToast }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 모달 표시 여부 상태 관리
  const [showExitModal, setShowExitModal] = useState(false);

  const { presignedUrl, podName, podNamespace } = location.state || {};

  useEffect(() => {
    if (!presignedUrl) {
      showToast?.("터미널 접속 정보가 없습니다. 서버 페이지로 이동합니다.", "warning");
      navigate("/serverpage");
    }
  }, [presignedUrl, navigate, showToast]);

  // [수정] EXIT 버튼 클릭 시 -> 모달 열기
  const handleExitClick = () => {
    setShowExitModal(true);
  };

  // [수정] 모달에서 '네(Yes)' 클릭 시 -> 실제 이동
  const confirmExit = () => {
    setShowExitModal(false); // 모달 닫기
    showToast?.("터미널 연결을 종료했습니다.", "info"); // Toast 띄우기
    navigate("/serverpage");
  };

  // [수정] 모달에서 '취소(No)' 클릭 시 -> 모달 닫기
  const cancelExit = () => {
    setShowExitModal(false);
  };

  if (!presignedUrl) return <div className="loading-screen">Connecting...</div>;

  return (
    <div className="terminal-page-layout">
      {/* 헤더 */}
      <header className="terminal-header">
        <div className="header-left">
          <div className="logo">TCAR</div>
          <div className="server-info-badge">
            <FaServer />
            <span>{podName || "Unknown Server"}</span>
          </div>
        </div>

        <div className="header-right">
          {/* 버튼 클릭 시 handleExitClick 실행 */}
          <button className="exit-btn" onClick={handleExitClick}>
            <FaSignOutAlt />
            <span>EXIT</span>
          </button>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="terminal-main-content">
        <div className="terminal-bash-wrapper">
          <TerminalBash
            showToast={showToast}
            presignedUrl={presignedUrl}
            podName={podName}
            podNamespace={podNamespace}
          />
        </div>

        <div className="terminal-status-wrapper">
          <div className="status-header">
            <FaMicrochip /> Management Status
          </div>
          <TerminalStatus
            podName={podName}
            podNamespace={podNamespace}
          />
        </div>
      </div>

      {/* ✨ [추가] 종료 확인 커스텀 모달 ✨ */}
      {showExitModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content">
            <h3>터미널 종료</h3>
            <p>터미널 연결을 종료하시겠습니까?<br />(작업 내용은 자동 저장됩니다.)</p>
            <div className="custom-modal-actions">
              <button className="modal-btn cancel" onClick={cancelExit}>취소</button>
              <button className="modal-btn confirm" onClick={confirmExit}>종료하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Terminal;