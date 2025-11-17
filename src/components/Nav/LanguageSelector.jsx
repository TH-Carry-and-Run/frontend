import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

// 간단한 언어 메타 (국기 + 라벨)
const LANG_META = {
  ko: { flag: "🇰🇷", label: "한국어" },
  en: { flag: "🇺🇸", label: "English" },
};

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const toggle = () => setOpen((o) => !o);
  const close = () => setOpen(false);

  // 바깥 클릭 시 닫기
  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) close();
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleSelect = (code) => {
    setLanguage(code); // Provider가 localStorage까지 저장
    close();
  };

  const current = LANG_META[language] || LANG_META.en;

  return (
    <div className="language-selector" ref={ref}>
      {/* 현재 언어 표시 버튼 (국기 + 라벨) */}
      <button
        className="lang-btn icon-button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggle}
        title="Change language"
      >
        <span style={{ marginRight: 6 }}>{current.flag}</span>
        <span style={{ fontSize: 14 }}>{current.label}</span>
      </button>

      {open && (
        <ul className="lang-dropdown" role="listbox" aria-label="Select language">
          {Object.entries(LANG_META).map(([code, meta]) => (
            <li
              key={code}
              role="option"
              aria-selected={language === code}
              className={language === code ? "active" : ""}
              onClick={() => handleSelect(code)}
            >
              <span style={{ marginRight: 8 }}>{meta.flag}</span>
              {meta.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSelector;