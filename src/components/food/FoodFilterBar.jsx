import React from 'react';
import { SlidersHorizontal, RotateCcw, ArrowUpDown } from 'lucide-react';

const FoodFilterBar = ({
  dietaryFilter,
  setDietaryFilter,
  availabilityFilter = 'all',
  setAvailabilityFilter,
  sortBy,
  setSortBy,
  minRating,
  setMinRating,
  onResetFilters,
  totalResults = 0,
}) => {
  const isFiltered =
    dietaryFilter !== 'all' ||
    availabilityFilter !== 'all' ||
    sortBy !== 'recommended' ||
    minRating > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Total Count & Title */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-800">Filter Menu Items</h4>
            <p className="text-xs text-slate-400">
              Showing <span className="font-extrabold text-orange-600">{totalResults}</span> appetizing dishes
            </p>
          </div>
        </div>

        {/* Right: Filter Controls (Veg/Non-Veg, Availability, Rating, Price Sort) */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Dietary toggle (Veg / Non-Veg) */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setDietaryFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                dietaryFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All Diet
            </button>
            <button
              type="button"
              onClick={() => setDietaryFilter('veg')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
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
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                dietaryFilter === 'nonveg'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-rose-700'
              }`}
            >
              🍗 Non-Veg
            </button>
          </div>

          {/* Availability Status Filter Pill */}
          {setAvailabilityFilter && (
            <button
              type="button"
              onClick={() =>
                setAvailabilityFilter(availabilityFilter === 'in-stock' ? 'all' : 'in-stock')
              }
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
                availabilityFilter === 'in-stock'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  availabilityFilter === 'in-stock'
                    ? 'bg-emerald-500 animate-pulse'
                    : 'bg-slate-300'
                }`}
              />
              <span>In Stock Only</span>
            </button>
          )}

          {/* Min Rating Filter */}
          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="text-xs font-bold rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-200 cursor-pointer"
          >
            <option value={0}>⭐ All Ratings</option>
            <option value={4.0}>⭐ 4.0 & above</option>
            <option value={4.5}>⭐ 4.5 & above</option>
            <option value={4.8}>⭐ 4.8 Top Rated</option>
          </select>

          {/* Sort By (Explicit Sort By Price featured prominently) */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none text-xs font-extrabold rounded-xl border border-slate-200 bg-white pl-3.5 pr-8 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-200 cursor-pointer"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="price-asc">Sort by Price: Low to High (₹ - ₹₹₹)</option>
              <option value="price-desc">Sort by Price: High to Low (₹₹₹ - ₹)</option>
              <option value="rating">Sort: Highest Rated</option>
              <option value="time">Sort: Fastest Delivery</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Reset Filters button */}
          {isFiltered && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-2 rounded-xl transition cursor-pointer"
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
