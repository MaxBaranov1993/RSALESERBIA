import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import ImageUpload from '../components/ImageUpload';

import { addNewProduct } from '../data/productsData';

function AddProduct() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  
  // Проверяем авторизацию
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Если пользователь не авторизован, показываем загрузку
  if (!user) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    city: '',
    category: '',
    condition: 'new',
    originalPrice: '',
    street: '',
    houseNumber: ''
  });
  
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'electronics', label: t('categories.electronics') },
    { value: 'clothes', label: t('categories.clothes') },
    { value: 'computers', label: t('categories.computers') },
    { value: 'estate', label: t('categories.estate') },
    { value: 'furniture', label: t('categories.furniture') },
    { value: 'goods', label: t('categories.goods') },
    { value: 'kids', label: t('categories.kids') },
    { value: 'cars', label: t('categories.cars') }
  ];

  const conditions = [
    { value: 'new', label: t('product.condition.new') },
    { value: 'excellent', label: t('product.condition.excellent') },
    { value: 'good', label: t('product.condition.good') },
    { value: 'satisfactory', label: t('product.condition.satisfactory') }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Добавляем новый товар в данные с информацией о пользователе
      const newProduct = addNewProduct(formData, images, user);
      
      console.log('Товар успешно добавлен:', newProduct);
      
      // Имитация отправки
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Перенаправление в профиль пользователя с параметрами
      navigate('/profile?added=true&type=product');
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('addProduct.title')}
          </h1>
          <p className="text-gray-600">
            {t('addProduct.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Основная информация */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Основная информация
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название товара *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
                  placeholder="Введите название товара"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Цена (€) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Исходная цена (€)
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Город *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
                  placeholder="Введите город"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Улица
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
                  placeholder="Введите улицу"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Номер дома
                </label>
                <input
                  type="text"
                  name="houseNumber"
                  value={formData.houseNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
                  placeholder="Введите номер дома"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Категория *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
                >
                  <option value="">Выберите категорию</option>
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Состояние *
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
                >
                  {conditions.map(condition => (
                    <option key={condition.value} value={condition.value}>
                      {condition.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500"
                placeholder="Опишите ваш товар подробно"
              />
            </div>
          </div>

          {/* Загрузка изображений */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Изображения
            </h2>
            <ImageUpload images={images} onImagesChange={setImages} />
          </div>



          {/* Кнопки */}
          <div className="flex flex-col space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-violet-600 text-white rounded-md hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Отправка...' : 'Добавить товар'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/add')}
              className="w-full px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct; 