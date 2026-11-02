import axiosClient from './axiosClient';
import { FALLBACK_RECIPES } from './mockData';
import { calculateFoodPrice, getRestaurantName, getEstimatedDeliveryTime, isVegetarian } from '../utils/helpers';

const STORAGE_KEY_CUSTOM_RECIPES = 'biterate_custom_recipes';

export const PARTNER_RESTAURANTS = [
  { id: 'rest-1', name: 'Trattoria Bella', cuisine: 'Italian', rating: 4.8, ordersCount: 142, status: 'Open', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&auto=format&fit=crop&q=80', location: 'Downtown Food Square' },
  { id: 'rest-2', name: 'Pasta Fresca Co.', cuisine: 'Italian', rating: 4.7, ordersCount: 98, status: 'Open', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&auto=format&fit=crop&q=80', location: 'Little Italy East' },
  { id: 'rest-3', name: 'Golden Wok Dynasty', cuisine: 'Asian', rating: 4.9, ordersCount: 210, status: 'Open', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&auto=format&fit=crop&q=80', location: 'Chinatown Central' },
  { id: 'rest-4', name: 'Umami Kitchen', cuisine: 'Asian', rating: 4.8, ordersCount: 135, status: 'Open', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&auto=format&fit=crop&q=80', location: 'Zenith Arts District' },
  { id: 'rest-5', name: 'Firehouse Grill & Burgers', cuisine: 'American', rating: 4.9, ordersCount: 320, status: 'Open', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80', location: 'Route 66 Plaza' },
  { id: 'rest-6', name: 'Cantina Del Sol', cuisine: 'Mexican', rating: 4.7, ordersCount: 165, status: 'Open', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&auto=format&fit=crop&q=80', location: 'Fiesta Promenade' },
  { id: 'rest-7', name: 'Royal Tandoor House', cuisine: 'Indian', rating: 4.9, ordersCount: 280, status: 'Open', image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&auto=format&fit=crop&q=80', location: 'Spice Market Lane' },
  { id: 'rest-8', name: 'Olive & Fig Taverna', cuisine: 'Mediterranean', rating: 4.8, ordersCount: 110, status: 'Open', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80', location: 'Harbor Promenade' },
  { id: 'rest-9', name: 'The Rustic Diner', cuisine: 'American', rating: 4.6, ordersCount: 88, status: 'Open', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop&q=80', location: 'Sunset Boulevard' },
  { id: 'rest-10', name: 'Tokyo Express', cuisine: 'Japanese', rating: 4.9, ordersCount: 195, status: 'Open', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&auto=format&fit=crop&q=80', location: 'Metro Tower B1' },
  { id: 'rest-11', name: 'Bangkok Street Flavors', cuisine: 'Thai', rating: 4.8, ordersCount: 140, status: 'Open', image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&auto=format&fit=crop&q=80', location: 'Riverfront Walk' },
  { id: 'rest-12', name: 'Sweet Tooth Bakery', cuisine: 'Dessert', rating: 4.9, ordersCount: 220, status: 'Open', image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80', location: 'Pastry Corner #4' },
];

// Helper to decorate raw recipe with realistic food delivery properties
const enhanceRecipe = (recipe) => {
  if (!recipe) return null;
  return {
    ...recipe,
    price: calculateFoodPrice(recipe),
    restaurantName: recipe.restaurantName || getRestaurantName(recipe),
    estimatedDeliveryTime: recipe.estimatedDeliveryTime || getEstimatedDeliveryTime(recipe),
    isVeg: typeof recipe.isVeg === 'boolean' ? recipe.isVeg : isVegetarian(recipe),
    discountBadge: recipe.id % 4 === 0 ? '20% OFF' : recipe.id % 3 === 0 ? 'Free Delivery' : null,
    rating: Number((recipe.rating || 4.5).toFixed(1)),
    reviewCount: recipe.reviewCount || 45,
  };
};

const getCustomRecipes = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_RECIPES);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse custom recipes', e);
    return [];
  }
};

export const foodApi = {
  // Get all partner restaurants
  getRestaurants: () => PARTNER_RESTAURANTS,

  // Get total count of partner restaurants
  getTotalRestaurantsCount: () => PARTNER_RESTAURANTS.length,

  // Add custom recipe from Dashboard
  addCustomRecipe: (newDish) => {
    const customList = getCustomRecipes();
    const createdItem = enhanceRecipe({
      ...newDish,
      id: Date.now(),
      rating: 4.9,
      reviewCount: 1,
      isCustom: true,
    });
    const updated = [createdItem, ...customList];
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_RECIPES, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to store custom recipe', e);
    }
    return createdItem;
  },

  // Get all recipes with pagination & optional limit (merges custom user recipes with API recipes)
  getAllRecipes: async (limit = 50, skip = 0) => {
    const customRecipes = getCustomRecipes();
    try {
      const data = await axiosClient.get(`/recipes?limit=${limit}&skip=${skip}`);
      const apiRecipes = (data.recipes || []).map(enhanceRecipe);
      const combined = [...customRecipes, ...apiRecipes];
      return {
        recipes: combined,
        total: (data.total || apiRecipes.length) + customRecipes.length,
        skip: data.skip || 0,
        limit: data.limit || limit,
      };
    } catch (err) {
      console.warn('DummyJSON API unavailable, falling back to local dataset:', err.message);
      const fallback = FALLBACK_RECIPES.map(enhanceRecipe);
      const combined = [...customRecipes, ...fallback];
      return {
        recipes: combined,
        total: combined.length,
        skip: 0,
        limit: combined.length,
      };
    }
  },

  // Search recipes by keyword
  searchRecipes: async (query) => {
    const customRecipes = getCustomRecipes();
    if (!query || !query.trim()) {
      return foodApi.getAllRecipes(50, 0);
    }
    const q = query.toLowerCase().trim();
    const matchedCustom = customRecipes.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.cuisine && r.cuisine.toLowerCase().includes(q)) ||
        (r.restaurantName && r.restaurantName.toLowerCase().includes(q))
    );

    try {
      const data = await axiosClient.get(`/recipes/search?q=${encodeURIComponent(query.trim())}`);
      const apiRecipes = (data.recipes || []).map(enhanceRecipe);
      const combined = [...matchedCustom, ...apiRecipes];
      return {
        recipes: combined,
        total: combined.length,
      };
    } catch (err) {
      console.warn('Search API failed, filtering fallback data:', err.message);
      const filtered = FALLBACK_RECIPES.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q) ||
          (r.tags && r.tags.some((t) => t.toLowerCase().includes(q)))
      ).map(enhanceRecipe);
      const combined = [...matchedCustom, ...filtered];
      return { recipes: combined, total: combined.length };
    }
  },

  // Get recipe by ID
  getRecipeById: async (id) => {
    const customRecipes = getCustomRecipes();
    const foundCustom = customRecipes.find((r) => String(r.id) === String(id));
    if (foundCustom) return foundCustom;

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
    const customRecipes = getCustomRecipes().filter(
      (r) => r.cuisine && r.cuisine.toLowerCase() === tag.toLowerCase()
    );
    try {
      const data = await axiosClient.get(`/recipes/tag/${encodeURIComponent(tag)}`);
      return [...customRecipes, ...(data.recipes || []).map(enhanceRecipe)];
    } catch (err) {
      console.warn(`Tag fetch failed for ${tag}:`, err.message);
      const q = tag.toLowerCase();
      const filtered = FALLBACK_RECIPES.filter((r) =>
        (r.tags && r.tags.some((t) => t.toLowerCase() === q)) ||
        (r.cuisine && r.cuisine.toLowerCase() === q)
      ).map(enhanceRecipe);
      return [...customRecipes, ...filtered];
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
