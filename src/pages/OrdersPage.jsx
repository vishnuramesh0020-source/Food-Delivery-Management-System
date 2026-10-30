import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  MapPin,
  ChevronRight,
  RotateCcw,
  FastForward,
  XCircle,
} from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/helpers';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';

const OrdersPage = () => {
  const { orders, advanceOrderStatus, cancelOrder } = useOrder();
  const { addToCart } = useCart();
  const [filter, setFilter] = useState('all');

  const filteredOrders = orders.filter((o) => {
    if (filter === 'active') return o.status !== 'Delivered' && o.status !== 'Cancelled';
    if (filter === 'delivered') return o.status === 'Delivered';
    return true;
  });

  const handleReorder = (order) => {
    order.items.forEach((entry) => {
      addToCart(entry.item, entry.quantity);
    });
    toast.success('All items from this order added to your cart! 🛒');
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-7 h-7 text-orange-500" />
            <span>My Orders & Live Tracking</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Follow your active food orders in real-time or view past delivery history.
          </p>
        </div>

        <div className="inline-flex rounded-2xl bg-white border border-slate-200 p-1 text-xs font-bold shadow-xs">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition ${
              filter === 'all'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-xl transition ${
              filter === 'active'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Orders
          </button>
          <button
            type="button"
            onClick={() => setFilter('delivered')}
            className={`px-3 py-1.5 rounded-xl transition ${
              filter === 'delivered'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Delivered
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 space-y-4 shadow-xs">
          <div className="w-20 h-20 bg-orange-50 text-orange-400 rounded-full flex items-center justify-center text-3xl mx-auto">
            📦
          </div>
          <h3 className="text-xl font-bold text-slate-800">No orders found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You don&apos;t have any orders matching this category yet. Order some mouth-watering food now!
          </p>
          <Link to="/menu">
            <Button variant="primary">Browse Full Menu</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs hover:shadow-md transition space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-orange-50 text-orange-600">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-black text-slate-900">
                        {order.id}
                      </span>
                      <Badge variant={getStatusBadgeVariant(order.status)} size="xs">
                        {order.status}
                      </Badge>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total</span>
                  <span className="text-lg font-black text-slate-900">
                    {formatCurrency(order.financials?.total || 0)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {order.items?.map((ci, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-2 rounded-2xl bg-slate-50/70 border border-slate-100"
                  >
                    <img
                      src={ci.item.image}
                      alt={ci.item.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1 text-xs">
                      <div className="font-bold text-slate-800 truncate">{ci.item.name}</div>
                      <div className="text-slate-400">
                        Qty: {ci.quantity} • {formatCurrency(ci.item.price * ci.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                  <span className="truncate max-w-xs">
                    {order.shippingAddress?.street}, {order.shippingAddress?.city}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                    <button
                      type="button"
                      onClick={() => advanceOrderStatus(order.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-xl transition cursor-pointer"
                      title="Simulate order advancing to next delivery milestone"
                    >
                      <FastForward className="w-3.5 h-3.5" />
                      <span>Simulate Next Stage</span>
                    </button>
                  )}

                  {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                    <button
                      type="button"
                      onClick={() => cancelOrder(order.id)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-xl transition cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleReorder(order)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reorder</span>
                  </button>

                  <Link to={`/orders/${order.id}`}>
                    <Button variant="primary" size="sm" icon={ChevronRight}>
                      Track Order
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
