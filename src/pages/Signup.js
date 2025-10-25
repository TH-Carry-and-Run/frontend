import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "../components/styles/Signup.css";
import axiosInstance from "../utils/axiosInstance";

const Signup = ({ showToast }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    birthdate: '',
    email: '',
    emailCode: '',
    password: '',
    confirmPassword: '',
    phone: '',
    phoneCode: '',
  });

  const [errors, setErrors] = useState({});
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // TODO: Add validation and API call logic from your original code here
  
  const handleSignup = async () => {
    // ... (회원가입 로직) ...
  };

  return (
    <div className="signup-page">
      <div className="signup-form-container">
        <h1 className="titleWrap">회원가입</h1>

        <div className="contentWrap">
          {/* 이름 */}
          <div className="input-group">
            <label className="inputTitle">이름</label>
            <input type="text" className="input" placeholder="이름을 입력해주세요" />
          </div>

          {/* 성별 */}
          <div className="input-group">
            <label className="inputTitle">성별</label>
            <div className="gender-select-wrap">
              <button className={`gender-button ${formData.gender === 'male' ? 'active' : ''}`} onClick={() => setFormData({...formData, gender: 'male'})}>남성</button>
              <button className={`gender-button ${formData.gender === 'female' ? 'active' : ''}`} onClick={() => setFormData({...formData, gender: 'female'})}>여성</button>
            </div>
          </div>
          
          {/* --- 생년월일 input 타입 변경 --- */}
          <div className="input-group">
            <label className="inputTitle">생년월일</label>
            {/* type을 "date"로 변경하고, placeholder 대신 required 속성 추가 */}
            <input type="date" className="input" required />
          </div>

          {/* 이메일 */}
          <div className="input-group">
            <label className="inputTitle">이메일</label>
            <div className="verify-input-wrap">
              <input type="email" className="input" placeholder="이메일 입력" disabled={isEmailVerified} />
              <button className="verify-button" disabled={isEmailVerified}>이메일 전송</button>
            </div>
            <div className="verify-input-wrap">
              <input type="text" className="input" placeholder="인증 코드 입력" disabled={isEmailVerified} />
              <button className="verify-button" disabled={isEmailVerified}>코드 인증</button>
            </div>
          </div>

          {/* 비밀번호 */}
          <div className="input-group">
            <label className="inputTitle">비밀번호</label>
            <input type="password" className="input" placeholder="비밀번호" />
            <input type="password" className="input" placeholder="비밀번호 확인" />
          </div>

          {/* 휴대폰 */}
          <div className="input-group">
            <label className="inputTitle">휴대폰 번호</label>
            <div className="verify-input-wrap">
              <input type="tel" className="input" placeholder="휴대폰 번호 ('-' 제외)" disabled={isPhoneVerified} />
              <button className="verify-button" disabled={isPhoneVerified}>휴대폰 인증</button>
            </div>
            <div className="verify-input-wrap">
              <input type="text" className="input" placeholder="인증 코드 입력" disabled={isPhoneVerified} />
              <button className="verify-button" disabled={isPhoneVerified}>코드 인증</button>
            </div>
          </div>

          <button className="bottomButton" onClick={handleSignup}>
            가입하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;