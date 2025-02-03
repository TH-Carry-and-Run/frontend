import React, { useState } from "react";
import axios from "axios";

function Login() {
  // 입력 값을 저장할 상태
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // 입력 변경
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 로그인 요청
  const handleSubmit = async (e) => {
    e.preventDefault(); // 새로고침X

    try {
      const response = await axios.post("http://localhost/api/user/login", formData);

      console.log("로그인 성공:", response.data);
      alert("로그인 성공!");

      // 로그인 성공 후 토큰 저장
      localStorage.setItem("token", response.data.token);
    } catch (error) {
      console.error("로그인 실패:", error.response?.data || error.message);
      alert("로그인 실패! 이메일과 비밀번호를 확인하세요.");
    }
  };

  return (
    <div>
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>이메일:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>비밀번호:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}

export default Login;
