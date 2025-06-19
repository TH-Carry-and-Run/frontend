import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Nav/Navbar';
import "../components/styles/Mainpage.css";
import { FaInfoCircle, FaComments, FaQuestionCircle, FaServer, FaBullhorn } from 'react-icons/fa';


function MainPage() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("accessToken");
  console.log(isLoggedIn);

  const onClickServerPage = () => {
    // if (!isLoggedIn) {
    //   alert("로그인이 필요한 서비스입니다.");
    //   navigate("/login");
    // } else {

    //   navigate("/ServerPage"); // 원하는 경로로 수정
      navigate("/ServerPage"); // 원하는 경로로 수정
    // }
  };

  return (
    <div id="wrap">
      <div className="main-wrapper">
        <Navbar />
        <main className="main-content">
          <section className="banner">
            <h2>이곳은 TCAR 사이트 입니다.</h2>
            <p>양방향 소통이 가능한 공간. 지금 바로 가입해 보세요!</p>
          </section>

          <br /><br />

          <section className="content-section">
          </section>

          {/* 버튼 카드 영역 */}
          <section className="button-section">
            <div className="button-card"><FaInfoCircle className="icon" /><span>소개</span></div>
            <div className="button-card"><FaComments className="icon" /><span>자유게시판</span></div>
            <div className="button-card"><FaQuestionCircle className="icon" /><span>Q&A</span></div>
            <div className="button-card" onClick={onClickServerPage}><FaServer className="icon" /><span>MyServer</span></div>
            <div className="button-card"><FaBullhorn className="icon" /><span>공지게시판</span></div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default MainPage;