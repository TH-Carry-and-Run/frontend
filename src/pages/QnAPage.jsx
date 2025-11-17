import React from 'react';
import "../components/styles/QnAPage.css";
import { FaLock } from 'react-icons/fa'; // 비밀글 아이콘

// Q&A를 위한 임시 더미 데이터
const dummyQAs = [
  {
    id: 5,
    status: '답변 완료',
    title: '서버 생성 후 접속이 안됩니다.',
    author: '서민재',
    date: '2025. 11. 01',
    isSecret: false,
  },
  {
    id: 4,
    status: '답변 대기',
    title: '비밀글 테스트입니다.',
    author: '한하영',
    date: '2025. 10. 30',
    isSecret: true, // 비밀글
  },
  {
    id: 3,
    status: '답변 완료',
    title: '요금은 어떻게 결제되나요?',
    author: '김주령',
    date: '2025. 10. 28',
    isSecret: false,
  },
  {
    id: 2,
    status: '답변 완료',
    title: 'React 프로젝트 배포 관련 문의',
    author: '서민재',
    date: '2025. 10. 25',
    isSecret: false,
  },
  {
    id: 1,
    status: '답변 대기',
    title: '회원가입 오류가 발생합니다.',
    author: '한하영',
    date: '2025. 10. 24',
    isSecret: true, // 비밀글
  },
];

function QnABoardPage() {
  return (
    <div className="full-page-wrapper">
      {/* '문의하기' 버튼 영역 */}
      <div className="qa-button-container">
        <button className="write-post-button">1:1 문의하기</button>
      </div>

      <div className="qa-board-container"> {/* CSS 클래스 이름 변경 */}
        <h1>Q&A</h1>
        <p className="subtitle">궁금한 점을 질문하고 답변을 받아보세요.</p>

        {/* 검색창 (공지사항과 동일한 구조) */}
        <div className="filter-section">
          <input type="text" placeholder="검색어를 입력하세요" />
          <button className="search-button">검색</button>
        </div>

        {/* Q&A 테이블 */}
        <table className="qa-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>답변상태</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
            </tr>
          </thead>
          <tbody>
            {dummyQAs.map((qa) => (
              <tr key={qa.id}>
                <td>{qa.id}</td>
                <td>
                  {/* 답변 상태에 따라 다른 클래스 부여 */}
                  <span
                    className={`status-tag ${
                      qa.status === '답변 완료'
                        ? 'status-completed'
                        : 'status-pending'
                    }`}
                  >
                    {qa.status}
                  </span>
                </td>
                <td className="qa-title">
                  {/* 비밀글이면 자물쇠 아이콘 표시 */}
                  {qa.isSecret && <FaLock className="secret-icon" />}
                  <span>{qa.title}</span>
                </td>
                <td>{qa.author}</td>
                <td>{qa.date}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 페이지네이션 (공지사항과 동일) */}
        <div className="pagination">
          <button className="active">1</button>
          {/* <button>2</button> */}
        </div>
      </div>
    </div>
  );
}

export default QnABoardPage;