import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 Link import
import axios from "axios";
import "../components/styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailValid, setEmailValid] = useState(false);  //emailValid: 이메일 유효성 테스트 값 저장
  const [pwValid, setPasswordValid] = useState(false);  // pwValid: 비밀번호 유효성 테스트 값 저장
  const [notAllow, setNotAllow] = useState(true); // notAllow: 로그인 버튼의 비활성화 여부를 저장하는 변수  // 입력값이 유효할 때만 버튼이 활성화됨
  const navigate = useNavigate();

  
  // 이메일 입력값이 변경될 때 실행되는 함수
  const handleEmail = (e) => {
    const value = e.target.value;
    setEmail(value);
    // 이메일 유효성 검사 (일반적인 이메일 형식 체크)
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,}$/;
    setEmailValid(regex.test(value));
  };
  
  const handlePw = (e) => {
    const value = e.target.value;
    setPassword(value);
    const regex =
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[$~!@$.%^&*()?_\-+=]).{8,}$/;
    setPasswordValid(regex.test(value));
  };
  
  const onClickConfirmButton = async () => {
    try {
      const response = await axios.post("http://192.168.1.19:8080/api/users/login", {
        email,
        password,
      },
      {
        withCredentials: true, // 쿠키를 포함하여 요청
      });

      console.log(response);

      if (response.data.message === "로그인 성공") {

        alert("로그인이 완료되었습니다.");
        navigate('/main');
        
      } else {
        alert("로그인 실패: " + response.data.message);
      }
    } catch (error) {
      alert("서버 오류 또는 로그인 실패");
      console.error("로그인 에러:", error);
    }
  };
  
  useEffect(() => {
    if (emailValid && pwValid) {
      setNotAllow(false);
    } else {
      setNotAllow(true);
    }
  }, [emailValid, pwValid]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#efefef'
      }}
    >
      <div className="page">
        <div className="titleWrap">
          <br />
          로그인
        </div>
  
        <div className="contentWrap">
          <div className="inputTitle">이메일 주소</div>
          <div className="inputWrap">
            <input
              type="text"
              className="input"
              placeholder="example@email.com"
              value={email}
              onChange={handleEmail}
            />
          </div>
          <div className="errorMessageWrap">
            {!emailValid && email.length > 0 && (
              <div>올바른 이메일을 입력해주세요.</div>
            )}
          </div>
  
          <div style={{ marginTop: "26px" }} className="inputTitle">
            비밀번호
          </div>
          <div className="inputWrap">
            <input
              type="password"
              className="input"
              placeholder="소문자, 숫자, 특수문자 포함 8자 이상"
              value={password}
              onChange={handlePw}
            />
          </div>
          {/* <div className="errorMessageWrap">
            {!pwValid && password.length > 0 && (
              <div>소문자, 숫자, 특수문자 포함 8자 이상 입력해주세요</div>
            )}
          </div> */}
  
          <div className="buttonWrap">
            <button onClick={onClickConfirmButton}>
              로그인
            </button>
          </div>
  
          <hr style={{ borderTop: "1px solid black" }} />
  
          <div className="registerWrap">
            <div className="registerTitle">
              계정이 없으신가요? <Link to="/signup">가입하기</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}