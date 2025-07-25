import React, { useState, useCallback, useMemo, useRef } from 'react';

const ProductImageSlider = ({ images, title, className = "" }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const sliderRef = useRef(null);

  // Если изображений нет, возвращаем пустой div
  if (!images || images.length === 0) {
    return (
      <div className={`w-full h-full bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-sm">Нет фото</span>
      </div>
    );
  }

  // Если только одно изображение, показываем его без слайдера
  if (images.length === 1) {
    return (
      <div className={`relative h-full ${className}`}>
        <img 
          src={images[0]} 
          alt={title} 
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    );
  }

  // Мемоизированные функции навигации
  const nextImage = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  const prevImage = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  const goToImage = useCallback((e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(index);
  }, []);

  // Функции для свайпа
  const onTouchStart = useCallback((e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const onTouchMove = useCallback((e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextImage();
    }
    if (isRightSwipe) {
      prevImage();
    }
  }, [touchStart, touchEnd, nextImage, prevImage]);

  return (
    <div className={`flex gap-4 h-full ${className}`} onClick={(e) => e.stopPropagation()}>
      {/* Вертикальные миниатюры слева - только на десктопе */}
      <div className="hidden lg:flex flex-col gap-2 w-20">
        {useMemo(() => images.map((image, index) => (
          <button
            key={index}
            onClick={(e) => goToImage(e, index)}
            className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
              index === currentImageIndex 
                ? 'border-violet-500 shadow-lg' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <img 
              src={image} 
              alt={`${title} - миниатюра ${index + 1}`} 
              className="w-full h-full object-cover"
            />
          </button>
        )), [images, currentImageIndex, goToImage, title])}
      </div>

      {/* Основное изображение справа */}
      <div className="flex-1 relative">
        <div 
          className="w-full h-full
       overflow-hidden rounded-lg relative"
          ref={sliderRef}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <img 
            src={images[currentImageIndex]} 
            alt={`${title} - фото ${currentImageIndex + 1}`} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          
          {/* Кнопки навигации - позиционированы относительно изображения */}
          <button
            onClick={prevImage}
            className="absolute left-2 lg:left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 lg:w-10 lg:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-100 transition-opacity duration-200 z-10"
          >
            <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={nextImage}
            className="absolute right-2 lg:right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 lg:w-10 lg:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-100 transition-opacity duration-200 z-10"
          >
            <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Счетчик изображений */}
          <div className="absolute bottom-2 lg:bottom-4 left-2 lg:left-4 bg-black/50 text-white text-xs lg:text-sm px-2 lg:px-3 py-1 rounded-full">
            {currentImageIndex + 1}/{images.length}
          </div>

          {/* Индикаторы для мобильных */}
          <div className="lg:hidden absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => goToImage(e, index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex 
                    ? 'bg-white' 
                    : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductImageSlider; 