// Utility helpers for food delivery system

export const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num);
};

export const calculateFoodPrice = (recipe) => {
  if (!recipe) return 12.99;
  if (recipe.price) return Number(recipe.price);
  
  // Deterministic realistic price based on calories and id
  const base = ((recipe.caloriesPerServing || 350) / 35);
  const variance = ((recipe.id || 1) % 5) * 1.25;
  const price = Math.max(7.99, base + variance + 4.99);
  return Number(price.toFixed(2));
};

export const getRestaurantName = (recipe) => {
  if (!recipe) return 'The Chef\'s Kitchen';
  const cuisine = recipe.cuisine || 'Global';
  const restaurants = {
    Italian: ['Trattoria Bella', 'Pasta Fresca Co.', 'Luigi\'s Wood-fired Oven'],
    Asian: ['Golden Wok Dynasty', 'Umami Kitchen', 'Bamboo Garden'],
    American: ['Firehouse Grill & Burgers', 'The Rustic Diner', 'Liberty Smokehouse'],
    Mexican: ['Cantina Del Sol', 'Taco Libre & Grill', 'Casa De Salsa'],
    Indian: ['Royal Tandoor House', 'Curry Symphony', 'Spice Palace'],
    Mediterranean: ['Olive & Fig Taverna', 'Santorini Breeze', 'Aegean Table'],
    Japanese: ['Sakura Izakaya', 'Koto Sushi & Bowl', 'Tokyo Express'],
    Thai: ['Bangkok Street Flavors', 'Lemongrass Bistro', 'Siam Kitchen'],
    Global: ['The Culinary Table', 'Flavor Street Co.', 'Bistro Central']
  };

  const list = restaurants[cuisine] || restaurants.Global;
  const index = (recipe.id || 1) % list.length;
  return list[index];
};

export const getEstimatedDeliveryTime = (recipe) => {
  if (!recipe) return '25-35 mins';
  const prep = Number(recipe.prepTimeMinutes) || 15;
  const cook = Number(recipe.cookTimeMinutes) || 15;
  const total = prep + cook;
  const minTime = Math.max(20, Math.round(total * 0.7));
  const maxTime = minTime + 15;
  return `${minTime}-${maxTime} mins`;
};

export const isVegetarian = (recipe) => {
  if (!recipe) return false;
  const tags = (recipe.tags || []).map(t => t.toLowerCase());
  const name = (recipe.name || '').toLowerCase();
  const meal = (recipe.mealType || []).map(m => m.toLowerCase());
  
  const vegKeywords = ['vegetarian', 'vegan', 'salad', 'tofu', 'veggie', 'margherita', 'pasta'];
  const nonVegKeywords = ['chicken', 'beef', 'pork', 'meat', 'bacon', 'salmon', 'tuna', 'turkey', 'shrimp'];
  
  if (nonVegKeywords.some(k => name.includes(k))) return false;
  if (vegKeywords.some(k => tags.includes(k) || name.includes(k) || meal.includes(k))) return true;
  return false;
};

export const generateOrderId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BR-${timestamp}-${randomStr}`;
};

export const COUPON_CODES = {
  BITE20: { code: 'BITE20', discountPercent: 20, description: '20% OFF on all items' },
  TASTY50: { code: 'TASTY50', discountFlat: 5, description: '$5.00 flat discount on orders' },
  FREESHIP: { code: 'FREESHIP', freeShipping: true, description: 'Free Express Delivery' },
};
