import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Truck,
  ChefHat,
  PackageCheck,
  FastForward,
  Star,
  XCircle,
  Copy,
  Check,
  RotateCcw,
  Receipt,
  CreditCard,
  AlertCircle,
} from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/helpers';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import customToast from '../utils/customToast';

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrderById, advanceOrderStatus, setOrderStatus, cancelOrder } = useOrder();
  const { addToCart } = useCart();

  const [copiedId, setCopiedId] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const order = getOrderById(orderId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-10 space-y-4">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto text-2xl">
            🔍
          </div>
          <h2 className="text-2xl font-black text-slate-800">Order Not Found</h2>
          <p className="text-sm text-slate-500">
            Could not locate any order matching reference ID: <span className="font-mono font-bold text-slate-700">{orderId}</span>
          </p>
          <Button variant="primary" onClick={() => navigate('/orders')}>
            Back to My Orders
          </Button>
        </div>
      </div>
    );
  }

  const isCancelled = order.status === 'Cancelled';
  const isDelivered = order.status === 'Delivered';

  const steps = [
    {
      id: 'Confirmed',
      label: 'Confirmed',
      description: 'Restaurant accepted order',
      icon: CheckCircle2,
    },
    {
      id: 'Preparing',
      label: 'Preparing',
      description: 'Chefs are cooking fresh food',
      icon: ChefHat,
    },
    {
      id: 'Out for Delivery',
      label: 'Out for Delivery',
      description: 'Rider is on the way to you',
      icon: Truck,
    },
    {
      id: 'Delivered',
      label: 'Delivered',
      description: 'Safely delivered to doorstep',
      icon: PackageCheck,
    },
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'Confirmed':
        return 0;
      case 'Preparing':
        return 1;
      case 'Out for Delivery':
        return 2;
      case 'Delivered':
        return 3;
      default:
        return 0;
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Delivered':
        return 'success';
      case 'Out for Delivery':
        return 'primary';
      case 'Preparing':
        return 'warning';
      case 'Confirmed':
        return 'accent';
      case 'Cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  const formatTimestamp = (isoStr) => {
    if (!isoStr) return null;
    try {
      return new Date(isoStr).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return null;
    }
  };

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.id);
    setCopiedId(true);
    customToast.info('Order ID Copied 📋', `Reference #${order.id} copied to clipboard.`);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleConfirmCancel = () => {
    cancelOrder(order.id);
    setIsCancelModalOpen(false);
  };

  const handleReorderAll = () => {
    order.items?.forEach((entry) => {
      addToCart(entry.item, entry.quantity);
    });
    customToast.success(
      'Items Added to Cart 🛒',
      `All ${order.items?.length || 0} dishes from #${order.id} added to your cart.`
    );
  };

  const currentStepIdx = getStepIndex(order.status);
  const trackingStatuses = ['Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. TOP BAR: ORDER ID, STATUS BADGE & CONTROLS */}
      <div className="flex flex-wrap items-start justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
        <div>
          <Link
            to="/orders"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-600 transition mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Orders</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
              #{order.id}
            </h1>
            <button
              type="button"
              onClick={handleCopyOrderId}
              className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-orange-600 border border-slate-200/70 transition cursor-pointer"
              title="Copy Order ID"
            >
              {copiedId ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
            <Badge variant={getStatusBadgeVariant(order.status)} size="sm" dot>
              {order.status}
            </Badge>
          </div>

          <p className="text-xs text-slate-400 mt-1.5">
            Placed on{' '}
            <span className="font-semibold text-slate-600">
              {new Date(order.createdAt).toLocaleDateString()} at{' '}
              {formatTimestamp(order.createdAt)}
            </span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {!isDelivered && !isCancelled && (
            <>
              <button
                type="button"
                onClick={() => advanceOrderStatus(order.id)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition border border-indigo-200 shadow-xs cursor-pointer"
              >
                <FastForward className="w-4 h-4 text-indigo-600" />
                <span>Next Tracking Step</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCancelModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition border border-rose-200 shadow-xs cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>Cancel Order</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={handleReorderAll}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reorder Items</span>
          </button>
        </div>
      </div>

      {/* 2. ESTIMATED DELIVERY TIME & STATUS HIGHLIGHT BANNER */}
      <div
        className={`rounded-3xl border p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs ${
          isCancelled
            ? 'bg-rose-50 border-rose-200 text-rose-900'
            : isDelivered
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 text-slate-900'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
              isCancelled
                ? 'bg-rose-100 text-rose-600'
                : isDelivered
                ? 'bg-emerald-100 text-emerald-600'
                : 'bg-orange-500 text-white'
            }`}
          >
            {isCancelled ? (
              <XCircle className="w-6 h-6" />
            ) : isDelivered ? (
              <PackageCheck className="w-6 h-6" />
            ) : (
              <Clock className="w-6 h-6" />
            )}
          </div>
          <div>
            <span className="text-[10.5px] font-black uppercase tracking-wider opacity-75 block">
              Estimated Delivery Time
            </span>
            <h2 className="text-lg sm:text-xl font-black">
              {order.estimatedDeliveryTime || '25-35 mins'}
              {!isCancelled && !isDelivered && order.estimatedArrivalTime && (
                <span className="text-sm font-bold opacity-80 ml-2">
                  (Expected by ~{order.estimatedArrivalTime})
                </span>
              )}
            </h2>
          </div>
        </div>

        <div className="text-xs font-bold sm:text-right">
          <span className="block opacity-75 uppercase tracking-wider text-[10px]">
            Delivery Tier
          </span>
          <span className="text-sm font-extrabold">{order.deliveryType}</span>
        </div>
      </div>

      {/* 3. ORDER TRACKING TIMELINE */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-xs space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            <span>Order Tracking Timeline</span>
          </h3>

          {/* Interactive Status Switcher for Preparing / Out for Delivery / Delivered / Cancelled */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/70">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2">
              Status:
            </span>
            {trackingStatuses.map((statusOption) => {
              const isSelected = order.status === statusOption;
              return (
                <button
                  key={statusOption}
                  type="button"
                  onClick={() => {
                    if (statusOption === 'Cancelled') {
                      setIsCancelModalOpen(true);
                    } else {
                      setOrderStatus(order.id, statusOption);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                    isSelected
                      ? statusOption === 'Cancelled'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : statusOption === 'Delivered'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-orange-500 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-white hover:text-slate-900'
                  }`}
                >
                  {statusOption}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cancelled Timeline View vs Active 4-Stage Timeline */}
        {isCancelled ? (
          <div className="p-6 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-500/20">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-black text-rose-900">Order Cancelled</h4>
                  <p className="text-xs text-rose-700 mt-0.5">
                    This order was cancelled and will not be dispatched. If prepaid, an automatic refund has been initiated.
                  </p>
                </div>
              </div>

              {(order.cancelledAt || order.statusHistory?.Cancelled) && (
                <span className="text-xs font-bold bg-white text-rose-700 border border-rose-200 px-3 py-1.5 rounded-xl shrink-0">
                  Cancelled at {formatTimestamp(order.cancelledAt || order.statusHistory?.Cancelled)}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-rose-200/70">
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <span className="font-bold text-slate-800 block">Order Placed</span>
                  <span>{formatTimestamp(order.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-rose-700">
                <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                <div>
                  <span className="font-bold block">Order Cancelled</span>
                  <span>
                    {formatTimestamp(order.cancelledAt || order.statusHistory?.Cancelled) || 'Cancelled'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative pt-2">
            {/* Desktop Horizontal Track Line */}
            <div className="hidden sm:block absolute top-8 left-12 right-12 h-1.5 bg-slate-100 rounded-full z-0">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isDelivered ? 'bg-emerald-500' : 'bg-orange-500'
                }`}
                style={{
                  width: `${(currentStepIdx / (steps.length - 1)) * 100}%`,
                }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-2 relative z-10">
              {steps.map((st, i) => {
                const isPast = i < currentStepIdx;
                const isCurrent = i === currentStepIdx;
                const StepIcon = st.icon;
                const stageTimestamp =
                  order.statusHistory?.[st.id] || (i === 0 ? order.createdAt : null);

                return (
                  <div
                    key={st.id}
                    className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-3"
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm shrink-0 ${
                        isPast || (isDelivered && isCurrent)
                          ? 'bg-emerald-500 text-white'
                          : isCurrent
                          ? 'bg-orange-500 text-white ring-4 ring-orange-100 scale-110'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      <StepIcon className="w-6 h-6" />
                    </div>

                    <div className="sm:space-y-1">
                      <h4
                        className={`text-sm font-extrabold ${
                          isCurrent && !isDelivered
                            ? 'text-orange-600'
                            : isPast || isDelivered
                            ? 'text-slate-900'
                            : 'text-slate-400'
                        }`}
                      >
                        {st.label}
                      </h4>
                      <p className="text-xs text-slate-400 max-w-40 sm:mx-auto">
                        {st.description}
                      </p>
                      {stageTimestamp && (isPast || isCurrent) && (
                        <span className="inline-block text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full mt-1">
                          {formatTimestamp(stageTimestamp)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 4. ORDER DETAILS: COURIER, SHIPPING ADDRESS & ITEMS BREAKDOWN */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Delivery Partner & Shipping Address */}
        <div className="md:col-span-5 space-y-6">
          {/* Delivery Partner */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Delivery Partner Assigned
            </h3>

            {isCancelled ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-500">
                Delivery partner unassigned because this order was cancelled.
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-xl font-black shrink-0">
                    {order.deliveryPartner?.name?.[0] || 'D'}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-slate-900 text-base truncate">
                      {order.deliveryPartner?.name || 'Carlos Mendoza'}
                    </h4>
                    <p className="text-xs text-slate-500 truncate">
                      {order.deliveryPartner?.vehicle || 'Yamaha Scooter (7BR-402)'}
                    </p>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{order.deliveryPartner?.rating || 4.9} Partner Rating</span>
                    </div>
                  </div>
                </div>

                <a
                  href={`tel:${order.deliveryPartner?.phone || '+15552345678'}`}
                  className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-2xl transition shadow-xs shrink-0"
                  title="Call Delivery Driver"
                >
                  <Phone className="w-5 h-5" />
                </a>
              </div>
            )}
          </div>

          {/* Delivery Destination */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Delivery Destination & Notes
            </h3>
            <div className="flex items-start gap-3 text-xs">
              <MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-black text-slate-900 text-sm block">
                  {order.shippingAddress?.title || order.shippingAddress?.label || 'Delivery'} Address
                </span>
                <p className="text-slate-600 mt-0.5 font-medium">
                  {order.shippingAddress?.street}
                </p>
                <p className="text-slate-500">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
                  {order.shippingAddress?.zipCode}
                </p>
                <p className="text-slate-400 mt-1">
                  Contact: {order.shippingAddress?.phone}
                </p>
              </div>
            </div>

            {order.specialInstructions && (
              <div className="p-3 bg-amber-50/70 rounded-xl text-xs text-amber-900 border border-amber-200/70">
                <span className="font-bold block text-amber-950 mb-0.5">
                  Delivery Instructions:
                </span>
                &quot;{order.specialInstructions}&quot;
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Details & Payment Summary */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-orange-500" />
              <span>Order Details ({order.items?.length || 0} dishes)</span>
            </h3>
            <span className="text-xs font-semibold text-slate-400">
              {order.customerName}
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
            {order.items?.map((ci, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <Link to={`/food/${ci.item.id}`} className="shrink-0">
                    <img
                      src={ci.item.image}
                      alt={ci.item.name}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200/60"
                    />
                  </Link>
                  <div className="min-w-0">
                    <Link
                      to={`/food/${ci.item.id}`}
                      className="font-bold text-slate-900 hover:text-orange-600 transition block truncate max-w-52 sm:max-w-xs"
                    >
                      {ci.item.name}
                    </Link>
                    <span className="text-slate-400 block">
                      Qty: <strong className="text-slate-700">{ci.quantity}</strong> ×{' '}
                      {formatCurrency(ci.item.price)}
                    </span>
                    {ci.instructions && (
                      <span className="text-[10px] text-amber-700 italic block truncate">
                        &quot;{ci.instructions}&quot;
                      </span>
                    )}
                  </div>
                </div>
                <span className="font-black text-slate-900 shrink-0">
                  {formatCurrency(ci.item.price * ci.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Items Subtotal</span>
              <span className="font-bold text-slate-800">
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
              <span className="font-bold text-slate-800">
                {order.financials?.deliveryFee === 0 ? (
                  <span className="text-emerald-600 font-black">FREE</span>
                ) : (
                  formatCurrency(order.financials?.deliveryFee || 0)
                )}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Sales Tax (8%)</span>
              <span className="font-bold text-slate-800">
                {formatCurrency(order.financials?.tax || 0)}
              </span>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-slate-900">
              <span className="font-black text-sm">
                {isCancelled ? 'Total Refundable' : 'Total Paid'}
              </span>
              <span className="text-2xl font-black text-orange-600">
                {formatCurrency(order.financials?.total || 0)}
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl text-xs text-slate-500 space-y-1.5 border border-slate-100">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                Payment Method:
              </span>
              <span className="font-bold text-slate-700">{order.paymentMethod}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-slate-400" />
                Delivery Tier:
              </span>
              <span className="font-bold text-slate-700">{order.deliveryType}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. CANCEL ORDER CONFIRMATION MODAL */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title={`Cancel Order #${order.id}`}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Are you sure you want to cancel order <span className="font-mono font-bold">#{order.id}</span>? Once cancelled, the kitchen will halt preparation and delivery will be cancelled.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsCancelModalOpen(false)}
            >
              Keep Order
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleConfirmCancel}
              icon={XCircle}
            >
              Yes, Cancel Order
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrderTrackingPage;
