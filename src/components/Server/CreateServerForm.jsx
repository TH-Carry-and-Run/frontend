import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa"; // 체크 아이콘
import "../Server/CreateServerForm.css";

const CreateServerForm = () => {
  const [preSignedUrl, setPreSignedUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPreSignedUrl = async () => {
      try {
        // 백엔드 API를 통해 preSignedUrl 받아오기
        const response = await fetch('http://192.168.1.19:8080/api/container/create', { method: 'POST' });
        const data = await response.json();
        console.log(data);

        if (data.preSignedUrl) {
          setPreSignedUrl(data.preSignedUrl);
        } else {
          alert("URL을 받아오는 데 실패했습니다.");
        }
      } catch (error) {
        console.error("Error fetching preSignedUrl:", error);
        alert("서버 오류가 발생했습니다.");
      }
    };

    fetchPreSignedUrl();
  }, []);

  const handleConnect = () => {
    // preSignedUrl 존재 -> 해당 URL로 이동
    if (preSignedUrl) {
        navigate(`/server-ide?url=${encodeURIComponent(preSignedUrl)}`);
    }
  };

  return (
    <div className="create-server-form-overlay">
      <div className="create-server-form-popup">
        <FaCheckCircle className="check-icon" />
        <h2>서버가 성공적으로 생성되었습니다!</h2>
        <button
          className="connect-button"
          onClick={handleConnect}
          disabled={!preSignedUrl} // preSignedUrl 없으면 버튼 비활성화
        >
          접속하기
        </button>
      </div>
    </div>
  );
};

export default CreateServerForm;
