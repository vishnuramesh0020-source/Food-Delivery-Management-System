import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Clock,
  ShieldCheck,
  Star,
  Flame,
  Tag,
  Copy,
  Check,
  ChevronRight,
} from 'lucide-react';
import { foodApi } from '../api/foodApi';
import FoodCard from '../components/food/FoodCard';
import CategoryPills from '../components/food/CategoryPills';
import QuickViewModal from '../components/food/QuickViewModal';
import SearchBar from '../components/common/SearchBar';
import { SkeletonCard } from '../components/common/Spinner';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';

const HomePage = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [quickViewFood, setQuickViewFood] = useState(null);
  const [copiedCoupon, setCopiedCoupon] = useState('');

  const categories = foodApi.getCategories();

  useEffect(() => {
    let isMounted = true;
    const fetchTopRecipes = async () => {
      setIsLoading(true);
      try {
        const data = await foodApi.getAllRecipes(12, 0);
        if (isMounted) {
          setRecipes(data.recipes || []);
        }
      } catch (err) {
        console.error('Failed to load recipes', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchTopRecipes();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearch = (query) => {
    if (query) {
      navigate(`/menu?search=${encodeURIComponent(query)}`);
    }
  };

  const handleCategorySelect = (catId) => {
    setActiveCategory(catId);
    if (catId === 'all') {
      navigate('/menu');
    } else {
      navigate(`/menu?cuisine=${encodeURIComponent(catId)}`);
    }
  };

  const copyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    toast.success(`Coupon code "${code}" copied to clipboard!`);
    setTimeout(() => setCopiedCoupon(''), 3000);
  };

  const displayedRecipes = recipes.slice(0, 8);

  return (
    <div className="space-y-14 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/70 via-white to-slate-50 pt-10 pb-16 md:py-20 border-b border-orange-100/60">
        <div className="absolute top-0 right-10 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-orange-700 text-xs font-bold uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>Superfast Food Delivery Across Town</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Delicious Dishes, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500">
                  Delivered In Minutes.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0">
                Explore hand-crafted recipes from top culinary chefs. Fresh ingredients, piping-hot preparation, and lightning-fast delivery to your doorstep.
              </p>

              <div className="max-w-xl mx-auto lg:mx-0 pt-2">
                <SearchBar
                  onSearch={handleSearch}
                  placeholder="Craving Pizza, Wagyu Burger, Ramen, or Tacos?..."
                />
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span>Avg. 25-35 mins</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span>100% Hygienic</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  </div>
                  <span>4.8 / 5 Rating</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform rotate-1 hover:rotate-0 transition-transform duration-500 bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&auto=format&fit=crop&q=80"
                    alt="Delicious Gourmet Spread"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="absolute -top-4 -left-4 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-pulse">
                  <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center text-xl">
                    🍕
                  </div>
                  <div>
                    <span className="block text-xs font-extrabold text-slate-900">Italian Margherita</span>
                    <span className="text-[10px] text-emerald-600 font-bold">Trending #1 Dish</span>
                  </div>
                </div>

                <div className="absolute -bottom-5 -right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-sm">
                    20%
                  </div>
                  <div>
                    <span className="block text-xs font-extrabold text-slate-900">Save with BITE20</span>
                    <span className="text-[10px] text-slate-400">On your first 3 orders</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROMOTIONAL COUPONS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
              <Tag className="w-3.5 h-3.5" />
              Special Foodie Deals
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              Get Up to 20% OFF on Your Feast!
            </h3>
            <p className="text-sm text-orange-100">
              Apply coupon at checkout or cart to unlock instant discounts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-center">
            <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-2.5 px-4 flex items-center gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-orange-200 block">Code</span>
                <span className="font-black text-sm tracking-wider">BITE20</span>
              </div>
              <button
                type="button"
                onClick={() => copyCoupon('BITE20')}
                className="p-1.5 rounded-xl bg-white text-orange-600 hover:bg-orange-50 transition"
                title="Copy code"
              >
                {copiedCoupon === 'BITE20' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-2.5 px-4 flex items-center gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-orange-200 block">Code</span>
                <span className="font-black text-sm tracking-wider">TASTY50</span>
              </div>
              <button
                type="button"
                onClick={() => copyCoupon('TASTY50')}
                className="p-1.5 rounded-xl bg-white text-orange-600 hover:bg-orange-50 transition"
                title="Copy code"
              >
                {copiedCoupon === 'TASTY50' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY EXPLORATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Explore by Cuisine
            </h2>
            <p className="text-xs text-slate-500">
              Pick your favorite flavor and dive into delightful dishes
            </p>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 transition"
          >
            <span>See All Cuisines</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <CategoryPills
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={handleCategorySelect}
        />
      </section>

      {/* POPULAR DISHES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-orange-100 text-orange-600 rounded-lg">
                <Flame className="w-4 h-4" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Chef&apos;s Specials & Popular Picks
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Top-rated culinary delights prepared fresh to order
            </p>
          </div>

          <Link to="/menu">
            <Button variant="outline" size="sm" icon={ArrowRight}>
              View Full Menu
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedRecipes.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                onQuickView={(f) => setQuickViewFood(f)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        food={quickViewFood}
        isOpen={!!quickViewFood}
        onClose={() => setQuickViewFood(null)}
      />
    </div>
  );
};

export default HomePage;
