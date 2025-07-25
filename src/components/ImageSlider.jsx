import React, { useState } from 'react';

const ImageSlider = ({ images, title, className = "" }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Если изображений нет, возвращаем пустой div
  if (!images || images.length === 0) {
    return (
      <div className={`w-full h-40 sm:h-44 md:h-48 lg:h-56 bg-gray-200 rounded-t-lg flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-xs sm:text-sm">Нет фото</span>
      </div>
    );
  }

  // Если только одно изображение, показываем его без слайдера
  if (images.length === 1) {
    return (
      <div className={`relative ${className}`}>
        <img 
          src={images[0]} 
          alt={title} 
          className="w-full h-40 sm:h-44 md:h-48 lg:h-56 object-cover rounded-t-lg"
        />
      </div>
    );
  }

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  return (
    <div className={`relative group ${className}`} onClick={(e) => e.stopPropagation()}>
      {/* Основное изображение */}
      <div className="w-full h-40 sm:h-44 md:h-48 lg:h-56 overflow-hidden rounded-t-lg">
        <img 
          src={images[currentImageIndex]} 
          alt={`${title} - фото ${currentImageIndex + 1}`} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Индикаторы */}
      {images.length > 1 && (
        <div className="absolute bottom-1 sm:bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                     {images.map((_, index) => (
             <button
               key={index}
               onClick={(e) => goToImage(e, index)}
               className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-200 ${
                 index === currentImageIndex 
                   ? 'bg-white shadow-lg' 
                   : 'bg-white/50 hover:bg-white/75'
               }`}
             />
           ))}
        </div>
      )}

      {/* Кнопки навигации */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={nextImage}
            className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Счетчик изображений */}
      {images.length > 1 && (
        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          {currentImageIndex + 1}/{images.length}
        </div>
      )}
    </div>
  );
};

export default ImageSlider; 