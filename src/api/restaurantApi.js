import axiosClient from './axiosClient';
import { foodApi } from './foodApi';

export const RESTAURANT_CUISINES = [
  { id: 'all', label: 'All Cuisines', icon: '🍽️' },
  { id: 'Italian', label: 'Italian', icon: '🍕' },
  { id: 'American', label: 'American', icon: '🍔' },
  { id: 'Asian', label: 'Asian', icon: '🍜' },
  { id: 'Mexican', label: 'Mexican', icon: '🌮' },
  { id: 'Indian', label: 'Indian', icon: '🍛' },
  { id: 'Mediterranean', label: 'Mediterranean', icon: '🥗' },
  { id: 'Japanese', label: 'Japanese', icon: '🍣' },
  { id: 'Thai', label: 'Thai', icon: '🍲' },
  { id: 'Healthy', label: 'Healthy & Vegan', icon: '🥑' },
  { id: 'Dessert', label: 'Desserts & Bakery', icon: '🍰' },
];

export const RATING_FILTERS = [
  { id: 'all', label: 'All Ratings', min: 0 },
  { id: '4.8', label: '4.8+ Top Rated', min: 4.8 },
  { id: '4.5', label: '4.5+ Highly Rated', min: 4.5 },
  { id: '4.0', label: '4.0+ Good', min: 4.0 },
  { id: '3.5', label: '3.5+ Standard', min: 3.5 },
];

export const SORT_OPTIONS = [
  { id: 'popularity', label: 'Most Popular' },
  { id: 'rating-desc', label: 'Highest Rated' },
  { id: 'time-asc', label: 'Fastest Delivery' },
  { id: 'fee-asc', label: 'Lowest Delivery Fee' },
  { id: 'name-asc', label: 'Name (A to Z)' },
];

