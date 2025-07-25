import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ImageUpload from '../components/ImageUpload';
import { addNewProduct } from '../data/productsData';

// Константы
const CATEGORIES = [
  { value: 'estate', label: 'Недвижимость' },
  { value: 'cars', label: 'Автомобили' },
  { value: 'electronics', label: 'Электроника' },
  { value: 'computers', label: 'Компьютеры' },
  { value: 'clothes', label: 'Одежда' },
  { value: 'goods', label: 'Товары' },
  { value: 'furniture', label: 'Мебель' },
  { value: 'kids', label: 'Детские товары' },
  { value: 'services', label: 'Услуги' }
];

const CONDITIONS = [
  { value: 'new', label: 'Новое' },
  { value: 'used', label: 'Б/у' },
  { value: 'service', label: 'Услуга' }
];

const INITIAL_REGISTER_DATA = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: ''
};

const INITIAL_PRODUCT_DATA = {
  title: '',
  description: '',
  price: '',
  category: '',
  condition: 'new',
  location: ''
};

// Компонент поля ввода
const FormField = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  placeholder, 
  required = false,
  ...props 
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && '*'}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
      placeholder={placeholder}
      {...props}
    />
    {error && (
      <p className="text-red-500 text-sm mt-1">{error}</p>
    )}
  </div>
);

// Компонент селекта
const FormSelect = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options, 
  error, 
  required = false,
  placeholder = "Выберите..." 
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && '*'}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    >
      <option value="">{placeholder}</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && (
      <p className="text-red-500 text-sm mt-1">{error}</p>
    )}
  </div>
);

// Компонент текстовой области
const FormTextarea = ({ 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  placeholder, 
  rows = 4,
  required = false 
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && '*'}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
      placeholder={placeholder}
    />
    {error && (
      <p className="text-red-500 text-sm mt-1">{error}</p>
    )}
  </div>
);

// Компонент секции формы
const FormSection = ({ title, children }) => (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
      {title}
    </h2>
    {children}
  </div>
);

