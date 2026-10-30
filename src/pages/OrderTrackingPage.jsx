import React, { useEffect } from 'react';
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
} from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { formatCurrency } from '../utils/helpers';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrderById, advanceOrderStatus } = useOrder();

  const order = getOrderById(orderId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Order Not Found</h2>
        <p className="text-slate-500 mb-6">Could not locate order ID: {orderId}</p>
        <Button variant="primary" onClick={() => navigate('/orders')}>
          Back to Orders
        </Button>
      </div>
    );
  }

  const steps = [
    {
      id: 'Confirmed',
      label: 'Order Confirmed',
      description: 'Restaurant accepted your order',
      icon: CheckCircle2,
    },
    {
      id: 'Preparing',
      label: 'Preparing in Kitchen',
      description: 'Chefs are cooking fresh ingredients',
      icon: ChefHat,
    },
    {
      id: 'Out for Delivery',
      label: 'Out for Delivery',
      description: 'Courier partner picked up your order',
      icon: Truck,
    },
    {
      id: 'Delivered',
      label: 'Delivered',
      description: 'Order safely delivered to your address',
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

  const currentStepIdx = getStepIndex(order.status);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            to="/orders"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-600 transition mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Orders
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Order #{order.id}
            </h1>
            <Badge variant="primary" size="sm">
              {order.status}
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Estimated arrival:{' '}
            <span className="font-extrabold text-orange-600">
              {order.estimatedDeliveryTime}
            </span>
          </p>
        </div>

        {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
          <button
            type="button"
            onClick={() => advanceOrderStatus(order.id)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition border border-indigo-200 shadow-xs cursor-pointer"
          >
            <FastForward className="w-4 h-4 text-indigo-600" />
            <span>Simulate Next Delivery Step</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-xs">
        <h3 className="text-base font-extrabold text-slate-900 mb-8 flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-500" />
          <span>Live Tracking Timeline</span>
        </h3>

        <div className="relative">
          <div className="hidden sm:block absolute top-6 left-12 right-12 h-1 bg-slate-100 z-0">
            <div
              className="h-full bg-orange-500 transition-all duration-700"
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

              return (
                <div
                  key={st.id}
                  className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-3"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${
                      isPast
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
                        isCurrent
                          ? 'text-orange-600'
                          : isPast
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {st.label}
                    </h4>
                    <p className="text-xs text-slate-400 max-w-40 sm:mx-auto">
                      {st.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Delivery Partner Assigned
            </h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-xl font-bold">
                  {order.deliveryPartner?.name?.[0] || 'D'}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">
                    {order.deliveryPartner?.name || 'Carlos Mendoza'}
                  </h4>
                  <p className="text-xs text-slate-500">
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
                className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-2xl transition shadow-xs"
                title="Call Delivery Driver"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Delivery Destination
            </h3>
            <div className="flex items-start gap-3 text-xs">
              <MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-black text-slate-900 text-sm block">
                  {order.shippingAddress?.title} Address
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
              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100">
                <span className="font-bold block text-slate-700">Special Instructions:</span>
                &quot;{order.specialInstructions}&quot;
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-6 bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
            Items & Payment Summary
          </h3>

          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
            {order.items?.map((ci, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={ci.item.image}
                    alt={ci.item.name}
                    className="w-10 h-10 rounded-xl object-cover bg-slate-100"
                  />
                  <div>
                    <span className="font-bold text-slate-800 block truncate max-w-48">
                      {ci.item.name}
                    </span>
                    <span className="text-slate-400">Qty: {ci.quantity}</span>
                  </div>
                </div>
                <span className="font-black text-slate-900">
                  {formatCurrency(ci.item.price * ci.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className="font-bold text-slate-800">
                {formatCurrency(order.financials?.subtotal || 0)}
              </span>
            </div>
            {order.financials?.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount</span>
                <span>-{formatCurrency(order.financials.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500">
              <span>Delivery Fee</span>
              <span className="font-bold text-slate-800">
                {order.financials?.deliveryFee === 0
                  ? 'FREE'
                  : formatCurrency(order.financials?.deliveryFee || 0)}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Tax</span>
              <span className="font-bold text-slate-800">
                {formatCurrency(order.financials?.tax || 0)}
              </span>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-slate-900">
              <span className="font-black text-sm">Total Paid</span>
              <span className="text-xl font-black">
                {formatCurrency(order.financials?.total || 0)}
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl text-[11px] text-slate-500 space-y-1">
            <div className="flex justify-between">
              <span>Payment:</span>
              <span className="font-bold text-slate-700">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Speed:</span>
              <span className="font-bold text-slate-700">{order.deliveryType}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
