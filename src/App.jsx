// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { LanguageProvider } from "./context/LanguageContext";

import Toast from "./components/Toast/Toast";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Mainpage from "./pages/Mainpage";
import CreateServer from './pages/CreateServer';
import ServerPage from './pages/ServerPage';
import DeleteServer from "./pages/DeleteServer";
import ProtectedRoute from "./components/Nav/ProtectedRoute";
// import CreateServerForm from './components/Server/CreateServerForm';
import './components/styles/Mainpage.css';
import PostListPage from "./pages/PostListPage";
import PostDetailPage from "./pages/PostDetailPage";
import PostEditorPage from "./pages/PostEditorPage";
import Modify from "./pages/Modify";
import Terminal from './pages/Terminal';
import NoticeBoardPage from "./pages/NoticeBoardPage"; 
import QnABoardPage from "./pages/QnAPage";
// import ServerLoading from "./components/Server/ServerLoading";

function App () {
  const [toast, setToast] = useState({ message: "", show: false, type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ message, show: true, type });
    setTimeout(() => setToast({ message: "", show: false, type: 'info' }), 5000);
  };

  return (
    <LanguageProvider>
      <Router>
        <Toast message={toast.message} show={toast.show} type={toast.type} />

        <Routes>
          <Route path="/" element={<Navigate to="/main" />} />

          <Route path="/signup" element={<Signup showToast={showToast} />} />
          <Route path="/login" element={<Login showToast={showToast} />} />
          <Route path="/main" element={<Mainpage showToast={showToast} />} />
          <Route path="/createserver" element={<CreateServer showToast={showToast} />} />
          <Route path="/deleteserver" element={<DeleteServer showToast={showToast} />} />
          {/* <Route path="/server-loading" element={<ServerLoading showToast={showToast} />} /> */}

          {/* 게시판 */}
          <Route path="/posts" element={<PostListPage />} />
          <Route path="/posts/:postId" element={<PostDetailPage showToast={showToast} />} />
          <Route path="/posts/new" element={<PostEditorPage showToast={showToast} />} />
          <Route path="/posts/edit/:postId" element={<PostEditorPage showToast={showToast} />} />
          
          {/* /notice 경로에 대한 라우트 */}
          <Route path="/notice" element={<NoticeBoardPage />} />

          <Route path="/qna" element={<QnABoardPage />} />

          <Route path="/modify" element={<Modify showToast={showToast} />} />

          {/* 터미널 */}
          <Route path="/terminal" element={<Terminal showToast={showToast} />} />

          {/* 보호 라우트 */}
          <Route
            path="/serverpage"
            element={
              <ProtectedRoute>
                <ServerPage showToast={showToast} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-server"
            element={
              <ProtectedRoute>
                <CreateServer showToast={showToast} />
              </ProtectedRoute>
            }
          />

          {/* 기타 */}
          {/* <Route
            path="/test-form"
            element={<CreateServerForm preSignedUrl="https://example.com" showToast={showToast} />} */}
          {/* /> */}
          <Route path="/delete-server" element={<DeleteServer showToast={showToast} />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;