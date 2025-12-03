// src/pages/ServerPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Nav/Navbar";
import "../components/styles/ServerPage.css";
import axiosInstance from "../utils/axiosInstance";
import ServerList from "../components/Server/ServerList";
import DeleteServer from "./DeleteServer";

const ServerPage = ({ showToast }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);      // optional
  const [servers, setServers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // (선택) localStorage 에서 유저 정보 복구
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        // 내 pod 목록 불러오기
        const serversRes = await axiosInstance.get("/api/container/pods");
        setServers(serversRes.data.servers || []);
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
        (s) => s.podNamespace !== podNamespace || s.podName !== podName
      )
    );
    handleCloseDeleteModal();
  };

  const handleAccessServer = async (server) => {
    try {
      showToast?.("터미널 접속 정보를 요청 중입니다…", "info");

      const res = await axiosInstance.post("/api/container/access", {
        podName: server.podName,
        podNamespace: server.podNamespace,
      });

      const preSignedUrl =
        res.data?.preSignedUrl || res.data?.presignedUrl || res.data?.url;

      if (!preSignedUrl) {
        throw new Error("preSignedUrl을 받지 못했습니다.");
      }

      navigate("/terminal", {
        state: {
          presignedUrl: preSignedUrl,
          podName: server.podName,
          podNamespace: server.podNamespace,
        },
      });
    } catch (err) {
      console.error("[ServerPage] handleAccessServer error", err);
      showToast?.("터미널 접속 정보를 가져오지 못했습니다.", "error");
    }
  };

  // ❗이제는 user 여부와 상관없이 isLoading 만 체크
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
          {servers.length === 0 ? (
            <div className="server-empty-card">
              <p>현재 생성된 서버가 없습니다.</p>
              <button
                className="server-empty-create-btn"
                onClick={handleGoToCreatePage}
              >
                첫 서버 만들기
              </button>
            </div>
          ) : (
            <ServerList
              servers={servers}
              onDelete={handleOpenDeleteModal}
              onAccess={handleAccessServer}
            />
          )}
        </section>
      </main>

      {showDeleteModal && deleteTarget && (
        <DeleteServer
          podNamespace={deleteTarget.podNamespace}
          podName={deleteTarget.podName}
          onClose={handleCloseDeleteModal}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
};

export default ServerPage;