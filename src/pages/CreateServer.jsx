// src/pages/CreateServer.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/styles/CreateServer.css";
import axiosInstance from "../utils/axiosInstance";
import { FaUbuntu, FaLinux, FaWindows, FaApple } from "react-icons/fa";
import UserTierBadge from "../components/Server/UserTierBadge";

const CreateServer = ({ showToast }) => {
  console.log("[CreateServer] 컴포넌트 마운트됨");
  const navigate = useNavigate();

  // --- 1. 상태 관리 ---
  const [tier, setTier] = useState(null);
  const [maxServerCount, setMaxServerCount] = useState(0);
  const [currentServerCount, setCurrentServerCount] = useState(0);
  const [osOptions, setOsOptions] = useState([]); // 백엔드 or 기본값

  const [selectedOs, setSelectedOs] = useState(null);      // "ubuntu" 같은 문자열
  const [selectedVersion, setSelectedVersion] = useState("");// "22.04" 등
  const [serverName, setServerName] = useState("");         // 서버 이름

  const [isLoading, setIsLoading] = useState(false);        // 생성 요청 로딩
  const [isOptionsLoading, setIsOptionsLoading] = useState(true); // 옵션 조회 로딩

  // --- 2. (백업용) 임시 OS 옵션 ---
  const defaultOsOptions = [
    {
      os: "ubuntu",
      displayName: "Ubuntu",
      versions: ["22.04"],
    },
    {
      os: "windows",
      displayName: "Windows",
      versions: ["Server 2022", "Server 2019", "Windows 10 Pro"],
    },
    {
      os: "macos",
      displayName: "macOS",
      versions: ["Sonoma 14", "Ventura 13", "Monterey 12"],
    },
    {
      os: "centos",
      displayName: "CentOS",
      versions: ["Stream 9", "Stream 8", "7"],
    },
  ];

  // --- 3. 페이지 진입 시 옵션 및 티어 정보 조회 ---
  useEffect(() => {
    const fetchOptions = async () => {
      setIsOptionsLoading(true);
      try {
        const res = await axiosInstance.get("/api/container/os-options");
        const data = res.data;

        if (data) {
          setTier(data.tier);
          setMaxServerCount(data.maxServerCount);
          setCurrentServerCount(data.currentServerCount);

          const fetchedOsList =
            data.osList && data.osList.length > 0
              ? data.osList
              : defaultOsOptions;

          setOsOptions(fetchedOsList);
        }
      } catch (err) {
        console.error("옵션 조회 실패:", err);
        setOsOptions(defaultOsOptions);
      } finally {
        setIsOptionsLoading(false);
      }
    };

    fetchOptions();
  }, [showToast]);

  // --- 4. OS 선택 변경 시 버전 초기화 / 고정 ---
  useEffect(() => {
    if (!selectedOs) {
      setSelectedVersion("");
      return;
    }

    const currentOsData = osOptions.find((item) => item.os === selectedOs);

    if (currentOsData) {
      // Ubuntu는 22.04 고정
      if (selectedOs.toLowerCase() === "ubuntu") {
        setSelectedVersion("22.04");
      } else if (
        currentOsData.versions &&
        !currentOsData.versions.includes(selectedVersion)
      ) {
        // 다른 OS로 변경 시 기존 버전이 리스트에 없으면 초기화
        setSelectedVersion("");
      }
    }
  }, [selectedOs, osOptions]);

  // --- 5. 서버 생성 요청 ---
  const handleCreate = async () => {
    if (!selectedOs || !selectedVersion) {
      showToast?.("운영체제와 버전을 선택해주세요.", "warning");
      return;
    }

    if (!serverName.trim()) {
      showToast?.("서버 이름을 입력해주세요.", "warning");
      return;
    }

    if (maxServerCount !== -1 && currentServerCount >= maxServerCount) {
      showToast?.(
        `현재 티어에서는 서버를 ${maxServerCount}개까지만 생성할 수 있습니다.`,
        "error"
      );
      return;
    }

    const payload = {
      os: selectedOs,
      version: selectedVersion,
      serverName: serverName,
    };

    setIsLoading(true);

    try {
      const response = await axiosInstance.post(
        "/api/container/create",
        payload
      );

      // 응답에서 여러 이름으로 올 수 있는 필드를 한 번에 구조분해
      const {
        presignedUrl,
        preSignedUrl,
        url,
        podName,
        podNamespace,
      } = response.data;

      // fallback: 어떤 키로 와도 finalUrl에 담기게 처리
      const finalUrl = presignedUrl || preSignedUrl || url;

      if (!finalUrl) {
        throw new Error("접속 URL을 받지 못했습니다.");
      }

      showToast?.("서버가 생성되었습니다. 터미널로 이동합니다.", "success");

      navigate("/terminal", {
        state: {
          presignedUrl: finalUrl,
          podName: podName || serverName,
          podNamespace,
        },
      });
    } catch (error) {
      console.error("서버 생성 실패:", error);
      const msg =
        error.response?.data?.message ||
        "서버 생성 중 오류가 발생했습니다.";
      showToast?.(msg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // --- 6. OS 아이콘 선택 ---
  const getOsIcon = (osName) => {
    const name = osName.toLowerCase();
    if (name.includes("ubuntu")) return <FaUbuntu size={40} color="#E95420" />;
    if (name.includes("windows")) return <FaWindows size={40} color="#0078D6" />;
    if (name.includes("mac") || name.includes("apple"))
      return <FaApple size={40} color="#555" />;
    if (name.includes("cent") || name.includes("linux"))
      return <FaLinux size={40} color="#FCC624" />;
    return <FaLinux size={40} />;
  };

  // --- 7. 옵션 로딩 중 화면 ---
  if (isOptionsLoading) {
    return (
      <div className="create-server-page">
        <div
          className="form-card"
          style={{ textAlign: "center", padding: "100px 0" }}
        >
          <div className="server-loading-spinner"></div>
          <p>서버 생성 옵션을 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  // --- 8. 실제 화면 렌더링 ---
  return (
    <div className="create-server-page">
      <div className="form-card">
        <div className="title-row">
          <h1 className="title">새 서버 생성</h1>
          {UserTierBadge && tier && (
            <UserTierBadge
              tier={tier}
              current={currentServerCount}
              max={maxServerCount}
            />
          )}
        </div>

        <p className="subtitle">
          몇 단계만으로 간단하게 나만의 개발 환경을 구축하세요.
        </p>

        {/* 1. 운영체제 선택 */}
        <div className="form-section">
          <h2 className="section-title">1. 운영체제(OS) 선택</h2>
          <div className="os-grid">
            {osOptions.map((option) => (
              <div
                key={option.os}
                className={`os-card ${
                  selectedOs === option.os ? "active" : ""
                }`}
                onClick={() => setSelectedOs(option.os)}
              >
                <div className="os-icon">
                  {getOsIcon(option.displayName || option.os)}
                </div>
                <span className="os-name">
                  {option.displayName || option.os}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. 버전 선택 */}
        <div className="form-section version-section">
          <h2 className="section-title">2. 버전 선택</h2>
          <select
            className="version-select"
            value={selectedVersion}
            onChange={(e) => setSelectedVersion(e.target.value)}
            disabled={!selectedOs || selectedOs.toLowerCase() === "ubuntu"}
            style={{
              backgroundColor:
                !selectedOs || selectedOs.toLowerCase() === "ubuntu"
                  ? "#f5f5f5"
                  : "white",
              color:
                !selectedOs || selectedOs.toLowerCase() === "ubuntu"
                  ? "#999"
                  : "#333",
            }}
          >
            {!selectedOs && (
              <option value="">운영체제를 먼저 선택해주세요</option>
            )}

            {selectedOs && selectedOs.toLowerCase() === "ubuntu" ? (
              <option value="22.04">22.04 (고정)</option>
            ) : (
              <>
                <option value="" disabled>
                  버전을 선택하세요
                </option>
                {osOptions
                  .find((o) => o.os === selectedOs)
                  ?.versions.map((ver) => (
                    <option key={ver} value={ver}>
                      {ver}
                    </option>
                  ))}
              </>
            )}
          </select>
        </div>

        {/* 3. 서버 이름 입력 */}
        <div className="form-section">
          <h2 className="section-title">3. 서버 이름</h2>
          <input
            className="server-name-input"
            type="text"
            placeholder="예: my-dev-server"
            value={serverName}
            onChange={(e) => setServerName(e.target.value)}
          />
        </div>

        {/* 버튼 그룹 */}
        <div className="button-group">
          <button
            className="cancel-btn"
            onClick={() => navigate("/serverpage")}
            disabled={isLoading}
          >
            취소
          </button>
          <button
            className="create-btn"
            onClick={handleCreate}
            disabled={
              isLoading ||
              !selectedOs ||
              !selectedVersion ||
              !serverName.trim()
            }
          >
            {isLoading ? "생성 중..." : "서버 생성"}
          </button>
        </div>
      </div>

      {/* 서버 생성 로딩 오버레이 */}
      {isLoading && (
        <div className="server-loading-overlay">
          <div className="server-loading-spinner"></div>
          <p>서버를 생성하고 있습니다. 잠시만 기다려주세요...</p>
        </div>
      )}
    </div>
  );
};

export default CreateServer;