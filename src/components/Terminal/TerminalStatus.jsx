import React, { useEffect, useState } from "react";
import axiosInstance from '../../utils/axiosInstance'; 
import "./TerminalStatus.css";

// --- props (podName, podNamespace)는 받지만 임시 테스트 중에는 사용하지 않음 ---
const TerminalStatus = ({ podName, podNamespace }) => {
    const [stats, setStats] = useState({
        cpu: 0,
        memory: 0,
        uplink: 0,
        downlink: 0,
    });

    useEffect(() => {
        // --- props 유효성 검사는 임시 테스트 중에는 주석 처리 ---
        // if (!podName || !podNamespace) {
        //     console.warn("TerminalStatus: podName 또는 podNamespace가 전달되지 않았습니다.");
        //     return; 
        // }

        const interval = setInterval(() => {
            axiosInstance
                // --- 임시 API 엔드포인트 사용 (baseURL은 axiosInstance에 설정) ---
                .get("/api/monitor/pod", { 
                    params: {
                        // --- ✨ VM 팀원이 준 임시 값 사용 ---
                        podNamespace : "default", // 임시 값
                        podName: "pod-5f164071",   // 임시 값       
                    },
                })
                .then((res) => setStats(res.data))
                .catch((err) => {
                    console.warn("모니터링 실패:", err.message); 
                });
        // --- 요청 간격: 2초 ---
        }, 2000); 

        // 컴포넌트 언마운트 시 interval 정리
        return () => clearInterval(interval);
        
    // --- 의존성 배열에서 props 제거 (임시 테스트) ---
    }, []); 

    return (
        <div className="status-container">
            <div className="status-box">
                <h3>💻 CPU</h3> 
                <p>{stats.cpu.toFixed(2)}%</p>
            </div>
            <div className="status-box">
                <h3>🧠 Memory</h3>
                <p>{stats.memory.toFixed(2)}%</p>
            </div>
        </div>
    );
};

export default TerminalStatus;