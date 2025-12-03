import React from "react";
import "../../components/styles/ServerPage.css";
import "./ServerList.css";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaPlus, FaDesktop, FaServer } from "react-icons/fa";

const ServerList = ({ servers, onDelete, onAccess }) => {
  const navigate = useNavigate();

  const formatDate = (isoString) => {
    if (!isoString) return "-";
    try {
      const d = new Date(isoString);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    } catch {
      return isoString;
    }
  };

  return (
    <div className="server-grid">
      {/* 1. 새 서버 생성 카드 */}
      <div className="server-card add-card" onClick={() => navigate("/createserver")}>
        <div className="add-icon-wrapper"><FaPlus /></div>
        <span className="add-text">새 서버 생성</span>
      </div>

      {/* 2. 서버 목록 카드 */}
      {servers.map((server, index) => {
        const name = server.serverName || server.podName || `server-${index}`;
        const namespace = server.podNamespace || "default";
        // OS 기본값 수정 (요청사항 반영)
        const os = server.os || "Ubuntu 22.04"; 
        const status = (server.status || "Stopped").toUpperCase();
        const created = server.createdAt || server.created;
        const statusClass = status === "RUNNING" ? "status-running" : "status-stopped";

        return (
          <div className="server-card" key={index}>
            {/* 헤더: 상태 뱃지와 삭제 버튼 */}
            <div className="card-header">
              <span className={`status-badge ${statusClass}`}>{status}</span>
              
              {/* ✨ 삭제 버튼: 빨간색 아이콘, 우측 상단 배치 */}
              <button
                className="trash-btn-styled"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(server); // 부모에게 삭제 요청 (모달 띄우기용)
                }}
                title="서버 삭제"
              >
                <FaTrash />
              </button>
            </div>

            {/* 본문 */}
            <div className="card-body">
              <div className="server-icon-area">
                <FaDesktop className="server-main-icon" />
              </div>
              
              <div className="server-details">
                <div className="detail-row">
                  <span className="label">Name:</span>
                  <span className="value bold">{name}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Namespace:</span>
                  <span className="value">{namespace}</span>
                </div>
                <div className="detail-row">
                  <span className="label">OS:</span>
                  <span className="value">{os}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Created:</span>
                  <span className="value">{formatDate(created)}</span>
                </div>
              </div>
            </div>

            {/* 푸터: 접속 버튼 */}
            <div className="card-footer">
              <button className="access-btn" onClick={() => onAccess?.(server)}>
                접속하기
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ServerList;