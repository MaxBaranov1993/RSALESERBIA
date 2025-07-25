import React from 'react';
import { Link } from 'react-router-dom';
import Searchicon from '../assets/svg/Searchicon.svg';
import Favorite from '../assets/svg/Favorite.svg';
import addIcon from '../assets/svg/add.svg';
import messageIcon from '../assets/svg/message.svg';
import personalIcon from '../assets/svg/personal.svg';
import { useFavorites } from '../context/FavoritesContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

// Константы для стилей
const STYLES = {
  base: "flex flex-col items-center justify-center gap-1 sm:gap-2 p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 flex-1",
  regular: "text-gray-600 hover:text-violet-600 hover:bg-violet-50",
  special: "bg-orange-500 text-white hover:bg-orange-600 shadow-lg",
  icon: {
    regular: "w-6 h-6 sm:w-7 sm:h-7",
    special: "w-8 h-8 sm:w-9 sm:h-9"
  },
  filter: {
    regular: "filter brightness-0 invert-[0.6]",
    special: "filter brightness-0 invert-0"
  }
};

// Оптимизированный компонент MenuItem
const MenuItem = React.memo(({ icon, label, href, isSpecial = false, isFavorite = false, isProfile = false }) => {
  const { getFavoritesCount } = useFavorites();
  const { user } = useAuth();
  const favoritesCount = getFavoritesCount();
  
  const iconSize = isSpecial ? STYLES.icon.special : STYLES.icon.regular;
  const iconFilter = isSpecial ? STYLES.filter.special : STYLES.filter.regular;
  const buttonClasses = `${STYLES.base} ${isSpecial ? STYLES.special : STYLES.regular}`;

  // Генерируем инициалы для аватара
  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Генерируем цвет для аватара
  const getAvatarColor = () => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-gray-500'
    ];
    const index = (user?.id || 0) % colors.length;
    return colors[index];
  };

  const iconElement = (
    <div className="relative">
      {isProfile && user ? (
        // Аватар пользователя
        user.avatar ? (
          <img 
            src={user.avatar} 
            alt={`${user.firstName} ${user.lastName}`}
            className={`${iconSize} rounded-full object-cover border-2 border-gray-200`}
          />
        ) : (
          <div className={`${iconSize} rounded-full flex items-center justify-center text-white text-xs font-semibold ${getAvatarColor()}`}>
            {getInitials()}
          </div>
        )
      ) : (
        // Обычная иконка
        <img 
          src={icon} 
          alt={label} 
          className={`${iconSize} transition-transform duration-200 ${iconFilter}`}
        />
      )}
      {isFavorite && favoritesCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-violet-600 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-semibold shadow-lg">
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
    { icon: personalIcon, label: t('mobile.profile'), href: "/profile", isProfile: true }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl md:hidden pb-safe">
      <div className="flex items-center justify-between text-gray-600 py-3 sm:py-4 px-4 sm:px-6 max-w-sm mx-auto gap-2">
        {MENU_ITEMS.map((item, index) => (
          <MenuItem 
            key={`${item.label}-${index}`}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isSpecial={item.isSpecial}
            isFavorite={item.isFavorite}
            isProfile={item.isProfile}
          />
        ))}
      </div>
    </div>
  );
});

MobileBottomMenu.displayName = 'MobileBottomMenu';

export default MobileBottomMenu;