// Rich base dataset of verified partner restaurants
export const BASE_RESTAURANTS = [
  {
    id: 'rest-1',
    name: 'Trattoria Bella',
    cuisine: 'Italian',
    cuisineTags: ['Pizza', 'Artisan Pasta', 'Wood-Fired', 'Wine Bar'],
    rating: 4.8,
    reviewCount: 420,
    deliveryTime: '25-35 mins',
    deliveryTimeMinutes: 30,
    deliveryCharges: 0, // Free delivery
    priceRange: '$$',
    address: '124 Culinary Way, Downtown Arts District, NY 10012',
    phone: '+1 (555) 234-5678',
    openingHours: '11:00 AM - 10:30 PM',
    isOpen: true,
    popularityScore: 98,
    featuredBadge: 'Chef Signature',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
    about: 'Authentic family-owned Italian trattoria serving handmade pasta, fermented sourdough pizzas, and rustic Tuscan classics crafted from imported ingredients.',
  },
  {
    id: 'rest-2',
    name: 'Firehouse Grill & Burgers',
    cuisine: 'American',
    cuisineTags: ['Smash Burgers', 'BBQ Ribs', 'Loaded Fries', 'Milkshakes'],
    rating: 4.9,
    reviewCount: 650,
    deliveryTime: '20-30 mins',
    deliveryTimeMinutes: 25,
    deliveryCharges: 1.99,
    priceRange: '$$',
    address: '450 Route 66 Promenade, Westside Plaza, NY 10019',
    phone: '+1 (555) 345-6789',
    openingHours: '11:30 AM - 11:00 PM',
    isOpen: true,
    popularityScore: 99,
    featuredBadge: 'Most Popular',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&auto=format&fit=crop&q=80',
    about: 'Famous for double smash burgers made from prime Angus beef, crispy beer-battered onion rings, and slow-smoked barbecue brisket.',
  },
  {
    id: 'rest-3',
    name: 'Golden Wok Dynasty',
    cuisine: 'Asian',
    cuisineTags: ['Dim Sum', 'Szechuan', 'Noodles', 'Kung Pao'],
    rating: 4.9,
    reviewCount: 510,
    deliveryTime: '25-35 mins',
    deliveryTimeMinutes: 30,
    deliveryCharges: 0,
    priceRange: '$$',
    address: '88 Chinatown Central Blvd, Heritage Plaza, NY 10013',
    phone: '+1 (555) 456-7890',
    openingHours: '10:30 AM - 10:00 PM',
    isOpen: true,
    popularityScore: 96,
    featuredBadge: 'Top Rated',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=1200&auto=format&fit=crop&q=80',
    about: 'Master wok chefs bringing fiery Szechuan flavors, delicate handmade dim sum, and traditional Beijing roasted duck straight to your doorstep.',
  },
  {
    id: 'rest-4',
    name: 'Cantina Del Sol',
    cuisine: 'Mexican',
    cuisineTags: ['Street Tacos', 'Burritos', 'Guacamole', 'Quesadillas'],
    rating: 4.7,
    reviewCount: 380,
    deliveryTime: '20-30 mins',
    deliveryTimeMinutes: 25,
    deliveryCharges: 2.49,
    priceRange: '$',
    address: '772 Fiesta Promenade, Mission District, NY 10003',
    phone: '+1 (555) 567-8901',
    openingHours: '12:00 PM - 11:30 PM',
    isOpen: true,
    popularityScore: 92,
    featuredBadge: 'Street Food Star',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=80',
    about: 'Vibrant street-style Mexican taqueria featuring slow-braised birria, handmade corn tortillas, freshly mashed guacamole, and charred salsas.',
  },
  {
    id: 'rest-5',
    name: 'Royal Tandoor House',
    cuisine: 'Indian',
    cuisineTags: ['Butter Chicken', 'Biryani', 'Tandoori Naan', 'Tikka'],
    rating: 4.9,
    reviewCount: 590,
    deliveryTime: '30-40 mins',
    deliveryTimeMinutes: 35,
    deliveryCharges: 0,
    priceRange: '$$',
    address: '315 Spice Market Lane, Little India, NY 10016',
    phone: '+1 (555) 678-9012',
    openingHours: '11:00 AM - 11:00 PM',
    isOpen: true,
    popularityScore: 97,
    featuredBadge: 'Michelin Recommended',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1200&auto=format&fit=crop&q=80',
    about: 'Imperial North & South Indian fine dining with slow-simmered rich curries, fragrant saffron Dum Biryanis, and clay-oven tandoori grills.',
  },
  {
    id: 'rest-6',
    name: 'Tokyo Express & Sushi Bar',
    cuisine: 'Japanese',
    cuisineTags: ['Nigiri Sushi', 'Ramen', 'Tempura', 'Sashimi'],
    rating: 4.9,
    reviewCount: 480,
    deliveryTime: '20-30 mins',
    deliveryTimeMinutes: 25,
    deliveryCharges: 2.99,
    priceRange: '$$$',
    address: '502 Metro Tower B1, Financial Center, NY 10005',
    phone: '+1 (555) 789-0123',
    openingHours: '11:30 AM - 10:00 PM',
    isOpen: true,
    popularityScore: 95,
    featuredBadge: 'Fresh Catch',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=1200&auto=format&fit=crop&q=80',
    about: 'Artisanal sushi bar using daily air-freighted Bluefin tuna, Hokkaido scallops, and rich 18-hour tonkotsu pork broth ramen.',
  },
  {
    id: 'rest-7',
    name: 'Olive & Fig Taverna',
    cuisine: 'Mediterranean',
    cuisineTags: ['Greek Souvlaki', 'Hummus', 'Falafel', 'Greek Salad'],
    rating: 4.8,
    reviewCount: 310,
    deliveryTime: '25-35 mins',
    deliveryTimeMinutes: 30,
    deliveryCharges: 1.49,
    priceRange: '$$',
    address: '68 Harbor Promenade, Seafront Wharf, NY 10004',
    phone: '+1 (555) 890-1234',
    openingHours: '11:00 AM - 10:00 PM',
    isOpen: true,
    popularityScore: 90,
    featuredBadge: 'Heart Healthy',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80',
    about: 'Sun-drenched Aegean coastal cuisine celebrating cold-pressed Greek olive oils, wood-grilled fish, savory spanakopita, and organic salads.',
  },
  {
    id: 'rest-8',
    name: 'Bangkok Street Flavors',
    cuisine: 'Thai',
    cuisineTags: ['Pad Thai', 'Tom Yum', 'Green Curry', 'Mango Sticky Rice'],
    rating: 4.8,
    reviewCount: 360,
    deliveryTime: '25-35 mins',
    deliveryTimeMinutes: 30,
    deliveryCharges: 0,
    priceRange: '$$',
    address: '22 Riverfront Walk, East Village, NY 10009',
    phone: '+1 (555) 901-2345',
    openingHours: '12:00 PM - 10:30 PM',
    isOpen: true,
    popularityScore: 89,
    featuredBadge: 'Spicy & Authentic',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=1200&auto=format&fit=crop&q=80',
    about: 'Authentic Thai street food with aromatic lemongrass, fiery bird’s eye chilies, kaffir lime, and silky coconut milk curries.',
  },
  {
    id: 'rest-9',
    name: 'Green Bowl Organics',
    cuisine: 'Healthy',
    cuisineTags: ['Grain Bowls', 'Superfood Smoothies', 'Avocado Toast', 'Vegan'],
    rating: 4.7,
    reviewCount: 290,
    deliveryTime: '15-25 mins',
    deliveryTimeMinutes: 20,
    deliveryCharges: 1.99,
    priceRange: '$$',
    address: '19 Botanica Avenue, Chelsea Green, NY 10011',
    phone: '+1 (555) 012-3456',
    openingHours: '08:00 AM - 08:30 PM',
    isOpen: true,
    popularityScore: 88,
    featuredBadge: '100% Organic',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&auto=format&fit=crop&q=80',
    about: 'Farm-to-table plant-forward dining with certified organic produce, antioxidant-rich smoothies, warm quinoa grain bowls, and cold-pressed juices.',
  },
  {
    id: 'rest-10',
    name: 'Sweet Tooth Artisan Bakery',
    cuisine: 'Dessert',
    cuisineTags: ['Gourmet Cakes', 'Croissants', 'Macarons', 'Specialty Coffee'],
    rating: 4.9,
    reviewCount: 540,
    deliveryTime: '20-30 mins',
    deliveryTimeMinutes: 25,
    deliveryCharges: 0,
    priceRange: '$$',
    address: '84 Pastry Corner, Soho Historic District, NY 10013',
    phone: '+1 (555) 123-4567',
    openingHours: '07:30 AM - 09:00 PM',
    isOpen: true,
    popularityScore: 94,
    featuredBadge: 'Sweet Cravings',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&auto=format&fit=crop&q=80',
    about: 'French-inspired patisserie handcrafting buttery croissants, silky cheesecakes, multi-layered celebration cakes, and vibrant Parisian macarons.',
  },
  {
    id: 'rest-11',
    name: 'Pasta Fresca Co.',
    cuisine: 'Italian',
    cuisineTags: ['Ravioli', 'Gnocchi', 'Tiramisu', 'Calzone'],
    rating: 4.6,
    reviewCount: 220,
    deliveryTime: '30-40 mins',
    deliveryTimeMinutes: 35,
    deliveryCharges: 2.99,
    priceRange: '$$',
    address: '92 Little Italy East, Mulberry Street, NY 10013',
    phone: '+1 (555) 234-8901',
    openingHours: '12:00 PM - 10:00 PM',
    isOpen: true,
    popularityScore: 84,
    featuredBadge: 'Handmade Pasta',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=1200&auto=format&fit=crop&q=80',
    about: 'Specializes in fresh daily-rolled pasta, rich bolognese simmered for 8 hours, and authentic Italian baked calzones.',
  },
  {
    id: 'rest-12',
    name: 'The Rustic American Diner',
    cuisine: 'American',
    cuisineTags: ['Pancake Stacks', 'Fried Chicken', 'Club Sandwich', 'Waffles'],
    rating: 4.5,
    reviewCount: 195,
    deliveryTime: '25-35 mins',
    deliveryTimeMinutes: 30,
    deliveryCharges: 1.99,
    priceRange: '$',
    address: '410 Sunset Boulevard, Retro Corner, NY 10025',
    phone: '+1 (555) 345-9012',
    openingHours: '06:00 AM - 02:00 PM',
    isOpen: false, // Closed for evening to showcase Closed state
    popularityScore: 78,
    featuredBadge: 'Breakfast Club',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&auto=format&fit=crop&q=80',
    about: 'Classic American comfort food with towering golden pancake stacks, buttermilk fried chicken, waffles, and breakfast skillets.',
  },
  {
    id: 'rest-13',
    name: 'El Taco Loco Taqueria',
    cuisine: 'Mexican',
    cuisineTags: ['Nachos Grande', 'Chorizo Tacos', 'Churros', 'Fajitas'],
    rating: 4.6,
    reviewCount: 245,
    deliveryTime: '20-30 mins',
    deliveryTimeMinutes: 25,
    deliveryCharges: 0,
    priceRange: '$',
    address: '155 Corona Boulevard, Sunset Hills, NY 10034',
    phone: '+1 (555) 456-0123',
    openingHours: '11:00 AM - 11:00 PM',
    isOpen: true,
    popularityScore: 82,
    featuredBadge: 'Free Delivery',
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=80',
    about: 'Lively neighborhood taqueria serving sizzling fajita skillets, overloaded nachos with melted queso, and cinnamon sugar churros.',
  },
  {
    id: 'rest-14',
    name: 'Zenith Umami Noodle House',
    cuisine: 'Asian',
    cuisineTags: ['Ramen', 'Udon', 'Gyoza', 'Bao Buns'],
    rating: 4.8,
    reviewCount: 390,
    deliveryTime: '20-30 mins',
    deliveryTimeMinutes: 25,
    deliveryCharges: 1.49,
    priceRange: '$$',
    address: '98 Silk Road Promenade, Zenith District, NY 10014',
    phone: '+1 (555) 567-1234',
    openingHours: '11:30 AM - 10:30 PM',
    isOpen: true,
    popularityScore: 91,
    featuredBadge: 'Comfort Bowls',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1200&auto=format&fit=crop&q=80',
    about: 'Cozy Asian noodle bar renowned for fluffy steamed bao buns, pan-seared gyoza, and complex simmered broths.',
  },
  {
    id: 'rest-15',
    name: 'The Cheesy Crust Pizzeria',
    cuisine: 'Italian',
    cuisineTags: ['Deep Dish', 'Stuffed Crust', 'Garlic Knots', 'Wings'],
    rating: 4.4,
    reviewCount: 180,
    deliveryTime: '35-45 mins',
    deliveryTimeMinutes: 40,
    deliveryCharges: 1.99,
    priceRange: '$$',
    address: '277 Broadway Junction, Midtown, NY 10018',
    phone: '+1 (555) 678-2345',
    openingHours: '12:00 PM - 09:00 PM',
    isOpen: false, // Closed
    popularityScore: 76,
    featuredBadge: 'Cheesy Goodness',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=1200&auto=format&fit=crop&q=80',
    about: 'Generous New York style and Chicago deep dish pies baked with a triple-cheese blend and seasoned crusts.',
  },
  {
    id: 'rest-16',
    name: 'Taj Mahal Biryani & Grills',
    cuisine: 'Indian',
    cuisineTags: ['Mughlai', 'Korma', 'Roti', 'Paneer Tikka'],
    rating: 4.7,
    reviewCount: 310,
    deliveryTime: '30-40 mins',
    deliveryTimeMinutes: 35,
    deliveryCharges: 2.49,
    priceRange: '$$',
    address: '81 Curry Row, Queens Crossing, NY 11101',
    phone: '+1 (555) 789-3456',
    openingHours: '11:00 AM - 11:00 PM',
    isOpen: true,
    popularityScore: 87,
    featuredBadge: 'Spice Royalty',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1200&auto=format&fit=crop&q=80',
    about: 'Rich Mughlai curries, fragrant long-grain saffron basmati biryanis, and melt-in-the-mouth marinated paneer tikka skewers.',
  },
];

