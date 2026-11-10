import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';

const CartItem = ({ cartEntry, onNavigate }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { item, quantity, instructions } = cartEntry;
  const [imageError, setImageError] = useState(false);

  const fallbackImage =
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80';

  const itemTotal = (Number(item.price) || 0) * quantity;

  return (
    <div className="flex items-center gap-3.5 py-3.5 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 p-2 rounded-2xl transition">
      {/* Item Image with Link */}
      <Link
        to={`/food/${item.id}`}
        onClick={onNavigate}
        className="relative block w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60 shadow-2xs group"
        title={`View ${item.name}`}
      >
        <img
          src={imageError ? fallbackImage : item.image || fallbackImage}
          alt={item.name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* Tiny Veg/Non-Veg Corner Dot */}
        <span
          className={`absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border border-white shadow-xs ${
            item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
          }`}
          title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
        />
      </Link>

      {/* Item Name, Restaurant/Category, Instructions, Price */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
          />
          <Link
            to={`/food/${item.id}`}
            onClick={onNavigate}
            className="text-sm font-extrabold text-slate-900 hover:text-orange-600 transition-colors truncate block"
          >
            {item.name}
          </Link>
        </div>

        <div className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
          <span className="text-orange-600">{item.restaurantName || 'BiteRush Kitchen'}</span>
          <span>•</span>
          <span className="capitalize">{item.category || item.cuisine || 'Dish'}</span>
        </div>

        {/* Price & Quantity Breakdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-900">
            {formatCurrency(itemTotal)}
          </span>
          {quantity > 1 && (
            <span className="text-[10px] text-slate-400 font-medium">
              ({formatCurrency(item.price)} each)
            </span>
          )}
        </div>

        {instructions && (
          <p className="text-[10.5px] text-amber-700 bg-amber-50/70 border border-amber-200/60 rounded-lg px-2 py-0.5 italic truncate mt-1 max-w-[200px] sm:max-w-xs">
            &quot;{instructions}&quot;
          </p>
        )}
      </div>

      {/* Stepper Controls & Delete Button */}
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1 border border-slate-200/60 shadow-2xs">
          <button
            type="button"
            onClick={() => updateQuantity(item.id, quantity - 1)}
            className="w-6 h-6 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-600 hover:text-orange-600 active:scale-95 transition cursor-pointer"
            title="Decrease quantity"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-5 text-center text-xs font-black text-slate-800 select-none">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => updateQuantity(item.id, quantity + 1)}
            className="w-6 h-6 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-600 hover:text-orange-600 active:scale-95 transition cursor-pointer"
            title="Increase quantity"
            aria-label="Increase quantity"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => removeFromCart(item.id)}
          className="text-[11px] font-bold text-slate-400 hover:text-rose-600 transition flex items-center gap-1 cursor-pointer py-0.5"
          title="Remove item"
        >
          <Trash2 className="w-3 h-3" />
          <span>Remove</span>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
