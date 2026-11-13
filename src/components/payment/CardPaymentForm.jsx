import React, { useState } from 'react';
import {
  CreditCard,
  Lock,
  ShieldCheck,
  Check,
  Sparkles,
  HelpCircle,
  Wifi,
} from 'lucide-react';
import customToast from '../../utils/customToast';

// Detect card network
const getCardType = (number = '') => {
  const clean = number.replace(/\D/g, '');
  if (clean.startsWith('4')) return 'Visa';
  if (/^5[1-5]/.test(clean)) return 'Mastercard';
  if (/^6(0|5)/.test(clean) || /^35/.test(clean)) return 'RuPay';
  return 'Card';
};

const CardPaymentForm = ({
  cardData,
  onChange,
  onAutofill,
}) => {
  const [showCvvTip, setShowCvvTip] = useState(false);
  const cardType = getCardType(cardData.cardNumber);

  // Format Card Number (auto space every 4 digits)
  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 16) val = val.slice(0, 16);
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    onChange({ ...cardData, cardNumber: formatted });
  };

  // Format Expiry Date (MM/YY)
  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length >= 2) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    onChange({ ...cardData, expiry: val });
  };

  // Format CVV
  const handleCvvChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    onChange({ ...cardData, cvv: val });
  };

  const handleFillTestCard = () => {
    if (onAutofill) {
      onAutofill();
    } else {
      onChange({
        cardNumber: '4532 8920 1234 5678',
        cardHolder: 'CHEF GOURMET',
        expiry: '09/29',
        cvv: '888',
      });
    }
    customToast.info('Test Card Applied', 'Pre-filled with verified test credentials.');
  };

  return (
    <div className="space-y-6">
      {/* 1. VISUAL CARD PREVIEW */}
      <div className="relative w-full max-w-md mx-auto aspect-[1.586/1] rounded-3xl p-6 sm:p-7 text-white shadow-2xl overflow-hidden bg-gradient-to-tr from-slate-900 via-indigo-950 to-orange-950 border border-white/20 select-none">
        {/* Subtle decorative circles */}
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-orange-500/15 blur-2xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />

        <div className="relative h-full flex flex-col justify-between z-10">
          {/* Top row: Chip & Wireless icon, Network brand */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* EMV Chip */}
              <div className="w-11 h-8 rounded-lg bg-gradient-to-tr from-amber-200 via-yellow-400 to-amber-300 border border-amber-600/40 shadow-inner flex items-center justify-center">
                <div className="w-full h-full grid grid-cols-3 grid-rows-2 gap-0.5 p-1 opacity-70">
                  <div className="border-r border-b border-amber-700/50" />
                  <div className="border-b border-amber-700/50" />
                  <div className="border-l border-b border-amber-700/50" />
                  <div className="border-r border-amber-700/50" />
                  <div />
                  <div className="border-l border-amber-700/50" />
                </div>
              </div>
              <Wifi className="w-5 h-5 text-white/70 rotate-90" />
            </div>

            <span className="font-black text-sm sm:text-base tracking-wider uppercase px-2.5 py-0.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/10">
              {cardType}
            </span>
          </div>

          {/* Middle: Card Number */}
          <div className="my-auto pt-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-white/50 block mb-1">
              Card Number
            </span>
            <span className="font-mono text-lg sm:text-2xl font-bold tracking-widest text-white drop-shadow-sm">
              {cardData.cardNumber || '•••• •••• •••• 4242'}
            </span>
          </div>

          {/* Bottom row: Cardholder Name & Expiry */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-[9px] uppercase font-bold tracking-widest text-white/50 block">
                Card Holder
              </span>
              <span className="font-mono text-xs sm:text-sm font-bold tracking-wider uppercase text-white truncate max-w-[200px] block">
                {cardData.cardHolder || 'YOUR NAME'}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[9px] uppercase font-bold tracking-widest text-white/50 block">
                Expires
              </span>
              <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-white">
                {cardData.expiry || 'MM/YY'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CARD INPUT FORM CONTROLS */}
      <div className="p-5 sm:p-6 bg-slate-50/80 rounded-3xl border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Card Details (Encrypted)</span>
          </div>

          <button
            type="button"
            onClick={handleFillTestCard}
            className="text-xs font-extrabold text-orange-600 hover:text-orange-700 bg-orange-100/70 hover:bg-orange-100 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>Autofill Test Card</span>
          </button>
        </div>

        {/* Card Number */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Card Number
          </label>
          <div className="relative">
            <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={cardData.cardNumber}
              onChange={handleCardNumberChange}
              placeholder="4532 •••• •••• 5678"
              maxLength={19}
              className="w-full pl-10 pr-20 py-2.5 text-xs sm:text-sm font-mono font-bold rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 tracking-wider transition"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              {cardType}
            </span>
          </div>
        </div>

        {/* Cardholder Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Cardholder Name
          </label>
          <input
            type="text"
            value={cardData.cardHolder}
            onChange={(e) => onChange({ ...cardData, cardHolder: e.target.value.toUpperCase() })}
            placeholder="NAME AS PRINTED ON CARD"
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm uppercase font-bold rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 tracking-wide transition"
          />
        </div>

        {/* Expiry Date & CVV */}
        <div className="grid grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Expiration Date
            </label>
            <input
              type="text"
              value={cardData.expiry}
              onChange={handleExpiryChange}
              placeholder="MM/YY"
              maxLength={5}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-mono font-bold rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 tracking-wider text-center transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">CVV / CVC</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCvvTip(!showCvvTip)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  title="What is CVV?"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
                {showCvvTip && (
                  <div className="absolute right-0 bottom-full mb-1 w-44 p-2 bg-slate-900 text-white text-[10px] rounded-xl shadow-lg z-20 leading-tight">
                    3-digit security code on the back of your card.
                  </div>
                )}
              </div>
            </div>
            <input
              type="password"
              value={cardData.cvv}
              onChange={handleCvvChange}
              placeholder="•••"
              maxLength={4}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-mono font-bold rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 tracking-widest text-center transition"
            />
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/80 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Encrypted</span>
          </span>
          <span className="flex items-center gap-1 font-semibold text-slate-500">
            <Check className="w-3 h-3 text-emerald-500" />
            <span>PCI-DSS Level 1 Compliant</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardPaymentForm;
