import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { productsData } from '../data/productsData';
import ProductCard from '../components/ProductCard';
import { translateCity } from '../utils/cityTranslations';
import MapMarker from '../components/MapMarker';

// Глобальная переменная для Leaflet
let L;

const MapSearch = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    city: 'all'
  });
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // Загружаем все товары
    setProducts(productsData);
    setFilteredProducts(productsData);
  }, []);

  // Фильтрация товаров
  useEffect(() => {
    let filtered = products;

    // Фильтр по категории
    if (filters.category !== 'all') {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Фильтр по городу
    if (filters.city !== 'all') {
      filtered = filtered.filter(product => normalizeCityName(product.city) === filters.city);
    }

    // Фильтр по цене
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(product => {
        if (max) {
          return product.price >= min && product.price <= max;
        } else {
          return product.price >= min;
        }
      });
    }

    setFilteredProducts(filtered);
  }, [products, filters]);

  useEffect(() => {
    if (filteredProducts.length === 0) return;

    // Функция для геокодирования адреса
    const geocodeAddress = async (address) => {
      try {
        console.log('Геокодирование адреса:', address);
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
        );
        
        if (!response.ok) {
          throw new Error('Ошибка геокодирования');
        }
        
        const data = await response.json();
        console.log('Результат геокодирования:', data);
        
        if (data && data.length > 0) {
          const location = data[0];
          return {
            lat: parseFloat(location.lat),
            lon: parseFloat(location.lon),
            display_name: location.display_name
          };
        } else {
          throw new Error('Адрес не найден');
        }
      } catch (error) {
        console.error('Ошибка геокодирования:', error);
        return null;
      }
    };

    // Функция для создания кастомного маркера с миниатюрой товара
    const createCustomMarker = (product) => {
      const isService = product.category === 'services';
      const markerColor = isService ? '#f97316' : '#7c3aed'; // оранжевый для услуг, фиолетовый для товаров
      const textColor = isService ? '#f97316' : '#7c3aed';
      
      const markerHtml = `
        <div class="custom-marker" style="
          width: 120px;
          height: 140px;
          background: white;
          border: 2px solid ${markerColor};
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s;
        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
          <div style="
            width: 100%;
            height: 80px;
            background-image: url('${product.photo}');
            background-size: cover;
            background-position: center;
            border-bottom: 1px solid #e5e7eb;
          "></div>
          <div style="padding: 8px;">
            <div style="
              font-weight: 600;
              font-size: 11px;
              line-height: 1.2;
              margin-bottom: 4px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            ">${product.title}</div>
            <div style="
              font-weight: 700;
              color: ${textColor};
              font-size: 12px;
              margin-bottom: 2px;
            ">€${product.price}</div>
            <div style="
              font-size: 9px;
              color: #6b7280;
              margin-top: 2px;
            ">${translateCity(normalizeCityName(product.city), t)}</div>
            <div style="
              font-size: 9px;
              color: ${textColor};
              margin-top: 2px;
            ">${isService ? t('mapSearch.filters.services') : t('mapSearch.filters.products')}</div>
          </div>
        </div>
      `;
      
      return L.divIcon({
        html: markerHtml,
        className: 'custom-div-icon',
        iconSize: [120, 140],
        iconAnchor: [60, 140],
        popupAnchor: [0, -140]
      });
    };

    // Инициализация карты
    const initMap = async () => {
      try {
        setError(null);
        setDebugInfo('Инициализация карты...');
        
        // Очищаем предыдущую карту если она существует
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        // Очищаем маркеры
        markersRef.current.forEach(marker => {
          if (marker) marker.remove();
        });
        markersRef.current = [];
        
        // Проверяем, что контейнер существует
        if (!mapRef.current) {
          throw new Error('Контейнер карты не найден');
        }

        setDebugInfo('Создание карты...');
        // Создаем карту с центром в Белграде
        const map = L.map(mapRef.current).setView([44.7866, 20.4489], 10);
        mapInstanceRef.current = map;
        
        // Добавляем слой OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18
        }).addTo(map);

        setDebugInfo('Обработка товаров...');
        // Добавляем маркеры для всех товаров
        const validProducts = [];
        let processedCount = 0;
        
        // Сначала добавим тестовые маркеры для проверки
        const testMarkers = [
          { lat: 44.7866, lon: 20.4489, title: 'Белград - центр' },
          { lat: 44.8453, lon: 20.4012, title: 'Земун' },
          { lat: 45.2551, lon: 19.8452, title: 'Нови Сад' }
        ];

        testMarkers.forEach((testMarker, index) => {
          const marker = L.marker([testMarker.lat, testMarker.lon]).addTo(map);
          marker.bindPopup(`<div style="padding: 8px;"><strong>${testMarker.title}</strong><br/>Тестовый маркер ${index + 1}</div>`);
          markersRef.current.push(marker);
          console.log('Тестовый маркер добавлен:', testMarker.title);
        });

        // Создаем группы маркеров для товаров и услуг
        const productMarkers = [];
        const serviceMarkers = [];
        const processedCities = new Set();

        for (const product of filteredProducts) {
          processedCount++;
          setDebugInfo(`Обработка товара ${processedCount}/${filteredProducts.length}: ${product.title}`);
          
          // Проверяем наличие адреса
          if (!product.city) {
            console.log('Пропускаем товар без города:', product.title);
            continue;
          }

          // Создаем адрес для геокодирования
          let fullAddress;
          const normalizedCity = normalizeCityName(product.city);
          if (product.street && product.houseNumber) {
            fullAddress = `${product.street} ${product.houseNumber}, ${normalizedCity}, ${t('common.serbia')}`;
          } else if (product.street) {
            fullAddress = `${product.street}, ${normalizedCity}, ${t('common.serbia')}`;
          } else {
            fullAddress = `${normalizedCity}, ${t('common.serbia')}`;
          }

          console.log('Геокодирование для товара:', product.title, 'Адрес:', fullAddress);
          const coordinates = await geocodeAddress(fullAddress);
          
          if (coordinates) {
            console.log('Координаты найдены:', coordinates);
            validProducts.push({ ...product, coordinates });
            
            // Создаем кастомный маркер с миниатюрой
            const customIcon = createCustomMarker(product);
            const marker = L.marker([coordinates.lat, coordinates.lon], { icon: customIcon }).addTo(map);
            
            // Создаем расширенное всплывающее окно
            const popupContent = `
              <div class="product-popup" style="
                max-width: 280px;
                padding: 0;
                margin: 0;
              ">
                <div style="
                  width: 100%;
                  height: 160px;
                  background-image: url('${product.photo}');
                  background-size: cover;
                  background-position: center;
                  border-radius: 8px 8px 0 0;
                  margin-bottom: 12px;
                "></div>
                <div style="padding: 0 12px 12px;">
                  <h3 style="
                    font-weight: 600;
                    font-size: 16px;
                    color: #1f2937;
                    margin: 0 0 8px 0;
                    line-height: 1.3;
                  ">${product.title}</h3>
                  <div style="
                    font-weight: 700;
                    font-size: 18px;
                    color: #7c3aed;
                    margin-bottom: 8px;
                  ">€${product.price}</div>
                  <div style="
                    font-size: 12px;
                    color: #6b7280;
                    margin-bottom: 8px;
                  ">
                    <div><strong>${t('product.location')}:</strong> ${translateCity(normalizedCity, t)}</div>
                    ${product.street ? `<div><strong>${t('product.street')}:</strong> ${product.street}</div>` : ''}
                    ${product.houseNumber ? `<div><strong>${t('product.houseNumber')}:</strong> ${product.houseNumber}</div>` : ''}
                  </div>
                  <div style="
                    font-size: 11px;
                    color: #9ca3af;
                    margin-bottom: 12px;
                  ">
                    ${product.views} ${t('product.views')} • ${product.favorites} ${t('product.favorites')}
                  </div>
                  <button onclick="window.openProductModal(${product.id})" style="
                    width: 100%;
                    background: #7c3aed;
                    color: white;
                    border: none;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-weight: 500;
                    font-size: 12px;
                    cursor: pointer;
                    transition: background 0.2s;
                  " onmouseover="this.style.background='#6d28d9'" onmouseout="this.style.background='#7c3aed'">
                    ${t('mapSearch.viewDetails')}
                  </button>
                </div>
              </div>
            `;
            
            marker.bindPopup(popupContent);
            
            // Открывать popup при наведении мыши
            marker.on('mouseover', function (e) {
              marker.openPopup();
            });
            marker.on('mouseout', function (e) {
              marker.closePopup();
            });
            
            markersRef.current.push(marker);
            console.log('Маркер добавлен для товара:', product.title);
          } else {
            console.log('Не удалось найти координаты для товара:', product.title);
            
            // Используем резервные координаты для демонстрации
            const fallbackCoordinates = getFallbackCoordinates(normalizedCity);
            if (fallbackCoordinates) {
              console.log('Используем резервные координаты:', fallbackCoordinates);
              validProducts.push({ ...product, coordinates: fallbackCoordinates });
              
              // Создаем простой маркер
              const marker = L.marker([fallbackCoordinates.lat, fallbackCoordinates.lon]).addTo(map);
              
              // Создаем простое всплывающее окно
              const popupContent = `
                <div style="padding: 8px; max-width: 200px;">
                  <h3 style="font-weight: 600; margin: 0 0 4px 0;">${product.title}</h3>
                  <div style="font-weight: 700; color: #7c3aed; margin-bottom: 4px;">€${product.price}</div>
                  <div style="font-size: 12px; color: #6b7280;">${translateCity(normalizedCity, t)}</div>
                  <button onclick="window.openProductModal(${product.id})" style="
                    width: 100%;
                    background: #7c3aed;
                    color: white;
                    border: none;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 11px;
                    cursor: pointer;
                    margin-top: 4px;
                  ">${t('mapSearch.viewDetails')}</button>
                </div>
              `;
              
              marker.bindPopup(popupContent);
              
              // Добавляем обработчик клика
              marker.on('click', () => {
                setSelectedProduct(product);
                setShowProductModal(true);
              });
              
              markersRef.current.push(marker);
              console.log('Резервный маркер добавлен для товара:', product.title);
            }
          }
        }

        // Добавляем маркеры для всех товаров с резервными координатами (без дублирования городов)
        const cityProducts = {};
        
        filteredProducts.forEach((product, index) => {
          const normalizedCity = normalizeCityName(product.city);
          if (product.city && !processedCities.has(normalizedCity)) {
            processedCities.add(normalizedCity);
            const fallbackCoordinates = getFallbackCoordinates(normalizedCity);
            if (fallbackCoordinates) {
              // Группируем товары по городам
              if (!cityProducts[normalizedCity]) {
                cityProducts[normalizedCity] = [];
              }
              cityProducts[normalizedCity].push(product);
            }
          }
        });

        // Создаем маркеры для каждого города
        Object.entries(cityProducts).forEach(([city, products], cityIndex) => {
          const fallbackCoordinates = getFallbackCoordinates(city);
          if (fallbackCoordinates) {
            // Определяем тип маркера (товар или услуга)
            const hasServices = products.some(p => p.category === 'services');
            const hasProducts = products.some(p => p.category !== 'services');
            
            // Цвет маркера: оранжевый если есть услуги, фиолетовый если только товары
            let markerColor;
            if (hasServices && hasProducts) {
              markerColor = '#f97316'; // оранжевый для смешанных
            } else if (hasServices) {
              markerColor = '#f97316'; // оранжевый для услуг
            } else {
              markerColor = '#7c3aed'; // фиолетовый для товаров
            }
            
            // Создаем кастомную иконку маркера
            const customIcon = L.divIcon({
              html: `
                <div style="
                  width: 20px;
                  height: 20px;
                  background: ${markerColor};
                  border: 2px solid white;
                  border-radius: 50%;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-weight: bold;
                  font-size: 12px;
                ">
                  ${products.length}
                </div>
              `,
              className: 'custom-marker-icon',
              iconSize: [20, 20],
              iconAnchor: [10, 20],
              popupAnchor: [0, -20]
            });

            const marker = L.marker([fallbackCoordinates.lat, fallbackCoordinates.lon], { icon: customIcon }).addTo(map);
            
            // Создаем всплывающее окно со списком товаров в городе
            const popupContent = `
              <div style="padding: 12px; max-width: 300px;">
                <h3 style="font-weight: 600; margin: 0 0 8px 0; color: ${markerColor};">${translateCity(city, t)}</h3>
                <div style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">
                  ${products.length} ${hasServices ? t('mapSearch.filters.services') : t('mapSearch.filters.products')}
                </div>
                <div style="max-height: 200px; overflow-y: auto;">
                  ${products.slice(0, 5).map(product => {
                    const isService = product.category === 'services';
                    const itemColor = isService ? '#f97316' : '#7c3aed';
                    return `
                      <div style="
                        padding: 8px;
                        border-bottom: 1px solid #e5e7eb;
                        cursor: pointer;
                        transition: background 0.2s;
                      " onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='transparent'"
                         onclick="window.openProductModal(${product.id})">
                        <div style="font-weight: 600; font-size: 13px; margin-bottom: 4px;">${product.title}</div>
                        <div style="font-weight: 700; color: ${itemColor}; font-size: 14px;">€${product.price}</div>
                        <div style="font-size: 10px; color: ${itemColor}; margin-top: 2px;">
                          ${isService ? t('mapSearch.filters.services') : t('mapSearch.filters.products')}
                        </div>
                      </div>
                    `;
                  }).join('')}
                  ${products.length > 5 ? `<div style="padding: 8px; text-align: center; color: #6b7280; font-size: 11px;">
                    +${products.length - 5} ${t('mapSearch.more')}
                  </div>` : ''}
                </div>
              </div>
            `;
            
            marker.bindPopup(popupContent);
            
            // Добавляем обработчик клика
            marker.on('click', () => {
              // Показываем первый товар в модальном окне
              if (products.length > 0) {
                setSelectedProduct(products[0]);
                setShowProductModal(true);
              }
            });
            
            markersRef.current.push(marker);
            console.log(`Маркер добавлен для города ${city}: ${products.length} ${hasServices ? 'услуг' : 'товаров'} (цвет: ${markerColor})`);
          }
        });

        setDebugInfo(`Обработано ${validProducts.length} товаров из ${filteredProducts.length}. Всего маркеров: ${markersRef.current.length}`);

        // Если есть валидные товары, подстраиваем карту
        if (validProducts.length > 0) {
          const group = new L.featureGroup(markersRef.current);
          map.fitBounds(group.getBounds().pad(0.1));
          console.log('Карта подстроена под маркеры');
        } else {
          console.log('Нет валидных товаров для отображения на карте');
        }
        
        setMapLoaded(true);
        setDebugInfo(`Карта загружена. Отображено ${markersRef.current.length} маркеров`);
      } catch (error) {
        console.error('Ошибка инициализации карты:', error);
        setError('Не удалось загрузить карту');
        setMapLoaded(false);
        setDebugInfo(`Ошибка: ${error.message}`);
      }
    };

    // Загружаем Leaflet CSS и JS
    const loadLeaflet = () => {
      return new Promise((resolve, reject) => {
        // Проверяем, загружена ли уже Leaflet
        if (window.L) {
          L = window.L;
          resolve();
          return;
        }

        setDebugInfo('Загрузка Leaflet...');
        // Загружаем CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        document.head.appendChild(link);

        // Загружаем JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        script.crossOrigin = '';
        
        script.onload = () => {
          L = window.L;
          setDebugInfo('Leaflet загружен');
          resolve();
        };
        script.onerror = () => {
          setDebugInfo('Ошибка загрузки Leaflet');
          reject(new Error('Не удалось загрузить Leaflet'));
        };
        
        document.head.appendChild(script);
      });
    };

    // Инициализируем карту
    loadLeaflet()
      .then(() => initMap())
      .catch((error) => {
        console.error('Ошибка загрузки Leaflet:', error);
        setError('Не удалось загрузить карту');
        setDebugInfo(`Ошибка загрузки: ${error.message}`);
      });

    // Очистка при размонтировании
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markersRef.current.forEach(marker => {
        if (marker) marker.remove();
      });
      markersRef.current = [];
    };
  }, [filteredProducts, t]);

  // Глобальная функция для открытия модального окна
  useEffect(() => {
    window.openProductModal = (productId) => {
      const product = products.find(p => p.id === productId);
      if (product) {
        setSelectedProduct(product);
        setShowProductModal(true);
      }
    };

    return () => {
      delete window.openProductModal;
    };
  }, [products]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const closeModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
  };

  const openProductPage = () => {
    if (selectedProduct) {
      navigate(`/product/${selectedProduct.id}`);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      priceRange: 'all',
      city: 'all'
    });
  };

  // Получаем уникальные города и категории
  const cities = [...new Set(products.map(p => p.city))];
  const categories = [...new Set(products.map(p => p.category))];

  // Функция для получения резервных координат городов
  const getFallbackCoordinates = (city) => {
    const cityCoordinates = {
      'Белград': { lat: 44.7866, lon: 20.4489 },
      'Нови Сад': { lat: 45.2551, lon: 19.8452 },
      'Земун': { lat: 44.8453, lon: 20.4012 },
      'Belgrade': { lat: 44.7866, lon: 20.4489 },
      'Novi Sad': { lat: 45.2551, lon: 19.8452 },
      'Zemun': { lat: 44.8453, lon: 20.4012 }
    };
    
    return cityCoordinates[city] || null;
  };

  // Нормализуем названия городов для фильтров
  const normalizeCityName = (city) => {
    const cityMap = {
      'Белград': 'Белград',
      'Belgrade': 'Белград',
      'Београд': 'Белград',
      'Нови Сад': 'Нови Сад',
      'Novi Sad': 'Нови Сад',
      'Земун': 'Земун',
      'Zemun': 'Земун'
    };
    return cityMap[city] || city;
  };

  // Получаем уникальные нормализованные города
  const uniqueCities = [...new Set(products.map(p => normalizeCityName(p.city)))].filter(city => city);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <svg className="w-12 h-12 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-semibold text-red-800 mb-2">{t('mapSearch.error')}</h3>
            <p className="text-red-600">{error}</p>
            {debugInfo && (
              <div className="mt-4 p-3 bg-gray-100 rounded text-sm text-gray-700">
                <strong>Отладочная информация:</strong><br />
                {debugInfo}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Заголовок */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('mapSearch.title')}</h1>
              <p className="text-gray-600 mt-2">{t('mapSearch.subtitle')}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-violet-600">{filteredProducts.length}</div>
              <div className="text-sm text-gray-500">{t('mapSearch.productsFound')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Фильтры */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">{t('mapSearch.filters.category')}:</label>
              <select 
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              >
                <option value="all">{t('mapSearch.filters.allCategories')}</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {t(`categories.${category}`)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">{t('mapSearch.filters.city')}:</label>
              <select 
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              >
                <option value="all">{t('mapSearch.filters.allCities')}</option>
                {uniqueCities.map(city => (
                  <option key={city} value={city}>
                    {translateCity(city, t)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">{t('mapSearch.filters.price')}:</label>
              <select 
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              >
                <option value="all">{t('mapSearch.filters.allPrices')}</option>
                <option value="0-100">€0 - €100</option>
                <option value="100-500">€100 - €500</option>
                <option value="500-1000">€500 - €1000</option>
                <option value="1000-">€1000+</option>
              </select>
            </div>

            <button
              onClick={clearFilters}
              className="text-violet-600 hover:text-violet-700 text-sm font-medium"
            >
              {t('mapSearch.filters.clear')}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Карта */}
          <div className="w-full">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">{t('mapSearch.mapTitle')}</h2>
                <p className="text-gray-600 mt-1">{t('mapSearch.mapDescription')}</p>
                {debugInfo && (
                  <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
                    {debugInfo}
                  </div>
                )}
              </div>
              
              <div className="relative">
                <div 
                  ref={mapRef} 
                  className="w-full h-96 lg:h-[600px]"
                >
                  {/* Индикатор загрузки */}
                  {!mapLoaded && (
                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-600">{t('mapSearch.loadingMap')}</p>
                        {debugInfo && (
                          <p className="text-xs text-gray-500 mt-2">{debugInfo}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Информация о карте */}
              <div className="p-4 bg-gray-50 text-xs text-gray-500 text-center">
                {t('mapSearch.mapInfo')} <a href="https://www.openstreetmap.org" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:text-violet-700">OpenStreetMap</a>
              </div>
            </div>
          </div>


        </div>
      </div>

      {/* Модальное окно с полным описанием товара */}
      {showProductModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 modal-overlay">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedProduct.title}</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Изображения */}
                <div>
                  <img 
                    src={selectedProduct.photo} 
                    alt={selectedProduct.title}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  {selectedProduct.photos && selectedProduct.photos.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {selectedProduct.photos.slice(0, 4).map((photo, index) => (
                        <img 
                          key={index}
                          src={photo} 
                          alt={`${selectedProduct.title} ${index + 1}`}
                          className="w-full h-16 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Информация о товаре */}
                <div>
                  <div className="text-3xl font-bold text-violet-600 mb-4">
                    €{selectedProduct.price}
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 w-20">{t('product.location')}:</span>
                      <span>{translateCity(normalizeCityName(selectedProduct.city), t)}</span>
                    </div>
                    {selectedProduct.street && (
                      <div className="flex items-center">
                        <span className="font-medium text-gray-700 w-20">{t('product.street')}:</span>
                        <span>{selectedProduct.street}</span>
                      </div>
                    )}
                    {selectedProduct.houseNumber && (
                      <div className="flex items-center">
                        <span className="font-medium text-gray-700 w-20">{t('product.houseNumber')}:</span>
                        <span>{selectedProduct.houseNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 w-20">{t('product.condition.label')}:</span>
                      <span>{t(`product.condition.${selectedProduct.condition}`)}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 w-20">{t('product.views')}:</span>
                      <span>{selectedProduct.views}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{t('product.description')}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {selectedProduct.description}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={openProductPage}
                      className="flex-1 bg-violet-600 text-white py-3 px-4 rounded-lg hover:bg-violet-700 transition-colors font-medium"
                    >
                      {t('mapSearch.viewFullPage')}
                    </button>
                    <button
                      onClick={closeModal}
                      className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {t('common.close')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapSearch; 