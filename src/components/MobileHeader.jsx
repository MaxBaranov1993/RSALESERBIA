import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/svg/logo.svg';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const MobileHeader = () => {
  const { t } = useLanguage();
  
  return (
    <div className="w-full px-4">
      {/* Верхняя панель: логотип + флаги */}
      <header className="w-full py-3 flex items-center justify-between">
        {/* Логотип слева */}
        <Link to="/" className="flex items-center gap-1">
          <img src={logo} alt="Logo" className="h-5" />
        </Link>

        {/* Переключатель языков справа */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
        </div>
      </header>
    </div>
  );
};

export default MobileHeader;
