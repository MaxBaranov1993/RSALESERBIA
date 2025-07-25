import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function SearchBar({ onSearch, placeholder = "Поиск товаров и услуг...", className = "" }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
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

  // Обработка отправки формы
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setShowSuggestions(false);
    
    try {
      // Сохраняем в недавние поиски
      saveToRecentSearches(query.trim());
      
      // Вызываем callback если передан
      if (onSearch) {
        await onSearch(query.trim());
      } else {
        // По умолчанию перенаправляем на страницу поиска
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [query, onSearch, navigate, saveToRecentSearches]);

  // Обработка клика по недавнему поиску
  const handleRecentSearchClick = useCallback((recentQuery) => {
    setQuery(recentQuery);
    setShowSuggestions(false);
    inputRef.current?.focus();
  }, []);

  // Обработка очистки поиска
  const handleClear = useCallback(() => {
    setQuery('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  }, []);

  // Обработка клавиш
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  }, []);

  // Автоматический поиск при вводе (с задержкой)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim() && query.length >= 2) {
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Закрытие предложений при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          {/* Иконка поиска */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg 
              className={`h-5 w-5 ${isFocused ? 'text-violet-500' : 'text-gray-400'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>

          {/* Поле ввода */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`
              w-full pl-10 pr-12 py-3 border rounded-lg transition-all duration-200
              ${isFocused 
                ? 'border-violet-500 ring-2 ring-violet-500/20' 
                : 'border-gray-300 hover:border-gray-400'
              }
              focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500
            `}
            autoComplete="off"
          />

          {/* Кнопка очистки */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-16 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Кнопка поиска */}
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className={`
              absolute inset-y-0 right-0 flex items-center px-4 rounded-r-lg transition-all duration-200
              ${isLoading || !query.trim()
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-violet-600 text-white hover:bg-violet-700 active:bg-violet-800'
              }
            `}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </button>
        </div>
      </form>

      {/* Выпадающие предложения */}
      {showSuggestions && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
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
  );
}