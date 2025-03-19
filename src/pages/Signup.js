import React, { useState, useEffect } from 'react';
import '../styles/Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    name: '',
    nickname: '',
    gender: '',
    birthdate: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [timer, setTimer] = useState(180); // 3분 타이머
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    if (isTimerRunning && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [isTimerRunning, timer]);

  // ✅ 이메일 유효성 검사
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(naver\.com|gmail\.com|daum\.net)$/;
    return emailRegex.test(email);
  };

  // ✅ 비밀번호 유효성 검사 (8자 이상, 소문자, 숫자, 특수문자 포함)
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    return passwordRegex.test(password);
  };

  // ✅ 휴대폰 번호 형식 검사 (010-1234-5678 형식)
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    return phoneRegex.test(phone);
  };

  // ✅ 이메일 입력 시 검증
  const handleEmailChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, email: value });

    if (!validateEmail(value)) {
      setErrors({ ...errors, email: '올바른 이메일 형식이 아닙니다.' });
    } else {
      setErrors({ ...errors, email: '' });
    }
  };

  // 이메일 인증 요청
  const handleEmailVerification = () => {
    if (!validateEmail(formData.email)) {
      setErrors({ ...errors, email: '올바른 이메일 형식이 아닙니다.(예: @example.com)' });
      return;
    }

    // 이메일 중복 체크 (임시 로직)
    if (formData.email === 'test@naver.com') {
      setErrors({ ...errors, email: '이미 가입된 이메일입니다.' });
      return;
    }

    setIsEmailVerified(true);
  };

  // 비밀번호 입력 시 검증
  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, password: value });
    setErrors({ ...errors, password: validatePassword(value) ? '' : '비밀번호는 8자 이상, 소문자, 숫자, 특수문자를 포함해야 합니다.' });
  };

  // 비밀번호 확인 입력 시 검증
  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, confirmPassword: value });
    setErrors({ ...errors, confirmPassword: value === formData.password ? '' : '비밀번호가 일치하지 않습니다.' });
  };

  // 휴대폰 번호 입력 시 검증
  const handlePhoneChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, phone: value });

    if (!validatePhoneNumber(value)) {
      setErrors({ ...errors, phone: '올바른 형식이 아닙니다. (예: 010-1234-5678)' });
    } else {
      setErrors({ ...errors, phone: '' });
    }
  };

  return (
    <div className="signup-container">
      <h2>회원가입</h2>

      <input type="text" placeholder="이름을 입력해주세요" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />

      <input type="text" placeholder="닉네임을 입력해주세요" value={formData.nickname} onChange={(e) => setFormData({ ...formData, nickname: e.target.value })} />

      <div className="gender-container">
        <button className={formData.gender === '남성' ? 'selected' : ''} onClick={() => setFormData({ ...formData, gender: '남성' })}>남성</button>
        <button className={formData.gender === '여성' ? 'selected' : ''} onClick={() => setFormData({ ...formData, gender: '여성' })}>여성</button>
      </div>

      <input type="date" value={formData.birthdate} onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })} />

      <div className="email-container">
        <input type="email" placeholder="이메일 주소" value={formData.email} disabled={isEmailVerified} onChange={handleEmailChange} />
        {!isEmailVerified && <button onClick={handleEmailVerification}>이메일 인증</button>}
      </div>
      {errors.email && <span className="error-message">{errors.email}</span>}

      <input type="password" placeholder="비밀번호" value={formData.password} onChange={handlePasswordChange} />
      {errors.password && <span className="error-message">{errors.password}</span>}

      <input type="password" placeholder="비밀번호 확인" value={formData.confirmPassword} onChange={handleConfirmPasswordChange} />
      {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}

      <div className="phone-container">
        <input type="text" placeholder="010-1234-5678" value={formData.phone} onChange={handlePhoneChange} />
        {!isPhoneVerified && <button>휴대폰 인증</button>}
      </div>
      {errors.phone && <span className="error-message">{errors.phone}</span>}

      <button className="signup-btn">가입하기</button>
    </div>
  );
};

export default Signup;
