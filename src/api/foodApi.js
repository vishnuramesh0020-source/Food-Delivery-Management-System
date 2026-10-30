import axiosClient from './axiosClient';
import { FALLBACK_RECIPES } from './mockData';
import { calculateFoodPrice, getRestaurantName, getEstimatedDeliveryTime, isVegetarian } from '../utils/helpers';

// Helper to decorate raw recipe with realistic food delivery properties
const enhanceRecipe = (recipe) => {
  if (!recipe) return null;
  return {
    ...recipe,
    price: calculateFoodPrice(recipe),
    restaurantName: getRestaurantName(recipe),
    estimatedDeliveryTime: getEstimatedDeliveryTime(recipe),
    isVeg: isVegetarian(recipe),
    discountBadge: recipe.id % 4 === 0 ? '20% OFF' : recipe.id % 3 === 0 ? 'Free Delivery' : null,
    rating: Number((recipe.rating || 4.5).toFixed(1)),
    reviewCount: recipe.reviewCount || 45,
  };
};

export const foodApi = {
  // Get all recipes with pagination & optional limit
  getAllRecipes: async (limit = 30, skip = 0) => {
    try {
      const data = await axiosClient.get(`/recipes?limit=${limit}&skip=${skip}`);
      const recipes = (data.recipes || []).map(enhanceRecipe);
      return {
        recipes,
        total: data.total || recipes.length,
        skip: data.skip || 0,
        limit: data.limit || limit,
      };
    } catch (err) {
      console.warn('DummyJSON API unavailable, falling back to local dataset:', err.message);
      const recipes = FALLBACK_RECIPES.map(enhanceRecipe);
      return {
        recipes,
        total: recipes.length,
        skip: 0,
        limit: recipes.length,
      };
    }
  },

  // Search recipes by keyword
  searchRecipes: async (query) => {
    if (!query || !query.trim()) {
      return foodApi.getAllRecipes(30, 0);
    }
    try {
      const data = await axiosClient.get(`/recipes/search?q=${encodeURIComponent(query.trim())}`);
      const recipes = (data.recipes || []).map(enhanceRecipe);
      return {
        recipes,
        total: data.total || recipes.length,
      };
    } catch (err) {
      console.warn('Search API failed, filtering fallback data:', err.message);
      const q = query.toLowerCase().trim();
      const filtered = FALLBACK_RECIPES.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q) ||
          (r.tags && r.tags.some((t) => t.toLowerCase().includes(q)))
      ).map(enhanceRecipe);
      return { recipes: filtered, total: filtered.length };
    }
  },

  // Get recipe by ID
  getRecipeById: async (id) => {
    try {
      const data = await axiosClient.get(`/recipes/${id}`);
      return enhanceRecipe(data);
    } catch (err) {
      console.warn(`Failed to fetch recipe #${id}, checking fallback data:`, err.message);
      const found = FALLBACK_RECIPES.find((r) => String(r.id) === String(id));
      if (found) return enhanceRecipe(found);
      return enhanceRecipe(FALLBACK_RECIPES[0]);
    }
  },

  // Get recipes by cuisine / tag / mealType
  getRecipesByTag: async (tag) => {
    try {
      const data = await axiosClient.get(`/recipes/tag/${encodeURIComponent(tag)}`);
      return (data.recipes || []).map(enhanceRecipe);
    } catch (err) {
      console.warn(`Tag fetch failed for ${tag}:`, err.message);
      const q = tag.toLowerCase();
      const filtered = FALLBACK_RECIPES.filter((r) =>
        (r.tags && r.tags.some((t) => t.toLowerCase() === q)) ||
        (r.cuisine && r.cuisine.toLowerCase() === q)
      ).map(enhanceRecipe);
      return filtered;
    }
  },

  // Fetch unique available cuisines / categories
  getCategories: () => [
    { id: 'all', label: 'All Items', icon: '🍽️' },
    { id: 'Italian', label: 'Italian', icon: '🍕' },
    { id: 'Asian', label: 'Asian', icon: '🍜' },
    { id: 'American', label: 'American', icon: '🍔' },
    { id: 'Mexican', label: 'Mexican', icon: '🌮' },
    { id: 'Indian', label: 'Indian', icon: '🍛' },
    { id: 'Mediterranean', label: 'Mediterranean', icon: '🥗' },
    { id: 'Dessert', label: 'Desserts', icon: '🍰' },
  ],
};
