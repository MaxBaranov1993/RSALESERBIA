import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import UserProfile from '../components/UserProfile';
import { useLanguage } from '../context/LanguageContext';
import SuccessNotification from '../components/SuccessNotification';

export default function Profile() {
  const { t } = useLanguage();
  const location = useLocation();
  const [showNotification, setShowNotification] = useState(false);
  const [productType, setProductType] = useState('product');

  useEffect(() => {
    // Проверяем, пришли ли мы с формы добавления
    const searchParams = new URLSearchParams(location.search);
    const added = searchParams.get('added');
    const type = searchParams.get('type');
    
    if (added === 'true') {
      setProductType(type || 'product');
      setShowNotification(true);
      
      // Очищаем URL параметры
      window.history.replaceState({}, document.title, '/profile');
    }
  }, [location]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('profile.title')}</h1>
          <p className="text-gray-600 mt-2">{t('profile.subtitle')}</p>
        </div>
        <Link 
          to="/add" 
          className="inline-flex items-center px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {t('profile.addItem')}
        </Link>
      </div>
      
      <UserProfile />
      
      <SuccessNotification 
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
        productType={productType}
      />
    </div>
  );
}