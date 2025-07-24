import React from 'react';
import { Link } from 'react-router-dom';
import Searchicon from '../assets/svg/Searchicon.svg';
import Favorite from '../assets/svg/Favorite.svg';
import addIcon from '../assets/svg/add.svg';
import messageIcon from '../assets/svg/message.svg';
import personalIcon from '../assets/svg/personal.svg';
import { useFavorites } from '../context/FavoritesContext';
import { useLanguage } from '../context/LanguageContext';

// Константы для стилей
const STYLES = {
  base: "flex flex-col items-center justify-center gap-1 p-3 rounded-xl transition-all duration-200",
  regular: "text-gray-500 hover:text-orange-600 hover:bg-orange-50",
  special: "",
  icon: {
    regular: "w-6 h-6",
    special: "w-8 h-8"
  },
  filter: {
    regular: "filter brightness-0 invert-[0.5]",
    special: ""
  }
};

// Оптимизированный компонент MenuItem
const MenuItem = React.memo(({ icon, label, href, isSpecial = false, isFavorite = false }) => {
  const { getFavoritesCount } = useFavorites();
  const favoritesCount = getFavoritesCount();
  
  const iconSize = isSpecial ? STYLES.icon.special : STYLES.icon.regular;
  const iconFilter = isSpecial ? STYLES.filter.special : STYLES.filter.regular;
  const buttonClasses = `${STYLES.base} ${isSpecial ? STYLES.special : STYLES.regular}`;

  const iconElement = (
    <div className="relative">
      <img 
        src={icon} 
        alt={label} 
        className={`${iconSize} transition-transform duration-200 ${iconFilter}`}
      />
      {isFavorite && favoritesCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-violet-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
          {favoritesCount}
        </span>
      )}
    </div>
  );

  const content = (
    <>
      {iconElement}
      {!isSpecial && <span className="text-xs font-medium">{label}</span>}
    </>
  );

  if (href) {
    return (
      <Link to={href} className={buttonClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button className={buttonClasses}>
      {content}
    </button>
  );
});

MenuItem.displayName = 'MenuItem';

// Основной компонент
const MobileBottomMenu = React.memo(() => {
  const { t } = useLanguage();
  
  const MENU_ITEMS = [
    { icon: Searchicon, label: t('mobile.search') },
    { icon: Favorite, label: t('mobile.favorites'), href: "/favorites", isFavorite: true },
    { icon: addIcon, label: t('mobile.add'), isSpecial: true },
    { icon: messageIcon, label: t('mobile.messages') },
    { icon: personalIcon, label: t('mobile.profile'), href: "/profile" }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden pb-safe">
      <div className="flex items-center justify-between text-gray-600 py-3 max-w-sm mx-auto">
        {MENU_ITEMS.map((item, index) => (
          <MenuItem 
            key={`${item.label}-${index}`}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isSpecial={item.isSpecial}
            isFavorite={item.isFavorite}
          />
        ))}
      </div>
    </div>
  );
});

MobileBottomMenu.displayName = 'MobileBottomMenu';

export default MobileBottomMenu;