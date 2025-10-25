import React from 'react';
import { FaSave, FaRedo, FaSignOutAlt, FaBars } from 'react-icons/fa';
import './TerminalSidebar.css'; // 사이드바 전용 CSS 파일을 import 합니다.

// 부모 컴포넌트(Terminal.jsx)로부터 2개의 props를 받습니다:
// 1. isOpen: 사이드바가 열려있는지 (true/false)
// 2. onToggle: 햄버거 버튼을 클릭했을 때 실행될 함수

const TerminalSidebar = ({ isOpen, onToggle }) => {
    return (
        <aside className={`terminal-sidebar ${isOpen ? 'open' : ''}`}>
            <div className="project-info">
                <FaBars className="menu-icon" onClick={onToggle} />
                <span className="project-name">Name: Project_1</span>
            </div>
            <nav className="sidebar-nav">
                <button className="nav-button">
                    <FaSave className="nav-icon" />
                    <span>Save State</span>
                </button>
                <button className="nav-button">
                    <FaRedo className="nav-icon" />
                    <span>Reboot</span>
                </button>
                <button className="nav-button">
                    <FaSignOutAlt className="nav-icon" />
                    <span>EXIT</span>
                </button>
            </nav>
        </aside>
    );
};

export default TerminalSidebar;