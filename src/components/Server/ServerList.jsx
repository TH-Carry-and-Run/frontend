import React from "react";
import "../../components/styles/ServerPage.css";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaPlus } from "react-icons/fa";


const ServerList = ({ servers, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="server-grid">
      {/* + 버튼 카드 */}
      <div className="server-card add-card" onClick={() => navigate("/create-server")}>
        <FaPlus />
      </div>

      {/* 실제 서버 카드들 */}
      {servers.map((server, index) => (
        <div className="server-card" key={index}>
          <button className="trash-btn" onClick={() => onDelete(server.id)}>
            <FaTrash />
          </button>
          <div className="server-info">
            <div className="server-title">{server.name}</div>
            <div>Status: {server.status}</div>
            <div>TTL: {server.ttl}</div>
            <div>OS: {server.os}</div>
            <div>Version: {server.version}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServerList;

