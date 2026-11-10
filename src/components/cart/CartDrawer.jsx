import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { X, ShoppingBag, ArrowRight, Tag, Sparkles, Trash2, Truck, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/helpers';

const CartDrawer = () => {
  const {
    cartItems,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    clearCart,
    coupon,
    applyCoupon,
    removeCoupon,
    subtotal,
    discount,
    deliveryFee,
    tax,
    total,
    totalItemsCount,
    freeDeliveryThreshold,
    amountToFreeDelivery,
  } = useCart();

  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    applyCoupon(couponInput);
    setCouponInput('');
  };

  const handleProceedToCheckout = () => {
    setIsCartDrawerOpen(false);
    navigate('/checkout');
  };

  const handleClose = () => {
    setIsCartDrawerOpen(false);
  };

  const progressPercent = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-orange-100 text-orange-600 rounded-2xl shadow-2xs">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-lg leading-tight">Your Cart</h3>
                <p className="text-xs text-slate-400 font-semibold">
                  {totalItemsCount} {totalItemsCount === 1 ? 'dish' : 'dishes'} • Saved to Local Storage
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {cartItems.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer"
                  title="Clear all items from cart"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleClose}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                aria-label="Close cart drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Free Delivery Banner Progress Bar */}
          {cartItems.length > 0 && (
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
              <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Truck className="w-3.5 h-3.5 text-orange-500" />
                  {amountToFreeDelivery === 0 || coupon?.freeShipping ? (
                    <span className="text-emerald-600 font-black flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Free Standard Delivery Unlocked!
                    </span>
                  ) : (
                    <span>Add {formatCurrency(amountToFreeDelivery)} more for Free Delivery</span>
                  )}
                </span>
                <span className="text-[11px] text-slate-400 font-extrabold">{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    amountToFreeDelivery === 0 || coupon?.freeShipping
                      ? 'bg-emerald-500'
                      : 'bg-gradient-to-r from-orange-500 to-amber-400'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Empty State vs Items List */}
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 bg-orange-50 text-orange-400 rounded-full flex items-center justify-center text-3xl mb-4 shadow-inner">
                🛒
              </div>
              <h4 className="text-lg font-black text-slate-800 mb-1">
                Your cart is hungry!
              </h4>
              <p className="text-xs text-slate-400 max-w-xs mb-6 leading-relaxed">
                Explore delicious recipes from top restaurants and add your favorite dishes to the cart.
              </p>
              <Button
                variant="primary"
                onClick={() => {
                  handleClose();
                  navigate('/menu');
                }}
              >
                Explore Delicious Menu
              </Button>
            </div>
          ) : (
            <>
              {/* Scrollable Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100">
                {cartItems.map((cartEntry) => (
                  <CartItem
                    key={cartEntry.item.id}
                    cartEntry={cartEntry}
                    onNavigate={handleClose}
                  />
                ))}
              </div>

              {/* Coupon Bar */}
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                {coupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-xl text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-black uppercase tracking-wider block">{coupon.code}</span>
                        <span className="text-[11px] text-emerald-700">{coupon.description}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs font-bold text-rose-600 hover:underline cursor-pointer ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <form onSubmit={handleApplyCoupon} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Coupon (e.g. BITE20)"
                        className="flex-1 uppercase text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 font-semibold"
                      />
                      <Button type="submit" variant="secondary" size="sm">
                        Apply
                      </Button>
                    </form>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <Sparkles className="w-3 h-3 text-orange-500 shrink-0" />
                      <span>Try:</span>
                      <button
                        type="button"
                        onClick={() => applyCoupon('BITE20')}
                        className="font-bold text-orange-600 hover:underline cursor-pointer"
                      >
                        BITE20 (20% OFF)
                      </button>
                      <span>or</span>
                      <button
                        type="button"
                        onClick={() => applyCoupon('TASTY50')}
                        className="font-bold text-orange-600 hover:underline cursor-pointer"
                      >
                        TASTY50
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Summary & Action Buttons */}
              <div className="p-5 border-t border-slate-100 bg-white space-y-2.5 shadow-lg">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Subtotal ({totalItemsCount} items)</span>
                  <span className="font-bold text-slate-800">{formatCurrency(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-600 font-bold">
                    <span>Coupon Discount</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-xs text-slate-500">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-slate-800">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-black">FREE</span>
                    ) : (
                      formatCurrency(deliveryFee)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-xs text-slate-500">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-bold text-slate-800">{formatCurrency(tax)}</span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-slate-900">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-black uppercase tracking-wider">
                      Total Payable
                    </span>
                    <span className="text-2xl font-black text-slate-900">{formatCurrency(total)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to="/cart"
                      onClick={handleClose}
                      className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold text-slate-700 hover:text-orange-600 hover:bg-orange-50 transition"
                      title="Open full cart management page"
                    >
                      View Cart
                    </Link>
                    <Button
                      onClick={handleProceedToCheckout}
                      variant="primary"
                      size="md"
                      icon={ArrowRight}
                      className="shadow-md shadow-orange-500/25"
                    >
                      Checkout
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
