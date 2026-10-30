import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, MapPin, Clock, Utensils } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { formatCurrency } from '../utils/helpers';
import Button from '../components/common/Button';

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const { getOrderById } = useOrder();

  const order = getOrderById(orderId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 sm:p-12 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Payment & Order Confirmed
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
            Thank You for Your Order!
          </h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
            The kitchen has accepted your order and has begun hand-crafting your meal fresh to perfection.
          </p>
        </div>

        {order ? (
          <div className="bg-slate-50 rounded-2xl p-6 text-left border border-slate-100 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
              <div>
                <span className="text-xs text-slate-400 block font-bold">Order ID</span>
                <span className="font-mono text-sm font-black text-slate-800">{order.id}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-bold">Estimated Delivery</span>
                <span className="text-sm font-extrabold text-orange-600 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {order.estimatedDeliveryTime || '25-35 mins'}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-bold">Total Paid</span>
                <span className="text-sm font-black text-slate-900">
                  {formatCurrency(order.financials?.total || 0)}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-slate-600">
              <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800">
                  Delivering to: {order.shippingAddress?.title}
                </span>
                <p>
                  {order.shippingAddress?.street}, {order.shippingAddress?.city}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1.5">
                Items Ordered
              </span>
              <div className="space-y-1 text-xs">
                {order.items?.map((ci, idx) => (
                  <div key={idx} className="flex justify-between text-slate-700">
                    <span>
                      {ci.quantity}x {ci.item.name}
                    </span>
                    <span className="font-bold">
                      {formatCurrency(ci.item.price * ci.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-500">
            Order Reference: <span className="font-mono font-bold">{orderId}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link to={`/orders/${orderId}`} className="w-full sm:w-auto">
            <Button variant="primary" size="lg" icon={Package} className="w-full">
              Track Order Live
            </Button>
          </Link>
          <Link to="/menu" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" icon={Utensils} className="w-full">
              Explore More Dishes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
