import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import CategoryProducts from '../components/CategoryProducts';
import { getProductsByCategory } from '../data/productsData';
import { useLanguage } from '../context/LanguageContext';

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  // Маппинг slug'ов на названия категорий для отображения
  const categoryDisplayNames = {
    'estate': 'estate',
    'services': 'services',
    'cars': 'cars',
    'kids': 'kids',
    'computers': 'computers',
    'clothes': 'clothes',
    'goods': 'goods',
    'furniture': 'furniture',
    'electronics': 'electronics'
  };

  useEffect(() => {
    setLoading(true);
    
    // Проверяем, существует ли категория
    const categoryExists = categoryDisplayNames[categorySlug];
    
    if (categoryExists) {
      // Получаем товары для данной категории, используя slug напрямую
      const categoryProducts = getProductsByCategory(categorySlug);
      setProducts(categoryProducts);
    } else {
      setProducts([]);
    }
    
    setLoading(false);
  }, [categorySlug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // Если категория не найдена
  if (!categoryDisplayNames[categorySlug]) {
    return (
      <div className="container mx-auto px-4">
        <div className="text-center py-8">
          <div className="text-gray-400 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {t('category.notFound')}
          </h1>
          <p className="text-gray-600 mb-6">
            {t('category.notFoundDescription')}
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            {t('category.backToHome')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <CategoryProducts 
        products={products} 
        categoryName={categorySlug}
      />
    </div>
  );
};

export default CategoryPage; 