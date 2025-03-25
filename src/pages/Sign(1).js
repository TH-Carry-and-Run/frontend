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
  const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 인증 여부
  const [isPhoneVerified, setIsPhoneVerified] = useState(false); // 휴대폰 인증 여부
  const [timer, setTimer] = useState(180); // 3분 타이머 (180초)
  const [isTimerRunning, setIsTimerRunning] = useState(false); // 타이머 실행 중인지 여부
  const [verificationCode, setVerificationCode] = useState(''); // 휴대폰 인증 코드
//  const [isCodeSent, setIsCodeSent] = useState(false); // 인증 코드 발송 여부
  const [emailVerificationCode, setEmailVerificationCode] = useState(''); // 이메일 인증 코드 입력값
  const [phoneVerificationCode, setPhoneVerificationCode] = useState(''); // 휴대폰 인증 코드 입력값
  const [isEmailCodeSent, setIsEmailCodeSent] = useState(false); // 이메일 인증 코드 발송되었는지 여부
  const [isPhoneCodeSent, setIsPhoneCodeSent] = useState(false); // 휴대폰 인증 코드 발송되었는지 여부
  const [generatedEmailCode, setGeneratedEmailCode] = useState(""); // 서버에서 받은 실제 인증 코드 저장


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

  // 인증 코드 입력 시 상태 업데이트
const handleVerificationCodeChange = (e) => {
  setVerificationCode(e.target.value); // 입력한 코드를 상태에 저장
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
    console.log("이메일 인증 버튼 클릭됨");

    setIsEmailCodeSent(true); // UI 즉시 업데이트
    setIsTimerRunning(true); 
    setTimer(180); // 3분 타이머
    
    // 실제 서비스에서는 서버에서 생성된 코드를 받아야 하지만, 여기서는 임시 코드 설정
    const tempCode = "123456"; // 예제용 (실제로는 백엔드에서 발급)
    setGeneratedEmailCode(tempCode);

    // 이메일 인증 요청을 서버에 보냄
    try {
      const response = await fetch('http://192.168.1.10:8080/email/send', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
  
      if (response.status === 202) {
        console.log("이메일 인증 코드 전송 완료!");
      } else if (response.status === 409) {
        setErrors({ ...errors, email: '이미 가입된 이메일입니다.' });
        setIsEmailCodeSent(false); // 인증 실패 시 입력창 숨김
      }
    } catch (error) {
      console.error("이메일 인증 실패:", error);
      setIsEmailCodeSent(false); // 오류 발생 시 다시 숨김
    }
  };


  // 이메일 인증번호 검증 요청 (API 호출)
  const handleEmailCodeVerification = async () => {
    if (!validateEmail(formData.email)) {
      setErrors({ ...errors, email: '올바른 이메일 형식이 아닙니다.' });
      return;
    }
  // 아래거
    console.log("🔎 입력된 인증 코드:", emailVerificationCode);

    try {
      const response = await fetch('http://192.168.1.10:8080/email/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          code: emailVerificationCode, // 입력된 인증 코드 전달
        }),
      });

      if (response.status === 202) {
        console.log("이메일 인증 완료!");
        setIsEmailVerified(true); // 이메일 인증 성공
        setIsTimerRunning(false); // 타이머 중지
        alert("인증이 완료되었습니다!");
      } else {
        setErrors({ ...errors, email: '인증 코드가 올바르지 않습니다.' });
      }
    } catch (error) {
      console.error("이메일 인증 실패:", error);
      //setErrors({ ...errors, email: '서버 오류로 인증에 실패했습니다.' });
    }
  };

  // 이메일 인증 상태 변화를 감지하여 UI 업데이트
useEffect(() => {
  if (isEmailVerified) {
    console.log("이메일 인증 완료! UI 업데이트됨");
  }
}, [isEmailVerified]);

