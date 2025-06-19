import React, { useState, useEffect } from 'react';
import "../components/styles/Signup.css";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom"; // navigate 함수 가져오기


const Signup = () => {
  // 사용자 입력 데이터를 저장하는 상태 변수
  const navigate = useNavigate(); // navigate 함수 사용할 준비

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
    const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 인증 여부
    const [isPhoneVerified, setIsPhoneVerified] = useState(false); // 휴대폰 인증 여부
    const [timer, setTimer] = useState(180); // 3분 타이머 (180초)
    const [isTimerRunning, setIsTimerRunning] = useState(false); // 타이머 실행 중인지 여부
    const [verificationCode, setVerificationCode] = useState(''); // 휴대폰 인증 코드
    const [emailVerificationCode, setEmailVerificationCode] = useState(''); // 이메일 인증 코드 입력값
    const [phoneVerificationCode, setPhoneVerificationCode] = useState(''); // 휴대폰 인증 코드 입력값
    const [isEmailCodeSent, setIsEmailCodeSent] = useState(false); // 이메일 인증 코드 발송되었는지 여부
    const [isPhoneCodeSent, setIsPhoneCodeSent] = useState(false); // 휴대폰 인증 코드 발송되었는지 여부


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
    console.log("이메일 인증 시작")
    // alert("1");
    if (!validateEmail(formData.email)) {
      setErrors({ ...errors, email: '올바른 이메일 형식이 아닙니다.' });
      return;
    }

    try {
      const response = await axiosInstance.post('/email/send', {
        email: formData.email,
      });
      console.log(response);

      if (response.status === 202 || response.status === 202) {
        console.log("이메일 인증 코드 발송");

      } else if (response.status === 401) {
        alert('이미 존재하는 이메일입니다.');
      } else if (response.status === 402) {
        alert('이미 인증이 진행중입니다.');

      }
    } catch (error) {
      console.error("이메일 인증 실패:", error);
      setErrors({ ...errors, email: '서버 오류 발생. 다시 시도해주세요.' });
    }
  };


  // 이메일 인증번호 검증 요청 (API 호출)
  const handleEmailCodeVerification = async () => {
    if (!emailVerificationCode) {
      setErrors({ ...errors, email: '인증 코드를 입력해주세요.' });
      return;
    }

    try {
      const response = await axiosInstance.post('/email/verify', {
        email: formData.email,
        code: emailVerificationCode,
      });

      if (response.status === 200 && response.data.data) {
        setIsEmailVerified(true);
        setIsTimerRunning(false);
        alert("인증이 완료되었습니다!");
      } else {
        setErrors({ ...errors, email: '인증 코드가 올바르지 않습니다.' });
      }
    } catch (error) {
      console.error("이메일 인증 실패:", error);
      alert("서버 오류 발생. 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    console.log("isEmailCodeSent 변경됨:", isEmailCodeSent);
  }, [isEmailCodeSent]);

    // '인증하기' 버튼 클릭 시 실행 (이메일 인증 코드 받아오기)
  const handleEmailVerify = () => {
    setIsEmailCodeSent(true); // 인증 코드 입력칸과 버튼 표시
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
    console.log("휴대폰 인증 시작")
    if (!validatePhoneNumber(formData.phone)) {
      setErrors({ ...errors, phone: '올바른 형식의 휴대폰 번호를 입력해주세요.' });
      return;
    }

    // 휴대폰 인증 요청을 서버에 보냄
    try {
      const response = await axiosInstance.post('/sms/send', {
        phoneNumber: formData.phone,
      });
        console.log(response);

      if (response.status === 202 || response.status === 202) {
        console.log("휴대폰 인증 코드 발송");

      }
    } catch (error) {
      console.error("휴대폰 인증 실패:", error);
      setErrors({ ...errors, phone: '서버 오류 발생. 다시 시도해주세요.'});
    }
  };

  // 휴대폰 인증번호 검증 요청 (API 호출)
  const handlePhoneCodeVerification = async () => {
    if (!phoneVerificationCode) {
      setErrors({ ...errors, phone: '인증 코드를 입력해주세요.' });
      return;
    }

    try {
      console.log("검증 요청 전송:", {
        phoneNumber: formData.phone,
        code: phoneVerificationCode,
      });

      const response = await axiosInstance.post('/sms/verify', {
        phoneNumber: formData.phone,
        code: phoneVerificationCode.trim(), // 공백 제거; 공백있을 시 검증 실패 가능성
      });

      console.log("서버 응답:", response.data);

      if (response.status === 200 && response.data === '인증 성공') {
        setIsPhoneVerified(true); // 휴대폰 인증 성공
        setIsTimerRunning(false); // 타이머 중지
        alert("휴대폰 인증이 완료되었습니다!");
      } else {
        setErrors({ ...errors, phone: '인증 코드가 올바르지 않습니다.' });
      }
    } catch (error) {
      console.error("이메일 인증 실패:", error);
      alert("서버 오류 발생. 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    console.log("isPhoneCodeSent 변경됨:", isPhoneCodeSent);
  }, [isPhoneCodeSent]);

// 로컬 테스트용: 휴대폰 인증 코드 생성 (실제 서비스에서는 서버에서 처리)
  const handlePhoneVerify = () => {
    setIsPhoneCodeSent(true);

  };

  // 최종 회원가입 요청 (API 요청)
  const handleSignup = async () => {
    console.log("회원가입 완료!")
    navigate('/main'); // 메인 페이지 라우트 경로

    if (isEmailVerified && isPhoneVerified) {
      try {
        // 회원가입 요청을 서버에 보냄
        const response = await axiosInstance.post('/api/users/signup', {
          email: formData.email,
          password: formData.password,
          username: formData.name, // 이름을 username으로 전달해야 함
          phoneNumber: formData.phone,
          birthDate: formData.birthdate,
          gender: formData.gender === "남성" ? "MALE" : "FEMALE"
        });

        if (response.status === 201 && response.data.token) {
          localStorage.setItem('accessToken', response.data.token); // 자동 로그인
          alert("회원가입이 완료되었습니다.");
          navigate('/main')
        } else {
          console.error("회원가입 실패:", response);
        }
      } catch (error) {
        console.error("회원가입 요청 실패:", error);
        alert("회원가입 중 오류가 발생했습니다.");
      }
    } else {
      alert("이메일과 휴대폰 인증을 완료해주세요.");
    }
  };

  const onClickConfirmButton = () => {
    alert("회원가입이 완료되었습니다.");
    navigate("/login"); // 회원가입 완료 후 로그인 페이지로 이동
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


      {/* 이메일 인증 */}
      <div className="email-container">     
        <input type="email" placeholder="이메일 입력" value={formData.email} disabled={isEmailVerified} onChange={handleEmailChange} />
        <button onClick={handleEmailVerification} disabled={isEmailVerified}>이메일 인증</button>
        <div style={{ marginTop: "10px" }}> {/* 이메일 입력칸과 간격 조정 */}
          <input
            type="text" placeholder="인증 코드 입력" value={emailVerificationCode} onChange={(e) => setEmailVerificationCode(e.target.value)} disabled={isEmailVerified} // 인증 완료 시 입력 불가능
            />
          <button onClick={handleEmailCodeVerification} disabled={isEmailVerified}>코드 인증</button> 
          {/* <button disabled={isEmailVerified}>코드 인증</button>  */}
        </div>
      </div>
 
      {errors.email && <span className="error-message">{errors.email}</span>}

      <input type="password" placeholder="비밀번호" value={formData.password} onChange={handlePasswordChange} />
      {errors.password && <span className="error-message">{errors.password}</span>}

      <input type="password" placeholder="비밀번호 확인" value={formData.confirmPassword} onChange={handleConfirmPasswordChange} />
      {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}

      {/* 휴대폰 인증 */}
      <div className="phone-container">
        <input type="text" placeholder="휴대폰 번호 (하이픈 없이)" value={formData.phone} disabled={isPhoneVerified} onChange={handlePhoneChange} />
        <button onClick={handlePhoneVerification} disabled={isPhoneVerified}>휴대폰 인증</button>
        <div style={{ marginTop: "10px" }}> {/* 휴대폰번호 입력칸과 간격 조정 */}
          <input
            type="text" placeholder="인증 코드 입력" value={phoneVerificationCode} onChange={(e) => setPhoneVerificationCode(e.target.value)} disabled={isPhoneVerified} // 인증 완료 시 입력 불가능
            />
          <button onClick={handlePhoneCodeVerification} disabled={isPhoneVerified}>코드 인증</button> 
        </div>
        {/* {!isPhoneVerified && <button onClick={handlePhoneVerification}>휴대폰 인증</button>} */}
      </div>

      {/* { isPhoneCodeSent && (
        <div className="verification-code-container">
          <input type="text" placeholder="인증 코드를 입력하세요" value={verificationCode} onChange={handleVerificationCodeChange} />
          <button onClick={() => setIsPhoneVerified(true)}>인증 코드 인증</button>
        </div>
      )} */}

      {errors.phone && <span className="error-message">{errors.phone}</span>}

      <button className="signup-btn" onClick={handleSignup}>가입하기</button>

    </div>
  );
};

export default Signup;