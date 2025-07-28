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

        // Используем OpenStreetMap Nominatim для геокодирования (бесплатный сервис)
        const geocodingUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
        
        const response = await fetch(geocodingUrl);
        const data = await response.json();

        if (data && data.length > 0) {
          const location = data[0];
          const lat = parseFloat(location.lat);
          const lng = parseFloat(location.lon);

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

          // Добавляем тайлы от OpenStreetMap (бесплатные)
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
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
        } else {
          // Если геокодирование не удалось, показываем карту с центром города
          const cityCoordinates = {
            'belgrade': [44.7866, 20.4489],
            'noviSad': [45.2551, 19.8452],
            'nis': [43.3247, 21.9033],
            'kragujevac': [44.0128, 20.9114],
            'zemun': [44.8453, 20.4016]
          };

          const cityKey = product.city?.toLowerCase();
          const coordinates = cityCoordinates[cityKey] || [44.7866, 20.4489]; // По умолчанию Белград

          const L = window.L;
          if (!L) {
            console.error('Leaflet not loaded');
            return;
          }

          const map = L.map(mapRef.current).setView(coordinates, 12);
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
          }).addTo(map);

          const marker = L.marker(coordinates).addTo(map);
          const popupContent = `
            <div class="p-3">
              <h3 class="font-semibold text-gray-900 mb-2">${product.title}</h3>
              <p class="text-sm text-gray-600">${translateCity(product.city, t)}</p>
            </div>
          `;
          
          marker.bindPopup(popupContent);
          setMapLoaded(true);
        }
      } catch (error) {
        console.error('Error loading map:', error);
        
        // Fallback - показываем карту с центром города
        const cityCoordinates = {
          'belgrade': [44.7866, 20.4489],
          'noviSad': [45.2551, 19.8452],
          'nis': [43.3247, 21.9033],
          'kragujevac': [44.0128, 20.9114],
          'zemun': [44.8453, 20.4016]
        };

        const cityKey = product.city?.toLowerCase();
        const coordinates = cityCoordinates[cityKey] || [44.7866, 20.4489];

        const L = window.L;
        if (L) {
          const map = L.map(mapRef.current).setView(coordinates, 12);
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
          }).addTo(map);

          const marker = L.marker(coordinates).addTo(map);
          const popupContent = `
            <div class="p-3">
              <h3 class="font-semibold text-gray-900 mb-2">${product.title}</h3>
              <p class="text-sm text-gray-600">${translateCity(product.city, t)}</p>
            </div>
          `;
          
          marker.bindPopup(popupContent);
          setMapLoaded(true);
        }
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