import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom"; // 임시 테스트 중에는 사용 안 함
import TerminalSidebar from "../components/Terminal/TerminalSidebar.jsx";
import TerminalBash from "../components/Terminal/TerminalBash.jsx";
import TerminalStatus from "../components/Terminal/TerminalStatus.jsx";
import "../components/Terminal/Terminal.css"; // styles 폴더에 있다고 가정

const Terminal = ({ showToast }) => {
    // const location = useLocation();
    // const navigate = useNavigate();

    // --- 임시 테스트를 위해 고정된 값을 직접 사용합니다 ---
    const presignedUrl = 'eyJzdWIiOiJoZXlfbWluakBuYXZlci5jb20iLCJwb2ROYW1lIjoicG9kLTM5ZTMwNzlmIiwicG9kTmFtZXNwYWNlIjoiZGVmYXVsdCIsImluZ3Jlc3MiOiJ0Y2FyLmFkbWluLmNvbm5lY3Rpb24uY29tL2RlZmF1bHQvcG9kLTM5ZTMwNzlmIn0'; // VM팀원이 준 임시 토큰(presignedUrl)
    const podName = 'pod-39e3079f';       // 임시 podName
    const podNamespace = 'default';     // 임시 podNamespace

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // --- URL 유효성 검사 로직을 완전히 제거합니다 ---
    // if (!presignedUrl || !podName || !podNamespace) { ... } // 이 부분을 삭제!

    // --- 무조건 터미널 페이지를 렌더링합니다 ---
    return (
        <div className="terminal-page-layout">
            <header className="terminal-header">
                <div className="logo">TCAR</div>
                <div className="header-actions"></div>
            </header>
            
            <div className="terminal-main-content">
                <TerminalSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
                <main className="terminal-body">
                    <div className="terminal-bash-wrapper">
                        {/* --- 임시 값을 자식 컴포넌트로 전달합니다 --- */}
                        <TerminalBash 
                            showToast={showToast} 
                            presignedUrl={presignedUrl} 
                            podName={podName}
                            podNamespace={podNamespace}
                        />
                    </div>
                    <div className="terminal-status-wrapper">
                        <h2 className="management-title">Management</h2>
                        {/* --- 임시 값을 TerminalStatus로 전달합니다 --- */}
                        <TerminalStatus 
                            podName={podName} 
                            podNamespace={podNamespace} 
                        />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Terminal;

