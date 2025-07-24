import React, { useRef, useState, useCallback, useMemo } from 'react';
import categories from './categoriesData';

// Константы для стилей
const STYLES = {
  container: "w-full flex items-center justify-start py-2",
  scrollContainer: "flex gap-2 min-w-0 overflow-x-scroll overscroll-x-contain md:select-none",
  categoryCard: "flex items-center flex-shrink-0 h-16 bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-2 hover:shadow-md transition cursor-pointer",
  categoryIcon: "h-10 w-10 object-contain mr-3 flex-shrink-0",
  categoryText: "text-sm font-medium text-gray-600 text-center w-full whitespace-normal break-words"
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
const CategoryCard = React.memo(({ category, isFirst }) => (
  <div
    className={`${STYLES.categoryCard} ${isFirst ? 'ml-2 md:ml-0' : ''}`}
  >
    <img 
      src={category.icon} 
      alt={category.name} 
      className={STYLES.categoryIcon} 
    />
    <span className={STYLES.categoryText}>
      {category.name}
    </span>
  </div>
));

CategoryCard.displayName = 'CategoryCard';

// Основной компонент CategoriesBar
const CategoriesBar = () => {
  const { scrollRef, scrollHandlers, scrollStyles } = useDragScroll();

  // Мемоизированный список категорий
  const categoryCards = useMemo(() => 
    categories.map((category, index) => (
      <CategoryCard
        key={category.name}
        category={category}
        isFirst={index === 0}
      />
    )), []
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