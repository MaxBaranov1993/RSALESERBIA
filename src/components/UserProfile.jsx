import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from './ProductCard';
import { productsData } from '../data/productsData';
import { updateProduct, deleteProduct } from '../data/productsData';

export default function UserProfile() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('active');
  const [userProducts, setUserProducts] = useState([]);
  const [soldProducts, setSoldProducts] = useState([]);

  useEffect(() => {
    if (user) {
      // Фильтруем товары текущего пользователя
      const currentUserProducts = productsData.filter(product => 
        product.sellerName === user.name || product.sellerName === user.username
      );
      
      // Разделяем на активные и проданные
      const active = currentUserProducts.filter(product => !product.sold);
      const sold = currentUserProducts.filter(product => product.sold);
      
      setUserProducts(active);
      setSoldProducts(sold);
    }
  }, [user]);

  const handleMarkAsSold = (productId) => {
    const soldDate = new Date().toISOString().split('T')[0];
    
    // Обновляем товар через функцию
    updateProduct(productId, {
      sold: true,
      soldDate: soldDate
    });
    
    // Обновляем локальное состояние
    setUserProducts(prev => prev.filter(p => p.id !== productId));
    const soldProduct = productsData.find(p => p.id === productId);
    if (soldProduct) {
      setSoldProducts(prev => [...prev, soldProduct]);
    }
  };

  const handleDelete = (productId) => {
    // Удаляем товар через функцию
    deleteProduct(productId);
    
    // Обновляем локальное состояние
    setUserProducts(prev => prev.filter(p => p.id !== productId));
    setSoldProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <p className="text-gray-600">Необходимо авторизоваться</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Заголовок профиля */}
      <div className="bg-gradient-to-r from-violet-600 to-violet-700 text-white p-8">
        <div className="flex items-center">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mr-6">
            <span className="text-3xl font-bold">
              {user.name ? user.name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.name || user.username}</h2>
            <p className="text-violet-100">{user.email}</p>
            <div className="flex items-center mt-2 space-x-4 text-sm">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                {userProducts.length} Активные товары
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {soldProducts.length} Проданные товары
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Вкладки */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-8">
          <button
            onClick={() => setActiveTab('active')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'active'
                ? 'border-violet-500 text-violet-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Активные товары ({userProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('sold')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'sold'
                ? 'border-violet-500 text-violet-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Проданные товары ({soldProducts.length})
          </button>
        </nav>
      </div>

      {/* Контент вкладок */}
      <div className="p-8">
        {activeTab === 'active' ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Активные товары
              </h3>
              <p className="text-sm text-gray-500">
                Ваши активные объявления, которые видны покупателям
              </p>
            </div>
            
            {userProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {userProducts.map(product => (
                  <div key={product.id} className="relative group">
                    <ProductCard product={product} />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleMarkAsSold(product.id)}
                          className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
                          title="Отметить как проданный"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                          title="Удалить"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <p className="text-gray-600 mb-2">У вас пока нет активных товаров</p>
                <p className="text-sm text-gray-500">Добавьте свой первый товар или услугу</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Проданные товары
              </h3>
              <p className="text-sm text-gray-500">
                История ваших проданных товаров и услуг
              </p>
            </div>
            
            {soldProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {soldProducts.map(product => (
                  <div key={product.id} className="relative group">
                    <div className="relative">
                      <ProductCard product={product} />
                      <div className="absolute inset-0 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Продано
                        </span>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        title="Удалить"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-600 mb-2">У вас пока нет проданных товаров</p>
                <p className="text-sm text-gray-500">Продайте свой первый товар</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Кнопка выхода */}
      <div className="px-8 pb-8">
        <button 
          onClick={handleLogout}
          className="w-full bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
        >
          Выйти
        </button>
      </div>
    </div>
  );
}