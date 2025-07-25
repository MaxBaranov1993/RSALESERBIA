import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/svg/logo.svg';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const MobileHeader = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Обработка поиска
  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) return;
    
    // Перенаправляем на страницу поиска
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  }, [navigate]);

  // Обработка отправки формы
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  }, [searchQuery, handleSearch]);

  // Обработка клавиш
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
      }
    }
  }, [searchQuery, handleSearch]);

  // Обработка изменения ввода
  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // На мобильных устройствах Enter может не срабатывать, поэтому добавляем обработку через изменение
    if (value.includes('\n')) {
      e.preventDefault();
      const cleanValue = value.replace('\n', '').trim();
      if (cleanValue) {
        setSearchQuery(cleanValue);
        handleSearch(cleanValue);
      }
    }
  }, [handleSearch]);

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
      <div className="pb-0.5">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (searchQuery.trim()) {
                  handleSearch(searchQuery);
                }
              }
            }}
            placeholder={t('header.search')}
            className="w-full px-4 py-2 rounded-lg bg-gray-200 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-600"
          />
        </form>
      </div>
    </div>
  );
};

export default MobileHeader;
