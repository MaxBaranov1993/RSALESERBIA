import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getCategoriesWithItems } from './categoriesData';

export default function CategoriesList({ categories }) {
  const { t } = useLanguage();
  
  // Получаем категории с товарами, если не переданы
  const categoriesWithItems = categories || getCategoriesWithItems();
  
  return (
    <ul className="space-y-2">
      {categoriesWithItems.map((cat) => (
        <li key={cat.key} className="flex items-center group">
          <div className="flex items-center gap-2">
            <img src={cat.icon} alt={t(`categories.${cat.key}`)} className="h-5 w-5" />
            <Link to={cat.link} className="text-gray-700 hover:text-violet-600 transition-colors">
              {t(`categories.${cat.key}`)}
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
} 