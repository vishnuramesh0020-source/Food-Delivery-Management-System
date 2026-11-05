import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  Clock,
  Bike,
  MapPin,
  Phone,
  Calendar,
  Search,
  UtensilsCrossed,
  Share2,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { restaurantApi } from '../api/restaurantApi';
import { formatCurrency } from '../utils/helpers';
import FoodCard from '../components/food/FoodCard';
import QuickViewModal from '../components/food/QuickViewModal';
import Button from '../components/common/Button';
import customToast from '../utils/customToast';

const RestaurantDetailPage = () => {
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Menu Search & Filter
  const [menuSearch, setMenuSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [quickViewFood, setQuickViewFood] = useState(null);

  const fetchRestaurantDetails = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await restaurantApi.getRestaurantById(id);
      setRestaurant(data);
    } catch (err) {
      console.error('Failed to load restaurant details:', err);
      setError('Unable to load restaurant information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRestaurantDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchRestaurantDetails]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: restaurant?.name,
        text: `Check out ${restaurant?.name} on BiteRush!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      customToast.info(
        'Restaurant Link Copied! 📋',
        'Share this restaurant with your foodie friends.'
      );
    }
  };

  // Filter menu items by search and tag
  const filteredMenu = (restaurant?.menu || []).filter((item) => {
    const matchesSearch =
      !menuSearch.trim() ||
      item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(menuSearch.toLowerCase()));

    const matchesTag =
      selectedTag === 'all' ||
      (item.cuisine && item.cuisine.toLowerCase() === selectedTag.toLowerCase()) ||
      (item.tags && item.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase()));

    return matchesSearch && matchesTag;
  });

  // Extract unique tags from menu
  const menuTags = [
    'all',
    ...new Set(
      (restaurant?.menu || [])
        .flatMap((m) => m.tags || [])
        .filter(Boolean)
        .slice(0, 6)
    ),
  ];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
        <div className="h-72 bg-slate-200 rounded-3xl w-full" />
        <div className="bg-white rounded-3xl p-8 border border-slate-100 space-y-4">
          <div className="h-8 bg-slate-200 rounded-xl w-1/3" />
          <div className="h-4 bg-slate-100 rounded-lg w-1/2" />
          <div className="h-16 bg-slate-50 rounded-2xl w-full" />
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Restaurant Not Found</h2>
        <p className="text-sm text-slate-500">{error || "The requested restaurant could not be located."}</p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link to="/restaurants">
            <Button variant="outline" size="sm">
              Back to Restaurants
            </Button>
          </Link>
          <Button variant="primary" size="sm" onClick={fetchRestaurantDetails} icon={RefreshCw}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. BACK NAVIGATION LINK */}
      <div>
        <Link
          to="/restaurants"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-orange-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Restaurants</span>
        </Link>
      </div>

      {/* 2. RESTAURANT HERO BANNER */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-21/9 min-h-[280px] bg-slate-900">
        <img
          src={restaurant.bannerImage || restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

        {/* Hero Overlay Badges & Share */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {restaurant.isOpen ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500 text-white shadow-md">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Open Now
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-900/90 text-slate-300 border border-slate-700 shadow-md">
                Closed
              </span>
            )}
            {restaurant.featuredBadge && (
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                {restaurant.featuredBadge}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="p-2.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-900 backdrop-blur-md transition shadow-md cursor-pointer"
            title="Share Restaurant"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Hero Bottom Title & Cuisine */}
        <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold">
            <span className="px-3 py-1 rounded-full bg-orange-600 text-white">
              {restaurant.cuisine}
            </span>
            <span className="px-3 py-1 rounded-full bg-black/60 text-amber-300 font-mono">
              {restaurant.priceRange}
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">{restaurant.name}</h1>
        </div>
      </div>

      {/* 3. RESTAURANT METRICS & INFO CARD */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-slate-100">
          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-500 shrink-0 shadow-xs">
              <Star className="w-6 h-6 fill-amber-400" />
            </div>
            <div>
              <div className="text-lg font-black text-slate-900">
                {restaurant.rating.toFixed(1)} <span className="text-xs text-slate-400">/ 5.0</span>
              </div>
              <div className="text-xs text-slate-500 font-semibold">
                {restaurant.reviewCount}+ verified reviews
              </div>
            </div>
          </div>

          {/* Delivery Time */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/80 flex items-center justify-center text-orange-600 shrink-0 shadow-xs">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-lg font-black text-slate-900">{restaurant.deliveryTime}</div>
              <div className="text-xs text-slate-500 font-semibold">Estimated arrival</div>
            </div>
          </div>

          {/* Delivery Charges */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shrink-0 shadow-xs">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <div className="text-lg font-black text-slate-900">
                {restaurant.deliveryCharges === 0
                  ? 'FREE'
                  : formatCurrency(restaurant.deliveryCharges)}
              </div>
              <div className="text-xs text-slate-500 font-semibold">Delivery fee</div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shrink-0 shadow-xs">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-black text-slate-900 line-clamp-1">{restaurant.openingHours}</div>
              <div className="text-xs text-slate-500 font-semibold">Daily operation</div>
            </div>
          </div>
        </div>

        {/* Location & About Description */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-8 space-y-2">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">About the Kitchen</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              {restaurant.about}
            </p>
          </div>

          <div className="md:col-span-4 bg-slate-50 rounded-2xl p-4 border border-slate-200/70 space-y-2 text-xs">
            <div className="flex items-start gap-2 text-slate-700">
              <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <span className="font-semibold">{restaurant.address}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Phone className="w-4 h-4 text-orange-500 shrink-0" />
              <span className="font-semibold">{restaurant.phone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. RESTAURANT MENU SECTION */}
      <div className="space-y-6">
        {/* Menu Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Restaurant Menu
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Select dishes crafted fresh by {restaurant.name}'s culinary team.
            </p>
          </div>

          {/* In-Menu Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
              placeholder="Search dishes in this menu..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition shadow-2xs"
            />
          </div>
        </div>

        {/* Menu Category / Tag Pills with Glassy Controls */}
        {menuTags.length > 1 && (
          <div className="relative group/menutags">
            <button
              type="button"
              onClick={() => {
                document.getElementById('restaurant-menu-tags')?.scrollBy({ left: -200, behavior: 'smooth' });
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-7 h-7 rounded-full bg-white/85 hover:bg-white backdrop-blur-md border border-slate-200/90 shadow-sm flex items-center justify-center text-slate-700 hover:text-orange-600 transition active:scale-90 cursor-pointer"
              aria-label="Scroll tags left"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <div
              id="restaurant-menu-tags"
              className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth px-1"
            >
              {menuTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold capitalize transition-all cursor-pointer shrink-0 ${
                    selectedTag === tag
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
                  }`}
                >
                  {tag === 'all' ? 'All Dishes' : tag}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                document.getElementById('restaurant-menu-tags')?.scrollBy({ left: 200, behavior: 'smooth' });
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-7 h-7 rounded-full bg-white/85 hover:bg-white backdrop-blur-md border border-slate-200/90 shadow-sm flex items-center justify-center text-slate-700 hover:text-orange-600 transition active:scale-90 cursor-pointer"
              aria-label="Scroll tags right"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Dishes Grid */}
        {filteredMenu.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMenu.map((dish) => (
              <FoodCard
                key={dish.id}
                food={dish}
                onQuickView={(f) => setQuickViewFood(f)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-3">
            <UtensilsCrossed className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-lg font-black text-slate-800">No Dishes Match Your Search</h4>
            <p className="text-xs text-slate-500">
              Try searching with another keyword or clearing category filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setMenuSearch('');
                setSelectedTag('all');
              }}
            >
              Reset Menu Filter
            </Button>
          </div>
        )}
      </div>

      {/* Quick View Modal for Selected Food Item */}
      {quickViewFood && (
        <QuickViewModal
          food={quickViewFood}
          isOpen={!!quickViewFood}
          onClose={() => setQuickViewFood(null)}
        />
      )}
    </div>
  );
};

export default RestaurantDetailPage;
