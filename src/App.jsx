import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Toast from "./components/Toast/Toast";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Mainpage from "./pages/Mainpage";
import CreateServer from './pages/CreateServer';
import ServerPage from './pages/ServerPage';
import DeleteServer from "./pages/DeleteServer";
import ProtectedRoute from "./components/Nav/ProtectedRoute";
import CreateServerForm from './components/Server/CreateServerForm';
import ServerIDE from './components/Server/ServerIDE';
import './components/styles/Mainpage.css';

import PostListPage from "./pages/PostListPage";
import PostDetailPage from "./pages/PostDetailPage";
import PostEditorPage from "./pages/PostEditorPage";
import Modify from "./pages/Modify";
import Terminal from './pages/Terminal';

function App () {
  const [toast, setToast] = useState({ message: "", show: false, type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ message, show: true, type });
    // 지속시간을 3초 정도로 조정
    setTimeout(() => setToast({ message: "", show: false, type: 'info' }), 3000);
  };

  return (
    <Router>
      <Toast message={toast.message} show={toast.show} type={toast.type} />
      <Routes>
        <Route path="/" element={<Navigate to="/main" />} />
        
        <Route path="/signup" element={<Signup showToast={showToast}/>} />
        <Route path="/login" element={<Login showToast={showToast}/>} />
        <Route path="/main" element={<Mainpage showToast={showToast}/>} />
        <Route path="/createserver" element={<CreateServer showToast={showToast}/>} />
        <Route path="/deleteserver" element={<DeleteServer showToast={showToast}/>} />

        <Route 
          path="/posts" 
          element={ <PostListPage /> } 
        />
        
        <Route path="/posts/:postId" element={<PostDetailPage showToast={showToast} />} />
        <Route path="/posts/new" element={<PostEditorPage showToast={showToast} />} />
        <Route path="/posts/edit/:postId" element={<PostEditorPage showToast={showToast} />} />
        
        <Route path="/modify" element={<Modify showToast={showToast} />} />

        {/* --- Terminal 경로에 showToast props 전달 --- */}
        <Route path="/terminal" element={<Terminal showToast={showToast} />} />

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
        <Route path="/test-form" element={<CreateServerForm preSignedUrl="https://example.com" showToast={showToast}/>} />
        <Route path="/server-ide" element={<ServerIDE showToast={showToast}/>} />
        <Route path="/delete-server" element={<DeleteServer showToast={showToast}/>} />
      </Routes>
    </Router>
  );
}

export default App;