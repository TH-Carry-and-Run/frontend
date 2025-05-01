// ServerPage.jsx: 서버 메인 대시보드 (서버 생성버튼 -> CreateServerPage.jsx로 이동)

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../components/styles/ServerPage.css';
import ServerHeader from "../components/Server/ServerHeader";
import ServerSidebar from "../components/Server/ServerSidebar";
import ServerList from "../components/Server/ServerList";
import DeleteServer from '../pages/DeleteServer';
import CreateServerForm from '../components/Server/CreateServerForm';

const ServerPage = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: '하나영',
        email: 'hanna@example.com'
      });
    const [servers, setServers] = useState([
        { id: 1, name: 'Server 1', status: 'running' },
        { id: 2, name: 'Server 2', status: 'stopped' }
    ]);

      // 검색어 상태와 검색 결과 상태를 관리하는 useState
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredServers, setFilteredServers] = useState(servers);

    // 검색 기능
    const handleSearch = () => {
        const filtered = servers.filter(server =>
        server.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredServers(filtered); // 필터링된 서버를 상태에 저장
    };

    const myServerCount = servers.length;
    const runningCount = servers.filter(server => server.status === 'running').length;
    const stoppedCount = servers.filter(server => server.status === 'stopped').length;
    
    const [deleteTarget, setDeleteTarget] = useState(null); // 삭제할 서버
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // 새로운 서버 추가
    const handleAddServer = () => {
    const newId = servers.length > 0 ? servers[servers.length - 1].id + 1 : 1;
    const newServer = {
      id: newId,
      name: `Server ${newId}`,
      status: Math.random() > 0.5 ? 'running' : 'stopped'
    };
    setServers((prevServers) => [...prevServers, newServer]);
  };

  // + 버튼 클릭 시 CreateServerPage로 이동
    const handleGoToCreatePage = () => {
        navigate("/create-server");
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
        const updated = servers.filter(
          (s) => s.podNamespace !== podNamespace || s.podName !== podName
        );
        setServers(updated);
        handleCloseDeleteModal();
      };


    return (
    <div className="server-page">
        <ServerHeader />
        {/* <CreateServerForm /> */}

        <div className="layout">
        <ServerSidebar
            name={user.name}
            email={user.email}
            myCount={myServerCount}
            runningCount={runningCount}
            stoppedCount={stoppedCount}
        />
        
        <div className="main-content">
            <h2>Welcome, {user.name}!</h2>

            <section className="content">
            <h2>Total Server</h2>

            {/* 검색창과 검색 버튼 */}
            <div className="search-section">
                <input 
                type="text" 
                placeholder="서버 이름" 
                value={searchTerm} // 검색어 상태
                onChange={(e) => setSearchTerm(e.target.value)} // 검색어 입력값 변경
                />
                <button 
                onClick={handleSearch} 
                className="search-btn">검색</button>
            </div>
            </section>

            <div className="my-server">
            <h3>My Servers</h3>

            {/* 서버 리스트 필터링된 서버 목록 */}
            <ServerList
                servers={filteredServers}  // 필터링된 서버 목록
                onDelete={handleOpenDeleteModal}
            />
            </div>

            <div className="management-section">Management</div>
        </div>

        <div className="create-box">
            <button className="create-server-btn" onClick={handleGoToCreatePage}>
            Create Server
            </button>
        </div>
        </div>

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