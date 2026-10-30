import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, ArrowRight, Tag, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/helpers';

const CartDrawer = () => {
  const {
    cartItems,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    coupon,
    applyCoupon,
    removeCoupon,
    subtotal,
    discount,
    deliveryFee,
    tax,
    total,
    totalItemsCount,
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">Your Cart</h3>
                <p className="text-xs text-slate-400">
                  {totalItemsCount} {totalItemsCount === 1 ? 'dish' : 'dishes'} selected
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 bg-orange-50 text-orange-400 rounded-full flex items-center justify-center text-3xl mb-4">
                🛒
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-1">
                Your cart is hungry!
              </h4>
              <p className="text-xs text-slate-400 max-w-xs mb-6">
                Explore delicious recipes from our top restaurants and add them to your cart.
              </p>
              <Button
                variant="primary"
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigate('/menu');
                }}
              >
                Explore Delicious Menu
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
                {cartItems.map((cartEntry) => (
                  <CartItem key={cartEntry.item.id} cartEntry={cartEntry} />
                ))}
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100">
                {coupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-xl text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="font-bold uppercase tracking-wider">{coupon.code}</span>
                        <span className="block text-[11px] text-emerald-700">{coupon.description}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
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
                        placeholder="Enter coupon (e.g. BITE20)"
                        className="flex-1 uppercase text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                      />
                      <Button type="submit" variant="secondary" size="sm">
                        Apply
                      </Button>
                    </form>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <Sparkles className="w-3 h-3 text-orange-500" />
                      <span>Try code:</span>
                      <button
                        type="button"
                        onClick={() => applyCoupon('BITE20')}
                        className="font-bold text-orange-600 hover:underline"
                      >
                        BITE20
                      </button>
                      <span>or</span>
                      <button
                        type="button"
                        onClick={() => applyCoupon('TASTY50')}
                        className="font-bold text-orange-600 hover:underline"
                      >
                        TASTY50
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-5 border-t border-slate-100 bg-white space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-700">{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-600 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-slate-700">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      formatCurrency(deliveryFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-semibold text-slate-700">{formatCurrency(tax)}</span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-slate-900">
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold">Total Amount</span>
                    <span className="text-xl font-black">{formatCurrency(total)}</span>
                  </div>
                  <Button
                    onClick={handleProceedToCheckout}
                    variant="primary"
                    size="lg"
                    icon={ArrowRight}
                  >
                    Checkout
                  </Button>
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
