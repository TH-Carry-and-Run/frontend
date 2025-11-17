// src/pages/CreateServer.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../components/styles/CreateServer.css';
import axiosInstance from '../utils/axiosInstance';
import { FaUbuntu, FaWindows, FaApple, FaLinux } from 'react-icons/fa';

const osOptions = [
  { name: "Ubuntu", icon: <FaUbuntu />, versions: ["22.04"] },
  { name: "Windows", icon: <FaWindows />, versions: ["Server 2022", "Server 2019"] },
  { name: "macOS", icon: <FaApple />, versions: ["Monterey", "Ventura"] },
  { name: "CentOS", icon: <FaLinux />, versions: ["7", "8 Stream"] },
];

const CreateServer = ({ showToast }) => {
  console.log("[CreateServer] 컴포넌트 마운트됨");
  const navigate = useNavigate();
  const [selectedOs, setSelectedOs] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState("");
  const [isLoading, setIsLoading] = useState(false);   // 로딩 상태 추가

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

  // 서버 생성 + presignedUrl 받기 + 터미널 이동까지 한 번에
  const handleCreate = async () => {
    console.log("[CreateServer] handleCreate 호출");
    if (!selectedOs || !selectedVersion) {
      showToast("운영체제와 버전을 선택해주세요.", "warning");
      return;
    }

    const payload = {
      os: selectedOs,
      version: selectedVersion,
    };

    try {
      setIsLoading(true);
      showToast("서버 생성 요청 중입니다…", "info");
      console.log("[CreateServer] handleCreate 호출됨");
      console.log("[CreateServer] payload >", payload);

      const res = await axiosInstance.post("/api/container/create", payload);
      console.log("[CreateServer] response.data >", res.data);

      // Swagger 기준: { "preSignedUrl": "...", "message": "..." }
      const preSignedUrl = res.data?.preSignedUrl || res.data?.presignedUrl;
      console.log("[CreateServer] 요청 성공, full response >", res);
      console.log("[CreateServer] response.data >", res.data);

      if (!preSignedUrl) {
        console.error("[CreateServer] preSignedUrl 없음, res.data >", res.data);
        throw new Error("preSignedUrl을 받지 못했습니다.");
      }


      showToast("웹 터미널로 연결 중…", "success");

      navigate("/terminal", {
        state: {
          presignedUrl: preSignedUrl,
          // 나중에 podName, podNamespace 나오면 여기에 추가
          podName: res.data?.podName,
          podNamespace: res.data?.podNamespace,
        },
      });
    } catch (err) {
      console.error("[CreateServer] 서버 생성 실패 (catch 안으로 들어옴)", err);
      const rawMsg =
        err.response?.data?.message ||
        err.message ||
        "서버 생성 중 오류가 발생했습니다.";

      // IP, URL 마스킹
      let s = String(rawMsg);
      s = s.replace(/\b\d{1,3}(\.\d{1,3}){3}\b(:\d+)?/g, "[IP 숨김]");
      s = s.replace(/\bhttps?:\/\/[^\s/]+/gi, "[URL 숨김]");

      showToast(`서버 생성 실패: ${s}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

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
                  if (os.name !== "Ubuntu") setSelectedVersion("");
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
            disabled={!selectedOs || !selectedVersion || isLoading}
          >
            {isLoading ? "생성 중..." : "서버 생성"}
          </button>
        </div>
      </div>

      {/* 🔹 전체 화면 로딩 오버레이 (원하면) */}
      {isLoading && (
        <div className="server-loading-overlay">
          <div className="server-loading-spinner"></div>
          <p>서버를 생성 중입니다...</p>
        </div>
      )}
    </div>
  );
};

export default CreateServer;
