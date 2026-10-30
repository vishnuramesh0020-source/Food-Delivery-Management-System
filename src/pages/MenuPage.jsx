import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Utensils, AlertCircle, RefreshCw } from 'lucide-react';
import { foodApi } from '../api/foodApi';
import FoodCard from '../components/food/FoodCard';
import FoodFilterBar from '../components/food/FoodFilterBar';
import CategoryPills from '../components/food/CategoryPills';
import QuickViewModal from '../components/food/QuickViewModal';
import SearchBar from '../components/common/SearchBar';
import { SkeletonCard } from '../components/common/Spinner';
import Button from '../components/common/Button';

const MenuPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get('search') || '';
  const initialCuisine = searchParams.get('cuisine') || 'all';

  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeCategory, setActiveCategory] = useState(initialCuisine);
  const [dietaryFilter, setDietaryFilter] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('recommended');

  const [quickViewFood, setQuickViewFood] = useState(null);

  const categories = foodApi.getCategories();

  // Load recipes from API with useCallback
  const fetchRecipes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let data;
      if (searchQuery.trim()) {
        data = await foodApi.searchRecipes(searchQuery);
      } else {
        data = await foodApi.getAllRecipes(50, 0);
      }
      setRecipes(data.recipes || []);
    } catch (err) {
      console.error('Menu load error:', err);
      setError('Unable to fetch recipes from server. Please check your network connection.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleSelectCategory = (catId) => {
    setActiveCategory(catId);
    if (catId === 'all') {
      searchParams.delete('cuisine');
    } else {
      searchParams.set('cuisine', catId);
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setActiveCategory('all');
    setDietaryFilter('all');
    setMinRating(0);
    setSortBy('recommended');
    setSearchQuery('');
    setSearchParams({});
  };

  const filteredRecipes = useMemo(() => {
    return recipes.filter((r) => {
      if (activeCategory !== 'all') {
        const matchesCuisine = r.cuisine && r.cuisine.toLowerCase() === activeCategory.toLowerCase();
        const matchesTag = r.tags && r.tags.some((t) => t.toLowerCase() === activeCategory.toLowerCase());
        if (!matchesCuisine && !matchesTag) return false;
      }

      if (dietaryFilter === 'veg' && !r.isVeg) return false;
      if (dietaryFilter === 'nonveg' && r.isVeg) return false;

      if (minRating > 0 && r.rating < minRating) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === 'price-asc') {
        return a.price - b.price;
      }
      if (sortBy === 'price-desc') {
        return b.price - a.price;
      }
      if (sortBy === 'time') {
        return (a.prepTimeMinutes || 20) - (b.prepTimeMinutes || 20);
      }
      return 0;
    });
  }, [recipes, activeCategory, dietaryFilter, minRating, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Utensils className="w-7 h-7 text-orange-500" />
            Explore Full Menu
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse through hundreds of delicious dishes crafted by top chefs and local diners.
          </p>
        </div>

        <div className="w-full md:w-96">
          <SearchBar
            initialValue={searchQuery}
            onSearch={(val) => setSearchQuery(val)}
            placeholder="Search by dish name or ingredient..."
          />
        </div>
      </div>

      <div>
        <CategoryPills
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
        />
      </div>

      <FoodFilterBar
        dietaryFilter={dietaryFilter}
        setDietaryFilter={setDietaryFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        minRating={minRating}
        setMinRating={setMinRating}
        onResetFilters={handleResetFilters}
        totalResults={filteredRecipes.length}
      />

      {error && (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-3xl text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h3 className="font-bold text-rose-900 text-lg">Failed to load recipes</h3>
          <p className="text-xs text-rose-700 max-w-md mx-auto">{error}</p>
          <Button variant="danger" size="sm" onClick={fetchRecipes} icon={RefreshCw}>
            Try Again
          </Button>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <SkeletonCard key={n} />
          ))}
        </div>
      )}

      {!isLoading && !error && filteredRecipes.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 space-y-4 shadow-xs">
          <div className="w-20 h-20 bg-orange-50 text-orange-400 rounded-full flex items-center justify-center text-3xl mx-auto">
            🔍
          </div>
          <h3 className="text-xl font-bold text-slate-800">No matching dishes found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query, selecting another cuisine, or resetting your dietary filters.
          </p>
          <Button variant="primary" size="md" onClick={handleResetFilters}>
            Reset All Filters
          </Button>
        </div>
      )}

      {!isLoading && !error && filteredRecipes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredRecipes.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              onQuickView={(f) => setQuickViewFood(f)}
            />
          ))}
        </div>
      )}

      <QuickViewModal
        food={quickViewFood}
        isOpen={!!quickViewFood}
        onClose={() => setQuickViewFood(null)}
      />
    </div>
  );
};

export default MenuPage;
