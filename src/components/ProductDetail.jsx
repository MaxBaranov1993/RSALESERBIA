import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useFavorites } from '../context/FavoritesContext';
import Favorite from '../assets/svg/Favorite.svg';
import categories from './categoriesData';
import ProductImageSlider from './ProductImageSlider';
import LocationMap from './LocationMap';

const ProductDetail = ({ product }) => {
  const { t } = useLanguage();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Мемоизированные данные
  const galleryImages = useMemo(() => {
    if (product.photos && product.photos.length > 1) {
      return product.photos;
    }
    
    // Если фото одно, используем его как основное
    const baseImage = product.photo || product.photos?.[0];
    return [baseImage];
  }, [product.photos, product.photo]);

  const isInFavorites = useMemo(() => isFavorite(product.id), [isFavorite, product.id]);

  // Мемоизированная функция переключения избранного
  const handleFavoriteToggle = useCallback(() => {
    if (isInFavorites) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  }, [isInFavorites, removeFromFavorites, addToFavorites, product]);

  // Мемоизированные функции для состояния товара
  const getConditionText = useCallback((condition) => {
    const conditionMap = {
      'new': t('product.condition.new'),
      'excellent': t('product.condition.excellent'),
      'good': t('product.condition.good'),
      'satisfactory': t('product.condition.satisfactory'),
      'service': t('product.condition.service')
    };
    return conditionMap[condition] || condition;
  }, [t]);

  const getConditionColor = useCallback((condition) => {
    const colorMap = {
      'new': 'bg-green-100 text-green-800',
      'excellent': 'bg-blue-100 text-blue-800',
      'good': 'bg-yellow-100 text-yellow-800',
      'satisfactory': 'bg-orange-100 text-orange-800',
      'service': 'bg-purple-100 text-purple-800'
    };
    return colorMap[condition] || 'bg-gray-100 text-gray-800';
  }, []);

  // Мемоизированная функция получения иконки категории
  const getCategoryIcon = useCallback((categoryKey) => {
    const category = categories.find(cat => cat.key === categoryKey);
    return category ? category.icon : null;
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
             {/* Основной контент */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
         
         {/* Название товара - только на мобильных */}
         <div className="lg:hidden mb-4">
           <div className="flex items-start justify-between">
             <h1 className="text-2xl font-bold text-gray-900 pr-4">
               {product.title}
             </h1>
             <button
               onClick={handleFavoriteToggle}
               className={`p-2 rounded-full transition-colors ${
                 isInFavorites 
                   ? 'bg-violet-100 text-violet-600' 
                   : 'bg-gray-100 text-gray-400 hover:bg-violet-100 hover:text-violet-600'
               }`}
             >
               <img 
                 src={Favorite} 
                 alt="Favorite" 
                 className="w-6 h-6"
               />
             </button>
           </div>
         </div>
         
         {/* Галерея фото - левая колонка */}
         <div className="h-[calc(100vh-200px)] min-h-[400px] max-h-[600px]">
           <ProductImageSlider 
             images={galleryImages}
             title={product.title}
             className="h-full"
           />
         </div>

         {/* Информация о товаре - правая колонка */}
         <div className="h-4/5 flex flex-col">
           {/* Заголовок и кнопка избранного - только на десктопе */}
           <div className="hidden lg:flex items-start justify-between">
             <h1 className="text-2xl font-bold text-gray-900 pr-4">
               {product.title}
             </h1>
             <button
               onClick={handleFavoriteToggle}
               className={`p-2 rounded-full transition-colors ${
                 isInFavorites 
                   ? 'bg-violet-100 text-violet-600' 
                   : 'bg-gray-100 text-gray-400 hover:bg-violet-100 hover:text-violet-600'
               }`}
             >
               <img 
                 src={Favorite} 
                 alt="Favorite" 
                 className="w-6 h-6"
               />
             </button>
           </div>

          {/* Цена */}
          <div className="space-y-3">
            <div className="text-3xl font-bold text-gray-900">
              {product.price} {t('product.currency')}
            </div>
            {product.originalPrice && product.originalPrice !== product.price && (
              <div className="text-lg text-gray-500 line-through">
                {product.originalPrice} {t('product.currency')}
              </div>
            )}
          </div>

          {/* Продавец */}
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
              <span className="text-violet-600 font-semibold text-sm">
                {product.sellerName?.charAt(0) || 'П'}
              </span>
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">
                {product.sellerId ? (
                  <Link 
                    to={`/user/${product.sellerId}`} 
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {product.sellerName || t('product.sellerUnknown')}
                  </Link>
                ) : (
                  product.sellerName || t('product.sellerUnknown')
                )}
              </div>
              <div className="text-sm text-gray-500">
                {product.city || t('product.locationUnknown')}
              </div>
            </div>
          </div>

          {/* Состояние */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">
              {t('product.condition.label')}:
            </div>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(product.condition)}`}>
              {getConditionText(product.condition)}
            </span>
          </div>

          {/* Основная информация */}
          <div className="space-y-4 flex-1">
            {/* Дополнительная информация */}
            <div className="space-y-3">
              {product.category && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">
                      {t('product.category')}:
                    </span>
                  </div>
                  <Link 
                    to={`/category/${product.category}`}
                    className="inline-flex items-center space-x-2 text-sm bg-violet-50 text-violet-700 hover:bg-violet-100 hover:text-violet-800 px-3 py-2 rounded-lg transition-colors cursor-pointer border border-violet-200 group"
                    title={`${t('product.categoryLink')} ${t(`categories.${product.category}`)}`}
                  >
                    {getCategoryIcon(product.category) && (
                      <img 
                        src={getCategoryIcon(product.category)} 
                        alt={t(`categories.${product.category}`)}
                        className="w-4 h-4 group-hover:scale-110 transition-transform"
                      />
                    )}
                    <span className="font-medium">{t(`categories.${product.category}`)}</span>
                    <svg className="w-3 h-3 text-violet-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )}
              
              {product.views && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">
                    {t('product.views')}:
                  </span>
                  <span className="text-sm text-gray-600">
                    {product.views}
                  </span>
                </div>
              )}

              {product.date && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">
                    {t('product.date')}:
                  </span>
                  <span className="text-sm text-gray-600">
                    {new Date(product.date).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Кнопки действий - выровнены по нижней границе */}
          <div className="flex space-x-4 mt-auto pt-4">
            <button className="flex-1 bg-violet-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-violet-700 transition-colors">
              {t('product.contact')}
            </button>
            <button className="flex-1 border border-violet-600 text-violet-600 py-3 px-6 rounded-lg font-medium hover:bg-violet-50 transition-colors">
              {t('product.message')}
            </button>
          </div>
        </div>
      </div>

      {/* Описание - снизу по центру */}
      <div className="border-t border-gray-200 p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {t('product.description')}
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {product.description || t('product.noDescription')}
            </p>
          </div>
        </div>
      </div>

      {/* Карта местоположения */}
      <div className="border-t border-gray-200 p-8">
        <div className="max-w-4xl mx-auto">
          <LocationMap 
            street={product.street}
            houseNumber={product.houseNumber}
            city={product.city}
            country="Сербия"
            height="400px"
            className="mb-4"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 