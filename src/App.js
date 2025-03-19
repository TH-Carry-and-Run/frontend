// App.js - 기본 화면을 회원가입(Signup) 페이지로 설정
import React from "react";
import Signup from "./pages/Signup";

const App = () => {
  return (
    <div>
      <Signup /> {/* 기본적으로 회원가입 페이지를 렌더링 */}
    </div>
  );
};

export default App;
