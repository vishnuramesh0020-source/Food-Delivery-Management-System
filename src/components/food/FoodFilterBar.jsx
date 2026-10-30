import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

const FoodFilterBar = ({
  dietaryFilter,
  setDietaryFilter,
  sortBy,
  setSortBy,
  minRating,
  setMinRating,
  onResetFilters,
  totalResults = 0,
}) => {
  const isFiltered = dietaryFilter !== 'all' || sortBy !== 'recommended' || minRating > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Total Count & Icon */}
        <div className="flex items-center gap-2">
          <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Filter Dishes</h4>
            <p className="text-xs text-slate-400">
              Showing <span className="font-semibold text-slate-700">{totalResults}</span> appetizing choices
            </p>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Dietary toggle */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setDietaryFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                dietaryFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setDietaryFilter('veg')}
              className={`px-3 py-1.5 rounded-lg transition ${
                dietaryFilter === 'veg'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-emerald-700'
              }`}
            >
              🌱 Veg
            </button>
            <button
              type="button"
              onClick={() => setDietaryFilter('nonveg')}
              className={`px-3 py-1.5 rounded-lg transition ${
                dietaryFilter === 'nonveg'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-rose-700'
              }`}
            >
              🍗 Non-Veg
            </button>
          </div>

          {/* Min Rating */}
          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="text-xs font-semibold rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-200"
          >
            <option value={0}>⭐ Any Rating</option>
            <option value={4.0}>⭐ 4.0 & above</option>
            <option value={4.5}>⭐ 4.5 & above</option>
            <option value={4.8}>⭐ 4.8 Top Rated</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-semibold rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-200"
          >
            <option value="recommended">Sort: Recommended</option>
            <option value="rating">Rating: High to Low</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="time">Fastest Delivery</option>
          </select>

          {/* Reset button */}
          {isFiltered && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-2 rounded-xl transition"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodFilterBar;
