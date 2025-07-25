import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { productsData, updateProduct, deleteProduct } from '../data/productsData';
import ProductCard from './ProductCard';
import AvatarUpload from './AvatarUpload';
import LocationMap from './LocationMap';

export default function UserProfile() {
  const { user, logout, updateUserProfile } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('active');
  const [userProducts, setUserProducts] = useState([]);
  const [soldProducts, setSoldProducts] = useState([]);
  
  // Состояние для настроек профиля
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    city: '',
    street: '',
    houseNumber: '',
    country: ''
  });
  const [newPassword, setNewPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

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

      // Заполняем данные профиля
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        city: user.location?.city || '',
        street: user.location?.street || '',
        houseNumber: user.location?.houseNumber || '',
        country: user.location?.country || ''
      });
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

  // Обработчики для настроек профиля
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setNewPassword(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (file) => {
    setAvatarFile(file);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setMessage('');

    try {
      const updates = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        bio: profileData.bio,
        location: {
          city: profileData.city,
          street: profileData.street,
          houseNumber: profileData.houseNumber,
          country: profileData.country,
          coordinates: user.location?.coordinates || { lat: 0, lng: 0 }
        }
      };

      // Если загружен новый аватар, добавляем его
      if (avatarFile) {
        // В реальном проекте здесь была бы загрузка файла на сервер
        // Для демонстрации используем URL.createObjectURL
        updates.avatar = URL.createObjectURL(avatarFile);
      }

      const result = await updateUserProfile(updates);
      
      if (result.success) {
        setMessage('Профиль успешно обновлен!');
        setIsEditing(false);
        setAvatarFile(null);
      } else {
        setMessage(`Ошибка: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Ошибка: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.new !== newPassword.confirm) {
      setMessage('Новые пароли не совпадают');
      return;
    }

    if (newPassword.new.length < 6) {
      setMessage('Новый пароль должен быть не менее 6 символов');
      return;
    }

    setIsSaving(true);
    setMessage('');

    try {
      // В реальном проекте здесь была бы проверка текущего пароля
      // и обновление пароля на сервере
      setMessage('Пароль успешно изменен!');
      setNewPassword({ current: '', new: '', confirm: '' });
    } catch (error) {
      setMessage(`Ошибка: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
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
        <div className="flex items-start space-x-6">
          {/* Аватар */}
          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <span className="text-4xl font-bold">
              {user.name ? user.name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
            </span>
          </div>
          
          {/* Информация пользователя */}
          <div className="flex-1 min-w-0">
            <h2 className="text-3xl font-bold mb-2">
              {user.name || user.username}
            </h2>
            <p className="text-violet-100 text-lg mb-6">
              {user.email}
            </p>
            
            {/* Статистика */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center bg-white/10 rounded-lg px-4 py-3">
                <svg className="w-6 h-6 mr-3 text-violet-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <div>
                  <div className="text-2xl font-bold">{userProducts.length}</div>
                  <div className="text-sm text-violet-200">Активные товары</div>
                </div>
              </div>
              
              <div className="flex items-center bg-white/10 rounded-lg px-4 py-3">
                <svg className="w-6 h-6 mr-3 text-violet-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="text-2xl font-bold">{soldProducts.length}</div>
                  <div className="text-sm text-violet-200">Проданные товары</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Вкладки */}
      <div className="border-b border-gray-200 bg-gray-50">
        <nav className="flex space-x-8 px-8">
          <button
            onClick={() => setActiveTab('active')}
            className={`py-6 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
              activeTab === 'active'
                ? 'border-violet-500 text-violet-600 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Активные товары ({userProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('sold')}
            className={`py-6 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
              activeTab === 'sold'
                ? 'border-violet-500 text-violet-600 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Проданные товары ({soldProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-6 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
              activeTab === 'settings'
                ? 'border-violet-500 text-violet-600 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Настройки профиля
          </button>
        </nav>
      </div>

      {/* Контент вкладок */}
      <div className="p-8 bg-white">
        {activeTab === 'active' ? (
          <div>
            {/* Заголовок секции */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Активные товары
              </h3>
              <p className="text-gray-600 text-lg">
                Ваши активные объявления, которые видны покупателям
              </p>
            </div>
            
            {userProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {userProducts.map(product => (
                  <div key={product.id} className="relative group">
                    <ProductCard product={product} />
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleMarkAsSold(product.id)}
                          className="bg-green-500 text-white p-2.5 rounded-full hover:bg-green-600 transition-colors shadow-lg"
                          title="Отметить как проданный"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="bg-red-500 text-white p-2.5 rounded-full hover:bg-red-600 transition-colors shadow-lg"
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
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  У вас пока нет активных товаров
                </h4>
                <p className="text-gray-600 text-lg mb-6">
                  Добавьте свой первый товар или услугу
                </p>
                <button className="bg-violet-600 text-white px-6 py-3 rounded-lg hover:bg-violet-700 transition-colors font-medium">
                  Добавить товар
                </button>
              </div>
            )}
          </div>
        ) : activeTab === 'sold' ? (
          <div>
            {/* Заголовок секции */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Проданные товары
              </h3>
              <p className="text-gray-600 text-lg">
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
                        <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                          Продано
                        </span>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-500 text-white p-2.5 rounded-full hover:bg-red-600 transition-colors shadow-lg"
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
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  У вас пока нет проданных товаров
                </h4>
                <p className="text-gray-600 text-lg">
                  Продайте свой первый товар
                </p>
              </div>
            )}
          </div>
        ) : (
          // Вкладка настроек профиля
          <div>
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Настройки профиля
              </h3>
              <p className="text-gray-600 text-lg">
                Управляйте своими личными данными и настройками
              </p>
            </div>

            {/* Сообщение об успехе/ошибке */}
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.includes('успешно') 
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {message}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Основная информация */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Основная информация
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Имя
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Фамилия
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent disabled:bg-gray-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Email нельзя изменить
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Телефон
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        О себе
                      </label>
                      <textarea
                        name="bio"
                        value={profileData.bio}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Город
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={profileData.city}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Улица
                        </label>
                        <input
                          type="text"
                          name="street"
                          value={profileData.street}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Номер дома
                        </label>
                        <input
                          type="text"
                          name="houseNumber"
                          value={profileData.houseNumber}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Страна
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={profileData.country}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent disabled:bg-gray-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Кнопки управления */}
                <div className="flex space-x-4">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-violet-600 text-white px-6 py-3 rounded-lg hover:bg-violet-700 transition-colors font-medium"
                    >
                      Редактировать профиль
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                      >
                        {isSaving ? 'Сохранение...' : 'Сохранить'}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setAvatarFile(null);
                          // Сбросить данные к исходным
                          setProfileData({
                            firstName: user.firstName || '',
                            lastName: user.lastName || '',
                            email: user.email || '',
                            phone: user.phone || '',
                            bio: user.bio || '',
                            city: user.location?.city || '',
                            street: user.location?.street || '',
                            houseNumber: user.location?.houseNumber || '',
                            country: user.location?.country || ''
                          });
                        }}
                        className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                      >
                        Отмена
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Аватар и пароль */}
              <div className="space-y-6">
                {/* Загрузка аватара */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Фото профиля
                  </h4>
                  <AvatarUpload
                    currentAvatar={user.avatar}
                    onAvatarChange={handleAvatarChange}
                    size="xlarge"
                  />
                </div>

                {/* Смена пароля */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Смена пароля
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Текущий пароль
                      </label>
                      <input
                        type="password"
                        name="current"
                        value={newPassword.current}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Новый пароль
                      </label>
                      <input
                        type="password"
                        name="new"
                        value={newPassword.new}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Подтвердите новый пароль
                      </label>
                      <input
                        type="password"
                        name="confirm"
                        value={newPassword.confirm}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    </div>

                    <button
                      onClick={handleChangePassword}
                      disabled={isSaving || !newPassword.current || !newPassword.new || !newPassword.confirm}
                      className="w-full bg-violet-600 text-white px-6 py-3 rounded-lg hover:bg-violet-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? 'Изменение...' : 'Изменить пароль'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Карта местоположения */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Местоположение
                </h4>
                <LocationMap 
                  street={profileData.street}
                  houseNumber={profileData.houseNumber}
                  city={profileData.city}
                  country={profileData.country}
                  height="300px"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Кнопка выхода */}
      <div className="px-8 pb-8 bg-gray-50">
        <button 
          onClick={handleLogout}
          className="w-full bg-red-500 text-white px-6 py-4 rounded-lg hover:bg-red-600 transition-colors font-medium text-lg"
        >
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
}