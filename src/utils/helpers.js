// Utility helpers for food delivery system

export const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
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

export const getEstimatedArrivalClockTime = (deliveryType = 'standard') => {
  const minutes = deliveryType === 'express' ? 22 : 40;
  const arrival = new Date(Date.now() + minutes * 60000);
  return arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const COUPON_CODES = {
  BITE20: {
    code: 'BITE20',
    title: '20% OFF Everything',
    discountPercent: 20,
    maxDiscount: 150,
    minOrder: 100,
    description: 'Get 20% discount up to ₹150 on your entire food order.',
    badge: 'Popular',
    icon: 'Percent',
  },
  TASTY50: {
    code: 'TASTY50',
    title: 'Flat ₹50 Instant Savings',
    discountFlat: 50,
    minOrder: 199,
    description: 'Flat ₹50 discount on chef-special orders above ₹199.',
    badge: 'Best Value',
    icon: 'Sparkles',
  },
  FESTIVE30: {
    code: 'FESTIVE30',
    title: '30% Grand Feast Discount',
    discountPercent: 30,
    maxDiscount: 250,
    minOrder: 250,
    description: 'Celebrate with 30% off up to ₹250 on orders above ₹250.',
    badge: 'Festive',
    icon: 'Flame',
  },
  WALLET100: {
    code: 'WALLET100',
    title: 'Flat ₹100 Mega Saver',
    discountFlat: 100,
    minOrder: 399,
    description: 'Flat ₹100 savings on party packs & orders above ₹399.',
    badge: 'Mega Deal',
    icon: 'Wallet',
  },
  FREESHIP: {
    code: 'FREESHIP',
    title: 'Free Express Delivery',
    freeShipping: true,
    minOrder: 0,
    description: 'Zero delivery charges on standard or priority express shipping.',
    badge: 'Zero Delivery',
    icon: 'Truck',
  },
};

export const AVAILABLE_COUPONS_LIST = Object.values(COUPON_CODES);

export const validateCoupon = (code, subtotal = 0) => {
  if (!code) return { valid: false, message: 'Please enter a coupon code.' };
  const cleanCode = code.trim().toUpperCase();
  const coupon = COUPON_CODES[cleanCode];

  if (!coupon) {
    return {
      valid: false,
      message: `Coupon "${cleanCode}" is invalid. Please try "BITE20", "TASTY50", or "FREESHIP".`,
    };
  }

  if (coupon.minOrder && subtotal < coupon.minOrder) {
    return {
      valid: false,
      coupon,
      message: `Coupon "${coupon.code}" requires a minimum order of ${formatCurrency(coupon.minOrder)}. Add ${formatCurrency(coupon.minOrder - subtotal)} more to qualify!`,
    };
  }

  return { valid: true, coupon };
};

export const generateTransactionId = (method = 'PAYMENT') => {
  const prefix = method.toUpperCase().replace(/\s+/g, '').substring(0, 4);
  const rand = Math.floor(100000 + Math.random() * 900000);
  const time = Date.now().toString().slice(-4);
  return `TXN-${prefix}-${rand}${time}`;
};
