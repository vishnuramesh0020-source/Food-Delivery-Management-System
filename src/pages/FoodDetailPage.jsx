import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  Flame,
  Users,
  Heart,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  ChefHat,
  CheckCircle2,
  Sparkles,
  Share2,
} from 'lucide-react';
import { foodApi } from '../api/foodApi';
import { formatCurrency } from '../utils/helpers';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import RatingStars from '../components/common/RatingStars';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import FoodCard from '../components/food/FoodCard';
import { Spinner } from '../components/common/Spinner';
import { toast } from 'react-toastify';

const FoodDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [food, setFood] = useState(null);
  const [relatedFoods, setRelatedFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [checkedIngredients, setCheckedIngredients] = useState({});

  useEffect(() => {
    let isMounted = true;
    const loadDetails = async () => {
      setIsLoading(true);
      try {
        const recipe = await foodApi.getRecipeById(id);
        if (isMounted) {
          setFood(recipe);
          if (recipe?.cuisine) {
            const related = await foodApi.getRecipesByTag(recipe.cuisine);
            setRelatedFoods(related.filter((r) => String(r.id) !== String(id)).slice(0, 4));
          }
        }
      } catch (err) {
        console.error('Failed to load recipe details', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadDetails();
    window.scrollTo(0, 0);
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner size="lg" text="Loading exquisite culinary details..." />
      </div>
    );
  }

  if (!food) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center px-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Recipe Not Found</h2>
        <p className="text-slate-500 mb-6">The dish you are looking for is currently unavailable.</p>
        <Button variant="primary" onClick={() => navigate('/menu')}>
          Back to Menu
        </Button>
      </div>
    );
  }

  const isFav = isFavorite(food.id);

  const handleAddToCart = () => {
    addToCart(food, quantity, specialInstructions);
    setSpecialInstructions('');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: food.name,
        text: `Check out ${food.name} on BiteRush!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.info('Recipe link copied to clipboard!');
    }
  };

  const toggleIngredientCheck = (idx) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <div>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-orange-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore Menu</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-7 relative min-h-[350px] lg:min-h-[500px] bg-slate-100 overflow-hidden">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-700 backdrop-blur-md shadow-md transition active:scale-95 cursor-pointer"
              title="Share dish"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => toggleFavorite(food)}
              className={`p-2.5 rounded-full backdrop-blur-md shadow-md transition active:scale-95 cursor-pointer ${
                isFav
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500'
              }`}
              title={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 text-white">
            <div className="flex items-center gap-2">
              <Badge variant={food.isVeg ? 'veg' : 'nonveg'} size="sm" dot>
                {food.isVeg ? 'VEGETARIAN' : 'NON-VEGETARIAN'}
              </Badge>
              <Badge variant="primary" size="sm">
                {food.cuisine}
              </Badge>
              {food.difficulty && (
                <span className="text-[11px] font-bold bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full uppercase border border-white/20">
                  {food.difficulty} Prep
                </span>
              )}
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md text-orange-400 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-white/10">
              <Clock className="w-4 h-4" />
              <span>{food.estimatedDeliveryTime}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-orange-600 font-extrabold uppercase tracking-wide">
                <ChefHat className="w-4 h-4" />
                <span>{food.restaurantName}</span>
              </div>
              <RatingStars rating={food.rating} reviewCount={food.reviewCount} size="md" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
              {food.name}
            </h1>

            <div className="grid grid-cols-3 gap-2.5 py-2">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-2.5 text-center">
                <Flame className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Calories</span>
                <span className="text-xs font-extrabold text-slate-800">{food.caloriesPerServing || 350} kcal</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-2.5 text-center">
                <Clock className="w-4 h-4 text-orange-500 mx-auto mb-1" />
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Cook Time</span>
                <span className="text-xs font-extrabold text-slate-800">{food.cookTimeMinutes || 15} mins</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-2.5 text-center">
                <Users className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Servings</span>
                <span className="text-xs font-extrabold text-slate-800">{food.servings || 2} persons</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider">Total Price</span>
              <div className="text-3xl font-black text-slate-900">
                {formatCurrency(food.price * quantity)}
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Special Kitchen Notes (Optional)
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                rows={2}
                placeholder="e.g. Extra spicy, dressing on the side, well done..."
                className="w-full text-xs p-3 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Select Quantity</span>
              <div className="flex items-center gap-2 border border-slate-200 rounded-2xl p-1 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-xl bg-white shadow-xs flex items-center justify-center text-slate-700 hover:text-orange-600 transition"
                  title="Decrease"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-sm font-black text-slate-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-xl bg-white shadow-xs flex items-center justify-center text-slate-700 hover:text-orange-600 transition"
                  title="Increase"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              variant="primary"
              size="lg"
              className="w-full shadow-lg shadow-orange-500/25"
              icon={ShoppingBag}
            >
              Add {quantity} to Cart • {formatCurrency(food.price * quantity)}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span>Fresh Ingredients</span>
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">
                {food.ingredients?.length || 0}
              </span>
            </h3>
            <span className="text-[11px] text-slate-400">Click to check</span>
          </div>

          <div className="space-y-2.5">
            {food.ingredients?.map((ing, i) => {
              const isChecked = checkedIngredients[i];
              return (
                <div
                  key={i}
                  onClick={() => toggleIngredientCheck(i)}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition cursor-pointer select-none ${
                    isChecked
                      ? 'bg-emerald-50/60 border-emerald-200 text-slate-400 line-through'
                      : 'bg-slate-50/70 border-slate-100 hover:border-orange-200 text-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center border transition ${
                      isChecked
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-xs font-semibold">{ing}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs">
          <div className="mb-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <span>Chef&apos;s Preparation Method</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              How our kitchen crafts this masterpiece from scratch
            </p>
          </div>

          <div className="space-y-4">
            {food.instructions?.map((step, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/60 border border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-orange-500 text-white text-xs font-black flex items-center justify-center shrink-0 shadow-xs">
                  {idx + 1}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {relatedFoods.length > 0 && (
        <section className="pt-8">
          <div className="mb-6">
            <h3 className="text-xl font-black text-slate-900">
              More Delicious {food.cuisine} Delights
            </h3>
            <p className="text-xs text-slate-400">
              Customers who ordered this also loved these
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedFoods.map((rf) => (
              <FoodCard key={rf.id} food={rf} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default FoodDetailPage;
