import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { getRandomServices } from '../data/productsData';
import { useLanguage } from '../context/LanguageContext';

function ServiceRecommendations() {
  const [recommendedServices, setRecommendedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  
  useEffect(() => {
    setLoading(true);
    // Получаем больше рекомендаций услуг для отдельной страницы
    const services = getRandomServices(50);
    setRecommendedServices(services);
    setLoading(false);
  }, []);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('serviceRecommendations.title')}
        </h1>
        <p className="text-gray-600">
          {t('serviceRecommendations.subtitle')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
        {recommendedServices.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ServiceRecommendations; 