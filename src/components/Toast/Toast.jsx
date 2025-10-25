import React from "react";
import "./Toast.css";

// 'type' prop을 추가로 받아서 클래스 이름에 적용
const Toast = ({ message, show, type = 'info' }) => {
    
  return (
    show ? (
      <div className={`custom-toast ${type}`}>
        {message}
      </div>
    ) : null
  );
};

export default Toast;
