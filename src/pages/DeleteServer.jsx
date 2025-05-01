import React from "react";
import axios from "axios";
import "../components/styles/CreateServer.css";

const DeleteContainer = ({ podNamespace, podName, onClose, onDeleteSuccess }) => {
  const handleDelete = async () => {
    try {
      await axios.post('http://192.168.1.19:8080/api/container/delete', {
        podNamespace,
        podName
      });

      onDeleteSuccess(podNamespace, podName);
      onClose();
    } catch (error) {
      console.error('컨테이너 삭제 실패:', error);
      alert('컨테이너 삭제 중 오류가 발생했어요.');
    }
  };

  return (
    <div className="delete-modal">
      <div className="delete-modal-content">
        <h3>이 컨테이너를 삭제할까요?</h3>
        <p>
          Namespace: <b>{podNamespace}</b><br />
          Pod: <b>{podName}</b>
        </p>
        <div className="delete-modal-buttons">
          <button onClick={onClose} className="cancel-btn">취소</button>
          <button onClick={handleDelete} className="confirm-btn">삭제</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteContainer;
