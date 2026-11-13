import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  MapPin,
  Clock,
  Utensils,
  Copy,
  Check,
  CreditCard,
  Receipt,
  ClipboardList,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { formatCurrency } from '../utils/helpers';
import Button from '../components/common/Button';
import customToast from '../utils/customToast';

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const { getOrderById } = useOrder();
  const [copiedId, setCopiedId] = useState(false);
  const [copiedTxnId, setCopiedTxnId] = useState(false);

  const order = getOrderById(orderId);
  const txnId = order?.transactionId || `TXN-BR-${(order?.id || orderId || '').replace(/[^a-zA-Z0-9]/g, '').slice(-8)}`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCopyOrderId = () => {
    const idToCopy = order?.id || orderId;
    navigator.clipboard.writeText(idToCopy);
    setCopiedId(true);
    customToast.info('Order ID Copied 📋', `Reference #${idToCopy} copied to clipboard.`);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyTxnId = () => {
    navigator.clipboard.writeText(txnId);
    setCopiedTxnId(true);
    customToast.info('Transaction ID Copied 💳', `Transaction reference ${txnId} copied.`);
    setTimeout(() => setCopiedTxnId(false), 2000);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 sm:p-10 space-y-6">
        {/* Top Confirmation Banner */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Payment Successful • Order Confirmed</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
              Thank You for Your Order!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
              Your payment has been received and verified. The kitchen is hand-crafting your freshly prepared dishes right now!
            </p>
          </div>
        </div>

        {order ? (
          <div className="space-y-4">
            {/* Key Stats Banner: Order ID, Estimated Delivery Time, Total Paid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 rounded-2xl p-5 border border-slate-100">
              {/* Generated Order ID */}
              <div className="space-y-1">
                <span className="text-[10.5px] text-slate-400 uppercase tracking-wider block font-black">
                  Generated Order ID
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-sm font-black text-slate-900">
                    {order.id}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyOrderId}
                    className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-orange-600 transition cursor-pointer"
                    title="Copy Order ID"
                  >
                    {copiedId ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold block">
                  Status: {order.status || 'Confirmed'}
                </span>
              </div>

              {/* Estimated Delivery Time */}
              <div className="space-y-1">
                <span className="text-[10.5px] text-slate-400 uppercase tracking-wider block font-black">
                  Estimated Delivery Time
                </span>
                <div className="text-sm font-black text-orange-600 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>{order.estimatedDeliveryTime || '35-45 mins'}</span>
                </div>
                {order.estimatedArrivalTime && (
                  <span className="text-[11px] font-semibold text-slate-500 block">
                    Expected by ~{order.estimatedArrivalTime}
                  </span>
                )}
              </div>

              {/* Total Paid & Payment Method */}
              <div className="space-y-1 sm:text-right">
                <span className="text-[10.5px] text-slate-400 uppercase tracking-wider block font-black">
                  Total Paid
                </span>
                <span className="text-lg font-black text-slate-900 block">
                  {formatCurrency(order.financials?.total || 0)}
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 block truncate">
                  {order.paymentMethod}
                </span>
              </div>
            </div>

            {/* Payment & Transaction Info Card */}
            <div className="p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-extrabold text-slate-900 block">
                    Transaction Reference: <span className="font-mono text-emerald-800">{txnId}</span>
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Payment Gateway: 256-bit SSL Secure Auth • Capture Successful
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyTxnId}
                  className="px-3 py-1.5 bg-white rounded-xl border border-emerald-200 text-emerald-800 font-bold hover:bg-emerald-50 transition flex items-center gap-1 cursor-pointer"
                >
                  {copiedTxnId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTxnId ? 'Copied' : 'Copy Ref'}</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrintInvoice}
                  className="px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition flex items-center gap-1 cursor-pointer"
                  title="Print Tax Invoice"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>Invoice</span>
                </button>
              </div>
            </div>

            {/* Delivery Address & Delivery Speed Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl border border-slate-100 bg-white flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-black text-slate-900 block mb-0.5">
                    Delivering to: {order.shippingAddress?.title || order.shippingAddress?.label || 'Address'}
                  </span>
                  <p className="text-slate-600">
                    {order.shippingAddress?.street}
                  </p>
                  <p className="text-slate-500">
                    {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
                  </p>
                  <p className="text-slate-400 mt-1">{order.shippingAddress?.phone}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-100 bg-white flex items-start gap-2.5">
                <CreditCard className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-black text-slate-900 block mb-0.5">
                    Delivery & Payment Info
                  </span>
                  <p className="text-slate-600 font-semibold">{order.deliveryType === 'express' ? 'Priority Express Dispatch' : 'Standard Delivery'}</p>
                  <p className="text-slate-500">{order.paymentMethod}</p>
                  {order.specialInstructions && (
                    <p className="text-amber-700 italic mt-1 bg-amber-50 px-2 py-0.5 rounded-lg">
                      Note: &quot;{order.specialInstructions}&quot;
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Itemized Receipt Summary */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-200/70 pb-2">
                <Receipt className="w-3.5 h-3.5 text-orange-500" />
                <span>Order Summary ({order.items?.length || 0} items)</span>
              </div>

              <div className="space-y-2 text-xs">
                {order.items?.map((ci, idx) => (
                  <div key={idx} className="flex justify-between text-slate-700">
                    <span className="font-medium">
                      <span className="font-extrabold text-slate-900">{ci.quantity}x</span> {ci.item.name}
                    </span>
                    <span className="font-bold text-slate-900">
                      {formatCurrency(ci.item.price * ci.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2.5 border-t border-slate-200/70 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Items Subtotal</span>
                  <span className="font-bold text-slate-700">
                    {formatCurrency(order.financials?.subtotal || 0)}
                  </span>
                </div>

                {order.financials?.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Promo Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
                    <span>-{formatCurrency(order.financials.discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-500">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-slate-700">
                    {order.financials?.deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-black">FREE</span>
                    ) : (
                      formatCurrency(order.financials?.deliveryFee || 0)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-slate-500">
                  <span>Sales Tax (8%)</span>
                  <span className="font-bold text-slate-700">
                    {formatCurrency(order.financials?.tax || 0)}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-sm font-black text-slate-900">
                  <span>Total Amount Paid</span>
                  <span className="text-lg text-orange-600">
                    {formatCurrency(order.financials?.total || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-500 text-center">
            Order Reference: <span className="font-mono font-bold text-slate-800">{orderId}</span>
          </div>
        )}

        {/* Action Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to={`/orders/${orderId}`} className="w-full sm:w-auto">
            <Button variant="primary" size="lg" icon={Package} className="w-full shadow-md shadow-orange-500/20">
              Track Order Live
            </Button>
          </Link>
          <Link to="/orders" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" icon={ClipboardList} className="w-full">
              Order History
            </Button>
          </Link>
          <Link to="/menu" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" icon={Utensils} className="w-full">
              Explore Menu
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
