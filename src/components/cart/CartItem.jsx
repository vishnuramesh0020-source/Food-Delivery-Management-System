import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';

const CartItem = ({ cartEntry }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { item, quantity, instructions } = cartEntry;

  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-b-0">
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 rounded-2xl object-cover bg-slate-100 shrink-0"
      />

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-slate-900 truncate">
          {item.name}
        </h4>
        <div className="text-xs text-slate-400 mb-1">
          {item.restaurantName || item.cuisine}
        </div>
        <div className="text-xs font-extrabold text-orange-600">
          {formatCurrency(item.price)}
        </div>
        {instructions && (
          <p className="text-[11px] text-slate-400 italic truncate mt-0.5">
            &quot;{instructions}&quot;
          </p>
        )}
      </div>

      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1">
          <button
            type="button"
            onClick={() => updateQuantity(item.id, quantity - 1)}
            className="w-6 h-6 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-600 hover:text-orange-600 transition"
            title="Decrease"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-5 text-center text-xs font-bold text-slate-800">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => updateQuantity(item.id, quantity + 1)}
            className="w-6 h-6 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-600 hover:text-orange-600 transition"
            title="Increase"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => removeFromCart(item.id)}
          className="text-[11px] text-slate-400 hover:text-rose-600 transition flex items-center gap-1 cursor-pointer"
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
