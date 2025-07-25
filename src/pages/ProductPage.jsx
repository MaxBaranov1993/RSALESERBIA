import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ProductDetail from '../components/ProductDetail';
import { getProductById } from '../data/productsData';
import { getProductWithSeller } from '../data/userProductsData';
import { useLanguage } from '../context/LanguageContext';

// Общий компонент для состояний загрузки и ошибок
const StatusMessage = ({ icon, title, message, buttonText, onButtonClick, className = "" }) => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="pt-6 pb-8">
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <div className="text-6xl mb-4">{icon}</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {title || 'Ошибка'}
              </h2>
              <p className="text-gray-600 mb-6">
                {message || 'Произошла ошибка'}
              </p>
              <button 
                onClick={onButtonClick}
                className="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition-colors"
              >
                {buttonText || 'Назад'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductPage = () => {
  const { productId } = useParams();
  const { t } = useLanguage();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Мемоизированная функция загрузки товара
  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Получаем товар по ID с информацией о продавце
      const foundProduct = getProductWithSeller(parseInt(productId)) || getProductById(parseInt(productId));
      
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        setError('product.notFound');
      }
    } catch (err) {
      setError('product.error');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  // Мемоизированная функция возврата назад
  const handleGoBack = useCallback(() => {
    window.history.back();
  }, []);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId, fetchProduct]);

  // Мемоизированное состояние загрузки
  const loadingState = useMemo(() => (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="pt-6 pb-8">
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
              <p className="text-gray-600">{t('product.loading') || 'Загрузка...'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ), [t]);

  // Мемоизированное состояние ошибки
  const errorState = useMemo(() => (
    <StatusMessage
      icon="😕"
      title={t('product.errorTitle') || 'Ошибка загрузки'}
      message={error ? t(error) : t('product.error') || 'Произошла ошибка при загрузке товара'}
      buttonText={t('product.goBack') || 'Вернуться назад'}
      onButtonClick={handleGoBack}
    />
  ), [error, t, handleGoBack]);

  // Мемоизированное состояние "не найдено"
  const notFoundState = useMemo(() => (
    <StatusMessage
      icon="🔍"
      title={t('product.notFoundTitle') || 'Товар не найден'}
      message={t('product.notFound') || 'Запрашиваемый товар не найден'}
      buttonText={t('product.goBack') || 'Вернуться назад'}
      onButtonClick={handleGoBack}
    />
  ), [t, handleGoBack]);

  // Мемоизированный основной контент
  const mainContent = useMemo(() => (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4">
        {/* Красивый отступ после хлебных крошек */}
        <div className=" pb-8">
          <ProductDetail product={product} />
        </div>
      </div>
    </div>
  ), [product]);

  // Рендер компонента
  if (loading) {
    return loadingState;
  }

  if (error) {
    return errorState;
  }

  if (!product) {
    return notFoundState;
  }

  return mainContent;
};

export default ProductPage; 