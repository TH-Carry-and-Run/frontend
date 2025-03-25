{isEmailCodeSent && (
    <div style={{ marginTop: "10px" }}> {/* 이메일 입력칸과 간격 조정 */}
      <input
        type="text" placeholder="인증 코드 입력" value={emailVerificationCode} onChange={(e) => setEmailVerificationCode(e.target.value)} disabled={isEmailVerified} // 인증 완료 시 입력 불가능
        />
      <button onClick="handleCodeVerify" disabled={isEmailVerified}>코드 인증</button> 
{/* 
    {/* <input 
      type="email"
      value={formData.email}
      onChange={handleEmailChange}
      placeholder="이메일 입력"
      disabled={isEmailCodeSent} // 인증 코드 요청 후 비활성화
    />

    <input 
      type="text"
      value={verificationCode}
      onChange={(e) => setVerificationCode(e.target.value)}
      placeholder="인증 코드 입력"
      disabled={isEmailVerified} // 인증 완료 시 비활성화
    />

    <button onClick={handleEmailVerification} disabled={isEmailCodeSent}>
      인증 코드 보내기
    </button> */}


    </div>
  )}