//ServerList.jsx
import React from "react";
import "../../components/styles/ServerPage.css";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaPlus } from "react-icons/fa";


const ServerList = ({ servers, onDelete, ServerAccess }) => {
  const navigate = useNavigate();

    // 날짜 포맷 함수 (예: ISO 문자열 → YYYY-MM-DD HH:mm)
    const formatDate = (isoString) => {
      if (!isoString) return "-";
      const d = new Date(isoString);
      const MM = String(d.getMonth() + 1).padStart(2, '0');
      const DD = String(d.getDate()).padStart(2, '0');
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      return `${d.getFullYear()}-${MM}-${DD} ${hh}:${mm}`;
    };


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
            {/* <div>Status: {server.status}</div> */}
            {/* <div>TTL: {server.ttl}</div> */}
            <div>Name: {server.serverName}</div>
            <div>OS: {server.os}</div>
            <div>Version: {server.version}</div>
            <div>Created: {formatDate(server.created)}</div>
            {/* <div>Pod Name: {server.podName}</div>
            <div>Pod Namespace: {server.podNamespace}</div>
            {/* <div>{server.ingressURL}</div> */}
          </div>

          {/* 접속하기 버튼 추가 */}
          <button
            className="access-btn"
            onClick={() => ServerAccess(server)} // 서버 오브젝트 전체 전달
          >
            접속하기
          </button>
        </div>
      ))}
    </div>
  );
};

export default ServerList;

