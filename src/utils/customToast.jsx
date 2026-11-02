import React from 'react';
import { toast } from 'react-toastify';
import {
  ShoppingBag,
  Heart,
  ArrowRight,
  Sparkles,
  Tag,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { formatCurrency } from './helpers';

export const customToast = {
  // Rich item added to cart notification with dish thumbnail & quick action
  addToCart: (item, quantity = 1, onOpenCart) => {
    return toast.success(
      <div className="flex items-center gap-3 w-full py-0.5">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-12 h-12 rounded-2xl object-cover border border-slate-200/80 shadow-xs shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
        )}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Added to Cart
            </span>
          </div>
          <p className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
            {item.name}
          </p>
          <div className="flex items-center justify-between gap-2 mt-0.5">
            <span className="text-[11px] font-semibold text-slate-500">
              {quantity} × {formatCurrency(item.price)}
            </span>
            {onOpenCart && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenCart();
                }}
                className="text-[11px] font-extrabold text-orange-600 hover:text-orange-700 flex items-center gap-0.5 hover:underline cursor-pointer"
              >
                <span>View Cart</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>,
      {
        toastId: `cart-add-${item.id}`,
        icon: false,
      }
    );
  },

  // Quantity updated notification
  updateQuantity: (item, newQty) => {
    return toast.info(
      <div className="flex items-center gap-3 w-full py-0.5">
        <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200/80 flex items-center justify-center text-orange-600 shrink-0 shadow-xs">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-black uppercase tracking-wider text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200/60">
            Quantity Updated
          </span>
          <p className="text-xs sm:text-sm font-extrabold text-slate-900 truncate mt-0.5">
            {item.name}
          </p>
          <p className="text-[11px] font-semibold text-slate-500">
            Now <span className="font-bold text-orange-600">{newQty} items</span> in your cart
          </p>
        </div>
      </div>,
      {
        toastId: `cart-qty-${item.id}`,
        icon: false,
      }
    );
  },

  // Removed from cart notification
  removeFromCart: (itemName) => {
    return toast.info(
      <div className="flex items-center gap-3 w-full py-0.5">
        <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
          <Trash2 className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
            Removed from Cart
          </span>
          <p className="text-xs sm:text-sm font-bold text-slate-800 truncate mt-0.5">
            {itemName}
          </p>
        </div>
      </div>,
      {
        toastId: `cart-remove-${itemName}`,
        icon: false,
      }
    );
  },

  // Coupon applied notification
  couponApplied: (code, discount) => {
    return toast.success(
      <div className="flex items-center gap-3 w-full py-0.5">
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 shadow-xs">
          <Tag className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Promo Applied! 🎉
          </span>
          <p className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5">
            Coupon <span className="text-emerald-600 font-mono">"{code}"</span>
          </p>
          <p className="text-[11px] font-semibold text-emerald-600">
            You saved {formatCurrency(discount)} on this order
          </p>
        </div>
      </div>,
      {
        toastId: `coupon-applied-${code}`,
        icon: false,
      }
    );
  },

  // Saved to favorites notification
  favoriteAdded: (item) => {
    return toast.success(
      <div className="flex items-center gap-3 w-full py-0.5">
        <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 shrink-0 shadow-xs">
          <Heart className="w-5 h-5 fill-rose-500" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
            Saved to Favorites ❤️
          </span>
          <p className="text-xs sm:text-sm font-extrabold text-slate-900 truncate mt-0.5">
            {item.name}
          </p>
        </div>
      </div>,
      {
        toastId: `fav-add-${item.id}`,
        icon: false,
      }
    );
  },

  // Removed from favorites notification
  favoriteRemoved: (item) => {
    return toast.info(
      <div className="flex items-center gap-3 w-full py-0.5">
        <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
          <Heart className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
            Removed from Favorites
          </span>
          <p className="text-xs sm:text-sm font-bold text-slate-700 truncate mt-0.5">
            {item.name}
          </p>
        </div>
      </div>,
      {
        toastId: `fav-rem-${item.id}`,
        icon: false,
      }
    );
  },
};

export default customToast;
