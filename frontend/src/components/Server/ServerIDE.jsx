// 서버 접속 IDE + 터미널

import React from "react";

const ServerIDE = ({ preSignedUrl }) => {
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <iframe
        src={preSignedUrl}
        title="Server Terminal"
        style={{ width: "100%", height: "100%", border: "none" }}
      ></iframe>
    </div>
  );
};

export default ServerIDE;
