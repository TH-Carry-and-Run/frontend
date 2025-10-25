import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// ✨ CSS 경로는 그대로 유지합니다.
import '../components/styles/CreateServer.css'; 
// import ServerLoading from "../components/Server/ServerLoading.jsx"; // ✨ 여기서 로딩을 직접 보여주지 않으므로 주석 처리
import axiosInstance from '../utils/axiosInstance'; // axiosInstance는 여전히 필요할 수 있으므로 유지 (혹은 나중에 ServerLoading으로 옮김)
import { FaUbuntu, FaWindows, FaApple, FaLinux } from 'react-icons/fa';

const osOptions = [
    { name: "Ubuntu", icon: <FaUbuntu />, versions: ["22.04"] },
    { name: "Windows", icon: <FaWindows />, versions: ["Server 2022", "Server 2019"] },
    { name: "macOS", icon: <FaApple />, versions: ["Monterey", "Ventura"] },
    { name: "CentOS", icon: <FaLinux />, versions: ["7", "8 Stream"] },
];

const CreateServer = ({ showToast }) => {
    const navigate = useNavigate();
    const [selectedOs, setSelectedOs] = useState(null);
    const [selectedVersion, setSelectedVersion] = useState("");
    // const [isLoading, setIsLoading] = useState(false); // ✨ 로딩 상태 제거

    useEffect(() => {
        if (selectedOs === "Ubuntu") {
            setSelectedVersion("22.04");
        } else {
             const currentOs = osOptions.find(os => os.name === selectedOs);
             if (currentOs && currentOs.versions.length > 0 && !currentOs.versions.includes(selectedVersion)) {
                 setSelectedVersion(""); 
             }
        }
    }, [selectedOs, selectedVersion]);

    const handleCreate = () => { // ✨ async 제거
        // --- 1. 입력값 유효성 검사 (기존과 동일) ---
        if (!selectedOs || !selectedVersion) {
            showToast("운영체제와 버전을 선택해주세요.", "warning");
            return;
        }

        // --- ✨ 2. setIsLoading(true) 코드 삭제 ---

        // --- ✨ 3. API 요청 payload 준비 (이 정보는 로딩 페이지로 전달) ---
        const creationData = { 
            os: selectedOs, 
            version: selectedVersion 
        };

        // --- ✨ 4. API 호출 로직(try...catch 블록) 전체 삭제 ---

        // --- ✨ 5. '/server-loading' 경로로 이동하고, 생성 정보(creationData)를 state로 전달합니다. ---
        // '/server-loading'은 App.jsx에서 ServerLoading 컴포넌트와 연결될 경로입니다.
        navigate("/server-loading", { state: { serverData: creationData } }); 
    };

    // --- ✨ 6. if (isLoading) { ... } 블록 전체 삭제 ---

    // 서버 생성 폼 UI 렌더링 부분 (항상 폼을 보여줌)
    return (
        <div className="create-server-page">
            <div className="form-card">
                <h1 className="title">새 서버 생성</h1>
                <p className="subtitle">몇 단계만으로 간단하게 나만의 개발 환경을 구축하세요.</p>

                <div className="form-section">
                    <h2 className="section-title">1. 운영체제(OS) 선택</h2> 
                    <div className="os-grid">
                        {osOptions.map((os) => (
                            <div
                                key={os.name}
                                className={`os-card ${selectedOs === os.name ? "active" : ""}`}
                                onClick={() => {
                                    setSelectedOs(os.name);
                                    if (os.name !== "Ubuntu") {
                                        setSelectedVersion(""); 
                                    }
                                }}
                            >
                                <div className="os-icon">{os.icon}</div>
                                <span className="os-name">{os.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
                
                {selectedOs && (
                    <div className="form-section version-section">
                        <h2 className="section-title">2. 버전 선택</h2>
                        <select
                            className="version-select"
                            value={selectedVersion}
                            onChange={(e) => setSelectedVersion(e.target.value)}
                            disabled={selectedOs === "Ubuntu"}
                        >
                            <option value="" disabled={selectedOs !== 'Ubuntu'}>
                                {selectedOs === 'Ubuntu' ? '22.04 (고정)' : '버전을 선택하세요'}
                            </option>
                            {selectedOs !== 'Ubuntu' && 
                             osOptions.find(os => os.name === selectedOs)?.versions.map(v => (
                                <option key={v} value={v}>{v}</option>
                             ))
                            }
                        </select>
                    </div>
                )}

                <div className="button-group">
                    <button className="cancel-btn" onClick={() => navigate("/serverpage")}>취소</button>
                    <button 
                        className="create-btn" 
                        onClick={handleCreate}
                        disabled={!selectedOs || !selectedVersion} 
                    >
                        서버 생성
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateServer;