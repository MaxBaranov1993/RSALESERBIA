import { useEffect, useRef, useState } from 'react';

const LocationMap = ({ address, city, country = "Сербия", height = "300px", className = "" }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!address && !city) {
      setError('Адрес не указан');
      return;
    }

    // Создаем полный адрес для геокодирования
    const fullAddress = `${address || ''} ${city}, ${country}`.trim();
    
    // Функция для геокодирования адреса
    const geocodeAddress = async (address) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
        );
        
        if (!response.ok) {
          throw new Error('Ошибка геокодирования');
        }
        
        const data = await response.json();
        
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
        throw error;
      }
    };

    // Инициализация карты
    const initMap = async () => {
      try {
        setError(null);
        
        // Очищаем предыдущую карту если она существует
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
        
        // Получаем координаты адреса
        const coordinates = await geocodeAddress(fullAddress);
        
        // Проверяем, что контейнер существует
        if (!mapRef.current) {
          throw new Error('Контейнер карты не найден');
        }
        
        // Создаем карту
        const map = L.map(mapRef.current).setView([coordinates.lat, coordinates.lon], 15);
        mapInstanceRef.current = map;
        
        // Добавляем слой OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18
        }).addTo(map);
        
        // Добавляем маркер
        const marker = L.marker([coordinates.lat, coordinates.lon]).addTo(map);
        
        // Добавляем всплывающее окно с адресом
        marker.bindPopup(`
          <div class="text-center">
            <strong>${address || city}</strong><br>
            <small>${coordinates.display_name}</small>
          </div>
        `);
        
        setMapLoaded(true);
      } catch (error) {
        console.error('Ошибка инициализации карты:', error);
        setError('Не удалось загрузить карту');
        setMapLoaded(false);
      }
    };

    // Загружаем Leaflet CSS и JS
    const loadLeaflet = () => {
      return new Promise((resolve, reject) => {
        // Проверяем, загружена ли уже Leaflet
        if (window.L) {
          resolve();
          return;
        }

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
        
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Не удалось загрузить Leaflet'));
        
        document.head.appendChild(script);
      });
    };

    // Инициализируем карту
    loadLeaflet()
      .then(() => initMap())
      .catch((error) => {
        console.error('Ошибка загрузки Leaflet:', error);
        setError('Не удалось загрузить карту');
      });

    // Очистка при размонтировании
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [address, city, country]);

  if (error) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`} style={{ height }}>
        <div className="text-center text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Заголовок карты */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Местоположение
        </h3>
        <p className="text-sm text-gray-600">
          {address && `${address}, `}{city}, {country}
        </p>
      </div>

      {/* Контейнер карты */}
      <div 
        ref={mapRef} 
        className="w-full rounded-lg overflow-hidden border border-gray-200"
        style={{ height }}
      >
        {/* Индикатор загрузки */}
        {!mapLoaded && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Загрузка карты...</p>
            </div>
          </div>
        )}
      </div>

      {/* Информация о карте */}
      <div className="mt-2 text-xs text-gray-500 text-center">
        Карта предоставлена <a href="https://www.openstreetmap.org" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:text-violet-700">OpenStreetMap</a>
      </div>
    </div>
  );
};

export default LocationMap; 