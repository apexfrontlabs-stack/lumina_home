import React, { createContext, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <LanguageContext.Provider value={{ t, currentLang: i18n.language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useAppLanguage = () => useContext(LanguageContext);
