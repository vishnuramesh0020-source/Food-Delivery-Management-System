import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Clock,
  Flame,
  Plus,
  Minus,
  Eye,
  Edit2,
  Trash2,
  Ban,
} from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import RatingStars from '../common/RatingStars';
import Badge from '../common/Badge';

const FoodCard = ({ food, onQuickView, onEdit, onDelete, showActions = true }) => {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [imageError, setImageError] = useState(false);

  const cartQty = getItemQuantity(food.id);
  const isFav = isFavorite(food.id);
  const isAvailable =
    typeof food.isAvailable === 'boolean'
      ? food.isAvailable
      : food.availabilityStatus !== 'Out of Stock';

  const fallbackImage =
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80';

  return (
    <div className="group relative flex flex-col bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* 1. FOOD IMAGE & OVERLAY BADGES */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
        <img
          src={imageError ? fallbackImage : food.image || fallbackImage}
          alt={food.name}
          onError={() => setImageError(true)}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
            !isAvailable ? 'grayscale-[40%] opacity-90' : ''
          }`}
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-40 group-hover:opacity-50 transition-opacity" />

        {/* Top-Left Badges: Veg/Non-Veg & Discount & Category */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          <Badge variant={food.isVeg ? 'veg' : 'nonveg'} size="xs" dot>
            {food.isVeg ? 'VEG' : 'NON-VEG'}
          </Badge>

          {/* Availability Status Badge */}
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-2xs backdrop-blur-md ${
              isAvailable
                ? 'bg-emerald-500/90 text-white'
                : 'bg-rose-500/95 text-white'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isAvailable ? 'bg-white animate-pulse' : 'bg-white'
              }`}
            />
            {isAvailable ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Top-Right Quick Actions: Edit, Delete, Favorite */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {showActions && onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(food);
              }}
              className="p-1.5 rounded-full bg-white/85 hover:bg-white text-slate-700 hover:text-orange-600 backdrop-blur-md transition-all shadow-md active:scale-90 cursor-pointer"
              title="Edit menu item"
              aria-label="Edit dish"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}

          {showActions && onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(food);
              }}
              className="p-1.5 rounded-full bg-white/85 hover:bg-white text-slate-700 hover:text-rose-600 backdrop-blur-md transition-all shadow-md active:scale-90 cursor-pointer"
              title="Delete menu item"
              aria-label="Delete dish"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(food);
            }}
            className={`p-1.5 rounded-full backdrop-blur-md transition-all active:scale-90 cursor-pointer ${
              isFav
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-white/85 hover:bg-white text-slate-600 hover:text-rose-500 shadow-md'
            }`}
            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
            aria-label="Favorite toggle"
          >
            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom Floating Quick View & Estimated Delivery */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {onQuickView ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(food);
              }}
              className="pointer-events-auto opacity-0 group-hover:opacity-100 bg-white/90 hover:bg-white text-slate-800 text-xs font-bold px-2.5 py-1.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 backdrop-blur-sm cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick View</span>
            </button>
          ) : <div />}

          <div className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
            <Clock className="w-3 h-3 text-orange-400" />
            <span>{food.estimatedDeliveryTime || '25-35 mins'}</span>
          </div>
        </div>
      </div>

      {/* 2. FOOD CARD CONTENT (NAME, CATEGORY, DESCRIPTION, PRICE) */}
      <div className="p-4 flex flex-col flex-1">
        {/* Restaurant Name & Category Pill */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span className="font-semibold text-orange-600 truncate max-w-[60%]">
            {food.restaurantName}
          </span>
          <span className="bg-orange-50 text-orange-700 border border-orange-200/60 px-2 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider">
            {food.category || food.cuisine || 'Dish'}
          </span>
        </div>

        {/* Food Name (Title) */}
        <Link
          to={`/food/${food.id}`}
          className="text-base font-black text-slate-900 hover:text-orange-600 transition-colors line-clamp-1 mb-1 tracking-tight"
        >
          {food.name}
        </Link>

        {/* Appetizing Food Description */}
        <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
          {food.description ||
            `Hand-crafted ${food.name} made with seasonal ingredients, fresh herbs, and house special spices.`}
        </p>

        {/* Rating & Calories Metadata */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <RatingStars rating={food.rating} reviewCount={food.reviewCount} />
          {food.caloriesPerServing && (
            <div className="flex items-center gap-0.5 text-slate-400 font-medium">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>{food.caloriesPerServing} cal</span>
            </div>
          )}
        </div>

        {/* 3. CARD FOOTER: PRICE & AVAILABILITY / CART ACTION */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Price</span>
            <span className="text-lg font-black text-slate-900">
              {formatCurrency(food.price)}
            </span>
          </div>

          {!isAvailable ? (
            <span className="inline-flex items-center gap-1 text-slate-400 bg-slate-100 font-bold text-xs px-3 py-2 rounded-xl border border-slate-200 cursor-not-allowed">
              <Ban className="w-3.5 h-3.5 text-rose-500" />
              <span>Out of Stock</span>
            </span>
          ) : cartQty > 0 ? (
            <div className="flex items-center bg-orange-500 text-white rounded-xl shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => updateQuantity(food.id, cartQty - 1)}
                className="p-1.5 px-2 hover:bg-orange-600 transition active:scale-95"
                title="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-xs font-black select-none">
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
