import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useLanguage } from '../context/LanguageContext';
import ImageSlider from './ImageSlider';
import eyeIcon from '../assets/svg/eye.svg';
import favoriteWhite from '../assets/svg/favorite-white.svg';
import favoriteOrange from '../assets/svg/favorite-orange.svg';

export default function ProductCard({ product }) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { t } = useLanguage();
  
  const formatPrice = (price) => {
    if (price >= 1000) {
      return `€${(price / 1000).toFixed(1)}k`;
    }
    return `€${price}`;
  };

  // Генерируем инициалы для аватара продавца
  const getSellerInitials = (sellerName) => {
    if (!sellerName) return 'U';
    const names = sellerName.split(' ');
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
    }
    return sellerName.charAt(0).toUpperCase();
  };

  // Генерируем цвет для аватара продавца
  const getSellerAvatarColor = (sellerName) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-gray-500'
    ];
    const index = (sellerName?.length || 0) % colors.length;
    return colors[index];
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const isProductFavorite = isFavorite(product.id);
  const sellerName = product.sellerName || product.seller;

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 transform hover:scale-[1.01] border border-gray-100">
        <div className="relative">
          <ImageSlider 
            images={product.photos || product.images || [product.photo || product.image]} 
            title={product.title}
          />
          {product.isService && (
            <div className="absolute top-2 left-2 bg-violet-600 text-white px-2 py-1 rounded-full text-xs font-semibold z-10 shadow-md">
              {t('product.service')}
            </div>
          )}
          <button 
            onClick={handleFavoriteClick}
            className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 z-10 shadow-md ${
              isProductFavorite 
                ? 'bg-orange-500 hover:bg-orange-600' 
                : 'bg-white/90 hover:bg-white'
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
        </div>
      
        <div className="p-3 sm:p-4">
          <h3 className="font-semibold text-sm sm:text-base mb-2 text-gray-800 truncate leading-tight">{product.title}</h3>
          
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs sm:text-sm text-gray-500">
              {product.street && product.houseNumber ? (
                <div>
                  <div className="font-medium">{product.street}, {product.houseNumber}</div>
                  <div className="text-xs text-gray-400">{product.city}</div>
                </div>
              ) : (
                <span className="font-medium">{product.city}</span>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-base sm:text-lg text-violet-600">{formatPrice(product.price)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-600">
              {product.sellerId ? (
                <Link 
                  to={`/user/${product.sellerId}`} 
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-semibold ${getSellerAvatarColor(sellerName)}`}>
                    {getSellerInitials(sellerName)}
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-1">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-semibold ${getSellerAvatarColor(sellerName)}`}>
                    {getSellerInitials(sellerName)}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center text-xs text-gray-500">
              <span className="flex items-center gap-1 text-orange-500">
                <img src={eyeIcon} alt="views" className="w-3 h-3" />
                {product.views}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}