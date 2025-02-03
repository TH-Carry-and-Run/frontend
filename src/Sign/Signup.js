// src/Signup.js
import React, { useState } from "react";
import axios from "axios";

const URL = "http://192.168.1.5:8080/api";
 

function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    nickname: "",
  });

  // 입력값이 변경될 때 formData 업데이트
  const handleChange = (e) => {
    setFormData({ 
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 회원가입 버튼 클릭하면 실행
  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출X

    try {
      // 백엔드로 POST 요청
      const response = await axios.post(`${URL}/users/signup`, formData);

      // 요청 성공
      console.log("회원가입 성공:", response.data);
      alert("회원가입이 완료되었습니다.");

    } catch (error) {
      if (error.response) {
        console.error("회원가입 실패:", error.response.data);
      } else if (error.request) {
        console.error("회원가입 요청이 백엔드에 전달되지 않음:", error.request);
      } else {
        console.error("요청 설정 중 오류 발생:", error.message);
      }
      alert("회원가입에 실패하였습니다.");
    }
    

  };

  return (
    <div>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>nickname:</label>
          <input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}

export default Signup;
