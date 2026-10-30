import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Tag,
  ArrowRight,
  Truck,
  Zap,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/helpers';
import CartItem from '../components/cart/CartItem';
import Button from '../components/common/Button';

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    coupon,
    applyCoupon,
    removeCoupon,
    clearCart,
    deliveryType,
    setDeliveryType,
    subtotal,
    discount,
    deliveryFee,
    tax,
    total,
    totalItemsCount,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim()) {
      applyCoupon(couponCode);
      setCouponCode('');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <div className="w-24 h-24 bg-orange-100 text-orange-500 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-inner">
          🛒
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">
          Your Cart is Empty
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-8">
          Looks like you haven&apos;t added any delicious meals yet. Browse our chef-crafted menu and satisfy your cravings!
        </p>
        <Link to="/menu">
          <Button variant="primary" size="lg" icon={ShoppingBag}>
            Explore Delicious Dishes
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-600 transition mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Shopping Cart</span>
            <span className="text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-bold">
              {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
            </span>
          </h1>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs divide-y divide-slate-100">
            {cartItems.map((entry) => (
              <CartItem key={entry.item.id} cartEntry={entry} />
            ))}
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-orange-500" />
              <span>Select Delivery Speed</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                onClick={() => setDeliveryType('standard')}
                className={`relative p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition ${
                  deliveryType === 'standard'
                    ? 'border-orange-500 bg-orange-50/40 ring-1 ring-orange-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">Standard Delivery</span>
                    <span className="text-xs font-bold text-slate-700">
                      {subtotal >= 35 ? 'FREE' : '$2.99'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">30 - 45 mins delivery window</p>
                </div>
              </label>

              <label
                onClick={() => setDeliveryType('express')}
                className={`relative p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition ${
                  deliveryType === 'express'
                    ? 'border-orange-500 bg-orange-50/40 ring-1 ring-orange-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">Priority Express</span>
                    <span className="text-xs font-bold text-orange-600">
                      {subtotal >= 35 ? '+$2.50' : '+$2.50'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">15 - 25 mins direct from kitchen</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Apply Promo Code
            </h4>
            {coupon ? (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-2xl text-xs">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="font-black uppercase tracking-wider block">{coupon.code}</span>
                    <span className="text-[11px] text-emerald-700">{coupon.description}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-xs font-bold text-rose-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code (BITE20)"
                    className="flex-1 uppercase text-xs p-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                  <Button type="submit" variant="secondary" size="md">
                    Apply
                  </Button>
                </form>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-2">
                  <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                  <span>Available:</span>
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

          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-3.5">
            <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
              Order Summary
            </h3>

            <div className="flex justify-between text-xs text-slate-600">
              <span>Items Subtotal</span>
              <span className="font-bold text-slate-800">{formatCurrency(subtotal)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-xs text-emerald-600 font-bold">
                <span>Coupon Discount ({coupon?.code})</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}

            <div className="flex justify-between text-xs text-slate-600">
              <span>Delivery Fee ({deliveryType})</span>
              <span className="font-bold text-slate-800">
                {deliveryFee === 0 ? (
                  <span className="text-emerald-600">FREE</span>
                ) : (
                  formatCurrency(deliveryFee)
                )}
              </span>
            </div>

            <div className="flex justify-between text-xs text-slate-600">
              <span>Estimated Sales Tax (8%)</span>
              <span className="font-bold text-slate-800">{formatCurrency(tax)}</span>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-slate-900">
              <div>
                <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider">
                  Total Payable
                </span>
                <span className="text-2xl font-black">{formatCurrency(total)}</span>
              </div>

              <Button
                onClick={() => navigate('/checkout')}
                variant="primary"
                size="lg"
                icon={ArrowRight}
                className="shadow-lg shadow-orange-500/25"
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