const RegisterWithProduct = () => {
  const navigate = useNavigate();
  const { register, login } = useAuth();
  const { t } = useLanguage();
  
  const [registerData, setRegisterData] = useState(INITIAL_REGISTER_DATA);
  const [productData, setProductData] = useState(INITIAL_PRODUCT_DATA);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Обработчики изменений
  const handleRegisterChange = useCallback((e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const handleProductChange = useCallback((e) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  // Валидация
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Валидация регистрации
    if (!registerData.firstName.trim()) newErrors.firstName = 'Имя обязательно';
    if (!registerData.lastName.trim()) newErrors.lastName = 'Фамилия обязательна';
    if (!registerData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      newErrors.email = 'Неверный формат email';
    }
    if (!registerData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (registerData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    }
    if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }
    if (!registerData.phone.trim()) newErrors.phone = 'Телефон обязателен';

    // Валидация товара
    if (!productData.title.trim()) newErrors.title = 'Название товара обязательно';
    if (!productData.description.trim()) newErrors.description = 'Описание обязательно';
    if (!productData.price) {
      newErrors.price = 'Цена обязательна';
    } else if (isNaN(productData.price) || parseFloat(productData.price) <= 0) {
      newErrors.price = 'Введите корректную цену';
    }
    if (!productData.category) newErrors.category = 'Выберите категорию';
    if (!productData.location.trim()) newErrors.location = 'Укажите местоположение';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [registerData, productData]);

  // Обработка отправки формы
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userData = {
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        email: registerData.email,
        password: registerData.password,
        phone: registerData.phone
      };

      const registeredUser = await register(userData);
      
      if (registeredUser) {
        await login(registerData.email, registerData.password);
        
        const productWithUser = {
          ...productData,
          sellerName: `${registerData.firstName} ${registerData.lastName}`,
          sellerEmail: registerData.email,
          sellerPhone: registerData.phone
        };

        const newProduct = addNewProduct(productWithUser, images, registeredUser);
        
        if (newProduct) {
          navigate('/profile', { 
            state: { 
              message: 'Регистрация и добавление товара прошли успешно!' 
            } 
          });
        }
      }
    } catch (error) {
      console.error('Ошибка при регистрации и добавлении товара:', error);
      setErrors({ submit: error.message || 'Произошла ошибка при регистрации' });
    } finally {
      setLoading(false);
    }
  }, [registerData, productData, images, register, login, validateForm, navigate]);

  // Переход на страницу входа
  const handleGoToLogin = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  // Мемоизированные поля регистрации
  const registerFields = useMemo(() => [
    {
      name: 'firstName',
      label: 'Имя',
      placeholder: 'Введите имя',
      required: true
    },
    {
      name: 'lastName',
      label: 'Фамилия',
      placeholder: 'Введите фамилию',
      required: true
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'example@email.com',
      required: true
    },
    {
      name: 'phone',
      label: 'Телефон',
      type: 'tel',
      placeholder: '+7 (999) 123-45-67',
      required: true
    },
    {
      name: 'password',
      label: 'Пароль',
      type: 'password',
      placeholder: 'Минимум 6 символов',
      required: true
    },
    {
      name: 'confirmPassword',
      label: 'Подтвердите пароль',
      type: 'password',
      placeholder: 'Повторите пароль',
      required: true
    }
  ], []);

  // Мемоизированные поля товара
  const productFields = useMemo(() => [
    {
      name: 'title',
      label: 'Название',
      placeholder: 'Краткое название товара или услуги',
      required: true
    },
    {
      name: 'price',
      label: 'Цена',
      type: 'number',
      placeholder: '0.00',
      min: '0',
      step: '0.01',
      required: true
    },
    {
      name: 'location',
      label: 'Местоположение',
      placeholder: 'Город или район',
      required: true
    }
  ], []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Заголовок */}
          <div className="bg-gradient-to-r from-violet-600 to-violet-700 text-white p-6">
            <h1 className="text-2xl font-bold text-center">
              Регистрация и добавление объявления
            </h1>
            <p className="text-violet-100 text-center mt-2">
              Создайте аккаунт и сразу разместите свое объявление
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Секция регистрации */}
            <FormSection title="Данные для регистрации">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {registerFields.slice(0, 2).map(field => (
                  <FormField
                    key={field.name}
                    {...field}
                    value={registerData[field.name]}
                    onChange={handleRegisterChange}
                    error={errors[field.name]}
                  />
                ))}
              </div>

              {registerFields.slice(2, 4).map(field => (
                <FormField
                  key={field.name}
                  {...field}
                  value={registerData[field.name]}
                  onChange={handleRegisterChange}
                  error={errors[field.name]}
                />
              ))}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {registerFields.slice(4).map(field => (
                  <FormField
                    key={field.name}
                    {...field}
                    value={registerData[field.name]}
                    onChange={handleRegisterChange}
                    error={errors[field.name]}
                  />
                ))}
              </div>
            </FormSection>

            {/* Секция товара */}
            <FormSection title="Информация о товаре/услуге">
              {productFields.slice(0, 1).map(field => (
                <FormField
                  key={field.name}
                  {...field}
                  value={productData[field.name]}
                  onChange={handleProductChange}
                  error={errors[field.name]}
                />
              ))}

              <FormTextarea
                name="description"
                label="Описание"
                value={productData.description}
                onChange={handleProductChange}
                error={errors.description}
                placeholder="Подробное описание товара или услуги"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {productFields.slice(1).map(field => (
                  <FormField
                    key={field.name}
                    {...field}
                    value={productData[field.name]}
                    onChange={handleProductChange}
                    error={errors[field.name]}
                  />
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect
                  name="category"
                  label="Категория"
                  value={productData.category}
                  onChange={handleProductChange}
                  options={CATEGORIES}
                  error={errors.category}
                  required
                />

                <FormSelect
                  name="condition"
                  label="Состояние"
                  value={productData.condition}
                  onChange={handleProductChange}
                  options={CONDITIONS}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Фотографии товара
                </label>
                <ImageUpload
                  images={images}
                  onImagesChange={setImages}
                  maxImages={5}
                />
              </div>
            </FormSection>

            {/* Ошибка отправки */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Кнопки */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-violet-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Обработка...' : 'Зарегистрироваться и добавить объявление'}
              </button>
              
              <button
                type="button"
                onClick={handleGoToLogin}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Уже есть аккаунт? Войти
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterWithProduct; 