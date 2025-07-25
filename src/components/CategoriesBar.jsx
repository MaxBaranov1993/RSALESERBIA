import React, { useRef, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getCategoriesWithItems } from './categoriesData';
import { useLanguage } from '../context/LanguageContext';

// Константы для стилей
const STYLES = {
  container: "w-full flex items-center justify-start py-2 sm:py-3 md:py-4",
  scrollContainer: "flex gap-2 sm:gap-3 md:gap-4 min-w-0 overflow-x-scroll overscroll-x-contain md:select-none",
  categoryCard: "flex items-center flex-shrink-0 h-16 sm:h-18 md:h-20 bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-sm px-3 sm:px-4 md:px-6 py-2 sm:py-3 hover:shadow-lg hover:border-violet-200 transition-all duration-200 cursor-pointer",
  categoryIcon: "h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 object-contain mr-2 sm:mr-3 md:mr-4 flex-shrink-0",
  categoryText: "text-xs sm:text-sm font-semibold text-gray-700 text-center w-full whitespace-normal break-words"
};

// Константы для скролла
const SCROLL_STYLES = {
  scrollBehavior: 'smooth',
  flex: 1,
  justifyContent: 'start',
  scrollbarWidth: 'none', // Firefox
  msOverflowStyle: 'none', // IE 10+
};

// Хук для drag-to-scroll функциональности
const useDragScroll = () => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = useCallback((e) => {
    if (!scrollRef.current) return;
    
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!isDragging || !scrollRef.current) return;
    
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX);
    scrollRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const stopDrag = useCallback(() => {
    setIsDragging(false);
  }, []);

  const scrollHandlers = useMemo(() => ({
    onMouseDown,
    onMouseMove,
    onMouseUp: stopDrag,
    onMouseLeave: stopDrag,
  }), [onMouseDown, onMouseMove, stopDrag]);

  const scrollStyles = useMemo(() => ({
    ...SCROLL_STYLES,
    cursor: isDragging ? 'grabbing' : 'grab',
  }), [isDragging]);

  return {
    scrollRef,
    scrollHandlers,
    scrollStyles,
    isDragging
  };
};

// Компонент для отдельной категории
const CategoryCard = React.memo(({ category, isFirst, translatedName }) => (
  <Link
    to={category.link}
    className={`${STYLES.categoryCard} ${isFirst ? 'ml-2 md:ml-0' : ''}`}
  >
    <img 
      src={category.icon} 
      alt={translatedName} 
      className={STYLES.categoryIcon} 
    />
    <div className="flex items-center flex-1">
      <span className={STYLES.categoryText}>
        {translatedName}
      </span>
    </div>
  </Link>
));

CategoryCard.displayName = 'CategoryCard';

// Основной компонент CategoriesBar
const CategoriesBar = () => {
  const { scrollRef, scrollHandlers, scrollStyles } = useDragScroll();
  const { t } = useLanguage();

  // Получаем категории с товарами
  const categoriesWithItems = useMemo(() => getCategoriesWithItems(), []);

  // Мемоизированный список категорий
  const categoryCards = useMemo(() => 
    categoriesWithItems.map((category, index) => (
      <CategoryCard
        key={category.key}
        category={category}
        isFirst={index === 0}
        translatedName={t(`categories.${category.key}`)}
      />
    )), [categoriesWithItems, t]
  );

  return (
    <div className={STYLES.container}>
      <div
        ref={scrollRef}
        className={STYLES.scrollContainer}
        style={scrollStyles}
        {...scrollHandlers}
      >
        {categoryCards}
      </div>
    </div>
  );
};

export default React.memo(CategoriesBar); 