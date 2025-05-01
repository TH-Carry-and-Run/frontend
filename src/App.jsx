import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
  return (
    <Router>
      <Routes>
        {/* 기본 루트("/")로 들어오면 something 페이지로 이동 */}
        <Route path="/" element={<Navigate to="/serverpage" />} />

        {/* 인증 없이 접근 가능한 페이지들 */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={<Mainpage />} />


        {/* 보호된 페이지 */}
        <Route
          path="/serverpage"
          element={
            <ProtectedRoute>
              <ServerPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-server"
          element={
            <ProtectedRoute>
              <CreateServer />
            </ProtectedRoute>
          }
        />

        {/* /test-form 경로에서 CreateServerForm 컴포넌트 렌더링 */}
        <Route path="/test-form" element={<CreateServerForm preSignedUrl="https://example.com" />} />

        {/* /server-ide 경로에서 ServerIDE 컴포넌트 렌더링 */}
        <Route path="/server-ide" element={<ServerIDE />} />
        <Route path="/delete-server" element={<DeleteServer />} />
      </Routes>
    </Router>
  );
}

export default App;