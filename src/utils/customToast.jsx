import React from 'react';
import { toast } from 'react-toastify';
import {
  ShoppingBag,
  Heart,
  ArrowRight,
  Tag,
  Trash2,
} from 'lucide-react';
import { formatCurrency } from './helpers';

/**
 * Universal BiteRush Branded Toast Card Component
 * Formats any notification to match the exact BiteRush app design language:
 * - Brand badge with live pulsing status indicator
 * - Avatar or vibrant gradient squircle icon
 * - Bold title + helpful subtitle
 * - Warm shadows and rounded-2xl geometry
 */
export const BiteRushMessage = ({
  badge = 'BiteRush',
  badgeVariant = 'orange', // 'orange' | 'emerald' | 'amber' | 'rose'
  title,
  subtitle,
  avatar,
  icon,
  iconBg = 'bg-gradient-to-tr from-orange-600 to-amber-500',
}) => {
  const badgeClasses = {
    orange: 'text-orange-700 bg-orange-50 border-orange-200',
    emerald: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    amber: 'text-amber-700 bg-amber-50 border-amber-200',
    rose: 'text-rose-700 bg-rose-50 border-rose-200',
  }[badgeVariant] || 'text-orange-700 bg-orange-50 border-orange-200';

  const dotClasses = {
    orange: 'bg-orange-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
  }[badgeVariant] || 'bg-orange-500';

  return (
    <div className="flex items-start gap-3 w-full py-0.5 select-none">
      {/* Left Icon or User Avatar */}
      {avatar ? (
        <img
          src={avatar}
          alt=""
          className="w-10 h-10 rounded-2xl object-cover border-2 border-orange-300 shadow-xs shrink-0 mt-0.5"
        />
      ) : (
        <div
          className={`w-10 h-10 rounded-2xl ${iconBg} text-white flex items-center justify-center text-lg shadow-md shadow-orange-500/20 shrink-0 mt-0.5`}
        >
          {icon || '🍔'}
        </div>
      )}

      {/* Main Toast Content */}
      <div className="flex-1 min-w-0 pr-1">
        {/* Top Tag / Category */}
        <div className="flex items-center gap-1.5 mb-1">
          <span
            className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border inline-flex items-center gap-1 shadow-2xs ${badgeClasses}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${dotClasses} animate-pulse`} />
            {badge}
          </span>
          <span className="text-[10px] font-semibold text-slate-400">• Just now</span>
        </div>

        {/* Title */}
        <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug truncate">
          {title}
        </h4>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-[11px] font-medium text-slate-500 mt-0.5 leading-tight">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export const customToast = {
  // --- 1. AUTHENTICATION NOTIFICATIONS ---
  authLogin: (user) => {
    return toast.success(
      <BiteRushMessage
        badge="BiteRush • Member"
        badgeVariant="orange"
        avatar={user?.avatar}
        icon="🍔"
        title={`Welcome back, ${user?.name || 'Foodie'}!`}
        subtitle="Signed in successfully. Ready to order your favorites? 🍕"
      />,
      {
        toastId: 'auth-login-success',
        icon: false,
      }
    );
  },

  authRegister: (user) => {
    return toast.success(
      <BiteRushMessage
        badge="BiteRush • Welcome"
        badgeVariant="emerald"
        avatar={user?.avatar}
        icon="🎉"
        iconBg="bg-gradient-to-tr from-emerald-500 to-teal-500"
        title="Account Created Successfully!"
        subtitle={`Welcome to BiteRush, ${user?.name || 'Foodie'}. Happy dining! 🍔`}
      />,
      {
        toastId: 'auth-register-success',
        icon: false,
      }
    );
  },

  authLogout: () => {
    return toast.info(
      <BiteRushMessage
        badge="BiteRush • Session"
        badgeVariant="orange"
        icon="👋"
        title="You have been logged out"
        subtitle="Come back hungry soon! See you next time."
      />,
      {
        toastId: 'auth-logout-info',
        icon: false,
      }
    );
  },

  authResetPassword: () => {
    return toast.success(
      <BiteRushMessage
        badge="BiteRush • Security"
        badgeVariant="emerald"
        icon="🔒"
        iconBg="bg-gradient-to-tr from-emerald-500 to-teal-500"
        title="Password Reset Successful"
        subtitle="Your password has been updated. Please log in with your new credentials."
      />,
      {
        toastId: 'auth-reset-success',
        icon: false,
      }
    );
  },

  authProfileUpdate: () => {
    return toast.success(
      <BiteRushMessage
        badge="BiteRush • Profile"
        badgeVariant="orange"
        icon="✨"
        title="Profile Updated Successfully"
        subtitle="Your personal details and delivery addresses have been saved."
      />,
      {
        toastId: 'auth-profile-update',
        icon: false,
      }
    );
  },

  authAddressAdded: (label = 'Address') => {
    return toast.success(
      <BiteRushMessage
        badge="BiteRush • Delivery"
        badgeVariant="emerald"
        icon="📍"
        iconBg="bg-gradient-to-tr from-emerald-500 to-teal-500"
        title="Delivery Address Saved"
        subtitle={`${label} has been added to your delivery locations.`}
      />,
      {
        toastId: `addr-add-${Date.now()}`,
        icon: false,
      }
    );
  },

  authAddressRemoved: () => {
    return toast.info(
      <BiteRushMessage
        badge="BiteRush • Delivery"
        badgeVariant="orange"
        icon="🗑️"
        title="Address Removed"
        subtitle="The delivery address has been removed from your account."
      />,
      {
        toastId: 'auth-address-removed',
        icon: false,
      }
    );
  },

  // --- 2. CART & FOOD NOTIFICATIONS ---
  addToCart: (item, quantity = 1, onOpenCart) => {
    return toast.success(
      <div className="flex items-center gap-3 w-full py-0.5 select-none">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-12 h-12 rounded-2xl object-cover border border-slate-200/80 shadow-xs shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center text-lg shadow-md shadow-orange-500/25 shrink-0">
            🍔
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

  updateQuantity: (item, newQty) => {
    return toast.info(
      <div className="flex items-center gap-3 w-full py-0.5 select-none">
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

  removeFromCart: (itemName) => {
    return toast.info(
      <div className="flex items-center gap-3 w-full py-0.5 select-none">
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

  clearCart: () => {
    return toast.info(
      <div className="flex items-center gap-3 w-full py-0.5 select-none">
        <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 shrink-0 shadow-xs">
          <Trash2 className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
            Cart Cleared
          </span>
          <p className="text-xs sm:text-sm font-extrabold text-slate-900 truncate mt-0.5">
            All items removed from cart
          </p>
          <p className="text-[11px] font-semibold text-slate-500">
            Cart saved safely in local storage
          </p>
        </div>
      </div>,
      {
        toastId: 'cart-cleared',
        icon: false,
      }
    );
  },

  couponApplied: (code, discount) => {
    return toast.success(
      <div className="flex items-center gap-3 w-full py-0.5 select-none">
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

  favoriteAdded: (item) => {
    return toast.success(
      <div className="flex items-center gap-3 w-full py-0.5 select-none">
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

  favoriteRemoved: (item) => {
    return toast.info(
      <div className="flex items-center gap-3 w-full py-0.5 select-none">
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

  // --- 3. ORDERS ---
  orderPlaced: (order) => {
    return toast.success(
      <BiteRushMessage
        badge="BiteRush • Kitchen Order"
        badgeVariant="emerald"
        icon="📦"
        iconBg="bg-gradient-to-tr from-emerald-500 to-teal-500"
        title={`Order #${order.id} Placed! 🎉`}
        subtitle="Your meal is being prepared. Track delivery in real time!"
      />,
      {
        toastId: `order-${order.id}`,
        icon: false,
      }
    );
  },

  orderStatusUpdated: (orderId, newStatus) => {
    return toast.success(
      <BiteRushMessage
        badge="BiteRush • Live Dispatch"
        badgeVariant="orange"
        icon="🛵"
        title={`Order #${orderId} Updated`}
        subtitle={`Current status is now: ${newStatus}`}
      />,
      {
        toastId: `order-status-${orderId}-${newStatus}`,
        icon: false,
      }
    );
  },

  orderCancelled: (orderId) => {
    return toast.info(
      <BiteRushMessage
        badge="BiteRush • Order"
        badgeVariant="rose"
        icon="❌"
        iconBg="bg-gradient-to-tr from-rose-500 to-red-600"
        title={`Order #${orderId} Cancelled`}
        subtitle="This order has been cancelled."
      />,
      {
        toastId: `order-cancel-${orderId}`,
        icon: false,
      }
    );
  },

  // --- 4. GENERAL PURPOSE BITERUSH NOTIFICATIONS ---
  success: (title, subtitle = 'Action completed successfully.', options = {}) => {
    return toast.success(
      <BiteRushMessage
        badge="BiteRush • Success"
        badgeVariant="emerald"
        icon="✅"
        iconBg="bg-gradient-to-tr from-emerald-500 to-teal-500"
        title={title}
        subtitle={subtitle}
      />,
      {
        icon: false,
        ...options,
      }
    );
  },

  error: (title, subtitle = 'Please check the details and try again.', options = {}) => {
    return toast.error(
      <BiteRushMessage
        badge="BiteRush • Notice"
        badgeVariant="rose"
        icon="⚠️"
        iconBg="bg-gradient-to-tr from-rose-500 to-red-600"
        title={title}
        subtitle={subtitle}
      />,
      {
        icon: false,
        ...options,
      }
    );
  },

  info: (title, subtitle = '', options = {}) => {
    return toast.info(
      <BiteRushMessage
        badge="BiteRush • Info"
        badgeVariant="orange"
        icon="ℹ️"
        title={title}
        subtitle={subtitle}
      />,
      {
        icon: false,
        ...options,
      }
    );
  },
};

export default customToast;
