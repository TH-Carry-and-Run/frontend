// src/router/Router.js
import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ProtectedRoute from '../components/Nav/ProtectedRoute';
import MainBoard from '../pages/MainBoard';

import Splash from '../pages/Splash'; // 홈 화면
import Login from '../pages/Login';   // 로그인 페이지
import Signup from '../pages/Signup'; // 회원가입 페이지
import Home from '../pages/Home';     // 로그인 후 홈 화면

import { AuthContextStore } from '../context/AuthContext'; // 인증 컨텍스트 불러오기

const Router = () => {
    const { userToken } = useContext(AuthContextStore); // 로그인 상태 체크

    return (
        <BrowserRouter>
            <Routes>
                {/* 로그인 전 사용 가능 페이지 */}
                {!userToken ? (
                    <>
                        <Route path="/" element={<Splash />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/join" element={<Signup />} />
                    </>
                ) : (
                    <>
                        {/* 로그인 후 홈 화면으로 이동 */}
                        <Route path="/home" element={<Home />} />
                        <Route path="/board" element={
                            <ProtectedRoute>
                                <MainBoard />
                            </ProtectedRoute>
                        } />
                    </>
                )}
            </Routes>
        </BrowserRouter>
    );
};

export default Router;