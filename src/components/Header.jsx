import { useState } from 'react';
import { Link } from 'react-router-dom';
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
  const { t } = useLanguage();

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
            <Link to="/users" className="hover:text-gray-900 transition-colors duration-200">Пользователи</Link>
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
          <div className="flex-1 flex items-center max-w-lg lg:max-w-2xl">
            <div className="relative w-full flex">
              <input
                type="text"
                placeholder={t('header.search')}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-l-lg sm:rounded-l-xl bg-gray-50 text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:bg-white border border-r-0 border-gray-200 transition-all duration-200 text-sm sm:text-base ${isSearchFocused ? 'ring-2 ring-violet-600' : ''}`}
              />
              <button 
                type="button"
                className={`px-4 sm:px-6 py-2 sm:py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-r-lg sm:rounded-r-xl transition-all duration-200 text-sm sm:text-base shadow-lg hover:shadow-xl border-0 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transform hover:scale-[1.02] ${isSearchFocused ? 'ring-2 ring-violet-600' : ''}`}
                style={{ backgroundColor: '#f97316', color: 'white' }}
              >
                {t('header.find')}
              </button>
            </div>
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