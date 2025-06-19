// ServerPage.jsx: 서버 메인 대시보드 (서버 생성버튼 -> CreateServerPage.jsx로 이동)

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../components/styles/ServerPage.css';
import ServerHeader from "../components/Server/ServerHeader";
import ServerSidebar from "../components/Server/ServerSidebar";
import ServerList from "../components/Server/ServerList";
import ServerAccess from "../components/Server/ServerAccess";
import DeleteServer from '../pages/DeleteServer';
// import CreateServerForm from '../components/Server/CreateServerForm';
import axiosInstance from '../utils/axiosInstance';
// import DUMMY_SERVERS from "../utils/dummyServers";


const ServerPage = ({ showToast }) => {
  const navigate = useNavigate();

  // 유저 정보와 서버 목록 상태값
  const [user, setUser] = useState(null); // 유저 정보 (이름, 이메일)
  const [servers, setServers] = useState([]); // 전체 서버 리스트 (서버 오브젝트 배열)

  // 삭제 모달 상태
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

    // useEffect(() => {
    //   setServers(DUMMY_SERVERS);
    // }, []);
  
  
  // 페이지 진입시 유저 정보와 서버 목록을 백엔드에서 fetch
  useEffect(() => {
    // 1) 유저 정보 요청
    axiosInstance.get('/api/users/me')  // 지금 로그인한 사용자의 정보만 조회
      .then(res => {
        setUser(res.data); // name, email 등
        console.log(res.data);
      })
      .catch(err => {
        showToast('유저 정보를 불러오는데 실패했습니다.');
        // 로그인 만료 등 시 로그인 페이지로 보내기
        // navigate('/login');
      });
      
    // 2) 서버 목록 요청
    axiosInstance.get('/api/container/pods')
      .then(res => {
        setServers(res.data.servers); // 서버 오브젝트 배열이 setServers로 들어감
        console.log(res.data.servers);
      })
      .catch(err => {
        showToast('서버 목록을 불러오는데 실패했습니다.');
      });
  //  }, [navigate]);
      }, );

  // 서버 상태별 갯수
  const myServerCount = servers.length;
  const runningCount = servers.filter(server => server.status === 'running').length;
  const stoppedCount = servers.filter(server => server.status === 'stopped').length;

  // + 버튼 클릭 시 CreateServerPage로 이동
  const handleGoToCreatePage = () => {
    navigate("/create-server");
  };

  // 서버 삭제 모달 관련
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

  // user 정보가 로드되기 전에 null일 수 있으므로 안전하게 처리
  if (!user) {
    return <div>Loading...</div>;
  }

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
          </section>

          <div className="my-server">
            <h3>My Servers</h3>
            <ServerList
              servers={servers}
              onDelete={handleOpenDeleteModal}
            />
          </div>
          <div className="management-section">Management</div>
        </div>

        <div className="create-card">
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