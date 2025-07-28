import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translateCity } from '../utils/cityTranslations';

const AllProductsMap = ({ products }) => {
  const mapRef = useRef(null);
  const { t } = useLanguage();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (!mapRef.current) return;

    const loadMap = async () => {
      try {
        // Создаем карту с центром в Белграде
        const L = window.L;
        
        if (!L) {
          console.error('Leaflet not loaded');
          return;
        }

        // Очищаем предыдущую карту
        if (mapInstance) {
          mapInstance.remove();
        }

        // Создаем новую карту
        const map = L.map(mapRef.current).setView([44.7866, 20.4489], 10);
        setMapInstance(map);

        // Добавляем тайлы от OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);

        // Массив для хранения маркеров
        const newMarkers = [];
        const bounds = L.latLngBounds();

        // Обрабатываем каждое объявление
        for (const product of products) {
          try {
            // Создаем адрес для геокодирования
            let address = '';
            if (product.street && product.houseNumber) {
              address = `${product.street} ${product.houseNumber}, ${translateCity(product.city, t)}`;
            } else {
              address = translateCity(product.city, t);
            }

            // Геокодирование через OpenStreetMap Nominatim
            const geocodingUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
            const response = await fetch(geocodingUrl);
            const data = await response.json();

            let coordinates;
            if (data && data.length > 0) {
              const location = data[0];
              coordinates = [parseFloat(location.lat), parseFloat(location.lon)];
            } else {
              // Fallback координаты для городов
              const cityCoordinates = {
                'belgrade': [44.7866, 20.4489],
                'noviSad': [45.2551, 19.8452],
                'nis': [43.3247, 21.9033],
                'kragujevac': [44.0128, 20.9114],
                'zemun': [44.8453, 20.4016]
              };
              const cityKey = product.city?.toLowerCase();
              coordinates = cityCoordinates[cityKey] || [44.7866, 20.4489];
            }

            // Создаем маркер
            const marker = L.marker(coordinates).addTo(map);
            
            // Создаем попап с информацией о товаре
            const popupContent = `
              <div class="p-3 max-w-xs">
                <div class="flex items-start space-x-3">
                  <div class="flex-shrink-0">
                    <img src="${product.photo || product.image || '/placeholder.jpg'}" 
                         alt="${product.title}" 
                         class="w-16 h-16 object-cover rounded-lg">
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-gray-900 text-sm mb-1 truncate">${product.title}</h3>
                    <p class="text-lg font-bold text-violet-600 mb-1">€${product.price}</p>
                    <p class="text-xs text-gray-500 mb-2">${address}</p>
                    <div class="flex items-center justify-between">
                      <span class="text-xs text-gray-400">${product.sellerName || 'Продавец'}</span>
                      <a href="/product/${product.id}" 
                         class="text-xs bg-violet-600 text-white px-2 py-1 rounded hover:bg-violet-700 transition-colors">
                        Посмотреть
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            `;
            
            marker.bindPopup(popupContent);
            newMarkers.push(marker);
            bounds.extend(coordinates);

            // Добавляем небольшую задержку между запросами геокодирования
            await new Promise(resolve => setTimeout(resolve, 100));

          } catch (error) {
            console.error(`Error processing product ${product.id}:`, error);
          }
        }

        // Устанавливаем границы карты, чтобы показать все маркеры
        if (newMarkers.length > 0) {
          map.fitBounds(bounds, { padding: [20, 20] });
        }

        setMarkers(newMarkers);
        setMapLoaded(true);

      } catch (error) {
        console.error('Error loading map:', error);
        setMapLoaded(true);
      }
    };

    // Загружаем Leaflet если еще не загружен
    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = loadMap;
      document.head.appendChild(script);

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    } else {
      loadMap();
    }

    // Очистка при размонтировании
    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [products, t]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t('map.allProducts')}
        </h3>
        <p className="text-sm text-gray-600">
          {t('map.productsCount', { count: products.length })}
        </p>
      </div>
      <div 
        ref={mapRef} 
        className="h-96 w-full"
        style={{ minHeight: '384px' }}
      >
        {!mapLoaded && (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">{t('common.loading')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProductsMap; 