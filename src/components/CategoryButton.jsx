import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function CategoryButton({ onClick, active }) {
  const { t } = useLanguage();
  
  return (
    <button
      onClick={onClick}
      className={`px-4 sm:px-6 py-2 sm:py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg sm:rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-sm sm:text-base font-semibold${active ? ' ring-2 ring-violet-400' : ''}`}
    >
      {t('categories.title')}
    </button>
  );
} 