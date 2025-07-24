import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
    setIsOpen(false);
  };

  const currentLang = languages[currentLanguage];

  return (
    <div className="relative" ref={dropdownRef}>
             <button
         onClick={() => setIsOpen(!isOpen)}
         className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
       >
         <span className="text-lg">{currentLang.flag}</span>
         <svg
           className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
             isOpen ? 'rotate-180' : ''
           }`}
           fill="none"
           stroke="currentColor"
           viewBox="0 0 24 24"
         >
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
         </svg>
       </button>

             {isOpen && (
         <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
           {Object.entries(languages).map(([code, lang]) => (
             <button
               key={code}
               onClick={() => handleLanguageChange(code)}
               className={`w-full flex items-center justify-center gap-2 px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-150 ${
                 currentLanguage === code ? 'bg-violet-50 text-violet-700' : 'text-gray-700'
               }`}
             >
               <span className="text-lg">{lang.flag}</span>
               {currentLanguage === code && (
                 <svg className="w-4 h-4 text-violet-600" fill="currentColor" viewBox="0 0 20 20">
                   <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                 </svg>
               )}
             </button>
           ))}
         </div>
       )}
    </div>
  );
};

export default LanguageSwitcher; 