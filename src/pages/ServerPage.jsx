// // ServerPage.jsx: 서버 메인 대시보드 (서버 생성버튼 -> CreateServerPage.jsx로 이동)

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import '../components/styles/ServerPage.css';
// import ServerHeader from "../components/Server/ServerHeader";
// import ServerSidebar from "../components/Server/ServerSidebar";
// import ServerList from "../components/Server/ServerList";
// import ServerAccess from "../components/Server/ServerAccess";
// import DeleteServer from '../pages/DeleteServer';
// // import CreateServerForm from '../components/Server/CreateServerForm';
// import axiosInstance from '../utils/axiosInstance';
// // import DUMMY_SERVERS from "../utils/dummyServers";


// const ServerPage = ({ showToast }) => {
//   const navigate = useNavigate();

//   // 유저 정보와 서버 목록 상태값
//   const [user, setUser] = useState(null); // 유저 정보 (이름, 이메일)
//   const [servers, setServers] = useState([]); // 전체 서버 리스트 (서버 오브젝트 배열)

//   // 삭제 모달 상태
//   const [deleteTarget, setDeleteTarget] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);

//     // useEffect(() => {
//     //   setServers(DUMMY_SERVERS);
//     // }, []);
  
  
//   // 페이지 진입시 유저 정보와 서버 목록을 백엔드에서 fetch
//   useEffect(() => {
//     // 1) 유저 정보 요청
//     axiosInstance.get('/api/users/me')  // 지금 로그인한 사용자의 정보만 조회
//       .then(res => {
//         setUser(res.data); // name, email 등
//         console.log(res.data);
//       })
//       .catch(err => {
//         showToast('유저 정보를 불러오는데 실패했습니다.');
//         // 로그인 만료 등 시 로그인 페이지로 보내기
//         // navigate('/login');
//       });
      
//     // 2) 서버 목록 요청
//     axiosInstance.get('/api/container/pods')
//       .then(res => {
//         setServers(res.data.servers); // 서버 오브젝트 배열이 setServers로 들어감
//         console.log(res.data.servers);
//       })
//       .catch(err => {
//         showToast('서버 목록을 불러오는데 실패했습니다.');
//       });
//   //  }, [navigate]);
//       }, );

//   // 서버 상태별 갯수
//   const myServerCount = servers.length;
//   const runningCount = servers.filter(server => server.status === 'running').length;
//   const stoppedCount = servers.filter(server => server.status === 'stopped').length;

//   // + 버튼 클릭 시 CreateServerPage로 이동
//   const handleGoToCreatePage = () => {
//     navigate("/create-server");
//   };

//   // 서버 삭제 모달 관련
//   const handleOpenDeleteModal = (server) => {
//     setDeleteTarget(server);
//     setShowDeleteModal(true);
//   };

//   const handleCloseDeleteModal = () => {
//     setShowDeleteModal(false);
//     setDeleteTarget(null);
//   };

//   const handleDeleteSuccess = (podNamespace, podName) => {
//     const updated = servers.filter(
//       (s) => s.podNamespace !== podNamespace || s.podName !== podName
//     );
//     setServers(updated);
//     handleCloseDeleteModal();
//   };

//   // user 정보가 로드되기 전에 null일 수 있으므로 안전하게 처리
//   if (!user) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="server-page">
//       <ServerHeader />
//       {/* <CreateServerForm /> */}

//       <div className="layout">
//         <ServerSidebar
//           name={user.name}
//           email={user.email}
//           myCount={myServerCount}
//           runningCount={runningCount}
//           stoppedCount={stoppedCount}
//         />

//         <div className="main-content">
//           <h2>Welcome, {user.name}!</h2>

//           <section className="content">
//             <h2>Total Server</h2>
//           </section>

//           <div className="my-server">
//             <h3>My Servers</h3>
//             <ServerList
//               servers={servers}
//               onDelete={handleOpenDeleteModal}
//             />
//           </div>
//           <div className="management-section">Management</div>
//         </div>

//         <div className="create-card">
//           <button className="create-server-btn" onClick={handleGoToCreatePage}>
//             Create Server
//           </button>
//         </div>
//       </div>

