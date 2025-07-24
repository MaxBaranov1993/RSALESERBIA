import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { useLanguage } from '../context/LanguageContext';

const CategoryProducts = ({ products, categoryName }) => {
  const [sortBy, setSortBy] = useState('date');
  const [filterCondition, setFilterCondition] = useState('all');
  const { t } = useLanguage();

  // Фильтрация и сортировка товаров
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Фильтрация по состоянию
    if (filterCondition !== 'all') {
      filtered = filtered.filter(product => product.condition === filterCondition);
    }

    // Сортировка
    switch (sortBy) {
      case 'price-low':
        return [...filtered].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...filtered].sort((a, b) => b.price - a.price);
      case 'date':
        return [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'popular':
        return [...filtered].sort((a, b) => b.views - a.views);
      default:
        return filtered;
    }
  }, [products, sortBy, filterCondition]);

  const conditions = ['all', 'new', 'excellent', 'good', 'satisfactory', 'service'];

  return (
    <div className="space-y-6">
      {/* Заголовок категории */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {t(`categories.${categoryName}`)}
        </h1>
        <p className="text-gray-600">
          {t('category.foundProducts', { count: products.length })}
        </p>
      </div>

      {/* Фильтры и сортировка */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Сортировка */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              {t('category.sortBy')}:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-violet-600 focus:border-violet-600"
            >
              <option value="date">{t('category.sort.date')}</option>
              <option value="price-low">{t('category.sort.priceLow')}</option>
              <option value="price-high">{t('category.sort.priceHigh')}</option>
              <option value="popular">{t('category.sort.popular')}</option>
            </select>
          </div>

          {/* Фильтр по состоянию */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              {t('category.filterBy')}:
            </label>
            <select
              value={filterCondition}
              onChange={(e) => setFilterCondition(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-violet-600 focus:border-violet-600"
            >
              <option value="all">{t('category.filter.all')}</option>
              <option value="new">{t('category.filter.new')}</option>
              <option value="excellent">{t('category.filter.excellent')}</option>
              <option value="good">{t('category.filter.good')}</option>
              <option value="satisfactory">{t('category.filter.satisfactory')}</option>
              <option value="service">{t('category.filter.service')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Сетка товаров */}
      {filteredAndSortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            {t('category.noProducts')}
          </h3>
          <p className="text-gray-500">
            {t('category.noProductsDescription')}
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryProducts; 