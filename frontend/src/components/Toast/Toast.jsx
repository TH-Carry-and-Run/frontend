// src/components/Toast/Toast.jsx
import React from "react";
import "./Toast.css";

const Toast = ({ message, show }) => {
    
  return (
    show ? (
      <div className="custom-toast">
        {message}
      </div>
    ) : null
  );
};

export default Toast;
