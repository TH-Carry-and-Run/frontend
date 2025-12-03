import React from "react";
import axiosInstance from "../utils/axiosInstance";
import "../components/styles/ServerPage.css"; 

const DeleteServer = ({ podNamespace, podName, onClose, onDeleteSuccess }) => {
  const handleDelete = async () => {
    try {
      await axiosInstance.post('/api/container/delete', {
        podNamespace,
        podName
      });

      // 성공 시 목록에서 삭제
      onDeleteSuccess(podNamespace, podName);
      
    } catch (error) {
      console.error('컨테이너 삭제 실패:', error);
      
      // 401 에러(로그아웃)가 아닐 때만 알림창 띄우기
      if (error.response && error.response.status !== 401) {
          alert('컨테이너 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal-content delete-modal-size">
        <h3 className="delete-title">서버 삭제</h3>
        <p className="delete-message">
          정말 <strong>{podName}</strong> 서버를 삭제하시겠습니까?<br />
          삭제된 데이터는 복구할 수 없습니다.
        </p>
        <div className="custom-modal-actions">
          <button className="modal-btn cancel" onClick={onClose}>
            취소
          </button>
          <button className="modal-btn delete-confirm" onClick={handleDelete}>
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteServer;