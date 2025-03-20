import React, { useState, useEffect } from 'react';
import '../styles/Signup.css';

const Signup = () => {
  // 사용자 입력 데이터를 저장하는 상태 변수
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    name: '',
    gender: '',
    birthdate: '',
  });

  // 입력 오류 메시지를 저장하는 상태 변수
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  // 이메일 및 휴대폰 인증 상태 관리
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [timer, setTimer] = useState(180); // 3분 타이머
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [verificationCode, setVerificationCode] = useState(''); // 휴대폰 인증 코드
  const [isCodeSent, setIsCodeSent] = useState(false); // 인증 코드 발송 여부

  // 타이머 작동하면 1초마다 감소하는 로직
  useEffect(() => {
    if (isTimerRunning && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [isTimerRunning, timer]);

  // 이메일 유효성 검사 (naver, gmail, daum 허용)
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(naver\.com|gmail\.com|daum\.net)$/;
    return emailRegex.test(email);
  };

  // 비밀번호 유효성 검사 (8자 이상, 소문자, 숫자, 특수문자 포함)
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    return passwordRegex.test(password);
  };

  // 휴대폰 번호 형식 검사 (하이픈(-) 없이 입력)
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\d{10,11}$/; // 하이픈 없이 10~11자리 숫자
    return phoneRegex.test(phone);
  };

  // 이메일 입력 시 유효성 검증
  const handleEmailChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, email: value });

    if (!validateEmail(value)) {
      setErrors({ ...errors, email: '올바른 이메일 형식이 아닙니다.' });
    } else {
      setErrors({ ...errors, email: '' });
    }
  };

  // 이메일 인증 요청 (API 요청)
  const handleEmailVerification = async () => {
    if (!validateEmail(formData.email)) {
      setErrors({ ...errors, email: '올바른 이메일 형식이 아닙니다.' });
      return;
    }

    try {
      // 이메일 인증 요청을 서버에 보냄
      const response = await fetch('http://192.168.1.10:8080/email/send', { // 이메일 인증 API 엔드포인트
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }), // 이메일 주소를 서버에 전달
      });

      if (response.status === 202) {
        setIsEmailVerified(true); // 이메일 인증 완료 처리
      } else if (response.status === 409) {
        setErrors({ ...errors, email: '이미 가입된 이메일입니다.' });
      }
    } catch (error) {
      console.error("이메일 인증 실패:", error);
    }
  };

  // 이메일 인증번호 검증 요청 (API 호출)
const handleEmailCodeVerification = async () => {
  try {
    const response = await fetch('http://192.168.1.10:8080/email/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.email, code: verificationCode }),
    });

    if (response.status === 200) {
      setIsEmailVerified(true); // 이메일 인증 성공
    } else {
      setErrors({ ...errors, email: '인증 코드가 올바르지 않습니다.' });
    }
  } catch (error) {
    console.error("이메일 인증 검증 실패:", error);
  }
};

  // 비밀번호 입력 시 유효성 검증
  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, password: value });
    setErrors({ ...errors, password: validatePassword(value) ? '' : '비밀번호는 8자 이상, 소문자, 숫자, 특수문자를 포함해야 합니다.' });
  };

  // 비밀번호 확인 입력 시 기존 비밀번호와 일치하는지 검증
  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, confirmPassword: value });
    setErrors({ ...errors, confirmPassword: value === formData.password ? '' : '비밀번호가 일치하지 않습니다.' });
  };

  // 휴대폰 번호 입력 시 유효성 검증
  const handlePhoneChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, phone: value });

    if (!validatePhoneNumber(value)) {
      setErrors({ ...errors, phone: '올바른 형식이 아닙니다. (예: 01012345678)' });
    } else {
      setErrors({ ...errors, phone: '' });
    }
  };

  // 휴대폰 인증 요청 (API 요청)
  const handlePhoneVerification = async () => {
    if (!validatePhoneNumber(formData.phone)) {
      setErrors({ ...errors, phone: '올바른 형식의 휴대폰 번호를 입력해주세요.' });
      return;
    }

    try {
      // 휴대폰 인증 요청을 서버에 보냄
      const response = await fetch('http://192.168.1.10:8080/sms/send', { // 휴대폰 인증 API 엔드포인트
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone }), // 전화번호를 서버에 전달
      });

      if (response.status === 202) {
        setIsCodeSent(true); // 인증 코드 발송 완료
        setIsTimerRunning(true); // 타이머 시작
      } else if (response.status === 409) {
        setErrors({ ...errors, phone: '이미 가입된 휴대폰 번호입니다.' });
      }
    } catch (error) {
      console.error("휴대폰 인증 실패:", error);
    }
  };

  // 휴대폰 인증번호 검증 요청 (API 호출)
  const handlePhoneCodeVerification = async () => {
    try {
      const response = await fetch('http://192.168.1.10:8080/sms/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: formData.phone, code: verificationCode }),
      });

      if (response.status === 200) {
        setIsPhoneVerified(true); // 휴대폰 인증 성공
      } else {
        setErrors({ ...errors, phone: '인증 코드가 올바르지 않습니다.' });
      }
    } catch (error) {
      console.error("휴대폰 인증 검증 실패:", error);
    }
  };

  // 인증 코드 입력 처리
  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  // 최종 회원가입 요청 (API 요청)
  const handleSignup = async () => {
    if (isEmailVerified && isPhoneVerified) {
      try {
        // 회원가입 요청을 서버에 보냄
        const response = await fetch('http://192.168.1.10:8080/users/signup', { // 회원가입 API 엔드포인트
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password, // 비밀번호는 프론트에서만 검증 후 서버에 전송
            phone: formData.phone,
            name: formData.name,
            gender: formData.gender,
            birthdate: formData.birthdate,
          }),
        });

        if (response.status === 201) {
          alert("회원가입이 완료되었습니다.");
        } else {
          console.error("회원가입 실패:", response);
        }
      } catch (error) {
        console.error("회원가입 요청 실패:", error);
      }
    } else {
      alert("이메일과 휴대폰 인증을 완료해주세요.");
    }
  };

  return (
    <div className="signup-container">
      <h2>회원가입</h2>

      <input type="text" placeholder="이름을 입력해주세요" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />

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
        <input type="text" placeholder="휴대폰 번호 (하이픈 없이)" value={formData.phone} onChange={handlePhoneChange} />
        {!isPhoneVerified && <button onClick={handlePhoneVerification}>휴대폰 인증</button>}
      </div>
      {isCodeSent && (
        <div className="verification-code-container">
          <input type="text" placeholder="인증 코드를 입력하세요" value={verificationCode} onChange={handleVerificationCodeChange} />
          <button onClick={() => setIsPhoneVerified(true)}>인증 코드 인증</button>
        </div>
      )}
      {errors.phone && <span className="error-message">{errors.phone}</span>}

      <button className="signup-btn" onClick={handleSignup}>가입하기</button>
    </div>
  );
};

export default Signup;
