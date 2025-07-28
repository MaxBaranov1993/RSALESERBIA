import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import CategoriesBar from '../components/CategoriesBar';
import { getRandomProductsOnly, getRandomServices } from '../data/productsData';
import { useLanguage } from '../context/LanguageContext';

function Home() {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [recommendedServices, setRecommendedServices] = useState([]);
  const { t } = useLanguage();
  
  useEffect(() => {
    // Получаем рекомендации товаров (15 карточек = 3 ряда по 5)
    const products = getRandomProductsOnly(15);
    setRecommendedProducts(products);
    
    // Получаем рекомендации услуг (15 карточек = 3 ряда по 5)
    const services = getRandomServices(15);
    setRecommendedServices(services);
  }, []);
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <CategoriesBar />
      
      {/* Рекомендации товаров */}
      <div className="mt-8 sm:mt-5 lg:mt-5">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('home.recommendedProducts')}
          </h1>
          <p className="text-gray-600">
            {t('recommendations.subtitle')}
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {recommendedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link 
            to="/recommendations" 
            className="inline-flex items-center px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {t('home.showMore')}
          </Link>
        </div>
      </div>
      
      {/* Рекомендации услуг */}
      <div className="mt-5 sm:mt-5 lg:mt-5">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('home.recommendedServices')}
          </h1>
          <p className="text-gray-600">
            {t('recommendations.subtitle')}
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {recommendedServices.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link 
            to="/service-recommendations" 
            className="inline-flex items-center px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {t('home.showMore')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
