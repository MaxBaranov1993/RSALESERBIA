import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translateCity } from '../utils/cityTranslations';

const ProductMap = ({ product }) => {
  const mapRef = useRef(null);
  const { t } = useLanguage();
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!product || !mapRef.current) return;

    const loadMap = async () => {
      try {
        // Создаем адрес для геокодирования
        let address = '';
        if (product.street && product.houseNumber) {
          address = `${product.street} ${product.houseNumber}, ${translateCity(product.city, t)}`;
        } else {
          address = translateCity(product.city, t);
        }

        // Геокодирование через planplus.rs API
        const geocodingUrl = `https://api.planplus.rs/geocoding/v1/search?q=${encodeURIComponent(address)}&api_key=C2E8EA00-5C3C-4915-A6C6-EA31A5DAD880`;
        
        const response = await fetch(geocodingUrl);
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const coordinates = data.features[0].geometry.coordinates;
          const [lng, lat] = coordinates;

          // Создаем карту с помощью Leaflet
          const L = window.L;
          
          if (!L) {
            console.error('Leaflet not loaded');
            return;
          }

          // Очищаем предыдущую карту
          if (mapRef.current._leaflet_id) {
            mapRef.current._leaflet_map.remove();
          }

          // Создаем новую карту
          const map = L.map(mapRef.current).setView([lat, lng], 15);

          // Добавляем тайлы от planplus.rs
          L.tileLayer('https://tiles.planplus.rs/tiles/{z}/{x}/{y}.png', {
            attribution: '© PlanPlus.rs',
            apiKey: 'C2E8EA00-5C3C-4915-A6C6-EA31A5DAD880'
          }).addTo(map);

          // Добавляем маркер
          const marker = L.marker([lat, lng]).addTo(map);
          
          // Создаем попап с информацией
          const popupContent = `
            <div class="p-3">
              <h3 class="font-semibold text-gray-900 mb-2">${product.title}</h3>
              <p class="text-sm text-gray-600">${address}</p>
            </div>
          `;
          
          marker.bindPopup(popupContent);

          setMapLoaded(true);
        }
      } catch (error) {
        console.error('Error loading map:', error);
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
  }, [product, t]);

  if (!product) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t('product.location')}
        </h3>
        <p className="text-sm text-gray-600">
          {product.street && product.houseNumber 
            ? `${product.street}, ${product.houseNumber}, ${translateCity(product.city, t)}`
            : translateCity(product.city, t)
          }
        </p>
      </div>
      <div 
        ref={mapRef} 
        className="h-64 w-full"
        style={{ minHeight: '256px' }}
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

export default ProductMap; 