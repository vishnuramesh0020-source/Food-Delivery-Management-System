import axiosClient from './axiosClient';
import { FALLBACK_RECIPES } from './mockData';
import { calculateFoodPrice, getRestaurantName, getEstimatedDeliveryTime, isVegetarian } from '../utils/helpers';

const STORAGE_KEY_CUSTOM_RECIPES = 'biterate_custom_recipes';
const STORAGE_KEY_EDITED_RECIPES = 'biterate_edited_recipes';
const STORAGE_KEY_DELETED_RECIPES = 'biterate_deleted_recipes';

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

  const isAvailable =
    typeof recipe.isAvailable === 'boolean'
      ? recipe.isAvailable
      : recipe.availabilityStatus
      ? recipe.availabilityStatus === 'In Stock' || recipe.availabilityStatus === 'Available'
      : true;

  const availabilityStatus = isAvailable ? 'In Stock' : 'Out of Stock';
  const category = recipe.category || recipe.cuisine || 'Italian';
  const cuisine = recipe.cuisine || recipe.category || 'Italian';

  const description =
    recipe.description ||
    (Array.isArray(recipe.instructions) && recipe.instructions.length > 0
      ? recipe.instructions.slice(0, 2).join(' ')
      : `Hand-crafted ${recipe.name || 'dish'} prepared with fresh organic ingredients, secret house seasonings, and culinary passion.`);

  return {
    ...recipe,
    description,
    category,
    cuisine,
    isAvailable,
    availabilityStatus,
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

const getEditedRecipes = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EDITED_RECIPES);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Failed to parse edited recipes', e);
    return {};
  }
};

const getDeletedRecipeIds = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DELETED_RECIPES);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse deleted recipes', e);
    return [];
  }
};

// Applies localStorage overrides (edits) and filters out deleted items
const applyEditsAndDeletions = (recipesList) => {
  const deletedIds = getDeletedRecipeIds().map(String);
  const editedMap = getEditedRecipes();

  return recipesList
    .filter((r) => !deletedIds.includes(String(r.id)))
    .map((r) => {
      const edited = editedMap[String(r.id)];
      if (edited) {
        return enhanceRecipe({ ...r, ...edited });
      }
      return enhanceRecipe(r);
    });
};

