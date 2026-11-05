import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  UtensilsCrossed,
} from 'lucide-react';
import { restaurantApi } from '../api/restaurantApi';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import RestaurantFilterBar from '../components/restaurant/RestaurantFilterBar';
import Button from '../components/common/Button';

const RestaurantsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter State (synced with URL search params where applicable)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [activeCuisine, setActiveCuisine] = useState(searchParams.get('cuisine') || 'all');
  const [activeRating, setActiveRating] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Data & Request State
  const [restaurants, setRestaurants] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Restaurants via Third-Party API
  const fetchRestaurants = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const minRatingNumber = activeRating === 'all' ? 0 : parseFloat(activeRating);
      const data = await restaurantApi.getRestaurants({
        search: searchQuery,
        cuisine: activeCuisine,
        minRating: minRatingNumber,
        sortBy,
        page: currentPage,
        limit: itemsPerPage,
      });

      // Filter only open if toggled
      let finalItems = data.restaurants;
      let finalTotal = data.totalCount;

      if (onlyOpen) {
        finalItems = finalItems.filter((r) => r.isOpen);
        finalTotal = finalItems.length;
      }

      setRestaurants(finalItems);
      setTotalCount(finalTotal);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Failed to load restaurants:', err);
      setError(
        err.message || 'Unable to connect to third-party restaurant services. Please check your network.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, activeCuisine, activeRating, sortBy, onlyOpen, currentPage]);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  // Handle Search Input Change
  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setCurrentPage(1);
    if (val) {
      searchParams.set('search', val);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

  // Handle Cuisine Change
  const handleCuisineChange = (cuisineId) => {
    setActiveCuisine(cuisineId);
    setCurrentPage(1);
    if (cuisineId !== 'all') {
      searchParams.set('cuisine', cuisineId);
    } else {
      searchParams.delete('cuisine');
    }
    setSearchParams(searchParams);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveCuisine('all');
    setActiveRating('all');
    setSortBy('popularity');
    setOnlyOpen(false);
    setCurrentPage(1);
    setSearchParams({});
  };

  // Change page
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 320, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. HERO BANNER & INTRO */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 p-8 sm:p-12 text-white shadow-xl shadow-orange-500/15">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Curated Culinary Directory</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Partner Restaurants & Kitchens
          </h1>
          <p className="text-sm sm:text-base text-orange-100 font-medium leading-relaxed">
            Discover top-rated local eateries, authentic international bistros, and cloud kitchens delivering hot food right to your doorstep.
          </p>
        </div>
      </div>

      {/* 2. FILTER & SEARCH CONTROL BAR */}
      <RestaurantFilterBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        activeCuisine={activeCuisine}
        onCuisineChange={handleCuisineChange}
        activeRating={activeRating}
        onRatingChange={(r) => {
          setActiveRating(r);
          setCurrentPage(1);
        }}
        sortBy={sortBy}
        onSortChange={(s) => {
          setSortBy(s);
          setCurrentPage(1);
        }}
        onlyOpen={onlyOpen}
        onOnlyOpenToggle={() => {
          setOnlyOpen(!onlyOpen);
          setCurrentPage(1);
        }}
        onResetFilters={handleResetFilters}
        totalResults={totalCount}
      />

      {/* 3. LOADING SKELETON STATE */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs animate-pulse"
            >
              <div className="aspect-16/10 w-full bg-slate-200" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-slate-200 rounded-lg w-3/4" />
                <div className="h-3.5 bg-slate-100 rounded-lg w-1/2" />
                <div className="pt-3 border-t border-slate-100 flex justify-between">
                  <div className="h-4 bg-slate-200 rounded w-1/4" />
                  <div className="h-4 bg-slate-200 rounded w-1/4" />
                </div>
                <div className="h-9 bg-slate-100 rounded-2xl w-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. ERROR STATE */}
      {!isLoading && error && (
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center space-y-4 max-w-xl mx-auto shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-rose-900">Failed to Load Restaurants</h3>
            <p className="text-xs sm:text-sm text-rose-700 mt-1">{error}</p>
          </div>
          <Button variant="primary" size="sm" onClick={fetchRestaurants} icon={RefreshCw}>
            Retry Request
          </Button>
        </div>
      )}

      {/* 5. EMPTY RESULTS STATE */}
      {!isLoading && !error && restaurants.length === 0 && (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-4 max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto text-2xl">
            <UtensilsCrossed className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">No Restaurants Found</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              We couldn't find any partner restaurants matching your active search or filters.
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={handleResetFilters}>
            Clear All Filters
          </Button>
        </div>
      )}

      {/* 6. RESTAURANTS GRID */}
      {!isLoading && !error && restaurants.length > 0 && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>

          {/* 7. NUMBERED PAGINATION */}
          {totalPages > 1 && (
            <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Pagination Info */}
              <div className="text-xs font-bold text-slate-500">
                Page <span className="text-slate-900 font-black">{currentPage}</span> of{' '}
                <span className="text-slate-900 font-black">{totalPages}</span> • Showing{' '}
                <span className="text-orange-600 font-black">
                  {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(currentPage * itemsPerPage, totalCount)}
                </span>{' '}
                of {totalCount} restaurants
              </div>

              {/* Page Controls */}
              <div className="flex items-center gap-1.5">
                {/* Prev Page Button */}
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1 ${
                    currentPage === 1
                      ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                      : 'border-slate-200 text-slate-700 hover:bg-orange-50 hover:text-orange-600 cursor-pointer'
                  }`}
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Prev</span>
                </button>

                {/* Page Number Buttons */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  const isActive = page === currentPage;
                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => handlePageChange(page)}
                      className={`w-9 h-9 rounded-xl text-xs font-black transition cursor-pointer ${
                        isActive
                          ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                {/* Next Page Button */}
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1 ${
                    currentPage === totalPages
                      ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                      : 'border-slate-200 text-slate-700 hover:bg-orange-50 hover:text-orange-600 cursor-pointer'
                  }`}
                  aria-label="Next Page"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RestaurantsPage;
