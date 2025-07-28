import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useFavorites } from '../context/FavoritesContext';
import categories from './categoriesData';
import ProductImageSlider from './ProductImageSlider';
import ProductMap from './ProductMap';

import favoriteGray from '../assets/svg/favorite-gray.svg';
import favoriteOrange from '../assets/svg/favorite-orange.svg';
import { translateCity } from '../utils/cityTranslations';

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
                           {/* Основной контент - помещается в один экран */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        
         {/* Название товара - только на мобильных */}
         <div className="lg:hidden mb-3">
           <div className="flex items-start justify-between">
             <h1 className="text-xl font-bold text-gray-900 pr-4">
               {product.title}
             </h1>
            <button
              onClick={handleFavoriteToggle}
              className={`p-2 rounded-full transition-all duration-200 shadow-md ${
                isInFavorites 
                  ? 'bg-orange-500 hover:bg-orange-600' 
                  : 'bg-white/90 hover:bg-white'
              }`}
              title={isInFavorites ? 'Удалить из избранного' : 'Добавить в избранное'}
            >
              <img 
                src={isInFavorites ? favoriteOrange : favoriteGray} 
                alt={isInFavorites ? 'Удалить из избранного' : 'Добавить в избранное'}
                className={`w-4 h-4 transition-all duration-200 ${
                  isInFavorites ? 'scale-110' : 'scale-100'
                }`} 
              />
            </button>
          </div>
        </div>
        
                                   {/* Галерея фото - левая колонка */}
          <div className="h-[500px]">
            <ProductImageSlider 
              images={galleryImages}
              title={product.title}
              className="h-full"
            />
          </div>

                   {/* Информация о товаре - правая колонка */}
          <div className="h-full flex flex-col bg-white rounded-xl p-3 shadow-sm">
                       {/* Заголовок и кнопка избранного - только на десктопе */}
            <div className="hidden lg:flex items-start justify-between mb-3">
              <h1 className="text-xl font-bold text-gray-900 pr-4 leading-tight">
                {product.title}
              </h1>
             <button
               onClick={handleFavoriteToggle}
               className={`p-2 rounded-full transition-all duration-200 shadow-md ${
                 isInFavorites 
                   ? 'bg-orange-500 hover:bg-orange-600' 
                   : 'bg-white/90 hover:bg-white'
               }`}
               title={isInFavorites ? 'Удалить из избранного' : 'Добавить в избранное'}
             >
               <img 
                 src={isInFavorites ? favoriteOrange : favoriteGray} 
                 alt={isInFavorites ? 'Удалить из избранного' : 'Добавить в избранное'}
                 className={`w-4 h-4 transition-all duration-200 ${
                   isInFavorites ? 'scale-110' : 'scale-100'
                 }`} 
               />
             </button>
           </div>

                    {/* Цена */}
           <div className="mb-3 p-2 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-100">
             <div className="flex items-baseline space-x-2">
               <div className="text-2xl font-bold text-violet-700">
                 {product.price}
               </div>
               <div className="text-sm font-medium text-violet-600">
                 {t('product.currency')}
               </div>
             </div>
             {product.originalPrice && product.originalPrice !== product.price && (
               <div className="text-xs text-gray-500 line-through mt-1">
                 {product.originalPrice} {t('product.currency')}
               </div>
             )}
           </div>

           {/* Продавец */}
           <div className="flex items-center space-x-2 p-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-base">
                  {product.sellerName?.charAt(0) || 'П'}
                </span>
              </div>
                          <div className="flex-1">
                <div className="font-semibold text-gray-900 text-sm">
                  {product.sellerId ? (
                    <Link 
                      to={`/user/${product.sellerId}`} 
                      className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    >
                      {product.sellerName || t('product.sellerUnknown')}
                    </Link>
                  ) : (
                    product.sellerName || t('product.sellerUnknown')
                  )}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {product.street && product.houseNumber ? (
                    <div className="flex items-center space-x-1">
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{product.street}, {product.houseNumber}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{translateCity(product.city, t) || t('product.locationUnknown')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Состояние */}
            <div className="mb-3">
              <div className="text-xs font-semibold text-gray-700 mb-1">
                {t('product.condition.label')}:
              </div>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold shadow-sm ${getConditionColor(product.condition)}`}>
                {getConditionText(product.condition)}
              </span>
            </div>

                        {/* Основная информация */}
             <div className="space-y-2">
               {/* Дополнительная информация */}
               <div className="space-y-2 bg-gray-50 rounded-xl p-2">
                               {product.views && (
                   <div className="flex items-center space-x-1">
                     <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                       <svg className="w-2.5 h-2.5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                       </svg>
                     </div>
                     <div>
                       <div className="text-xs font-medium text-gray-700">
                         {t('product.views')}
                       </div>
                       <div className="text-xs font-semibold text-gray-900">
                         {product.views}
                       </div>
                     </div>
                   </div>
                 )}

                 {product.date && (
                   <div className="flex items-center space-x-1">
                     <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                       <svg className="w-2.5 h-2.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                       </svg>
                     </div>
                     <div>
                       <div className="text-xs font-medium text-gray-700">
                         {t('product.date')}
                       </div>
                       <div className="text-xs font-semibold text-gray-900">
                         {new Date(product.date).toLocaleDateString()}
                       </div>
                     </div>
                   </div>
                 )}
              </div>
            </div>

                         {/* Кнопки действий - сразу после даты */}
             <div className="flex space-x-2 mt-3">
               <button className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white py-2 px-3 rounded-xl font-semibold hover:from-violet-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-xs">
                 {t('product.contact')}
               </button>
               <button className="flex-1 border-2 border-violet-600 text-violet-600 py-2 px-3 rounded-xl font-semibold hover:bg-violet-50 transition-all duration-200 shadow-sm hover:shadow-md text-xs">
                 {t('product.message')}
               </button>
             </div>
          </div>
      </div>

      {/* Категория */}
      {product.category && (
        <div className="border-t border-gray-200 p-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {t('product.category')}
            </h2>
            <Link 
              to={`/category/${product.category}`}
              className="inline-flex items-center space-x-2 text-sm bg-violet-50 text-violet-700 hover:bg-violet-100 hover:text-violet-800 px-4 py-3 rounded-lg transition-colors cursor-pointer border border-violet-200 group"
              title={`${t('product.categoryLink')} ${t(`categories.${product.category}`)}`}
            >
              {getCategoryIcon(product.category) && (
                <img 
                  src={getCategoryIcon(product.category)} 
                  alt={t(`categories.${product.category}`)}
                  className="w-5 h-5 group-hover:scale-110 transition-transform"
                />
              )}
              <span className="font-medium text-base">{t(`categories.${product.category}`)}</span>
              <svg className="w-4 h-4 text-violet-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      )}

      {/* Карта - местоположение товара */}
      <div className="border-t border-gray-200 p-8">
        <div className="max-w-4xl mx-auto">
          <ProductMap product={product} />
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


    </div>
  );
};

export default ProductDetail; 