// UI 렌더링 부분
return (
  <div className="signup-container">
    <h2>회원가입</h2>

    {/* 이메일 입력 및 인증 버튼 */}
    <div className="email-container">
      <input 
        type="email" 
        placeholder="이메일 주소" 
        value={formData.email} 
        disabled={isEmailVerified} 
        onChange={handleEmailChange} 
      />
      {!isEmailVerified && <button onClick={handleEmailVerification}>이메일 인증</button>}
      {isTimerRunning && isEmailCodeSent && <p className="timer">⏳ {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</p>}
    </div>

    {/* 이메일 인증 버튼을 누르면 인증 코드 입력칸과 버튼이 나타남 */}
    {isEmailCodeSent && !isEmailVerified && (
      <div className="verification-code-container">
        <input 
          type="text" 
          placeholder="인증코드를 입력해주세요" 
          value={emailVerificationCode} 
          onChange={(e) => setEmailVerificationCode(e.target.value)} 
        />
        <button onClick={handleEmailCodeVerification} disabled={!emailVerificationCode.trim()}>확인</button>
      </div>
    )}

    {/* 인증 완료 메시지 */}
    {isEmailVerified && <p style={{ color: 'green', fontWeight: 'bold' }}>✅ 이메일 인증이 완료되었습니다.</p>}
  </div>
);


{/* 타이머 추가 (인증 요청 후 3분 카운트다운) */}
{isTimerRunning && isEmailCodeSent && <p className="timer">남은 시간: {timer}초</p>}


 // 휴대폰 번호 입력 시 유효성 검증
 const handlePhoneChange = (e) => {
  const { value } = e.target;
  const validatePhoneNumber = (phone) => /^\d{10,11}$/.test(phone);
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
  // 버튼 클릭 즉시 UI 변경을 위해 먼저 상태 업데이트
  setIsPhoneCodeSent(true);
  setIsTimerRunning(true);
  setTimer(180);
  console.log("휴대폰 인증 코드 입력칸 즉시 생성됨");

  try {
    const response = await fetch('http://192.168.1.10:8080/sms/send', { // 휴대폰 인증 API 요청
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: formData.phone }),
    });

    if (response.status === 202) {
      //setIsCodeSent(true); // 휴대폰 인증 코드 입력칸 및 버튼을 나타나게 함
      setIsPhoneCodeSent(true); // 휴대폰 인증 코드 입력란 표시
      setIsTimerRunning(false); // 타이머 시작

      setTimer(180); // 타이머 초기화

    } else if (response.status === 409) {
      setErrors({ ...errors, phone: '이미 가입된 휴대폰 번호입니다.' });
    }
  } catch (error) {
    setIsPhoneCodeSent(false);
    setIsTimerRunning(false);
    console.error("휴대폰 인증 실패:", error);
  }
};

// 휴대폰 인증번호 검증 요청 (API 호출)
const handlePhoneCodeVerification = async () => {
  try {
    const response = await fetch('http://192.168.1.10:8080/sms/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber: formData.phone, 
        code: phoneVerificationCode, // verificationCode가 아니라 phoneVerificationCode 사용
        userEmail: formData.email,   // formData.email로 수정
      }),
    });
      // body: JSON.stringify({ phoneNumber: formData.phone, code: verificationCode }),
      // userEmail: formValue.email,
    //});
  

    setIsPhoneCodeSent(true); // 인증 코드 입력칸과 버튼을 보이게 설정

    if (response.status === 202) {
      //setIsPhoneVerified(true); // 휴대폰 인증 성공
      setIsTimerRunning(true); // 타이머 시작
      setTimer(180); // 타이머 초기화
    } else if (response.status === 409) {
      setErrors({ ...errors, phone: '이미 가입된 휴대폰 번호입니다.' });
    }
  } catch (error) {
    console.error("휴대폰 인증 실패:", error);
  }
};

{isPhoneCodeSent && !isPhoneVerified && (
  <div className="verification-code-container">
    <input 
      type="text" 
      placeholder="휴대폰 인증 코드를 입력하세요" 
      value={phoneVerificationCode} 
      onChange={(e) => setPhoneVerificationCode(e.target.value)} 
    />
    <button onClick={handlePhoneCodeVerification}>휴대폰 인증 확인</button>
  </div>
)}
{isTimerRunning && isPhoneCodeSent && <p className="timer">남은 시간: {timer}초</p>}


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


{/* 휴대폰 입력 및 인증 버튼 */}
<div className="phone-container">
  <input 
    type="text" 
    placeholder="휴대폰 번호 (하이픈 없이)" 
    value={formData.phone} 
    disabled={isPhoneVerified} 
    onChange={handlePhoneChange} 
  />
  {!isPhoneVerified && <button onClick={handlePhoneVerification}>휴대폰 인증</button>}
</div>

{/* 휴대폰 인증 버튼을 누르면 인증 코드 입력칸과 버튼이 나타남 */}
{isPhoneCodeSent && !isPhoneVerified && (
  <div className="verification-code-container">
    <input 
      type="text" 
      placeholder="휴대폰 인증 코드를 입력하세요" 
      value={phoneVerificationCode} 
      onChange={(e) => setPhoneVerificationCode(e.target.value)} 
    />
    <button onClick={handlePhoneCodeVerification}>휴대폰 인증 확인</button>
  </div>
)}

{isTimerRunning && isPhoneCodeSent && <p className="timer">남은 시간: {timer}초</p>}


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
