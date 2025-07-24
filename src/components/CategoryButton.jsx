import React from 'react';

export default function CategoryButton({ onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]${active ? ' ring-2 ring-violet-400' : ''}`}
    >
      Категории
    </button>
  );
} 