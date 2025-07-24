import React, { createContext, useContext, useState, useEffect } from 'react';
import ru from '../locales/ru.json';
import en from '../locales/en.json';
import sr from '../locales/sr.json';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('ru'); // Русский по умолчанию
  const [translations, setTranslations] = useState(ru);

  const languages = {
    ru: { name: 'Русский', flag: '🇷🇺', translations: ru },
    en: { name: 'English', flag: '🇬🇧', translations: en },
    sr: { name: 'Српски', flag: '🇷🇸', translations: sr }
  };

  useEffect(() => {
    // Загружаем сохраненный язык из localStorage
    const savedLanguage = localStorage.getItem('language') || 'ru';
    setCurrentLanguage(savedLanguage);
    setTranslations(languages[savedLanguage].translations);
  }, []);

  const changeLanguage = (languageCode) => {
    if (languages[languageCode]) {
      setCurrentLanguage(languageCode);
      setTranslations(languages[languageCode].translations);
      localStorage.setItem('language', languageCode);
    }
  };

  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Возвращаем ключ, если перевод не найден
      }
    }
    
    let result = value || key;
    
    // Заменяем параметры в строке
    if (typeof result === 'string' && Object.keys(params).length > 0) {
      Object.keys(params).forEach(param => {
        result = result.replace(new RegExp(`{${param}}`, 'g'), params[param]);
      });
    }
    
    return result;
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    languages,
    availableLanguages: Object.keys(languages)
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 