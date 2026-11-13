import React from 'react';
import {
  Tag,
  ShieldCheck,
  Percent,
  Clock,
  MapPin,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/helpers';

const PaymentSummaryCard = ({
  cartItems,
  subtotal,
  discount,
  coupon,
  deliveryFee,
  deliveryType,
  tax,
  total,
  totalItemsCount,
  chosenAddress,
  estimatedDuration,
  estimatedArrivalClock,
  onOpenCouponModal,
  onRemoveCoupon,
  isPlacingOrder,
  onPlaceOrder,
  simulateFailure,
  setSimulateFailure,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <h3 className="text-lg font-black text-slate-900">Payment Summary</h3>
        <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full">
          {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Address Quick Preview */}
      {chosenAddress && (
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1">
          <div className="flex items-center justify-between font-bold text-slate-700">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              <span>Deliver to {chosenAddress.title || chosenAddress.label || 'Home'}</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500 truncate">
            {chosenAddress.street}, {chosenAddress.city}
          </p>
        </div>
      )}

      {/* Estimated Delivery Time Preview */}
      <div className="p-3 bg-orange-50/70 rounded-2xl border border-orange-200/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 font-bold text-orange-900">
          <Clock className="w-4 h-4 text-orange-600" />
          <span>Estimated Delivery</span>
        </div>
        <div className="text-right">
          <span className="font-black text-orange-700 block">{estimatedDuration}</span>
          <span className="text-[10px] text-orange-600 font-semibold">~{estimatedArrivalClock}</span>
        </div>
      </div>

      {/* Itemized Cart Mini List */}
      <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 pr-1">
        {cartItems.map((ci) => (
          <div key={ci.item.id} className="py-2 flex justify-between items-start gap-2 text-xs">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    ci.item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />
                <span className="font-bold text-slate-800">{ci.quantity}x</span>
                <span className="text-slate-700 font-semibold truncate">{ci.item.name}</span>
              </div>
            </div>
            <span className="font-black text-slate-900 shrink-0">
              {formatCurrency(ci.item.price * ci.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Coupon Application Trigger / Banner */}
      <div className="pt-2 border-t border-slate-100">
        {coupon ? (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-black text-emerald-900 uppercase tracking-wide block">
                  {coupon.code} Applied
                </span>
                <span className="text-[11px] text-emerald-700">
                  {coupon.description}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onRemoveCoupon}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer ml-2"
            >
              Remove
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenCouponModal}
            className="w-full p-3 rounded-2xl border-2 border-dashed border-orange-300 hover:border-orange-500 bg-orange-50/50 hover:bg-orange-50 text-orange-700 font-bold text-xs transition flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>Apply Coupon / Promo Code</span>
            </span>
            <span className="text-[11px] font-black uppercase text-orange-600 bg-white px-2.5 py-1 rounded-xl border border-orange-200">
              View Offers
            </span>
          </button>
        )}
      </div>

      {/* Financial Breakdown */}
      <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
        <div className="flex justify-between text-slate-600">
          <span>Items Subtotal</span>
          <span className="font-bold text-slate-800">{formatCurrency(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-emerald-600 font-bold">
            <span className="flex items-center gap-1">
              <Percent className="w-3.5 h-3.5" />
              <span>Coupon Discount {coupon?.code ? `(${coupon.code})` : ''}</span>
            </span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-slate-600">
          <span>Delivery Charges ({deliveryType === 'express' ? 'Priority Express' : 'Standard'})</span>
          <span className="font-bold text-slate-800">
            {deliveryFee === 0 ? (
              <span className="text-emerald-600 font-black">FREE</span>
            ) : (
              formatCurrency(deliveryFee)
            )}
          </span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span>Restaurant GST & Taxes (8%)</span>
          <span className="font-bold text-slate-800">{formatCurrency(tax)}</span>
        </div>
      </div>

      {/* Grand Total */}
      <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-slate-900">
        <div>
          <span className="text-[10px] text-slate-400 block font-black uppercase tracking-wider">
            Total Payable Amount
          </span>
          <span className="text-2xl font-black text-slate-900">{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Payment Action Button */}
      <Button
        onClick={onPlaceOrder}
        variant="primary"
        size="lg"
        className="w-full shadow-lg shadow-orange-500/25"
        isLoading={isPlacingOrder}
      >
        Pay {formatCurrency(total)} • Place Order
      </Button>

      {/* Simulation Toggle for Developer / Evaluator Testing */}
      <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-1.5 text-slate-700">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-bold text-[11px]">Simulate Payment Failure</span>
          </div>
          <input
            type="checkbox"
            checked={simulateFailure}
            onChange={(e) => setSimulateFailure(e.target.checked)}
            className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
          />
        </label>
        {simulateFailure && (
          <p className="text-[10px] text-rose-600 mt-1 font-semibold">
            Test mode: This transaction will trigger the Payment Failure Screen so you can verify the decline & retry workflow.
          </p>
        )}
      </div>

      <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5 pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Safe & Secure 256-bit Encrypted Checkout</span>
      </div>
    </div>
  );
};

export default PaymentSummaryCard;
