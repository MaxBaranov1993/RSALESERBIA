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

      {/* Поисковый инпут — отдельный блок ниже */}
      <div className=" pt-5">
        <input
          type="text"
          placeholder={t('header.search')}
          className="w-full px-4 py-2 rounded-lg bg-gray-200 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-600"
        />
      </div>
    </div>
  );
};

export default MobileHeader;
