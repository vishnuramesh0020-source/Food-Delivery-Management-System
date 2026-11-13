import React, { useEffect, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  XCircle,
  RotateCcw,
  CreditCard,
  ShoppingBag,
  Headphones,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react';
import Button from '../components/common/Button';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/helpers';
import customToast from '../utils/customToast';

const PaymentFailurePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, total } = useCart();

  // Retrieve state passed from checkout or use realistic fallback
  const failureState = location.state || {};
  const reason =
    failureState.reason ||
    'Transaction declined by bank: 3D Secure authentication timed out or verification was unsuccessful.';
  const transactionId = useMemo(
    () => failureState.transactionId || 'TXN-FAIL-' + Math.floor(100000 + Math.random() * 900000),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [failureState.transactionId]
  );
  const paymentMethod = failureState.paymentMethod || 'Credit/Debit Card';
  const amount = failureState.amount || total || 0;
  const timestamp = useMemo(
    () => failureState.timestamp || new Date().toLocaleString(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [failureState.timestamp]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleRetryPayment = () => {
    customToast.info('Resuming Checkout', 'Your cart is preserved. Please try completing your payment.');
    navigate('/checkout');
  };

  const handleContactSupport = () => {
    customToast.info(
      'Support Connected 🎧',
      'Our 24/7 billing support team is available at 1800-BITERUSH or support@biterush.com.'
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 sm:p-10 space-y-6">
        {/* Top Decline Banner */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-pulse">
            <XCircle className="w-12 h-12" />
          </div>

          <div>
            <span className="text-xs font-black uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 px-3.5 py-1 rounded-full inline-block">
              Payment Failed
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
              Payment Could Not Be Processed
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
              We were unable to charge your account. Don&apos;t worry, no funds were deducted from your account. If any amount was debited, it will be refunded within 24-48 hours.
            </p>
          </div>
        </div>

        {/* Failure Details Card */}
        <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-5 space-y-3">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-extrabold text-rose-900 block text-sm">
                Decline Reason:
              </span>
              <p className="text-rose-800 leading-relaxed font-medium">
                {reason}
              </p>
            </div>
          </div>
        </div>

        {/* Transaction Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 rounded-2xl p-5 border border-slate-100 text-xs">
          <div className="space-y-1">
            <span className="text-[10.5px] text-slate-400 uppercase tracking-wider block font-black">
              Transaction Reference
            </span>
            <span className="font-mono text-sm font-black text-slate-900 block truncate">
              {transactionId}
            </span>
            <span className="text-[10px] text-slate-400 block">{timestamp}</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10.5px] text-slate-400 uppercase tracking-wider block font-black">
              Attempted Payment Method
            </span>
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <CreditCard className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span className="truncate">{paymentMethod}</span>
            </div>
            <span className="text-[10px] text-slate-500 block">Status: Declined</span>
          </div>

          <div className="space-y-1 sm:text-right">
            <span className="text-[10.5px] text-slate-400 uppercase tracking-wider block font-black">
              Attempted Amount
            </span>
            <span className="text-lg font-black text-slate-900 block">
              {formatCurrency(amount)}
            </span>
            <span className="text-[10px] text-rose-600 font-bold block">
              Charge Incomplete
            </span>
          </div>
        </div>

        {/* Cart Preservation Banner */}
        <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-emerald-900 font-semibold">
              Good news: Your cart with <strong>{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</strong> has been safely preserved!
            </span>
          </div>
          <Link
            to="/cart"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline shrink-0 ml-2"
          >
            Review Cart
          </Link>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={handleRetryPayment}
            icon={RotateCcw}
            className="w-full sm:flex-1 shadow-md shadow-orange-500/20"
          >
            Retry Payment Now
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleRetryPayment}
            icon={CreditCard}
            className="w-full sm:flex-1"
          >
            Try Another Payment Method
          </Button>
        </div>

        {/* Help & Support Footer */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Need assistance completing your order?</span>
          </div>

          <button
            type="button"
            onClick={handleContactSupport}
            className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Contact 24/7 Customer Support</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailurePage;
