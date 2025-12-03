// src/components/Server/ServerList.jsx
import React from "react";
import "../../components/styles/ServerPage.css";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaPlus } from "react-icons/fa";

const ServerList = ({ servers, onDelete, onAccess }) => {
  const navigate = useNavigate();

  const formatDate = (isoString) => {
    if (!isoString) return "-";
    const d = new Date(isoString);
    const MM = String(d.getMonth() + 1).padStart(2, "0");
    const DD = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${d.getFullYear()}-${MM}-${DD} ${hh}:${mm}`;
  };

  return (
    <div className="server-grid">
      {/* + 카드 (새 서버 생성으로 이동) */}
      <div
        className="server-card add-card"
        onClick={() => navigate("/createserver")}
      >
        <FaPlus />
      </div>

      {servers.map((server, index) => {
        const name = server.serverName || server.podName || `server-${index}`;
        const created =
          server.createdAt || server.created || server.creationTimestamp;
        const status = (server.status || "").toLowerCase();

        return (
          <div className="server-card" key={`${server.podNamespace}-${server.podName}-${index}`}>
            <button
              className="trash-btn"
              onClick={() => onDelete?.(server)}
              title="서버 삭제"
            >
              <FaTrash />
            </button>

            <div className="server-info">
              <div className="server-title">{name}</div>
              <div>Namespace: {server.podNamespace}</div>
              <div>Pod: {server.podName}</div>
              <div>OS: {server.os || "-"}</div>
              <div>Status: {status || "-"}</div>
              <div>Version: {server.version || "-"}</div>
              <div>Created: {formatDate(created)}</div>
            </div>

            <button
              className="access-btn"
              onClick={() => onAccess?.(server)}
            >
              접속하기
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ServerList;