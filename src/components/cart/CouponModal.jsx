import React, { useState } from 'react';
import {
  Tag,
  Percent,
  Sparkles,
  Flame,
  Wallet,
  Truck,
  Check,
  Copy,
  Info,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { AVAILABLE_COUPONS_LIST, formatCurrency } from '../../utils/helpers';
import customToast from '../../utils/customToast';

const getCouponIcon = (iconName) => {
  switch (iconName) {
    case 'Percent':
      return Percent;
    case 'Sparkles':
      return Sparkles;
    case 'Flame':
      return Flame;
    case 'Wallet':
      return Wallet;
    case 'Truck':
      return Truck;
    default:
      return Tag;
  }
};

const CouponModal = ({ isOpen, onClose, currentSubtotal = 0, appliedCoupon = null, onApplyCoupon }) => {
  const [copiedCode, setCopiedCode] = useState(null);
  const [customInput, setCustomInput] = useState('');

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    customToast.info('Coupon Copied', `Code ${code} copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleApply = (code) => {
    const res = onApplyCoupon(code);
    if (res?.success) {
      onClose();
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    const res = onApplyCoupon(customInput.trim());
    if (res?.success) {
      setCustomInput('');
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Available Coupons & Offers"
      size="lg"
    >
      <div className="space-y-5">
        {/* Manual Input Promo Box */}
        <form onSubmit={handleCustomSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value.toUpperCase())}
              placeholder="ENTER PROMO CODE..."
              className="w-full pl-10 pr-3 py-2.5 uppercase tracking-wider text-xs font-black rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
            />
          </div>
          <Button type="submit" variant="primary" size="md">
            Apply
          </Button>
        </form>

        {/* Coupons List */}
        <div className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
          {AVAILABLE_COUPONS_LIST.map((c) => {
            const Icon = getCouponIcon(c.icon);
            const isApplied = appliedCoupon?.code === c.code;
            const isEligible = !c.minOrder || currentSubtotal >= c.minOrder;
            const shortfall = c.minOrder ? Math.max(0, c.minOrder - currentSubtotal) : 0;

            let discountPreview = '';
            if (c.discountPercent) {
              const raw = (currentSubtotal * c.discountPercent) / 100;
              const actual = c.maxDiscount ? Math.min(raw, c.maxDiscount) : raw;
              discountPreview = `Saves ~${formatCurrency(actual)}`;
            } else if (c.discountFlat) {
              discountPreview = `Saves ${formatCurrency(c.discountFlat)}`;
            } else if (c.freeShipping) {
              discountPreview = 'Free Standard & Express Delivery';
            }

            return (
              <div
                key={c.code}
                className={`p-4 rounded-3xl border-2 transition-all relative overflow-hidden ${
                  isApplied
                    ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500'
                    : isEligible
                    ? 'border-slate-200 hover:border-orange-300 bg-white shadow-2xs'
                    : 'border-slate-200/70 bg-slate-50/60 opacity-80'
                }`}
              >
                {/* Decorative Pill Top Right */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isApplied
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-orange-100 text-orange-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-mono text-sm font-black tracking-wider text-slate-900">
                      {c.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(c.code)}
                      className="p-1 text-slate-400 hover:text-slate-700 transition rounded-lg hover:bg-slate-100 cursor-pointer"
                      title="Copy code"
                    >
                      {copiedCode === c.code ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      isApplied
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {isApplied ? 'Applied' : c.badge}
                  </span>
                </div>

                <h4 className="text-sm font-extrabold text-slate-900">{c.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{c.description}</p>

                {/* Terms & Conditions */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400 mt-2.5 pt-2.5 border-t border-slate-100">
                  {c.minOrder ? (
                    <span className="flex items-center gap-1 font-semibold text-slate-600">
                      <Info className="w-3 h-3 text-slate-400" />
                      Min. Order: {formatCurrency(c.minOrder)}
                    </span>
                  ) : (
                    <span className="font-semibold text-emerald-600">No minimum order required</span>
                  )}

                  {c.maxDiscount && (
                    <span className="font-semibold text-slate-600">
                      Max Cap: {formatCurrency(c.maxDiscount)}
                    </span>
                  )}
                </div>

                {/* Status & Action */}
                <div className="flex items-center justify-between gap-3 mt-3 pt-2">
                  <div>
                    {isEligible ? (
                      <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        {discountPreview}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-amber-700 flex items-center gap-1 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200/60">
                        <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                        Add {formatCurrency(shortfall)} more to unlock
                      </span>
                    )}
                  </div>

                  <div>
                    {isApplied ? (
                      <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl inline-flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Active
                      </span>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        variant={isEligible ? 'primary' : 'outline'}
                        disabled={!isEligible}
                        onClick={() => handleApply(c.code)}
                        icon={ArrowRight}
                      >
                        Apply Code
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default CouponModal;
