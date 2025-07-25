import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getProductById } from '../data/productsData';

const Breadcrumbs = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const [productTitle, setProductTitle] = useState('');

  // Функция для получения первых 2 слов из названия
  const getFirstTwoWords = (title) => {
    if (!title) return '';
    const words = title.split(' ').filter(word => word.length > 0);
    const firstTwo = words.slice(0, 2);
    return firstTwo.length > 0 ? firstTwo.join(' ') : title;
  };

  // Получаем данные товара для страниц товаров
  useEffect(() => {
    if (location.pathname.startsWith('/product/')) {
      const productId = location.pathname.split('/')[2];
      const product = getProductById(parseInt(productId));
      if (product) {
        setProductTitle(getFirstTwoWords(product.title));
      }
    }
  }, [location.pathname]);

  // Не показываем хлебные крошки на главной странице
  if (location.pathname === '/') {
    return null;
  }

  // Функция для получения названия страницы по пути
  const getPageTitle = (pathname) => {
    const pathMap = {
      '/profile': t('profile.title'),
      '/register': t('register.title'),
      '/favorites': t('favorites.title'),
      '/login': t('register.loginLink')
    };

    // Для страниц категорий
    if (pathname.startsWith('/category/')) {
      const categorySlug = pathname.split('/')[2];
      return t(`categories.${categorySlug}`);
    }

    // Для страниц товаров
    if (pathname.startsWith('/product/')) {
      return productTitle || t('product.title') || 'Товар';
    }

    return pathMap[pathname] || pathname;
  };

  // Создаем массив путей для хлебных крошек
  const generateBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [
      {
        name: t('breadcrumbs.home'),
        path: '/',
        isActive: false
      }
    ];

    // Специальная обработка для страниц категорий
    if (location.pathname.startsWith('/category/')) {
      const categorySlug = paths[1]; // categorySlug после /category/
      breadcrumbs.push({
        name: t(`categories.${categorySlug}`),
        path: location.pathname,
        isActive: true
      });
    } 
    // Специальная обработка для страниц товаров
    else if (location.pathname.startsWith('/product/')) {
      // Добавляем категорию товара
      const productId = paths[1];
      const product = getProductById(parseInt(productId));
      if (product && product.category) {
        breadcrumbs.push({
          name: t(`categories.${product.category}`),
          path: `/category/${product.category}`,
          isActive: false
        });
      }
      
      // Добавляем название товара (первые 2 слова)
      breadcrumbs.push({
        name: productTitle || t('product.title'),
        path: location.pathname,
        isActive: true
      });
    } else {
      // Обычная обработка для других страниц
      let currentPath = '';
      
      paths.forEach((path, index) => {
        currentPath += `/${path}`;
        const isLast = index === paths.length - 1;
        
        breadcrumbs.push({
          name: getPageTitle(currentPath),
          path: currentPath,
          isActive: isLast
        });
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className="py-4 sm:py-6 md:py-8 bg-transparent">
      <div className="container mx-auto px-4 sm:px-6">
        <ol className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 text-sm sm:text-base">
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={breadcrumb.path} className="flex items-center">
              {index > 0 && (
                <svg 
                  className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mx-2 sm:mx-3 md:mx-4" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
              )}
              
              {breadcrumb.isActive ? (
                <span className="text-gray-800 font-bold text-base sm:text-lg">
                  {breadcrumb.name}
                </span>
              ) : (
                <Link 
                  to={breadcrumb.path}
                  className="text-violet-600 hover:text-violet-800 transition-colors font-semibold hover:underline"
                >
                  {breadcrumb.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs; 