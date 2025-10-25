import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TerminalSidebar from "../components/Terminal/TerminalSidebar.jsx";
import TerminalBash from "../components/Terminal/TerminalBash.jsx";
import TerminalStatus from "../components/Terminal/TerminalStatus.jsx";
import "../components/Terminal/Terminal.css";

const Terminal = ({ showToast }) => {
    const location = useLocation();
    const navigate = useNavigate();

    // --- 4. CreateServer 페이지로부터 navigate state를 통해 presigned-url 전달받기 ---
    const presignedUrl = location.state?.presignedUrl;

    // --- 5. 사이드바 열림/닫힘 상태 관리 ---
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // --- 6. URL이 없으면 (직접 /terminal로 접속 시도 등), 잘못된 접근으로 간주하고 에러 화면 표시 ---
    if (!presignedUrl) {
        return (
            <div className="terminal-error-page" style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: 'var(--bg-dark, #1e1e2e)', // CSS 변수 사용 시도, 없으면 기본값
                color: 'var(--text-primary, #cdd6f4)'
            }}>
                <h2 style={{ color: 'var(--danger-color, #dc3545)'}}>잘못된 접근입니다.</h2>
                <p style={{ margin: '20px 0' }}>서버 생성 페이지를 통해 정상적으로 접근해주세요.</p>
                <button
                    onClick={() => navigate('/serverpage')}
                    style={{
                        padding: '10px 20px',
                        cursor: 'pointer',
                        backgroundColor: 'var(--accent-mauve, #cba6f7)',
                        color: 'var(--bg-dark, #1e1e2e)',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 'bold'
                    }}
                >
                    서버 목록으로 돌아가기
                </button>
            </div>
        );
    }

    // --- 7. URL이 있다면 정상적으로 페이지 렌더링 ---
    return (
        <div className="terminal-page-layout">
            <header className="terminal-header">
                <div className="logo">TCAR</div>
                <div className="header-actions"></div>
            </header>

            <div className="terminal-main-content">
                {/* --- 8. TerminalSidebar에 상태와 토글 함수 전달 --- */}
                <TerminalSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
                <main className="terminal-body">
                    <div className="terminal-bash-wrapper">
                        {/* --- 9. TerminalBash에 presigned-url과 showToast 전달 --- */}
                        <TerminalBash showToast={showToast} presignedUrl={presignedUrl} />
                    </div>
                    <div className="terminal-status-wrapper">
                        <h2 className="management-title">Management</h2>
                        <TerminalStatus />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Terminal;