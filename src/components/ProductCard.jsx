import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useLanguage } from '../context/LanguageContext';

export default function ProductCard({ product }) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { t } = useLanguage();
  
  const formatPrice = (price) => {
    if (price >= 1000) {
      return `€${(price / 1000).toFixed(1)}k`;
    }
    return `€${price}`;
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

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]">
        <div className="relative">
          <img 
            src={product.photo || product.image} 
            alt={product.title} 
            className="w-full h-48 object-cover"
          />
        {product.isService && (
          <div className="absolute top-2 left-2 bg-violet-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            {t('product.service')}
          </div>
        )}
        <button 
          onClick={handleFavoriteClick}
          className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
            isProductFavorite 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-white/80 hover:bg-white'
          }`}
        >
          <svg 
            className={`w-5 h-5 transition-all duration-200 ${
              isProductFavorite ? 'text-white fill-current' : 'text-gray-600'
            }`} 
            fill={isProductFavorite ? 'currentColor' : 'none'} 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={isProductFavorite ? 0 : 2} 
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" 
            />
          </svg>
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-gray-800 truncate">{product.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500">{product.city}</span>
          <span className="text-xs text-gray-400">{product.condition}</span>
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <span className="font-bold text-xl text-violet-600">{formatPrice(product.price)}</span>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>👁 {product.views} {t('product.views')}</span>
            <span>❤ {product.favorites} {t('product.favorites')}</span>
          </div>
        </div>
        
        <div className="text-sm text-gray-600 mb-3 truncate">
          {t('product.seller')}: {product.sellerName || product.seller}
        </div>
        
        <button className="w-full bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium">
          {product.isService ? t('product.order') : t('product.addToCart')}
        </button>
      </div>
    </div>
    </Link>
  );
}