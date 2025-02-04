import React, { useState } from "react";
import axios from "axios";


// const URL = "http://192.168.1.5:8080/api";
const URL = "http://localhost:8080/api";


function Login() {

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      
      const response = await axios.post(`${URL}/user/login`, formData);

      console.log("로그인 성공:", response.data);
      alert("로그인에 성공하였습니다.");

      
      localStorage.setItem("token", response.data.token);
    } catch (error) {
      console.error("로그인 실패:", error.response?.data || error.message);
      alert("로그인에 실패하였습니다. 이메일과 비밀번호를 확인하세요.");
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
