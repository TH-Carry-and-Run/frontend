// src/App.jsx
import React, { useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { LanguageProvider } from "./context/LanguageContext";

import Toast from "./components/Toast/Toast";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Mainpage from "./pages/Mainpage";
import CreateServer from "./pages/CreateServer";
import ServerPage from "./pages/ServerPage";
import DeleteServer from "./pages/DeleteServer";
import ProtectedRoute from "./components/Nav/ProtectedRoute";
import "./components/styles/Mainpage.css";
import PostListPage from "./pages/PostListPage";
import PostDetailPage from "./pages/PostDetailPage";
import PostEditorPage from "./pages/PostEditorPage";
import Modify from "./pages/Modify";
import Terminal from "./pages/Terminal";
import NoticeBoardPage from "./pages/NoticeBoardPage";
import QnABoardPage from "./pages/QnAPage";

function App() {
  const [toast, setToast] = useState({
    message: "",
    show: false,
    type: "info",
  });

  const showToast = useCallback((message, type = "info") => {
    setToast({ message, show: true, type });
    setTimeout(() => {
      setToast({ message: "", show: false, type: "info" });
    }, 5000);
  }, []);

  return (
    <LanguageProvider>
      <Router>
        <Toast message={toast.message} show={toast.show} type={toast.type} />

        <Routes>
          <Route path="/" element={<Navigate to="/main" />} />

          {/* 인증 관련 */}
          <Route path="/signup" element={<Signup showToast={showToast} />} />
          <Route path="/login" element={<Login showToast={showToast} />} />

          {/* 메인 */}
          <Route path="/main" element={<Mainpage showToast={showToast} />} />

          {/* 서버 목록 (MyServer) – 로그인 필요 */}
          <Route
            path="/serverpage"
            element={
              <ProtectedRoute>
                <ServerPage showToast={showToast} />
              </ProtectedRoute>
            }
          />

          {/* 서버 생성 – 로그인 필요 */}
          <Route
            path="/createserver"
            element={
              <ProtectedRoute>
                <CreateServer showToast={showToast} />
              </ProtectedRoute>
            }
          />

          {/* 터미널 – presignedUrl state로 이동 */}
          <Route
            path="/terminal"
            element={<Terminal showToast={showToast} />}
          />

          {/* 게시판 */}
          <Route path="/posts" element={<PostListPage />} />
          <Route
            path="/posts/:postId"
            element={<PostDetailPage showToast={showToast} />}
          />
          <Route
            path="/posts/new"
            element={<PostEditorPage showToast={showToast} />}
          />
          <Route
            path="/posts/edit/:postId"
            element={<PostEditorPage showToast={showToast} />}
          />

          {/* 공지 / QnA */}
          <Route path="/notice" element={<NoticeBoardPage />} />
          <Route path="/qna" element={<QnABoardPage />} />

          {/* 프로필 수정 */}
          <Route path="/modify" element={<Modify showToast={showToast} />} />

          {/* 삭제 페이지 – 필요하면 보호 라우트로 바꿔도 됨 */}
          <Route
            path="/deleteserver"
            element={<DeleteServer showToast={showToast} />}
          />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;