import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Clock, Flame, Plus, Minus, Eye } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import RatingStars from '../common/RatingStars';
import Badge from '../common/Badge';

const FoodCard = ({ food, onQuickView }) => {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [imageError, setImageError] = useState(false);

  const cartQty = getItemQuantity(food.id);
  const isFav = isFavorite(food.id);

  const fallbackImage =
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80';

  return (
    <div className="group relative flex flex-col bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
        <img
          src={imageError ? fallbackImage : food.image || fallbackImage}
          alt={food.name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-40 group-hover:opacity-50 transition-opacity" />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          <Badge variant={food.isVeg ? 'veg' : 'nonveg'} size="xs" dot>
            {food.isVeg ? 'VEG' : 'NON-VEG'}
          </Badge>
          {food.discountBadge && (
            <span className="bg-orange-500 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-xs">
              {food.discountBadge}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(food);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all active:scale-90 cursor-pointer ${
            isFav
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-white/80 hover:bg-white text-slate-600 hover:text-rose-500'
          }`}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </button>

        {onQuickView && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(food);
            }}
            className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 bg-white/90 hover:bg-white text-slate-800 text-xs font-bold px-2.5 py-1.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 backdrop-blur-sm cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
        )}

        <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
          <Clock className="w-3 h-3 text-orange-400" />
          <span>{food.estimatedDeliveryTime || '25-35 mins'}</span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-semibold text-orange-600 truncate max-w-[65%]">
            {food.restaurantName}
          </span>
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[10px] font-bold">
            {food.cuisine}
          </span>
        </div>

        <Link
          to={`/food/${food.id}`}
          className="text-base font-bold text-slate-900 hover:text-orange-600 transition-colors line-clamp-1 mb-1.5"
        >
          {food.name}
        </Link>

        <div className="flex items-center justify-between mb-3 text-xs">
          <RatingStars rating={food.rating} reviewCount={food.reviewCount} />
          {food.caloriesPerServing && (
            <div className="flex items-center gap-0.5 text-slate-400 font-medium">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>{food.caloriesPerServing} cal</span>
            </div>
          )}
        </div>

        {food.ingredients && food.ingredients.length > 0 && (
          <p className="text-xs text-slate-500 line-clamp-1 mb-4 flex-1">
            {food.ingredients.slice(0, 3).join(', ')}
            {food.ingredients.length > 3 && '...'}
          </p>
        )}

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Price</span>
            <span className="text-lg font-extrabold text-slate-900">
              {formatCurrency(food.price)}
            </span>
          </div>

          {cartQty > 0 ? (
            <div className="flex items-center bg-orange-500 text-white rounded-xl shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => updateQuantity(food.id, cartQty - 1)}
                className="p-1.5 px-2 hover:bg-orange-600 transition active:scale-95"
                title="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-xs font-extrabold select-none">
                {cartQty}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(food.id, cartQty + 1)}
                className="p-1.5 px-2 hover:bg-orange-600 transition active:scale-95"
                title="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => addToCart(food, 1)}
              className="inline-flex items-center gap-1.5 bg-orange-50 hover:bg-orange-500 text-orange-600 hover:text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all duration-200 active:scale-95 border border-orange-200 hover:border-transparent cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