//       {showDeleteModal && deleteTarget && (
//         <DeleteServer
//           podNamespace={deleteTarget.podNamespace}
//           podName={deleteTarget.podName}
//           onClose={handleCloseDeleteModal}
//           onDeleteSuccess={handleDeleteSuccess}
//         />
//       )}
//     </div>
//   );
// };

// export default ServerPage;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../components/styles/ServerPage.css'; // ✨ CSS 경로를 styles 폴더로 가정합니다.
import DeleteServer from '../pages/DeleteServer';
import axiosInstance from '../utils/axiosInstance';
import { FaServer, FaPlay, FaStop, FaPlus, FaTrash } from 'react-icons/fa';

const ServerPage = ({ showToast }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [servers, setServers] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const userPromise = axiosInstance.get('/api/users/me');
        const serversPromise = axiosInstance.get('/api/container/pods');
        
        const [userRes, serversRes] = await Promise.all([userPromise, serversPromise]);

        setUser(userRes.data);
        setServers(serversRes.data.servers || []);
      } catch (err) {
        showToast('데이터를 불러오는 데 실패했습니다.', 'error');
        // navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [showToast]);

  const myServerCount = servers.length;
  const runningCount = servers.filter(server => server.status.toLowerCase() === 'running').length;
  
  const handleGoToCreatePage = () => navigate("/createserver");

  const handleOpenDeleteModal = (server) => {
    setDeleteTarget(server);
    setShowDeleteModal(true);
  };
  
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const handleDeleteSuccess = (podNamespace, podName) => {
    setServers(servers.filter(s => s.podNamespace !== podNamespace || s.podName !== podName));
    handleCloseDeleteModal();
  };

  if (isLoading || !user) {
    // TODO: 더 나은 로딩 스피너 컴포넌트로 교체 가능
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="server-dashboard">
      {/* --- 1. 왼쪽 사이드바 --- */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo">TCAR</h1>
        </div>
        <div className="user-profile">
          <span className="username">{user.name}</span>
          <span className="email">{user.email}</span>
        </div>
        <nav className="sidebar-nav">
          <a href="#my-servers" className="nav-item active">
            <FaServer /> My Servers
          </a>
          {/* 다른 메뉴 아이템 추가 가능 */}
        </nav>
        <div className="server-status-summary">
          <div className="status-item">
            <span>Total Servers</span>
            <span className="count">{myServerCount}</span>
          </div>
          <div className="status-item">
            <span>Running</span>
            <span className="count running">{runningCount}</span>
          </div>
        </div>
      </aside>

      {/* --- 2. 메인 콘텐츠 --- */}
      <main className="main-content">
        <header className="main-header">
          <h2>My Servers</h2>
          <button className="create-server-btn" onClick={handleGoToCreatePage}>
            <FaPlus /> 서버 생성
          </button>
        </header>
        
        <div className="server-list-container">
          {servers.length === 0 ? (
            <div className="no-servers-card" onClick={handleGoToCreatePage}>
              <div className="plus-icon"><FaPlus /></div>
              <p>현재 생성된 서버가 없습니다.</p>
              <span>여기를 클릭하여 첫 서버를 생성해보세요.</span>
            </div>
          ) : (
            <div className="server-grid">
              {servers.map(server => (
                <div key={`${server.podNamespace}-${server.podName}`} className="server-card">
                  <div className="card-header">
                    <span className={`status-dot ${server.status.toLowerCase()}`}></span>
                    <h3 className="server-name">{server.podName}</h3>
                  </div>
                  <div className="server-details">
                    <p><strong>OS:</strong> {server.os}</p>
                    <p><strong>Status:</strong> <span className={`status-text ${server.status.toLowerCase()}`}>{server.status}</span></p>
                    <p><strong>Created:</strong> {new Date(server.createdAt).toLocaleDateString()}</p>
                    {/* <p><strong>TTL:</strong> {server.ttl}</p> */}
                  </div>
                  <div className="card-actions">
                    <button className="action-btn delete" onClick={() => handleOpenDeleteModal(server)}>
                      <FaTrash />
                    </button>
                    {/* TODO: 서버 시작/중지 기능 추가 */}
                    {server.status.toLowerCase() === 'running' ? (
                      <button className="action-btn stop"><FaStop /></button>
                    ) : (
                      <button className="action-btn start"><FaPlay /></button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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