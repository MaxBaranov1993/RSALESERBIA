import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/ProductCard';
import { productsData } from '../data/productsData';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useLanguage();
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    condition: '',
    priceMin: '',
    priceMax: '',
    location: ''
  });
  const [sortBy, setSortBy] = useState('relevance');

  const query = searchParams.get('q') || '';

  // Поиск товаров
  const searchProducts = useMemo(() => {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase();
    
    return productsData.filter(product => {
      const matchesQuery = 
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.sellerName.toLowerCase().includes(searchTerm) ||
        product.city.toLowerCase().includes(searchTerm);

      const matchesCategory = !filters.category || product.category === filters.category;
      const matchesCondition = !filters.condition || product.condition === filters.condition;
      const matchesLocation = !filters.location || 
        product.city.toLowerCase().includes(filters.location.toLowerCase());
      const matchesPrice = (!filters.priceMin || product.price >= parseFloat(filters.priceMin)) &&
        (!filters.priceMax || product.price <= parseFloat(filters.priceMax));

      return matchesQuery && matchesCategory && matchesCondition && matchesLocation && matchesPrice;
    });
  }, [query, filters]);

  // Сортировка результатов
  const sortedResults = useMemo(() => {
    const sorted = [...searchProducts];
    
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'date-new':
        return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'date-old':
        return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
      default:
        return sorted;
    }
  }, [searchProducts, sortBy]);

  // Обработка фильтров
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Очистка фильтров
  const clearFilters = () => {
    setFilters({
      category: '',
      condition: '',
      priceMin: '',
      priceMax: '',
      location: ''
    });
    setSortBy('relevance');
  };

  // Получение уникальных категорий
  const categories = useMemo(() => {
    const unique = [...new Set(productsData.map(p => p.category))];
    return unique.map(cat => ({ value: cat, label: t(`categories.${cat}`) || cat }));
  }, [t]);

  // Получение уникальных городов
  const cities = useMemo(() => {
    const unique = [...new Set(productsData.map(p => p.city))];
    return unique.sort();
  }, []);

  useEffect(() => {
    setLoading(true);
    // Имитация задержки поиска
    const timer = setTimeout(() => {
      setResults(sortedResults);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [sortedResults]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Результаты поиска
          </h1>
        </div>

        {/* Статистика результатов */}
        {query && (
          <div className="mb-6">
            <p className="text-gray-600">
              Найдено {results.length} {results.length === 1 ? 'объявление' : 
                results.length < 5 ? 'объявления' : 'объявлений'} по запросу "{query}"
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Фильтры */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Фильтры</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-violet-600 hover:text-violet-700"
                >
                  Очистить
                </button>
              </div>

              <div className="space-y-4">
                {/* Категория */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Категория
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
                  >
                    <option value="">Все категории</option>
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Состояние */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Состояние
                  </label>
                  <select
                    value={filters.condition}
                    onChange={(e) => handleFilterChange('condition', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
                  >
                    <option value="">Любое состояние</option>
                    <option value="new">Новое</option>
                    <option value="used">Б/у</option>
                    <option value="service">Услуга</option>
                  </select>
                </div>

                {/* Цена */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Цена (€)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="От"
                      value={filters.priceMin}
                      onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
                    />
                    <input
                      type="number"
                      placeholder="До"
                      value={filters.priceMax}
                      onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
                    />
                  </div>
                </div>

                {/* Местоположение */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Местоположение
                  </label>
                  <select
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
                  >
                    <option value="">Все города</option>
                    {cities.map(city => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Результаты */}
          <div className="lg:col-span-3">
            {/* Сортировка */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Сортировка:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
                >
                  <option value="relevance">По релевантности</option>
                  <option value="price-low">Цена: по возрастанию</option>
                  <option value="price-high">Цена: по убыванию</option>
                  <option value="date-new">Дата: новые первыми</option>
                  <option value="date-old">Дата: старые первыми</option>
                </select>
              </div>
            </div>

            {/* Список товаров */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Поиск...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : query ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Ничего не найдено
                </h3>
                <p className="text-gray-600 mb-6">
                  Попробуйте изменить запрос или фильтры
                </p>
                <button
                  onClick={() => setSearchParams({})}
                  className="bg-violet-600 text-white px-6 py-3 rounded-lg hover:bg-violet-700 transition-colors"
                >
                  Очистить поиск
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Введите поисковый запрос
                </h3>
                <p className="text-gray-600">
                  Используйте поиск в шапке сайта для поиска товаров и услуг
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 