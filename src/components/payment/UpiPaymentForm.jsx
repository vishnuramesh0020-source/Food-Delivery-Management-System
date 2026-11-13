import React, { useState, useEffect } from 'react';
import {
  QrCode,
  Smartphone,
  AtSign,
  CheckCircle2,
  Clock,
  RefreshCw,
} from 'lucide-react';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/helpers';
import customToast from '../../utils/customToast';

const UPI_APPS = [
  { id: 'gpay', name: 'Google Pay', icon: '🌐', color: 'from-blue-500 to-indigo-600', vpaSuffix: '@okaxis' },
  { id: 'phonepe', name: 'PhonePe', icon: '🟣', color: 'from-purple-600 to-indigo-700', vpaSuffix: '@ybl' },
  { id: 'paytm', name: 'Paytm UPI', icon: '🔷', color: 'from-sky-500 to-blue-600', vpaSuffix: '@paytm' },
  { id: 'bhim', name: 'BHIM UPI', icon: '🇮🇳', color: 'from-emerald-600 to-teal-700', vpaSuffix: '@upi' },
  { id: 'cred', name: 'CRED UPI', icon: '🖤', color: 'from-slate-800 to-black', vpaSuffix: '@cred' },
];

const UpiPaymentForm = ({
  upiData,
  onChange,
  totalAmount = 0,
}) => {
  const [activeTab, setActiveTab] = useState('qr'); // 'qr', 'apps', 'vpa'
  const [secondsRemaining, setSecondsRemaining] = useState(300);
  const [isVerifyingVpa, setIsVerifyingVpa] = useState(false);
  const [isVpaVerified, setIsVpaVerified] = useState(false);

  // Countdown timer for QR code
  useEffect(() => {
    if (activeTab !== 'qr') return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleSelectApp = (app) => {
    onChange({
      ...upiData,
      selectedApp: app.id,
      vpa: `user${app.vpaSuffix}`,
      methodType: 'app',
    });
    customToast.info(app.name + ' Selected', `Ready to pay ${formatCurrency(totalAmount)} via ${app.name}.`);
  };

  const handleVerifyVpa = () => {
    if (!upiData.vpa || !upiData.vpa.includes('@')) {
      customToast.error('Invalid UPI ID', 'Please enter a valid UPI ID (e.g. yourname@okhdfcbank)');
      return;
    }
    setIsVerifyingVpa(true);
    setTimeout(() => {
      setIsVerifyingVpa(false);
      setIsVpaVerified(true);
      customToast.success('UPI ID Verified', `Verified account linked to "${upiData.vpa}"`);
    }, 600);
  };

  const handleRefreshQr = () => {
    setSecondsRemaining(300);
    customToast.info('QR Code Refreshed', 'New UPI payment session started.');
  };

  return (
    <div className="space-y-5">
      {/* 1. UPI MODE SWITCHER TABS */}
      <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl">
        <button
          type="button"
          onClick={() => {
            setActiveTab('qr');
            onChange({ ...upiData, methodType: 'qr' });
          }}
          className={`py-2 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'qr'
              ? 'bg-white text-orange-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Scan QR Code</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('apps');
            onChange({ ...upiData, methodType: 'app' });
          }}
          className={`py-2 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'apps'
              ? 'bg-white text-orange-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>UPI Apps</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('vpa');
            onChange({ ...upiData, methodType: 'vpa' });
          }}
          className={`py-2 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'vpa'
              ? 'bg-white text-orange-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <AtSign className="w-3.5 h-3.5" />
          <span>UPI ID / VPA</span>
        </button>
      </div>

      {/* 2. MODE CONTENT */}
      {/* OPTION A: SCAN QR CODE */}
      {activeTab === 'qr' && (
        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200/80 text-center space-y-4">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-orange-600 bg-orange-100 px-3 py-1 rounded-full inline-block">
              Dynamic UPI QR Code
            </span>
            <h4 className="text-base font-black text-slate-900">
              Scan with Any UPI App
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Open Google Pay, PhonePe, Paytm, or BHIM and scan the QR code to complete payment of{' '}
              <strong className="text-slate-900">{formatCurrency(totalAmount)}</strong>.
            </p>
          </div>

          {/* Realistic Dynamic QR Graphic */}
          <div className="relative inline-block p-4 bg-white rounded-3xl shadow-lg border-2 border-slate-900/5">
            <svg
              className="w-48 h-48 sm:w-56 sm:h-56 mx-auto text-slate-900"
              viewBox="0 0 200 200"
              fill="currentColor"
            >
              {/* Corner position markers */}
              {/* Top-left */}
              <rect x="10" y="10" width="50" height="50" rx="10" fill="#0f172a" />
              <rect x="20" y="20" width="30" height="30" rx="6" fill="#ffffff" />
              <rect x="28" y="28" width="14" height="14" rx="3" fill="#ea580c" />

              {/* Top-right */}
              <rect x="140" y="10" width="50" height="50" rx="10" fill="#0f172a" />
              <rect x="150" y="20" width="30" height="30" rx="6" fill="#ffffff" />
              <rect x="158" y="28" width="14" height="14" rx="3" fill="#ea580c" />

              {/* Bottom-left */}
              <rect x="10" y="140" width="50" height="50" rx="10" fill="#0f172a" />
              <rect x="20" y="150" width="30" height="30" rx="6" fill="#ffffff" />
              <rect x="28" y="158" width="14" height="14" rx="3" fill="#ea580c" />

              {/* Data matrix dots */}
              <rect x="70" y="15" width="12" height="12" rx="2" fill="#0f172a" />
              <rect x="90" y="15" width="12" height="12" rx="2" fill="#0f172a" />
              <rect x="115" y="15" width="12" height="12" rx="2" fill="#0f172a" />
              <rect x="70" y="35" width="12" height="12" rx="2" fill="#0f172a" />
              <rect x="110" y="35" width="18" height="12" rx="2" fill="#0f172a" />

              <rect x="15" y="70" width="12" height="12" rx="2" fill="#0f172a" />
              <rect x="35" y="70" width="12" height="12" rx="2" fill="#0f172a" />
              <rect x="55" y="70" width="12" height="12" rx="2" fill="#0f172a" />
              <rect x="75" y="70" width="12" height="12" rx="2" fill="#0f172a" />
              <rect x="95" y="70" width="12" height="12" rx="2" fill="#0f172a" />
              <rect x="115" y="70" width="12" height="12" rx="2" fill="#0f172a" />
              <rect x="135" y="70" width="12" height="12" rx="2" fill="#0f172a" />
              <rect x="155" y="70" width="12" height="12" rx="2" fill="#0f172a" />
              <rect x="175" y="70" width="12" height="12" rx="2" fill="#0f172a" />

              <rect x="15" y="90" width="12" height="12" rx="2" fill="#0f172a" />
              <rect x="40" y="90" width="20" height="12" rx="2" fill="#0f172a" />
              <rect x="140" y="90" width="20" height="12" rx="2" fill="#0f172a" />
              <rect x="170" y="90" width="16" height="12" rx="2" fill="#0f172a" />

              <rect x="15" y="115" width="12" height="12" rx="2" fill="#0f172a" />
              <rect x="35" y="115" width="12" height="12" rx="2" fill="#0f172a" />
              <rect x="70" y="115" width="15" height="12" rx="2" fill="#0f172a" />
              <rect x="95" y="115" width="12" height="12" rx="2" fill="#0f172a" />
              <rect x="115" y="115" width="25" height="12" rx="2" fill="#0f172a" />
              <rect x="150" y="115" width="15" height="12" rx="2" fill="#0f172a" />
              <rect x="175" y="115" width="12" height="12" rx="2" fill="#0f172a" />

              <rect x="70" y="140" width="12" height="12" rx="2" fill="#0f172a" />
              <rect x="90" y="140" width="18" height="12" rx="2" fill="#0f172a" />
              <rect x="120" y="140" width="20" height="12" rx="2" fill="#0f172a" />
              <rect x="150" y="140" width="15" height="12" rx="2" fill="#0f172a" />
              <rect x="175" y="140" width="12" height="12" rx="2" fill="#0f172a" />

              <rect x="70" y="165" width="25" height="15" rx="2" fill="#0f172a" />
              <rect x="105" y="165" width="15" height="15" rx="2" fill="#0f172a" />
              <rect x="130" y="165" width="30" height="15" rx="2" fill="#0f172a" />
              <rect x="170" y="165" width="15" height="15" rx="2" fill="#0f172a" />

              {/* Center Logo Badge */}
              <rect x="80" y="80" width="40" height="40" rx="10" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
              <circle cx="100" cy="100" r="14" fill="#ea580c" />
              <text
                x="100"
                y="105"
                fontSize="14"
                fontWeight="900"
                fill="#ffffff"
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                ₹
              </text>
            </svg>

            {/* Amount pill over QR */}
            <div className="mt-3 bg-slate-900 text-white text-xs font-black py-1.5 px-4 rounded-xl inline-flex items-center gap-1.5 shadow-sm">
              <span>Pay:</span>
              <span className="text-orange-400 font-mono text-sm">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          {/* Expiration Timer & Refresh */}
          <div className="flex items-center justify-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
              <Clock className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
              <span>QR Expires in:</span>
              <strong className="text-orange-600 font-mono">{timeFormatted}</strong>
            </span>

            <button
              type="button"
              onClick={handleRefreshQr}
              className="p-1.5 text-slate-500 hover:text-orange-600 rounded-xl hover:bg-white transition cursor-pointer"
              title="Refresh QR code"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* OPTION B: INSTANT UPI APPS */}
      {activeTab === 'apps' && (
        <div className="p-5 sm:p-6 bg-slate-50 rounded-3xl border border-slate-200/80 space-y-4">
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">Choose Installed UPI App</h4>
            <p className="text-xs text-slate-500">Tap your favorite app to initiate instant 1-click checkout</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {UPI_APPS.map((app) => {
              const isSelected = upiData.selectedApp === app.id;
              return (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => handleSelectApp(app)}
                  className={`p-3.5 rounded-2xl border-2 flex items-center justify-between transition cursor-pointer ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50/50 ring-1 ring-orange-500 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{app.icon}</span>
                    <div className="text-left">
                      <span className="font-extrabold text-sm text-slate-900 block">
                        {app.name}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Fast UPI intent
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-xs">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {upiData.selectedApp && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Selected: <strong>{UPI_APPS.find((a) => a.id === upiData.selectedApp)?.name}</strong>.
                When you click Place Order, you will be redirected to complete the payment.
              </span>
            </div>
          )}
        </div>
      )}

      {/* OPTION C: VPA / UPI ID */}
      {activeTab === 'vpa' && (
        <div className="p-5 sm:p-6 bg-slate-50 rounded-3xl border border-slate-200/80 space-y-4">
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">Enter UPI ID / VPA</h4>
            <p className="text-xs text-slate-500">
              A payment collect request will be sent to your UPI application
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">Virtual Payment Address (VPA)</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <AtSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={upiData.vpa}
                  onChange={(e) => {
                    onChange({ ...upiData, vpa: e.target.value.toLowerCase(), methodType: 'vpa' });
                    setIsVpaVerified(false);
                  }}
                  placeholder="e.g. mobile@upi or username@okhdfcbank"
                  className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm font-mono font-bold rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
                />
              </div>
              <Button
                type="button"
                variant={isVpaVerified ? 'secondary' : 'primary'}
                size="md"
                onClick={handleVerifyVpa}
                isLoading={isVerifyingVpa}
              >
                {isVpaVerified ? 'Verified' : 'Verify'}
              </Button>
            </div>
          </div>

          {isVpaVerified && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-800">
              <span className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verified Account: {upiData.vpa}</span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Active VPA
              </span>
            </div>
          )}

          {/* Quick preset VPAs for testing */}
          <div className="pt-2 border-t border-slate-200/80">
            <span className="text-[11px] text-slate-400 font-semibold block mb-1.5">
              Quick Test Handles:
            </span>
            <div className="flex flex-wrap gap-2">
              {['foodie@okaxis', 'chef@paytm', 'bite@ybl'].map((testVpa) => (
                <button
                  key={testVpa}
                  type="button"
                  onClick={() => {
                    onChange({ ...upiData, vpa: testVpa, methodType: 'vpa' });
                    setIsVpaVerified(true);
                  }}
                  className="text-xs font-mono font-bold text-orange-600 hover:text-orange-700 bg-white hover:bg-orange-50 px-2.5 py-1 rounded-xl border border-slate-200 transition cursor-pointer"
                >
                  +{testVpa}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpiPaymentForm;
