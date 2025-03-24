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
    const [isCodeSent, setIsCodeSent] = useState(false); // 인증 코드 발송 여부
    const [emailVerificationCode, setEmailVerificationCode] = useState(''); // 이메일 인증 코드 입력값
    const [phoneVerificationCode, setPhoneVerificationCode] = useState(''); // 휴대폰 인증 코드 입력값
    const [isEmailCodeSent, setIsEmailCodeSent] = useState(false); // 이메일 인증 코드 발송되었는지 여부
    const [isPhoneCodeSent, setIsPhoneCodeSent] = useState(false); // 휴대폰 인증 코드 발송되었는지 여부
    const [generatedEmailCode, setGeneratedEmailCode] = useState(""); // 서버에서 받은 실제 인증 코드 저장
    const [generatedPhoneCode, setGeneratedPhoneCode] = useState(""); 
    const [email, setEmail] = useState(""); // 사용자가 입력한 이메일 값

  

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
    //console.log("이메일 인증 버튼 클릭됨");
    //console.log("입력된 인증 코드:", emailVerificationCode);
    setIsEmailCodeSent(true); // 인증 코드 입력 UI 표시
    setIsTimerRunning(true); 
    setTimer(180); // 3분 타이머 시작


    try {
      // 이메일 인증 요청을 서버에 보냄
      const response = await fetch('http://192.168.1.10:8080/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }), // 이메일 주소를 서버에 전달
      });

      if (response.status === 202) {
        //console.log("이메일 인증 완료!");
        setIsEmailVerified(true); // 이메일 인증 완료 처리

      }
    } catch (error) {
      console.error("이메일 인증 실패:", error);
    }
  };

  // 이메일 인증번호 검증 요청 (API 호출)
const handleEmailCodeVerification = async () => {
  if (!validateEmail(formData.email)) {
    setErrors({ ...errors, email: '올바른 이메일 형식이 아닙니다.' });
    return;
  }

  console.log("입력된 인증 코드:", emailVerificationCode);


  try {
    const response = await fetch('http://192.168.1.10:8080/email/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.email, code: emailVerificationCode }),
    });

    const data = await response.json(); // 응답을 JSON으로 변환
    console.log("서버 응답:", data); // 서버 응답 확인
    code: emailVerificationCode.trim()

    // if (response.status === 202) {
      if (response.ok && data.data) { 
      console.log("이메일 인증 완료!");
      setIsEmailVerified(true); // 이메일 인증 성공
      setIsTimerRunning(false); // 타이머 중지
      alert("인증이 완료되었습니다!");
    } else {
      setErrors({ ...errors, email: '인증 코드가 올바르지 않습니다.' });
    }
  } catch (error) {
    console.error("이메일 인증 실패:", error);
    alert("서버 오류 발생. 다시 시도해주세요.")

  }
};
    // '인증하기' 버튼 클릭 시 실행 (이메일 인증 코드 받아오기)
const handleEmailVerify = () => {
  setIsEmailCodeSent(true); // 인증 코드 입력칸과 버튼 표시


  // 인증 코드 생성 (6자리 랜덤 숫자)
  const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
  setGeneratedEmailCode(generatedCode); // 생성된 코드 저장
  alert(`이메일 인증 코드: ${generatedCode}`); // 실제 서비스에서는 사용자에게 이메일로 발송
};

    // '코드 인증' 버튼 클릭 시 실행 (사용자 입력 코드 검증)
const handleCodeVerify = () => {
  if (emailVerificationCode === generatedEmailCode) {
    setIsEmailVerified(true); // 인증 완료 상태로 변경
    alert("이메일 인증이 완료되었습니다.");
  } else {
    alert("인증 코드가 틀렸습니다. 다시 입력해주세요.");
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
      console.log("휴대폰 인증 요청 중...");
      // 휴대폰 인증 요청을 서버에 보냄
      const response = await fetch('http://192.168.1.10:8080/sms/send', { // 휴대폰 인증 API 엔드포인트
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone }), // 전화번호를 서버에 전달
      });

      if (response.status === 202) {
        setIsPhoneCodeSent(true); // 인증 코드 발송 완료
        setIsTimerRunning(true); // 타이머 시작
        setTimer(180); // 3분 타이머 시작
        console.log("인증 코드 발송 완료!");
      } else if (response.status === 409) {
        setErrors({ ...errors, phone: '이미 가입된 휴대폰 번호입니다.' });
      }
    } catch (error) {
      console.error("휴대폰 인증 실패:", error);
    }
  };

  // 휴대폰 인증번호 검증 요청 (API 호출)
  const handlePhoneCodeVerification = async () => {
    if (!verificationCode) {
      setErrors({ ...errors, phone: '인증 코드를 입력해주세요.' });
      return;
    }

    try {
      console.log("입력된 인증 코드:", verificationCode);
      const response = await fetch('http://192.168.1.10:8080/sms/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: formData.phone, code: verificationCode }),
      });

      if (response.status === 200) {
        console.log("휴대폰 인증 완료!");
        setIsPhoneVerified(true); // 휴대폰 인증 성공
        setIsTimerRunning(false); // 타이머 중지
        alert("휴대폰 인증이 완료되었습니다!");
      } else {
        setErrors({ ...errors, phone: '인증 코드가 올바르지 않습니다.' });
      }
    } catch (error) {
      console.error("휴대폰 인증 검증 실패:", error);
    }
  };

// 로컬 테스트용: 휴대폰 인증 코드 생성 (실제 서비스에서는 서버에서 처리)
const handlePhoneVerify = () => {
  setIsPhoneCodeSent(true); // 인증 코드 입력칸과 버튼 표시
  const generatedCode = "654321"; // 실제 환경에서는 서버에서 생성한 코드 사용
  setGeneratedPhoneCode(generatedCode); // 생성된 코드 저장
  alert(`휴대폰 인증 코드: ${generatedCode}`); // 실제 서비스에서는 사용자에게 SMS 발송
};

// 로컬 테스트용: 입력한 코드 검증 (실제 서비스에서는 API 요청 필요)
const handlePhoneCodeCheck = () => {
  if (verificationCode === generatedPhoneCode) {
    setIsPhoneVerified(true); // 인증 완료 상태 변경
    alert("휴대폰 인증이 완료되었습니다.");
  } else {
    alert("인증 코드가 틀렸습니다. 다시 입력해주세요.");
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
        <input type="email" placeholder="이메일 입력" value={formData.email} disabled={isEmailVerified} onChange={handleEmailChange} />
        {!isEmailVerified && <button onClick={handleEmailVerification} disabled={isEmailVerified}>이메일 인증</button>}

          {/* 인증 코드 입력 UI (isEmailCodeSent가 true일 때만 표시) */}
      {isEmailCodeSent && (
        <div style={{ marginTop: "10px" }}> {/* 이메일 입력칸과 간격 조정 */}
          <input
            type="text" placeholder="인증 코드 입력" value={emailVerificationCode} onChange={(e) => setEmailVerificationCode(e.target.value)} disabled={isEmailVerified} // 인증 완료 시 입력 불가능
            />
          <button onClick={handleCodeVerify} disabled={isEmailVerified}>코드 인증</button>
        </div>
      )}
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