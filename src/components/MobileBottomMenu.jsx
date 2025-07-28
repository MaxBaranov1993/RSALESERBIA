import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Searchicon from '../assets/svg/Searchicon.svg';
import Favorite from '../assets/svg/Favorite.svg';
import addIcon from '../assets/svg/add.svg';
import messageIcon from '../assets/svg/message.svg';
import personalIcon from '../assets/svg/personal.svg';
import mapIcon from '../assets/svg/map.svg';
import { useFavorites } from '../context/FavoritesContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

// Константы для стилей
const STYLES = {
  base: "flex flex-col items-center justify-center gap-1 p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 flex-1 min-w-0",
  regular: "text-gray-600 hover:text-violet-600 hover:bg-violet-50",
  special: "bg-white text-orange-500 hover:bg-gray-50",
  icon: {
    regular: "w-6 h-6 sm:w-7 sm:h-7",
    special: "w-7 h-7 sm:w-8 sm:h-8"
  }
};

// Утилиты для аватара
const AVATAR_COLORS = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
  'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-gray-500'
];

const getInitials = (user) => {
  if (user?.firstName && user?.lastName) {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }
  if (user?.username) {
    return user.username.charAt(0).toUpperCase();
  }
  return 'U';
};

const getAvatarColor = (userId = 0) => {
  const index = userId % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

// Компонент иконки
const IconElement = React.memo(({ icon, label, isSpecial, isProfile, isFavorite, favoritesCount, user }) => {
  const iconSize = isSpecial ? STYLES.icon.special : STYLES.icon.regular;

  const renderIcon = () => {
    if (isProfile) {
      if (user) {
        return user.avatar ? (
          <img 
            src={user.avatar} 
            alt={`${user.firstName} ${user.lastName}`}
            className={`${iconSize} rounded-full object-cover border-2 border-gray-200`}
          />
        ) : (
          <div className={`${iconSize} rounded-full flex items-center justify-center text-white text-xs font-semibold ${getAvatarColor(user.id)}`}>
            {getInitials(user)}
          </div>
        );
      }
      return (
        <img 
          src={icon} 
          alt={label} 
          className={`${iconSize} transition-transform duration-200`}
        />
      );
    }

    return (
      <img 
        src={icon} 
        alt={label} 
        className={`${iconSize} transition-transform duration-200`}
      />
    );
  };

  return (
    <div className="relative">
      {renderIcon()}
      {isFavorite && favoritesCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-violet-600 text-white text-xs rounded-full h-3 w-3 sm:h-4 sm:w-4 flex items-center justify-center font-semibold shadow-lg">
          {favoritesCount}
        </span>
      )}
    </div>
  );
});

IconElement.displayName = 'IconElement';

// Компонент элемента меню
const MenuItem = React.memo(({ icon, label, href, isSpecial = false, isFavorite = false, isProfile = false }) => {
  const { getFavoritesCount } = useFavorites();
  const { user } = useAuth();
  const navigate = useNavigate();
  const favoritesCount = getFavoritesCount();
  
  const buttonClasses = `${STYLES.base} ${isSpecial ? STYLES.special : STYLES.regular}`;

  const content = (
    <>
      <IconElement 
        icon={icon}
        label={label}
        isSpecial={isSpecial}
        isProfile={isProfile}
        isFavorite={isFavorite}
        favoritesCount={favoritesCount}
        user={user}
      />
    </>
  );

  const handleClick = () => {
    if (isSpecial) {
      // Если пользователь авторизован - переход на страницу добавления товара
      // Если не авторизован - переход на страницу регистрации с добавлением товара
      if (user) {
        navigate('/add-product');
      } else {
        navigate('/register-with-product');
      }
    }
  };

  if (href) {
    return (
      <Link to={href} className={buttonClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button className={buttonClasses} onClick={handleClick}>
      {content}
    </button>
  );
});

MenuItem.displayName = 'MenuItem';

// Основной компонент
const MobileBottomMenu = React.memo(() => {
  const { t } = useLanguage();
  const { user } = useAuth();
  
  const menuItems = useMemo(() => [
    { icon: Searchicon, label: t('mobile.search') },
    { icon: Favorite, label: t('mobile.favorites'), href: "/favorites", isFavorite: true },
    { icon: mapIcon, label: t('mapSearch.title'), href: "/map-search" },
    { icon: addIcon, label: t('mobile.add'), isSpecial: true },
    { icon: personalIcon, label: t('mobile.profile'), href: user ? "/profile" : "/login", isProfile: true }
  ], [t, user]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl md:hidden pb-safe z-50">
      <div className="flex items-center justify-between text-gray-600 py-3 sm:py-4 px-3 sm:px-4 max-w-sm mx-auto gap-1">
        {menuItems.map((item, index) => (
          <MenuItem 
            key={`${item.label}-${index}`}
            {...item}
          />
        ))}
      </div>
    </div>
  );
});

MobileBottomMenu.displayName = 'MobileBottomMenu';

export default MobileBottomMenu;