import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CategoryButton from './CategoryButton';
import ReactDOM from 'react-dom';
import logo from '../assets/svg/logo.svg';
import serbia from '../assets/svg/serbia.svg';
import eng from '../assets/svg/eng.svg';
import russia from '../assets/svg/russia.svg';
import map from '../assets/svg/map.svg';
import message from '../assets/svg/message.svg';
import categories from './categoriesData';
import CategoriesList from './CategoriesList';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import UserAvatar from './UserAvatar';

export default function Header() {
  const [showCategories, setShowCategories] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Загружаем недавние поиски из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Error parsing recent searches:', error);
      }
    }
  }, []);

  // Сохраняем поиск в недавние
  const saveToRecentSearches = useCallback((searchQuery) => {
    if (!searchQuery.trim()) return;
    
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  }, [recentSearches]);

  // Обработка поиска
  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) return;

    // Сохраняем в недавние поиски
    saveToRecentSearches(query.trim());
    
    // Перенаправляем на страницу поиска
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setShowSuggestions(false);
  }, [navigate, saveToRecentSearches]);

  // Обработка отправки формы (для мобильных устройств)
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  }, [searchQuery, handleSearch]);

  // Обработка клика по недавнему поиску
  const handleRecentSearchClick = useCallback((recentQuery) => {
    setSearchQuery(recentQuery);
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  }, []);

  // Обработка очистки поиска
  const handleClear = useCallback(() => {
    setSearchQuery('');
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  }, []);

  // Обработка клавиш
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      searchInputRef.current?.blur();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
      }
    }
  }, [searchQuery, handleSearch]);

  // Обработка изменения ввода (для мобильных устройств)
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

  // Обработка input события (для мобильных устройств)
  const handleInput = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);
  }, []);

  // Автоматический показ предложений при вводе (с задержкой)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim() && searchQuery.length >= 2) {
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Закрытие предложений при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="shadow-md w-full">
      {/* Topbar */}
      <div className="bg-gray-50 border-b border-gray-100 text-gray-600 text-xs sm:text-sm">
        <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 py-2 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <img src={map} alt="map" className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="font-medium">{t('header.location')}</span>
          </div>
          <nav className="hidden sm:flex gap-4 lg:gap-8">
            <Link to="#" className="hover:text-gray-900 transition-colors duration-200">{t('header.about')}</Link>
            <Link to="#" className="hover:text-gray-900 transition-colors duration-200">{t('header.news')}</Link>
            <Link to="#" className="hover:text-gray-900 transition-colors duration-200">{t('header.advertising')}</Link>
            <Link to="/users" className="hover:text-gray-900 transition-colors duration-200">{t('header.users')}</Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
      {/* Main header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto flex items-center gap-3 sm:gap-4 md:gap-6 px-4 sm:px-6 py-3 sm:py-4 md:py-5">
          <Link to="/" className="flex-shrink-0">
            <img src={logo} alt="Logo" className="h-8 sm:h-10 md:h-12" />
          </Link>
          <CategoryButton onClick={() => setShowCategories(!showCategories)} active={showCategories} />
          <div className="flex-1 flex items-center max-w-lg lg:max-w-2xl relative">
            <form onSubmit={handleSubmit} className="relative w-full flex">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                onInput={handleInput}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
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
                className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-l-lg sm:rounded-l-xl bg-gray-50 text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:bg-white border border-r-0 border-gray-200 transition-all duration-200 text-sm sm:text-base ${isSearchFocused ? 'ring-2 ring-violet-600' : ''}`}
              />
              
              <button 
                type="submit"
                className={`px-4 sm:px-6 py-2 sm:py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-r-lg sm:rounded-r-xl transition-all duration-200 text-sm sm:text-base shadow-lg hover:shadow-xl border-0 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transform hover:scale-[1.02] ${isSearchFocused ? 'ring-2 ring-violet-600' : ''}`}
                style={{ backgroundColor: '#f97316', color: 'white' }}
              >
                {t('header.find')}
              </button>
            </form>

            {/* Выпадающие предложения */}
            {showSuggestions && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg top-full">
                {/* Недавние поиски */}
                {recentSearches.length > 0 && (
                  <div className="p-3 border-b border-gray-100">
                    <div className="text-xs font-medium text-gray-500 mb-2">Недавние поиски</div>
                    <div className="space-y-1">
                      {recentSearches.map((recentQuery, index) => (
                        <button
                          key={index}
                          onClick={() => handleRecentSearchClick(recentQuery)}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors flex items-center"
                        >
                          <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {recentQuery}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Быстрые фильтры */}
                <div className="p-3">
                  <div className="text-xs font-medium text-gray-500 mb-2">Популярные категории</div>
                  <div className="flex flex-wrap gap-2">
                    {['Электроника', 'Одежда', 'Авто', 'Недвижимость', 'Услуги'].map((category) => (
                      <button
                        key={category}
                        onClick={() => handleRecentSearchClick(category)}
                        className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            <button className="relative p-2 sm:p-3 rounded-full hover:bg-gray-100 transition-colors duration-200">
              <img src={message} alt="messages" className="h-5 w-5 sm:h-6 sm:w-6" />
              {/* Можно добавить badge */}
            </button>
            <UserAvatar />
          </div>
        </div>
      </div>
      {/* Выпадающее меню категорий через портал */}
      {showCategories && typeof window !== 'undefined' && ReactDOM.createPortal(
        <div className="fixed inset-0 z-40 flex items-start justify-center bg-black bg-opacity-40 backdrop-blur-sm" onClick={() => setShowCategories(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 mt-28 max-w-5xl w-full mx-4 relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Колонка 1 */}
                <div>
                  <h3 className="font-bold text-xl mb-6 text-gray-900 border-b border-gray-200 pb-4">Товары</h3>
                  <CategoriesList categories={categories} />
                </div>
                {/* Колонка 2 */}
                <div>
                  <h3 className="font-bold text-xl mb-6 text-gray-900 border-b border-gray-200 pb-4">Недвижимость</h3>
                  <ul className="space-y-3">
                    {['Купить жильё', 'Все квартиры', 'Вторичка', 'Новостройки', 'Дома, дачи, коттеджи', 'Комнаты'].map((item) => (
                      <li key={item}>
                        <Link to={`/real-estate/${item.toLowerCase().replace(/[, ]/g, '-')}`} className="text-gray-700 hover:text-violet-600 transition-colors duration-200 block py-1">
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Колонка 3 */}
                <div>
                  <h3 className="font-bold text-xl mb-6 text-gray-900 border-b border-gray-200 pb-4">Путешествия</h3>
                  <ul className="space-y-3">
                    {['Квартиры', 'Дома, дачи и коттеджи', 'Комнаты и койко-места', 'Отели'].map((item) => (
                      <li key={item}>
                        <Link to={`/travel/${item.toLowerCase().replace(/[, ]/g, '-')}`} className="text-gray-700 hover:text-violet-600 transition-colors duration-200 block py-1">
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-3xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setShowCategories(false)}
              aria-label="Закрыть"
            >
              ×
            </button>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}