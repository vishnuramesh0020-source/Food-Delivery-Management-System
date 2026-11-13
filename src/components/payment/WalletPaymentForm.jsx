import React, { useState } from 'react';
import {
  Wallet,
  CheckCircle2,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import customToast from '../../utils/customToast';

const WALLETS = [
  {
    id: 'biterush',
    name: 'BiteRush Cash Wallet',
    tagline: 'Instant 1-Click Pay & Cashback',
    defaultBalance: 650,
    icon: '🍔',
    isPrimary: true,
  },
  {
    id: 'paytm',
    name: 'Paytm Wallet',
    tagline: 'Linked via Registered Mobile',
    defaultBalance: 1200,
    icon: '🔷',
    isPrimary: false,
  },
  {
    id: 'phonepe',
    name: 'PhonePe Wallet',
    tagline: 'Instant UPI Wallet Checkout',
    defaultBalance: 850,
    icon: '🟣',
    isPrimary: false,
  },
  {
    id: 'amazonpay',
    name: 'Amazon Pay Balance',
    tagline: 'Fast & Secure Amazon Balance',
    defaultBalance: 1500,
    icon: '📦',
    isPrimary: false,
  },
];

const STORAGE_KEY_WALLET_BALANCE = 'biterush_wallet_balance';

const WalletPaymentForm = ({
  walletData,
  onChange,
  totalAmount = 0,
}) => {
  const [biteRushBalance, setBiteRushBalance] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WALLET_BALANCE);
      return saved ? Number(saved) : 650;
    } catch {
      return 650;
    }
  });

  const selectedWalletId = walletData.selectedWallet || 'biterush';
  const selectedWallet = WALLETS.find((w) => w.id === selectedWalletId) || WALLETS[0];

  const currentBalance =
    selectedWallet.id === 'biterush' ? biteRushBalance : selectedWallet.defaultBalance;
  const isSufficient = currentBalance >= totalAmount;
  const deficit = Math.max(0, totalAmount - currentBalance);

  const handleSelectWallet = (wallet) => {
    onChange({
      ...walletData,
      selectedWallet: wallet.id,
      walletName: wallet.name,
    });
    customToast.info(wallet.name, 'Active payment wallet selected.');
  };

  const handleTopUpBiteRush = (amountToAdd) => {
    const newBal = Number((biteRushBalance + amountToAdd).toFixed(2));
    setBiteRushBalance(newBal);
    try {
      localStorage.setItem(STORAGE_KEY_WALLET_BALANCE, String(newBal));
    } catch (e) {
      console.error(e);
    }
    customToast.success(
      'Wallet Recharged',
      `Added ${formatCurrency(amountToAdd)}! New balance: ${formatCurrency(newBal)}.`
    );
  };

  return (
    <div className="space-y-5">
      {/* 1. WALLETS LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {WALLETS.map((w) => {
          const isSelected = selectedWalletId === w.id;
          const balance = w.id === 'biterush' ? biteRushBalance : w.defaultBalance;
          const hasEnough = balance >= totalAmount;

          return (
            <button
              key={w.id}
              type="button"
              onClick={() => handleSelectWallet(w)}
              className={`p-4 rounded-3xl border-2 text-left transition cursor-pointer relative flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'border-orange-500 bg-orange-50/40 ring-1 ring-orange-500 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{w.icon}</span>
                  <div>
                    <span className="font-extrabold text-sm text-slate-900 block leading-tight">
                      {w.name}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">{w.tagline}</span>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              {/* Balance Bar */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold">Available Balance:</span>
                <span
                  className={`font-black font-mono ${
                    hasEnough ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                >
                  {formatCurrency(balance)}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 2. SELECTED WALLET DETAILS & TOP-UP CONTROLS */}
      <div className="p-5 sm:p-6 bg-slate-50 rounded-3xl border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-orange-600" />
            <h4 className="font-extrabold text-slate-900 text-sm">
              {selectedWallet.name}
            </h4>
          </div>

          <span
            className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
              isSufficient
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {isSufficient ? 'Sufficient Balance' : 'Low Balance'}
          </span>
        </div>

        {/* Balance Status Card */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Current Wallet Balance
            </span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
              {formatCurrency(currentBalance)}
            </span>
          </div>

          <div className="sm:text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Order Payable
            </span>
            <span className="text-base sm:text-lg font-black text-orange-600 font-mono">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>

        {/* Sufficient Confirmation */}
        {isSufficient ? (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Your balance covers the total order amount. Order will be confirmed with <strong>1-Click Instant Payment</strong>.
            </span>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800">
              <span className="font-bold block">
                Shortfall of {formatCurrency(deficit)}
              </span>
              <span>
                Please top up your wallet balance below to complete your order without leaving checkout.
              </span>
            </div>

            {/* Top-up buttons (available for BiteRush wallet) */}
            {selectedWallet.id === 'biterush' && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">
                  Quick Recharge Options:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[100, 200, 500, Math.ceil(deficit)].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleTopUpBiteRush(amt)}
                      className="px-3.5 py-2 rounded-xl border border-orange-200 bg-white hover:bg-orange-50 text-orange-700 font-extrabold text-xs transition flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5 text-orange-600" />
                      <span>{formatCurrency(amt)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Zero processing fees on all digital wallet transactions</span>
        </div>
      </div>
    </div>
  );
};

export default WalletPaymentForm;
