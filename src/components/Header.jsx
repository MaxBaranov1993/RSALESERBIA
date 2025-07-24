import { useState } from 'react';
import { Link } from 'react-router-dom';
import CategoryButton from './CategoryButton';
import ReactDOM from 'react-dom';
import logo from '../assets/svg/logo.svg';
import serbia from '../assets/svg/serbia.svg';
import eng from '../assets/svg/eng.svg';
import map from '../assets/svg/map.svg';
import message from '../assets/svg/message.svg';
import categories from './categoriesData';
import CategoriesList from './CategoriesList';

export default function Header() {
  const [showCategories, setShowCategories] = useState(false);

  return (
    <header className="shadow-md w-full">
      {/* Topbar */}
      <div className=" text-dark text-sm">
        <div className="container mx-auto flex justify-between items-center px-4 py-2">
          <div className="flex items-center gap-2">
            <img src={map} alt="map" className="h-4 w-4" />
            <span>Beograd</span>
          </div>
          <nav className="flex gap-6">
            <Link to="#" className="hover:underline">About</Link>
            <Link to="#" className="hover:underline">News</Link>
            <Link to="#" className="hover:underline">Advertising</Link>
          </nav>
          <div className="flex items-center gap-3">
            <img src={serbia} alt="Serbian" className="w-6 h-4 rounded" />
            <img src={eng} alt="English" className="w-6 h-4 rounded" />
          </div>
        </div>
      </div>
      {/* Main header */}
      <div className="bg-white">
        <div className="container mx-auto flex items-center gap-4 px-4 py-4">
          <Link to="/">
            <img src={logo} alt="Logo" className="h-10" />
          </Link>
          <CategoryButton onClick={() => setShowCategories(!showCategories)} active={showCategories} />
          <div className="flex-1 flex items-center">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search"
                className="w-full  px-2 py-2  rounded-lg bg-gray-100 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-600 border border-gray-200"
              />
             
            </div>
          </div>
          <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
            <img src={message} alt="messages" className="h-7 w-7" />
            {/* Можно добавить badge */}
          </button>
          <Link to="/login" className="ml-2 flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118A7.5 7.5 0 0112 15.75a7.5 7.5 0 017.5 4.5" />
            </svg>
            Войти
          </Link>
        </div>
      </div>
      {/* Выпадающее меню категорий через портал */}
      {showCategories && typeof window !== 'undefined' && ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-30" onClick={() => setShowCategories(false)}>
          <div
            className="bg-white p-4 rounded shadow-lg border border-gray-200 mt-24 max-w-4xl w-full relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Колонка 1 */}
              <div>
                <h3 className="font-bold text-lg mb-3 text-gray-800 border-b pb-2">Товары</h3>
                <CategoriesList categories={categories} />
              </div>
              {/* Колонка 2 */}
              <div>
                <h3 className="font-bold text-lg mb-3 text-gray-800 border-b pb-2">Недвижимость</h3>
                <ul className="space-y-2">
                  {['Купить жильё', 'Все квартиры', 'Вторичка', 'Новостройки', 'Дома, дачи, коттеджи', 'Комнаты'].map((item) => (
                    <li key={item}>
                      <Link to={`/real-estate/${item.toLowerCase().replace(/[, ]/g, '-')}`} className="text-gray-700 hover:text-blue-600">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Колонка 3 */}
              <div>
                <h3 className="font-bold text-lg mb-3 text-gray-800 border-b pb-2">Путешествия</h3>
                <ul className="space-y-2">
                  {['Квартиры', 'Дома, дачи и коттеджи', 'Комнаты и койко-места', 'Отели'].map((item) => (
                    <li key={item}>
                      <Link to={`/travel/${item.toLowerCase().replace(/[, ]/g, '-')}`} className="text-gray-700 hover:text-blue-600">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
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