import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Nav/Navbar";
import "../components/styles/ServerPage.css";
import axiosInstance from "../utils/axiosInstance";
import ServerList from "../components/Server/ServerList";
import DeleteServer from "./DeleteServer";

const ServerPage = ({ showToast }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [servers, setServers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        // 서버 목록 조회
        const serversRes = await axiosInstance.get("/api/container/pods");    
        const fetchedData = serversRes.data;
        setServers(Array.isArray(fetchedData) ? fetchedData : []);

      } catch (err) {
        console.error("[ServerPage] fetch error", err);
        showToast?.("데이터를 불러오는 데 실패했습니다.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [showToast]);

  const handleGoToCreatePage = () => {
    navigate("/createserver");
  };

  const handleOpenDeleteModal = (server) => {
    setDeleteTarget(server);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const handleDeleteSuccess = (podNamespace, podName) => {
    setServers((prev) =>
      prev.filter(
        (s) => (s.podNamespace || s.namespace) !== podNamespace || s.podName !== podName
      )
    );
    handleCloseDeleteModal();
  };

  // --- 🛠️ [핵심 수정] 접속하기 버튼 클릭 로직 ---
  const handleAccessServer = async (server) => {
    try {
      showToast?.("터미널 접속 정보를 요청 중입니다…", "info");

      // 1. 네임스페이스 추출
      const targetNamespace = server.podNamespace || server.namespace || "default";

      // 2. [중요] API 명세서(image_ac7227.png)에 있는 '모든 필드'를 채워서 보냅니다.
      // 값이 없으면 빈 문자열("")이나 기본값을 넣어줘야 400 에러가 안 납니다.
      const requestBody = {
        podNamespace: targetNamespace,
        podName: server.podName,
        ingressURL: server.ingressUrl || "",        // 명세서: ingressURL
        OS: server.os || "Ubuntu 22.04",            // 명세서: OS
        Version: server.version || "Latest",        // 명세서: Version
        Created: server.createdAt || server.created || "", // 명세서: Created
        ServerName: server.serverName || server.podName // 명세서: ServerName
      };

      console.log("접속 요청 데이터(Payload):", requestBody);

      // 3. POST 요청 전송
      const res = await axiosInstance.post("/api/container/presign", requestBody);

      // 4. 응답에서 URL 추출
      const preSignedUrl =
        res.data?.preSignedUrl || res.data?.presignedUrl || res.data?.url;

      if (!preSignedUrl) {
        throw new Error("preSignedUrl을 받지 못했습니다.");
      }

      // 5. 터미널로 이동
      navigate("/terminal", {
        state: {
          presignedUrl: preSignedUrl,
          podName: server.podName,
          podNamespace: targetNamespace,
        },
      });
    } catch (err) {
      console.error("[ServerPage] 접속 요청 실패:", err);
      const errMsg = err.response?.data?.message || "터미널 접속 정보를 가져오지 못했습니다.";
      showToast?.(errMsg, "error");
    }
  };

  if (isLoading) {
    return (
      <div className="server-page-loading">
        <Navbar />
        <div className="server-page-loading-body">Loading...</div>
      </div>
    );
  }

  return (
    <div className="server-page-root">
      <Navbar />

      <main className="server-page-main">
        <header className="server-page-header">
          <div>
            <h1 className="server-page-title">My Servers</h1>
            <p className="server-page-subtitle">
              {(user?.name || "사용자")} 님이 생성한 서버 목록입니다.
            </p>
          </div>
          <button
            className="server-page-create-btn"
            onClick={handleGoToCreatePage}
          >
            새 서버 생성
          </button>
        </header>

        <section className="server-page-list-section">
          <ServerList
            servers={servers}
            onDelete={handleOpenDeleteModal}
            onAccess={handleAccessServer}
          />
        </section>
      </main>

      {showDeleteModal && deleteTarget && (
        <DeleteServer
          podNamespace={deleteTarget.podNamespace || deleteTarget.namespace} 
          podName={deleteTarget.podName}
          onClose={handleCloseDeleteModal}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
};

export default ServerPage;