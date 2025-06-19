// ProfileFormInput.js - 회원가입 폼 입력 필드 컴포넌트
import React from 'react';

import { validateForm } from '../../utils/userApi';

const ProfileFormInput = ({ id, label, formData, setFormData, error, setError, inputProps = {} }) => {
  // 입력값 변경 시 상태 업데이트
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [id]: e.target.value }));
    if (error && error[id]) {
      setError((prev) => ({ ...prev, [id]: '' })); // 에러 메시지 초기화
    }
  };

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={id}
        value={formData[id] || ''} // 초기값 설정 (null 방지)
        onChange={handleChange} // handleChange 사용 (오류 해결)
        {...inputProps} // 타입 지정 가능 (ex: type="password", type="email")
      />
      {error && error[id] && <span className="error-message">{error[id]}</span>}
    </div>
  );
};

export default ProfileFormInput;
