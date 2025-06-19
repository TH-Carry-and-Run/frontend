// 비회원 유저의 경우 마이페이지 접근 불가능처리
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({children}) => {
    const isLoggedIn = !!localStorage.getItem("accessToken");

    if (!isLoggedIn) {
        // alert("로그인이 필요한 서비스입니다.")
        // return isLoggedIn === "true" ? children : <Navigate to="/login" />; // replace: 방문기록에 로그인 페이지 쌓이지 않음 -> 뒤로가기를 눌러도 mypage로 돌아갈 수 없음 즉, 로그인 성공 전까진 접근차단
    
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

export default ProtectedRoute;
