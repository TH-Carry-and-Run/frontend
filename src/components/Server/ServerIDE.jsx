// 서버 접속 IDE + 터미널

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ServerIDE = () => {
  const [url, setUrl] = useState('');
  const location = useLocation();

  useEffect(() => {
    // URL 파라미터 -> preSignedUrl 받아오기
    const queryParams = new URLSearchParams(location.search);
    const preSignedUrl = queryParams.get('url');

    if (preSignedUrl) {
      setUrl(preSignedUrl); // URL 상태로 저장
    }
  }, [location]);

  // URL이 없으면 로딩 메시지 표시
  if (!url) {
    return <div>로딩 중...</div>;
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <h1>서버 터미널 환경</h1>
      <iframe
        src={url}
        title="Server Terminal"
        width="100%"
        height="100%"
        style={{ border: "none" }}
      />
    </div>
  );
};

export default ServerIDE;
