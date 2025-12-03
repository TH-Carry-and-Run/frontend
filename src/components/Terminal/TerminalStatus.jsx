import React, { useEffect, useState } from "react";
import axios from "axios"; 
import "./TerminalStatus.css";

const TerminalStatus = () => {
    const [stats, setStats] = useState({
        cpu: 0,
        memory: 0
    });

    // --- [설정] TerminalBash와 동일하게 하드코딩 (테스트용) ---
    // 팀원이 준 모니터링 주소
    const MONITOR_API_URL = "http://3.39.199.192:8080/api/monitor/pod";
    
    // TerminalBash에 있는 값과 동일하게 설정
    const POD_NAME = 'pod-92f9dcfa';
    const POD_NAMESPACE = 'default';

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                // GET http://3.39.199.192:8080/api/monitor/pod?podName=...&podNamespace=...
                const res = await axios.get(MONITOR_API_URL, {
                    params: {
                        podName: POD_NAME,
                        podNamespace: POD_NAMESPACE,
                    },
                    timeout: 2000 // 2초 안에 응답 안 오면 끊기
                });
                
                // 데이터 확인용 로그 (확인 후 주석 처리하세요)
                console.log("[Status API 응답]", res.data);

                setStats({
                    cpu: res.data.cpu || 0,
                    memory: res.data.memory || 0
                });
            } catch (err) {
                console.error(`[Status Error] 상태 조회 실패:`, err);
            }
        };

        // 1. 시작하자마자 1회 실행
        fetchStatus();

        // 2. 1초(1000ms)마다 반복 실행
        const interval = setInterval(fetchStatus, 1000);

        // 3. 컴포넌트가 꺼질 때 반복 중단
        return () => clearInterval(interval);

    }, []); // 빈 배열: 컴포넌트가 처음 나타날 때 한 번만 실행 (내부 interval이 계속 돔)

    return (
        <div className="status-container">
            <div className="status-box">
                <h3>💻 CPU</h3>
                <p>{Number(stats.cpu).toFixed(2)}%</p>
            </div>
            <div className="status-box">
                <h3>🧠 Memory</h3>
                <p>{Number(stats.memory).toFixed(2)}%</p>
            </div>
        </div>
    );
};

export default TerminalStatus;