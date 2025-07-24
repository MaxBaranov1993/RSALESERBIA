import React from 'react';
import logo from '../assets/svg/logo.svg';
import serbia from '../assets/svg/serbia.svg';
import eng from '../assets/svg/eng.svg';

const MobileHeader = () => {
  return (
    <div className="w-full px-4">
      {/* Верхняя панель: логотип + флаги */}
      <header className="w-full py-3 flex items-center justify-between">
        {/* Логотип слева */}
        <div className="flex items-center gap-1">
          <img src={logo} alt="Logo" className="h-5" />
        </div>

        {/* Флаги справа */}
        <div className="flex items-center gap-2">
          <img src={serbia} alt="Serbian" className="w-6 h-4 rounded" />
          <img src={eng} alt="English" className="w-6 h-4 rounded" />
        </div>
      </header>

      {/* Поисковый инпут — отдельный блок ниже */}
      <div className=" pt-5">
        <input
          type="text"
          placeholder="Поиск..."
          className="w-full px-4 py-2 rounded-lg bg-gray-200 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-600"
        />
      </div>
    </div>
  );
};

export default MobileHeader;
