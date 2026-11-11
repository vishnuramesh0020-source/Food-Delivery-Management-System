import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  MapPin,
  ChevronRight,
  RotateCcw,
  FastForward,
  XCircle,
  Clock,
  Search,
} from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/helpers';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import customToast from '../utils/customToast';

const FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'Preparing', label: 'Preparing' },
  { id: 'Out for Delivery', label: 'Out for Delivery' },
  { id: 'Delivered', label: 'Delivered' },
  { id: 'Cancelled', label: 'Cancelled' },
];

const OrdersPage = () => {
  const { orders, advanceOrderStatus, cancelOrder } = useOrder();
  const { addToCart } = useCart();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const statusCounts = useMemo(() => {
    const counts = { all: orders.length };
    FILTER_TABS.slice(1).forEach((tab) => {
      counts[tab.id] = orders.filter((o) => o.status === tab.id).length;
    });
    return counts;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return orders.filter((o) => {
      if (filter !== 'all' && o.status !== filter) return false;
      if (!q) return true;

      const matchesId = o.id.toLowerCase().includes(q);
      const matchesAddress =
        o.shippingAddress?.street?.toLowerCase().includes(q) ||
        o.shippingAddress?.city?.toLowerCase().includes(q);
      const matchesDish = o.items?.some((entry) =>
        entry.item.name.toLowerCase().includes(q)
      );
      return matchesId || matchesAddress || matchesDish;
    });
  }, [orders, filter, searchQuery]);

  const handleReorder = (order) => {
    order.items.forEach((entry) => {
      addToCart(entry.item, entry.quantity);
    });
    customToast.success(
      'Reordered All Items! 🛒',
      `All ${order.items.length} items from #${order.id} have been added to your cart.`
    );
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
      {/* Header & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Package className="w-7 h-7 text-orange-500" />
            <span>My Orders & Live Tracking</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor preparing status, live delivery progress, estimated arrival times, and complete order history.
          </p>
        </div>

        {/* Search Input by Order ID or Dish */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Order ID or dish..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
        </div>
      </div>

      {/* Status Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {FILTER_TABS.map((tab) => {
          const isActive = filter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 cursor-pointer border ${
                isActive
                  ? 'bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-500/20'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-orange-50 hover:text-orange-600'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {statusCounts[tab.id] || 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Empty State vs Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 space-y-4 shadow-xs">
          <div className="w-20 h-20 bg-orange-50 text-orange-400 rounded-full flex items-center justify-center text-3xl mx-auto">
            📦
          </div>
          <h3 className="text-xl font-bold text-slate-800">No matching orders found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            There are no orders matching the selected status filter or search query.
          </p>
          {filter !== 'all' || searchQuery ? (
            <Button
              variant="secondary"
              onClick={() => {
                setFilter('all');
                setSearchQuery('');
              }}
            >
              Show All Orders
            </Button>
          ) : (
            <Link to="/menu">
              <Button variant="primary">Browse Full Menu</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs hover:shadow-md transition space-y-4"
            >
              {/* Top Row: Order ID, Status, ETA & Total */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-orange-50 text-orange-600">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`/orders/${order.id}`}
                        className="font-mono text-sm font-black text-slate-900 hover:text-orange-600 transition"
                      >
                        #{order.id}
                      </Link>
                      <Badge variant={getStatusBadgeVariant(order.status)} size="xs" dot>
                        {order.status}
                      </Badge>
                      {order.estimatedDeliveryTime && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200/70">
                          <Clock className="w-3 h-3" />
                          {order.estimatedDeliveryTime}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Total
                  </span>
                  <span className="text-lg font-black text-slate-900">
                    {formatCurrency(order.financials?.total || 0)}
                  </span>
                </div>
              </div>

              {/* Dish Thumbnails Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {order.items?.map((ci, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-2 rounded-2xl bg-slate-50/70 border border-slate-100"
                  >
                    <img
                      src={ci.item.image}
                      alt={ci.item.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1 text-xs">
                      <div className="font-bold text-slate-800 truncate">
                        {ci.item.name}
                      </div>
                      <div className="text-slate-400">
                        Qty: {ci.quantity} • {formatCurrency(ci.item.price * ci.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer: Address & Action Buttons */}
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
                      <span>Next Stage</span>
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
