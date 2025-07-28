import React, { useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useLanguage } from '../context/LanguageContext';
import ImageSlider from './ImageSlider';
import eyeIcon from '../assets/svg/eye.svg';
import favoriteWhite from '../assets/svg/favorite-white.svg';
import favoriteOrange from '../assets/svg/favorite-orange.svg';
import { translateCity } from '../utils/cityTranslations';

export default function ProductCard({ product }) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { t } = useLanguage();

  // Мемоизированные данные
  const isProductFavorite = useMemo(() => isFavorite(product.id), [isFavorite, product.id]);
  const sellerName = useMemo(() => product.sellerName || product.seller, [product.sellerName, product.seller]);
  const galleryImages = useMemo(() => {
    if (product.photos && product.photos.length > 1) {
      return product.photos;
    }
    return [product.photo || product.image];
  }, [product.photos, product.photo, product.image]);

  // Утилитарные функции
  const formatPrice = useCallback((price) => {
    if (price >= 1000) {
      return `€${(price / 1000).toFixed(1)}k`;
    }
    return `€${price}`;
  }, []);

  const getSellerInitials = useCallback((sellerName) => {
    if (!sellerName) return 'U';
    const names = sellerName.split(' ');
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
    }
    return sellerName.charAt(0).toUpperCase();
  }, []);

  const getSellerAvatarColor = useCallback((sellerName) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-gray-500'
    ];
    const index = (sellerName?.length || 0) % colors.length;
    return colors[index];
  }, []);

  // Обработчики событий
  const handleFavoriteClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isProductFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  }, [isProductFavorite, removeFromFavorites, addToFavorites, product]);

  // Компоненты для рендера
  const renderServiceBadge = () => {
    if (!product.isService) return null;
    
    return (
      <div className="absolute top-3 left-3 bg-violet-600 text-white px-3 py-1 rounded-full text-xs font-semibold z-10 shadow-lg">
        {t('product.service')}
      </div>
    );
  };

  const renderFavoriteButton = () => (
    <button 
      onClick={handleFavoriteClick}
      className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 z-10 shadow-lg hover:scale-110 ${
        isProductFavorite 
          ? 'bg-orange-500 hover:bg-orange-600' 
          : 'bg-white/95 hover:bg-white backdrop-blur-sm'
      }`}
      title={isProductFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
    >
      <img 
        src={isProductFavorite ? favoriteOrange : favoriteWhite} 
        alt={isProductFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
        className={`w-4 h-4 transition-all duration-200 ${
          isProductFavorite ? 'scale-110' : 'scale-100'
        }`} 
      />
    </button>
  );

  const renderAddress = () => {
    if (product.street && product.houseNumber) {
      return (
        <div className="truncate">
          <div className="font-medium text-gray-700 truncate">{product.street}, {product.houseNumber}</div>
          <div className="text-xs text-gray-400">{translateCity(product.city, t)}</div>
        </div>
      );
    }
    return <span className="font-medium text-gray-700">{translateCity(product.city, t)}</span>;
  };

  const renderSellerAvatar = () => {
    const avatarColor = getSellerAvatarColor(sellerName);
    const initials = getSellerInitials(sellerName);
    
    const avatarElement = (
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold ${avatarColor}`}>
        {initials}
      </div>
    );

    if (product.sellerId) {
      return (
        <Link 
          to={`/user/${product.sellerId}`} 
          className="text-blue-600 hover:text-blue-800 hover:underline font-medium flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {avatarElement}
          <span className="text-xs font-medium">{sellerName}</span>
        </Link>
      );
    }

    return (
      <div className="flex items-center gap-2">
        {avatarElement}
        <span className="text-xs font-medium text-gray-700">{sellerName}</span>
      </div>
    );
  };

  const renderViews = () => (
    <div className="flex items-center text-xs text-gray-500">
      <span className="flex items-center gap-1 text-gray-600">
        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span className="font-medium">{product.views}</span>
      </span>
    </div>
  );

  return (
    <Link to={`/product/${product.id}`} className="block group">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] border border-gray-100 flex flex-col overflow-hidden">
        {/* Изображение товара */}
        <div className="relative h-52 flex-shrink-0 overflow-hidden">
          <ImageSlider 
            images={galleryImages} 
            title={product.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {renderServiceBadge()}
          {renderFavoriteButton()}
        </div>
      
        {/* Информация о товаре */}
        <div className="p-4 flex flex-col">
          {/* Название товара */}
          <h3 className="font-semibold text-sm mb-3 text-gray-900 line-clamp-2 leading-tight min-h-[2.5rem]">
            {product.title}
          </h3>
          
          {/* Адрес */}
          <div className="mb-3">
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {renderAddress()}
            </div>
          </div>
          
          {/* Цена */}
          <div className="mb-3">
            <span className="font-bold text-lg text-violet-600">
              {formatPrice(product.price)}
            </span>
          </div>
          
          {/* Продавец и просмотры */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-600">
              {renderSellerAvatar()}
            </div>
            {renderViews()}
          </div>
        </div>
      </div>
    </Link>
  );
}