// src/component/terminal/TerminalStatus.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TerminalStatus.css"; // ✅ CSS 분리해서 관리

const TerminalStatus = () => {
    const [stats, setStats] = useState({
        cpu: 0,
        memory: 0,
        uplink: 0,
        downlink: 0,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            axios
                .get("http://localhost:8080/api/monitor/pod", {
                    params: {
                        podNamespace : "default",
                        podName: "pod-5f164071", // TODO: 동적 값으로 바꾸기
                    },
                })
                .then((res) => setStats(res.data))
                .catch((err) => console.error("📛 모니터링 실패", err));
        }, 1000);
        console.log(interval);
        // console.log(res);


        return () => clearInterval(interval);
    }, []);

    return (
        <div className="status-container">
            <div className="status-box">
                <h3>💻 CPU</h3>
                <p>{stats.cpu}%</p>
            </div>
            <div className="status-box">
                <h3>🧠 Memory</h3>
                <p>{stats.memory}%</p>
            </div>
            <div className="status-box">
                <h3>📤 Uplink</h3>
                <p>{stats.uplink} MB/s</p>
            </div>
            <div className="status-box">
                <h3>📥 Downlink</h3>
                <p>{stats.downlink} MB/s</p>
            </div>
        </div>
    );
};

export default TerminalStatus;