export const foodApi = {
  // Get all partner restaurants
  getRestaurants: () => PARTNER_RESTAURANTS,

  // Get total count of partner restaurants
  getTotalRestaurantsCount: () => PARTNER_RESTAURANTS.length,

  // Add custom recipe from UI (Menu Management / Dashboard)
  addCustomRecipe: (newDish) => {
    const customList = getCustomRecipes();
    const isAvail = typeof newDish.isAvailable === 'boolean' ? newDish.isAvailable : true;
    const createdItem = enhanceRecipe({
      ...newDish,
      id: Date.now(),
      rating: 4.9,
      reviewCount: 1,
      isCustom: true,
      isAvailable: isAvail,
      availabilityStatus: isAvail ? 'In Stock' : 'Out of Stock',
    });
    const updated = [createdItem, ...customList];
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_RECIPES, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to store custom recipe', e);
    }
    return createdItem;
  },

  // Edit / Update existing menu item
  updateRecipe: (id, updatedFields) => {
    const stringId = String(id);
    const customList = getCustomRecipes();
    const customIndex = customList.findIndex((r) => String(r.id) === stringId);

    const isAvail =
      typeof updatedFields.isAvailable === 'boolean'
        ? updatedFields.isAvailable
        : updatedFields.availabilityStatus
        ? updatedFields.availabilityStatus === 'In Stock' || updatedFields.availabilityStatus === 'Available'
        : true;

    const fullUpdates = {
      ...updatedFields,
      isAvailable: isAvail,
      availabilityStatus: isAvail ? 'In Stock' : 'Out of Stock',
    };

    let updatedDish = null;

    if (customIndex > -1) {
      const existing = customList[customIndex];
      updatedDish = enhanceRecipe({ ...existing, ...fullUpdates });
      customList[customIndex] = updatedDish;
      try {
        localStorage.setItem(STORAGE_KEY_CUSTOM_RECIPES, JSON.stringify(customList));
      } catch (e) {
        console.error('Failed to update custom recipe', e);
      }
    } else {
      const editedMap = getEditedRecipes();
      editedMap[stringId] = { ...(editedMap[stringId] || {}), ...fullUpdates };
      try {
        localStorage.setItem(STORAGE_KEY_EDITED_RECIPES, JSON.stringify(editedMap));
      } catch (e) {
        console.error('Failed to store edited recipe', e);
      }
      updatedDish = enhanceRecipe({ id, ...fullUpdates });
    }

    return updatedDish;
  },

  // Delete menu item
  deleteRecipe: (id) => {
    const stringId = String(id);
    // 1. Remove from custom recipes list if present
    const customList = getCustomRecipes();
    const filteredCustom = customList.filter((r) => String(r.id) !== stringId);
    if (filteredCustom.length !== customList.length) {
      try {
        localStorage.setItem(STORAGE_KEY_CUSTOM_RECIPES, JSON.stringify(filteredCustom));
      } catch (e) {
        console.error('Failed to remove custom recipe', e);
      }
    }

    // 2. Add ID to deleted list
    const deletedIds = getDeletedRecipeIds();
    if (!deletedIds.includes(stringId)) {
      const updatedDeleted = [...deletedIds, stringId];
      try {
        localStorage.setItem(STORAGE_KEY_DELETED_RECIPES, JSON.stringify(updatedDeleted));
      } catch (e) {
        console.error('Failed to persist deleted recipe ID', e);
      }
    }

    // 3. Clean from edited map if present
    const editedMap = getEditedRecipes();
    if (editedMap[stringId]) {
      delete editedMap[stringId];
      try {
        localStorage.setItem(STORAGE_KEY_EDITED_RECIPES, JSON.stringify(editedMap));
      } catch (e) {
        console.error('Failed to clean edited map', e);
      }
    }

    return true;
  },

  // Get all recipes with pagination & optional limit (merges custom user recipes with API recipes)
  getAllRecipes: async (limit = 50, skip = 0) => {
    const customRecipes = getCustomRecipes();
    try {
      const data = await axiosClient.get(`/recipes?limit=${limit}&skip=${skip}`);
      const apiRecipes = (data.recipes || []).map(enhanceRecipe);
      const combined = applyEditsAndDeletions([...customRecipes, ...apiRecipes]);
      return {
        recipes: combined,
        total: combined.length,
        skip: data.skip || 0,
        limit: data.limit || limit,
      };
    } catch (err) {
      console.warn('DummyJSON API unavailable, falling back to local dataset:', err.message);
      const fallback = FALLBACK_RECIPES.map(enhanceRecipe);
      const combined = applyEditsAndDeletions([...customRecipes, ...fallback]);
      return {
        recipes: combined,
        total: combined.length,
        skip: 0,
        limit: combined.length,
      };
    }
  },

  // Search recipes by keyword across name, description, category, and cuisine
  searchRecipes: async (query) => {
    const allResult = await foodApi.getAllRecipes(100, 0);
    if (!query || !query.trim()) {
      return allResult;
    }
    const q = query.toLowerCase().trim();
    const matched = allResult.recipes.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q)) ||
        (r.cuisine && r.cuisine.toLowerCase().includes(q)) ||
        (r.category && r.category.toLowerCase().includes(q)) ||
        (r.restaurantName && r.restaurantName.toLowerCase().includes(q)) ||
        (r.tags && r.tags.some((t) => t.toLowerCase().includes(q)))
    );

    return {
      recipes: matched,
      total: matched.length,
    };
  },

  // Get recipe by ID
  getRecipeById: async (id) => {
    const stringId = String(id);
    const deletedIds = getDeletedRecipeIds().map(String);
    if (deletedIds.includes(stringId)) return null;

    const editedMap = getEditedRecipes();
    const customRecipes = getCustomRecipes();
    const foundCustom = customRecipes.find((r) => String(r.id) === stringId);
    if (foundCustom) {
      const merged = editedMap[stringId] ? { ...foundCustom, ...editedMap[stringId] } : foundCustom;
      return enhanceRecipe(merged);
    }

    try {
      const data = await axiosClient.get(`/recipes/${id}`);
      const merged = editedMap[stringId] ? { ...data, ...editedMap[stringId] } : data;
      return enhanceRecipe(merged);
    } catch (err) {
      console.warn(`Failed to fetch recipe #${id}, checking fallback data:`, err.message);
      const found = FALLBACK_RECIPES.find((r) => String(r.id) === stringId);
      const base = found || FALLBACK_RECIPES[0];
      const merged = editedMap[stringId] ? { ...base, ...editedMap[stringId] } : base;
      return enhanceRecipe(merged);
    }
  },

  // Get recipes by cuisine / tag / mealType
  getRecipesByTag: async (tag) => {
    const allResult = await foodApi.getAllRecipes(100, 0);
    const q = tag.toLowerCase().trim();
    const matched = allResult.recipes.filter(
      (r) =>
        (r.cuisine && r.cuisine.toLowerCase() === q) ||
        (r.category && r.category.toLowerCase() === q) ||
        (r.tags && r.tags.some((t) => t.toLowerCase() === q))
    );
    return matched;
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
