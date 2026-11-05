import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Utensils,
  AlertCircle,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { foodApi } from '../api/foodApi';
import FoodCard from '../components/food/FoodCard';
import FoodFilterBar from '../components/food/FoodFilterBar';
import CategoryPills from '../components/food/CategoryPills';
import QuickViewModal from '../components/food/QuickViewModal';
import AddEditFoodModal from '../components/food/AddEditFoodModal';
import DeleteFoodModal from '../components/food/DeleteFoodModal';
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
  const [availabilityFilter, setAvailabilityFilter] = useState('all'); // 'all' | 'in-stock'
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('recommended'); // 'recommended' | 'price-asc' | 'price-desc' | 'rating' | 'time'

  // Modals state
  const [quickViewFood, setQuickViewFood] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [deletingFood, setDeletingFood] = useState(null);

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
        data = await foodApi.getAllRecipes(100, 0);
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
    setAvailabilityFilter('all');
    setMinRating(0);
    setSortBy('recommended');
    setSearchQuery('');
    setSearchParams({});
  };

  // Filter and sort items based on Category, Veg/Non-Veg, Availability, Price
  const filteredRecipes = useMemo(() => {
    return recipes
      .filter((r) => {
        // 1. Filter by Category / Cuisine
        if (activeCategory !== 'all') {
          const cat = activeCategory.toLowerCase();
          const matchesCategory =
            r.category && r.category.toLowerCase() === cat;
          const matchesCuisine =
            r.cuisine && r.cuisine.toLowerCase() === cat;
          const matchesTag =
            r.tags && r.tags.some((t) => t.toLowerCase() === cat);
          if (!matchesCategory && !matchesCuisine && !matchesTag) return false;
        }

        // 2. Filter by Veg / Non-Veg
        if (dietaryFilter === 'veg' && !r.isVeg) return false;
        if (dietaryFilter === 'nonveg' && r.isVeg) return false;

        // 3. Filter by Availability Status
        if (availabilityFilter === 'in-stock') {
          const isAvail =
            typeof r.isAvailable === 'boolean'
              ? r.isAvailable
              : r.availabilityStatus !== 'Out of Stock';
          if (!isAvail) return false;
        }

        // 4. Filter by Rating
        if (minRating > 0 && r.rating < minRating) return false;

        return true;
      })
      .sort((a, b) => {
        // Sort by Price (Low to High / High to Low)
        if (sortBy === 'price-asc') {
          return a.price - b.price;
        }
        if (sortBy === 'price-desc') {
          return b.price - a.price;
        }
        if (sortBy === 'rating') {
          return (b.rating || 0) - (a.rating || 0);
        }
        if (sortBy === 'time') {
          return (a.prepTimeMinutes || 20) - (b.prepTimeMinutes || 20);
        }
        return 0;
      });
  }, [recipes, activeCategory, dietaryFilter, availabilityFilter, minRating, sortBy]);

  // Callback when item is added or edited
  const handleFoodSaved = (savedDish) => {
    setRecipes((prev) => {
      const idx = prev.findIndex((r) => String(r.id) === String(savedDish.id));
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = savedDish;
        return copy;
      }
      return [savedDish, ...prev];
    });
    setEditingFood(null);
    setIsAddModalOpen(false);
  };

  // Callback when item is deleted
  const handleFoodDeleted = (deletedId) => {
    setRecipes((prev) => prev.filter((r) => String(r.id) !== String(deletedId)));
    setDeletingFood(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 1. TOP HEADER & MENU MANAGEMENT ACTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Utensils className="w-8 h-8 text-orange-500" />
            <span>Food Menu & Catalog</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Browse, search, and manage fresh culinary dishes. Add new items, update prices or availability, and organize by category.
          </p>
        </div>

        {/* Action Controls: Add New Food Item Button */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => setIsAddModalOpen(true)}
            icon={Plus}
            className="shadow-md shadow-orange-500/20"
          >
            Add New Menu Item
          </Button>
        </div>
      </div>

      {/* 2. SEARCH BAR */}
      <div className="w-full">
        <SearchBar
          initialValue={searchQuery}
          onSearch={(val) => setSearchQuery(val)}
          placeholder="Search food by name, description, category, or cuisine..."
        />
      </div>

      {/* 3. CATEGORY PILLS FILTER */}
      <div>
        <CategoryPills
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
        />
      </div>

      {/* 4. FILTER BAR (VEG/NON-VEG, AVAILABILITY, SORT BY PRICE) */}
      <FoodFilterBar
        dietaryFilter={dietaryFilter}
        setDietaryFilter={setDietaryFilter}
        availabilityFilter={availabilityFilter}
        setAvailabilityFilter={setAvailabilityFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        minRating={minRating}
        setMinRating={setMinRating}
        onResetFilters={handleResetFilters}
        totalResults={filteredRecipes.length}
      />

      {/* 5. ERROR STATE */}
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

      {/* 6. LOADING SKELETON */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <SkeletonCard key={n} />
          ))}
        </div>
      )}

      {/* 7. EMPTY STATE */}
      {!isLoading && !error && filteredRecipes.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 space-y-4 shadow-xs">
          <div className="w-20 h-20 bg-orange-50 text-orange-400 rounded-full flex items-center justify-center text-3xl mx-auto">
            🔍
          </div>
          <h3 className="text-xl font-bold text-slate-800">No matching dishes found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query, selecting another category, or clearing your dietary / price filters.
          </p>
          <Button variant="primary" size="md" onClick={handleResetFilters}>
            Reset All Filters
          </Button>
        </div>
      )}

      {/* 8. FOOD CARDS GRID (WITH EDIT & DELETE ACTIONS) */}
      {!isLoading && !error && filteredRecipes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredRecipes.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              onQuickView={(f) => setQuickViewFood(f)}
              onEdit={(f) => setEditingFood(f)}
              onDelete={(f) => setDeletingFood(f)}
              showActions={true}
            />
          ))}
        </div>
      )}

      {/* 9. MODALS */}
      {/* Quick View Modal */}
      <QuickViewModal
        food={quickViewFood}
        isOpen={!!quickViewFood}
        onClose={() => setQuickViewFood(null)}
      />

      {/* Add / Edit Menu Item Modal */}
      <AddEditFoodModal
        isOpen={isAddModalOpen || !!editingFood}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingFood(null);
        }}
        foodItem={editingFood}
        onSaved={handleFoodSaved}
      />

      {/* Delete Confirmation Modal */}
      <DeleteFoodModal
        isOpen={!!deletingFood}
        onClose={() => setDeletingFood(null)}
        foodItem={deletingFood}
        onDeleted={handleFoodDeleted}
      />
    </div>
  );
};

export default MenuPage;
