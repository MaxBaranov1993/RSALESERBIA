import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductDetail from '../components/ProductDetail';
import { getProductById } from '../data/productsData';
import { getProductWithSeller } from '../data/userProductsData';
import { useLanguage } from '../context/LanguageContext';

const ProductPage = () => {
  const { productId } = useParams();
  const { t } = useLanguage();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
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
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t('product.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t('product.errorTitle')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t(error)}
            </p>
            <button 
              onClick={() => window.history.back()}
              className="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition-colors"
            >
              {t('product.goBack')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t('product.notFoundTitle')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('product.notFound')}
            </p>
            <button 
              onClick={() => window.history.back()}
              className="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition-colors"
            >
              {t('product.goBack')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetail product={product} />
    </div>
  );
};

export default ProductPage; 