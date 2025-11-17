// src/context/LanguageContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";

// 전역 언어 Context 생성
export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // 현재 선택된 언어 (기본값: localStorage 값 또는 'ko')
  const [language, setLanguage] = useState(localStorage.getItem("lang") || "ko");

  // 언어 변경 시 localStorage에 저장 → 새로고침 후에도 유지됨
  useEffect(() => {
    localStorage.setItem("lang", language);
  }, [language]);

  return (
    // 모든 자식 컴포넌트가 language, setLanguage 사용 가능
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// 커스텀 훅 추가 (여기서 useContext 사용)
export const useLanguage = () => useContext(LanguageContext);