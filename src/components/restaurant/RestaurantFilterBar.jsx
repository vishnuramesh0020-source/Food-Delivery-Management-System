import React, { useRef, useState, useEffect } from 'react';
import {
  Search,
  X,
  Star,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { RESTAURANT_CUISINES, RATING_FILTERS, SORT_OPTIONS } from '../../api/restaurantApi';

const RestaurantFilterBar = ({
  searchQuery,
  onSearchChange,
  activeCuisine,
  onCuisineChange,
  activeRating,
  onRatingChange,
  sortBy,
  onSortChange,
  onlyOpen,
  onOnlyOpenToggle,
  onResetFilters,
  totalResults,
}) => {
  const cuisineScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (cuisineScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = cuisineScrollRef.current;
      setCanScrollLeft(scrollLeft > 6);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = cuisineScrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scrollCuisine = (direction) => {
    if (cuisineScrollRef.current) {
      const scrollAmount = direction === 'left' ? -240 : 240;
      cuisineScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    activeCuisine !== 'all' ||
    activeRating !== 'all' ||
    sortBy !== 'popularity' ||
    onlyOpen;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-5 sm:p-6 shadow-xs space-y-5">
      {/* 1. TOP ROW: SEARCH BAR, SORT & ONLY-OPEN TOGGLE */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search restaurants by name, cuisine, street, or dish..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right Controls: Sort Dropdown & Open Now Toggle */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Open Now Toggle Pill */}
          <button
            type="button"
            onClick={onOnlyOpenToggle}
            className={`px-3.5 py-3 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer border ${
              onlyOpen
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                onlyOpen ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
              }`}
            />
            <span>Open Now Only</span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative min-w-44">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-black text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  Sort: {opt.label}
                </option>
              ))}
            </select>
            <ArrowUpDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Reset Filters Trigger */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="px-3 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition cursor-pointer shrink-0"
              title="Reset all filters"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* 2. MIDDLE ROW: CUISINE FILTER PILLS WITH GLASSY MOVE BUTTONS */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            Filter by Cuisine
          </span>
          <span className="text-xs font-bold text-slate-400">
            {totalResults} {totalResults === 1 ? 'restaurant' : 'restaurants'} found
          </span>
        </div>

        {/* Carousel Wrapper with Glassy Controls */}
        <div className="relative group/carousel">
          {/* Glassy Left Move Button */}
          <button
            type="button"
            onClick={() => scrollCuisine('left')}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-20 w-8 h-8 rounded-full bg-white/85 hover:bg-white backdrop-blur-md border border-slate-200/90 shadow-md hover:shadow-lg flex items-center justify-center text-slate-700 hover:text-orange-600 transition-all duration-200 active:scale-90 cursor-pointer ${
              canScrollLeft
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-75 pointer-events-none'
            }`}
            title="Move cuisines left"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Left Gradient Edge Fade */}
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-2 w-10 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-10 rounded-l-2xl" />
          )}

          {/* Scrollable Pills Row */}
          <div
            ref={cuisineScrollRef}
            className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth px-1"
          >
            {RESTAURANT_CUISINES.map((cuisine) => {
              const isSelected = activeCuisine.toLowerCase() === cuisine.id.toLowerCase();
              return (
                <button
                  key={cuisine.id}
                  type="button"
                  onClick={() => onCuisineChange(cuisine.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25 scale-[1.02]'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                  }`}
                >
                  <span>{cuisine.icon}</span>
                  <span>{cuisine.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Gradient Edge Fade */}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-2 w-10 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-10 rounded-r-2xl" />
          )}

          {/* Glassy Right Move Button */}
          <button
            type="button"
            onClick={() => scrollCuisine('right')}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-20 w-8 h-8 rounded-full bg-white/85 hover:bg-white backdrop-blur-md border border-slate-200/90 shadow-md hover:shadow-lg flex items-center justify-center text-slate-700 hover:text-orange-600 transition-all duration-200 active:scale-90 cursor-pointer ${
              canScrollRight
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-75 pointer-events-none'
            }`}
            title="Move cuisines right"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. BOTTOM ROW: RATING FILTER BUTTONS */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>Minimum Rating:</span>
          </span>

          {RATING_FILTERS.map((r) => {
            const isSelected = activeRating === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => onRatingChange(r.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/70'
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RestaurantFilterBar;
