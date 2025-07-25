import house from '../assets/svg/categoryEstate.svg';
import service from '../assets/svg/categoryServices.svg';
import car from '../assets/svg/categoryCar.svg';
import child from '../assets/svg/categorykids.svg';
import electronics from '../assets/svg/categoryComputer.svg';
import sport from '../assets/svg/categoryClothes.svg';
import home from '../assets/svg/categoryGoods.svg';
import furniture from '../assets/svg/categoryFurniture.svg';
import { getCategoryStats } from '../data/productsData.js';

// Базовые данные категорий
const baseCategories = [
  { key: 'estate', icon: house, link: '/category/estate' },
  { key: 'services', icon: service, link: '/category/services' },
  { key: 'cars', icon: car, link: '/category/cars' },
  { key: 'kids', icon: child, link: '/category/kids' },
  { key: 'electronics', icon: electronics, link: '/category/electronics' },
  { key: 'computers', icon: electronics, link: '/category/computers' },
  { key: 'clothes', icon: sport, link: '/category/clothes' },
  { key: 'goods', icon: home, link: '/category/goods' },
  { key: 'furniture', icon: furniture, link: '/category/furniture' },
];

// Функция для получения категорий с количеством товаров
export const getCategoriesWithStats = () => {
  const stats = getCategoryStats();
  
  return baseCategories.map(category => ({
    ...category,
    count: stats[category.key] || 0
  }));
};

// Функция для получения только категорий с товарами
export const getCategoriesWithItems = () => {
  const categoriesWithStats = getCategoriesWithStats();
  return categoriesWithStats.filter(category => category.count > 0);
};

// Экспортируем базовые категории для обратной совместимости
export default baseCategories; 