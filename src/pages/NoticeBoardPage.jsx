import React from 'react';
import Navbar from '../components/Nav/Navbar';
import "../components/styles/NoticeBoardPage.css";

const dummyNotices = [
  { id: '중요', title: '초보자들을 위한 사용 가이드', author: '관리자', date: '2025. 11. 01', views: 999, important: true, isNew: true },
  { id: 8, title: '11월 5일 이벤트 당첨자 공지', author: '서민재', date: '2025. 11. 05', views: 152, important: false, isNew: true },
  { id: 7, title: '댓글 이벤트 안내', author: '한하영', date: '2025. 11. 04', views: 230, important: false, isNew: true },
  { id: 6, title: '10/23 서버 업데이트 내역', author: '김주령', date: '2025. 10. 23', views: 310, important: false, isNew: false },
  { id: 5, title: '10/23 서버 점검 예정', author: '서민재', date: '2025. 10. 22', views: 288, important: false, isNew: false },
  { id: 4, title: '초보자들을 위한 사용 가이드', author: '한하영', date: '2025. 10. 20', views: 512, important: false, isNew: false },
  { id: 3, title: "'김태훈 교수님을 소개합니다!'", author: '김주령', date: '2025. 09. 15', views: 401, important: false, isNew: false },
  { id: 2, title: '웹터미널 가이드', author: '서민재', date: '2025. 09. 01', views: 350, important: false, isNew: false },
  { id: 1, title: '금지사항', author: '한하영', date: '2025. 08. 20', views: 620, important: false, isNew: false },
];

function NoticeBoardPage() {
  return (
    // 1. notice-page-wrapper가 검은 배경을 완전히 덮습니다.
    <div className="notice-page-wrapper">
      
      <Navbar />

      {/* 2. 파란색 헤더 바 */}
      <div className="notice-header-bar">
        <div className="header-content">
          <h1 className="page-title">공지사항 페이지</h1>
          {/* 버튼이 헤더 안으로 들어왔습니다 */}
          <button className="admin-button">공지사항 관리</button>
        </div>
      </div>

      {/* 3. 흰색 카드 영역 */}
      <div className="notice-board-container">
          
          <div className="subtitle-area">
              <h2>TCAR 공지사항</h2>
              <p>TCAR의 새로운 소식과 업데이트를 확인하세요.</p>
          </div>

          <div className="filter-section">
              <div className="date-picker-group">
                  <input type="date" defaultValue="2025-08-01" />
                  <span>~</span>
                  <input type="date" defaultValue="2025-11-05" />
              </div>
              <div className="search-group">
                  <input type="text" placeholder="검색어를 입력하세요" />
                  <button className="search-button">검색</button>
              </div>
          </div>

          <table className="notice-table">
              <thead>
                  <tr>
                      <th width="10%">번호</th>
                      <th width="50%">제목</th>
                      <th width="15%">작성자</th>
                      <th width="15%">작성날짜</th>
                      <th width="10%">조회수</th>
                  </tr>
              </thead>
              <tbody>
                  {dummyNotices.map((notice) => (
                      <tr key={notice.id}>
                          <td>
                              {notice.important ? <span className="badge-important">중요</span> : notice.id}
                          </td>
                          <td className="notice-title">
                              {notice.isNew && <span className="badge-new">N</span>}
                              <span>{notice.title}</span>
                          </td>
                          <td>{notice.author}</td>
                          <td>{notice.date}</td>
                          <td>{notice.views}</td>
                      </tr>
                  ))}
              </tbody>
          </table>

          <div className="pagination">
              <button className="page-btn">&lt;</button>
              <button className="page-btn active">1</button>
              <button className="page-btn">&gt;</button>
          </div>
      </div>
    </div>
  );
}

export default NoticeBoardPage;