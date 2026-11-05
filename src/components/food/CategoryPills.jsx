import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CategoryPills = ({ categories, activeCategory, onSelectCategory }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 6);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [categories]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -220 : 220;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group/pills">
      {/* Glassy Left Move Button */}
      <button
        type="button"
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-20 w-8 h-8 rounded-full bg-white/85 hover:bg-white backdrop-blur-md border border-slate-200/90 shadow-md hover:shadow-lg flex items-center justify-center text-slate-700 hover:text-orange-600 transition-all duration-200 active:scale-90 cursor-pointer ${
          canScrollLeft
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-75 pointer-events-none'
        }`}
        title="Scroll left"
        aria-label="Scroll cuisines left"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Left Gradient Fade */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-2 w-10 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-10 rounded-l-2xl" />
      )}

      {/* Scrollable Pills Row */}
      <div
        ref={scrollRef}
        className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none py-1 scroll-smooth px-1"
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs md:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer shadow-xs ${
                isActive
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25 scale-102 ring-2 ring-orange-400'
                  : 'bg-white text-slate-700 hover:bg-orange-50 hover:text-orange-600 border border-slate-200/80 hover:border-orange-200'
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right Gradient Fade */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-2 w-10 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-10 rounded-r-2xl" />
      )}

      {/* Glassy Right Move Button */}
      <button
        type="button"
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-20 w-8 h-8 rounded-full bg-white/85 hover:bg-white backdrop-blur-md border border-slate-200/90 shadow-md hover:shadow-lg flex items-center justify-center text-slate-700 hover:text-orange-600 transition-all duration-200 active:scale-90 cursor-pointer ${
          canScrollRight
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-75 pointer-events-none'
        }`}
        title="Scroll right"
        aria-label="Scroll cuisines right"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default CategoryPills;
