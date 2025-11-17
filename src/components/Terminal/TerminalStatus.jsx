// // TerminalStatus.jsx
// import React, { useEffect, useState } from "react";
// import axiosInstance from '../../utils/axiosInstance';
// // --- config.js에서 VM_URL을 가져오는 import 구문을 추가합니다! ---
// import { VM_URL } from '../../config';
// import "./TerminalStatus.css";

// // --- props (podName, podNamespace)는 받지만 임시 테스트 중에는 사용하지 않음 ---
// const TerminalStatus = ({ podName, podNamespace }) => {
//     const [stats, setStats] = useState({
//         cpu: 0,
//         memory: 0,
//         uplink: 0,
//         downlink: 0,
//     });

//     useEffect(() => {
//         // --- props 유효성 검사는 임시 테스트 중에는 주석 처리 ---
//         // if (!podName || !podNamespace) { ... }

//         const interval = setInterval(() => {
//             // --- 이제 VM_URL 변수를 정상적으로 사용할 수 있습니다 ---
//             axiosInstance
//                 .get(`${VM_URL}/api/monitor/pod`, {
//                     params: {
//                         podNamespace : "default",
//                         podName: "pod-5f164071",
//                     },
//                 })
//                 .then((res) => setStats(res.data))
//                 .catch((err) => {
//                     // console.warn(`모니터링 실패:`, err.message);
//                 });
//         }, 2000);

//         return () => clearInterval(interval);

//     }, []);

//     return (
//         <div className="status-container">
//             <div className="status-box">
//                 <h3>💻 CPU</h3>
//                 <p>{stats.cpu ? stats.cpu.toFixed(2) : 0}%</p>
//             </div>
//             <div className="status-box">
//                 <h3>🧠 Memory</h3>
//                 <p>{stats.memory ? stats.memory.toFixed(2) : 0}%</p>
//             </div>
//         </div>
//     );
// };

// export default TerminalStatus;



import React, { useState } from "react"; // useEffect, axiosInstance, VM_URL 제거
import "./TerminalStatus.css";

// props (podName, podNamespace)는 더 이상 필요 없으므로 제거해도 됩니다 (선택 사항)
const TerminalStatus = ({ podName, podNamespace }) => {
    // --- ✨ useState의 초기값을 원하는 고정값으로 설정 ---
    const [stats, setStats] = useState({
        cpu: 12,    // CPU 12%
        memory: 15,   // Memory 15%
        // uplink, downlink은 제거하거나 0으로 유지
        uplink: 0, 
        downlink: 0,
    });

    // --- ✨ useEffect와 API 호출 로직 전체 제거 ---
    // useEffect(() => { ... }, []); 

    return (
        <div className="status-container">
            <div className="status-box">
                <h3>💻 CPU</h3> 
                {/* stats 상태값을 직접 사용 */}
                <p>{stats.cpu.toFixed(2)}%</p> 
            </div>
            <div className="status-box">
                <h3>🧠 Memory</h3>
                 {/* stats 상태값을 직접 사용 */}
                <p>{stats.memory.toFixed(2)}%</p>
            </div>
            {/* --- Uplink, Downlink 박스는 제거 --- */}
            {/* <div className="status-box"> ... </div> */}
            {/* <div className="status-box"> ... </div> */}
        </div>
    );
};

export default TerminalStatus;