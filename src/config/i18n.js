import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from '../locales/en.json'; 
import frTranslation from '../locales/fr.json'
import deTranslation from '../locales/de.json'; 
import zhTranslation from '../locales/zh.json'; 

const resources = {
  en: { translation: enTranslation }, 
  fr: { translation: frTranslation }, 
  de: { translation: deTranslation },  
  zh: { translation: zhTranslation }   
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: 'en', 
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
