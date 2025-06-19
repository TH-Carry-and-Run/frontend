import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Toast from "./components/Toast/Toast";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Mainpage from "./pages/Mainpage";
import CreateServer from './pages/CreateServer';
import ServerPage from './pages/ServerPage';
import CreateServerForm from './components/Server/CreateServerForm';
import ServerIDE from './components/Server/ServerIDE';
import DeleteServer from "./pages/DeleteServer";
import ProtectedRoute from "./components/Nav/ProtectedRoute";
import './components/styles/Mainpage.css';


function App () {
  // const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
  const [toast, setToast] = useState({ message: "", show: false });

  // 토스트 띄우는 함수
  const showToast = (message) => {
    setToast({ message, show: true });
    setTimeout(() => setToast({ message: "", show: false }), 10000);
  };

  return (
    <Router>
      <Toast message={toast.message} show={toast.show} />
      <Routes>
        {/* 기본 루트("/")로 들어오면 something 페이지로 이동 */}
        <Route path="/" element={<Navigate to="/mainpage" />} />

        {/* 인증 없이 접근 가능한 페이지들 */}
        <Route path="/signup" element={<Signup showToast={showToast}/>} />
        <Route path="/login" element={<Login showToast={showToast}/>} />
        <Route path="/main" element={<Mainpage showToast={showToast}/>} />
        <Route path="/createserver" element={<CreateServer showToast={showToast}/>} />
        <Route path="/deleteserver" element={<DeleteServer showToast={showToast}/>} />

ㅛ
        {/* 보호된 페이지 */}
        <Route
          path="/serverpage"
          element={
            <ProtectedRoute>
              <ServerPage showToast={showToast}/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-server"
          element={
            <ProtectedRoute>
              <CreateServer showToast={showToast}/>
            </ProtectedRoute>
          }
        />

        {/* /test-form 경로에서 CreateServerForm 컴포넌트 렌더링 */}
        <Route path="/test-form" element={<CreateServerForm preSignedUrl="https://example.com" showToast={showToast}/>} />

        {/* /server-ide 경로에서 ServerIDE 컴포넌트 렌더링 */}
        <Route path="/server-ide" element={<ServerIDE showToast={showToast}/>} />
        <Route path="/delete-server" element={<DeleteServer showToast={showToast}/>} />
      </Routes>
    </Router>
  );
}

export default App;