export const restaurantApi = {
  // Fetch paginated, filtered, and sorted restaurant listing via Third-Party API
  getRestaurants: async ({
    search = '',
    cuisine = 'all',
    minRating = 0,
    sortBy = 'popularity',
    page = 1,
    limit = 6,
  } = {}) => {
    // 1. Invoke Third-Party API (DummyJSON) via Axios for real network integration
    let apiRecipes = [];
    try {
      const data = await axiosClient.get('/recipes?limit=30');
      apiRecipes = data.recipes || [];
    } catch (err) {
      console.warn('Third-party API request fallback active:', err.message);
    }

    // 2. Clone base restaurants dataset
    let results = [...BASE_RESTAURANTS];

    // Enrich each restaurant with menu item count from API data
    results = results.map((r) => {
      const relatedDishes = apiRecipes.filter(
        (dish) =>
          dish.cuisine?.toLowerCase() === r.cuisine.toLowerCase() ||
          dish.tags?.some((t) => r.cuisineTags.some((ct) => ct.toLowerCase().includes(t.toLowerCase())))
      );
      return {
        ...r,
        liveDishCount: relatedDishes.length > 0 ? relatedDishes.length : 6,
      };
    });

    // 3. Search Filter (by restaurant name, cuisine, address, or cuisine tags)
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      results = results.filter((r) => {
        const matchesName = r.name.toLowerCase().includes(q);
        const matchesCuisine = r.cuisine.toLowerCase().includes(q);
        const matchesAddress = r.address.toLowerCase().includes(q);
        const matchesTags = r.cuisineTags.some((t) => t.toLowerCase().includes(q));
        return matchesName || matchesCuisine || matchesAddress || matchesTags;
      });
    }

    // 4. Cuisine Filter
    if (cuisine && cuisine !== 'all') {
      const c = cuisine.toLowerCase();
      results = results.filter((r) => r.cuisine.toLowerCase() === c);
    }

    // 5. Rating Filter
    if (minRating && Number(minRating) > 0) {
      const min = Number(minRating);
      results = results.filter((r) => r.rating >= min);
    }

    // 6. Sorting
    results.sort((a, b) => {
      switch (sortBy) {
        case 'rating-desc':
          return b.rating - a.rating;
        case 'time-asc':
          return a.deliveryTimeMinutes - b.deliveryTimeMinutes;
        case 'fee-asc':
          return a.deliveryCharges - b.deliveryCharges;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'popularity':
        default:
          return b.popularityScore - a.popularityScore;
      }
    });

    // 7. Pagination calculations
    const totalCount = results.length;
    const totalPages = Math.ceil(totalCount / limit) || 1;
    const validPage = Math.max(1, Math.min(page, totalPages));
    const startIndex = (validPage - 1) * limit;
    const paginatedItems = results.slice(startIndex, startIndex + limit);

    return {
      restaurants: paginatedItems,
      totalCount,
      totalPages,
      currentPage: validPage,
      limit,
      hasNextPage: validPage < totalPages,
      hasPrevPage: validPage > 1,
    };
  },

  // Fetch single restaurant details + full menu matching its cuisine from DummyJSON API
  getRestaurantById: async (id) => {
    // 1. Find restaurant in catalog
    const restaurant = BASE_RESTAURANTS.find((r) => String(r.id) === String(id)) || BASE_RESTAURANTS[0];

    // 2. Fetch dishes matching restaurant cuisine from Third-Party API
    try {
      const allRecipesResponse = await foodApi.getAllRecipes(50, 0);
      const allRecipes = allRecipesResponse.recipes || [];

      // Filter recipes that belong to or match this restaurant
      let restaurantMenu = allRecipes.filter(
        (item) =>
          item.restaurantName?.toLowerCase() === restaurant.name.toLowerCase() ||
          item.cuisine?.toLowerCase() === restaurant.cuisine.toLowerCase()
      );

      // If fewer than 4 items match, take dishes from the global list and tag them
      if (restaurantMenu.length < 4) {
        const fallbacks = allRecipes.slice(0, 6).map((item) => ({
          ...item,
          restaurantName: restaurant.name,
        }));
        restaurantMenu = [...restaurantMenu, ...fallbacks];
      }

      return {
        ...restaurant,
        menu: restaurantMenu,
      };
    } catch (err) {
      console.warn(`Failed to fetch menu for ${restaurant.name}:`, err.message);
      return {
        ...restaurant,
        menu: [],
      };
    }
  },

  // Cuisines list
  getCuisines: () => RESTAURANT_CUISINES,

  // Ratings filter list
  getRatingFilters: () => RATING_FILTERS,

  // Sort options list
  getSortOptions: () => SORT_OPTIONS,
};

export default restaurantApi;
