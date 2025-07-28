import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import AllProductsMap from '../components/AllProductsMap';
import { getAllProducts } from '../data/productsData';

const MapPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const { t } = useLanguage();

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const allProducts = getAllProducts();
        setProducts(allProducts);
        setFilteredProducts(allProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    // Фильтрация по категории
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Фильтрация по городу
    if (selectedCity !== 'all') {
      filtered = filtered.filter(product => product.city === selectedCity);
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, selectedCity]);

  const categories = [
    { key: 'all', name: t('categories.all') },
    { key: 'cars', name: t('categories.cars') },
    { key: 'clothes', name: t('categories.clothes') },
    { key: 'computers', name: t('categories.computers') },
    { key: 'electronics', name: t('categories.electronics') },
    { key: 'estate', name: t('categories.estate') },
    { key: 'furniture', name: t('categories.furniture') },
    { key: 'goods', name: t('categories.goods') },
    { key: 'kids', name: t('categories.kids') },
    { key: 'services', name: t('categories.services') }
  ];

  const cities = [
    { key: 'all', name: t('cities.all') },
    { key: 'belgrade', name: t('cities.belgrade') },
    { key: 'noviSad', name: t('cities.noviSad') },
    { key: 'nis', name: t('cities.nis') },
    { key: 'kragujevac', name: t('cities.kragujevac') },
    { key: 'zemun', name: t('cities.zemun') }
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Заголовок */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('map.title')}
        </h1>
        <p className="text-gray-600">
          {t('map.subtitle')}
        </p>
      </div>

      {/* Фильтры */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Фильтр по категории */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('map.filterByCategory')}
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-violet-600 focus:border-violet-600"
            >
              {categories.map(category => (
                <option key={category.key} value={category.key}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Фильтр по городу */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('map.filterByCity')}
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-violet-600 focus:border-violet-600"
            >
              {cities.map(city => (
                <option key={city.key} value={city.key}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Статистика */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {t('map.showingProducts', { count: filteredProducts.length, total: products.length })}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedCity('all');
                }}
                className="text-sm text-violet-600 hover:text-violet-700 font-medium"
              >
                {t('map.clearFilters')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Карта */}
      <div className="mb-8">
        <AllProductsMap products={filteredProducts} />
      </div>

      {/* Список товаров (для мобильных устройств) */}
      <div className="md:hidden">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {t('map.nearbyProducts')}
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {filteredProducts.slice(0, 10).map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="flex items-center space-x-3">
                <img 
                  src={product.photo || product.image} 
                  alt={product.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    {product.title}
                  </h3>
                  <p className="text-lg font-bold text-violet-600 mb-1">
                    €{product.price}
                  </p>
                  <p className="text-xs text-gray-500">
                    {product.street && product.houseNumber 
                      ? `${product.street}, ${product.houseNumber}, ${t(`cities.${product.city}`)}`
                      : t(`cities.${product.city}`)
                    }
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapPage; 