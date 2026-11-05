import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Store,
  Utensils,
  Package,
  Clock,
  CheckCircle2,
  Users,
  IndianRupee,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Search,
  Sparkles,
  RefreshCw,
  Download,
  FastForward,
  ChevronRight,
  Eye,
  XCircle,
} from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { foodApi, PARTNER_RESTAURANTS } from '../api/foodApi';
import { formatCurrency } from '../utils/helpers';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import AddFoodModal from '../components/dashboard/AddFoodModal';
import CustomerDirectoryModal from '../components/dashboard/CustomerDirectoryModal';
import RestaurantsModal from '../components/dashboard/RestaurantsModal';
import customToast from '../utils/customToast';

const DashboardPage = () => {
  const { orders, advanceOrderStatus, cancelOrder } = useOrder();
  const { users: authUsers } = useAuth();

  const [totalFoodItems, setTotalFoodItems] = useState(50);
  const [isLoadingFoodCount, setIsLoadingFoodCount] = useState(true);

  // Modals
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
  const [isCustomersOpen, setIsCustomersOpen] = useState(false);
  const [isRestaurantsOpen, setIsRestaurantsOpen] = useState(false);

  // Filters for Recent Orders
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all'); // all | active | delivered | cancelled
  const [chartTimeframe, setChartTimeframe] = useState('weekly'); // weekly | monthly

  // Fetch live total dishes count from foodApi
  const refreshFoodCount = async () => {
    setIsLoadingFoodCount(true);
    try {
      const data = await foodApi.getAllRecipes(100, 0);
      setTotalFoodItems(data.total || data.recipes.length);
    } catch (e) {
      console.error('Failed to load total dishes count', e);
    } finally {
      setIsLoadingFoodCount(false);
    }
  };

  useEffect(() => {
    refreshFoodCount();
  }, []);

  // --- Dynamic Dashboard Metrics ---
  const totalRestaurants = PARTNER_RESTAURANTS.length;
  const totalCustomers = authUsers && authUsers.length > 0 ? authUsers.length : 5;
  const totalOrdersCount = orders.length;

  const activeOrders = orders.filter(
    (o) => o.status === 'Confirmed' || o.status === 'Preparing' || o.status === 'Out for Delivery'
  );
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered');

  // Revenue computations (orders total + realistic baseline dummy data for professional presentation)
  const calculatedOrdersRevenue = orders.reduce((sum, o) => sum + (o.financials?.total || 0), 0);
  const totalGrossRevenue = calculatedOrdersRevenue + 1840.50;
  const todaysRevenue = orders.slice(0, 3).reduce((sum, o) => sum + (o.financials?.total || 0), 0) + 215.30;
  const averageOrderValue = totalOrdersCount > 0 ? (totalGrossRevenue / (totalOrdersCount + 45)) : 38.50;
  const platformEarnings = totalGrossRevenue * 0.15; // 15% marketplace commission

  // Weekly Revenue Dummy Data for Interactive Visual Bar Chart
  const weeklyData = [
    { day: 'Mon', revenue: 380, orders: 12, height: '45%' },
    { day: 'Tue', revenue: 460, orders: 15, height: '55%' },
    { day: 'Wed', revenue: 420, orders: 14, height: '50%' },
    { day: 'Thu', revenue: 580, orders: 18, height: '70%' },
    { day: 'Fri', revenue: 840, orders: 28, height: '95%' },
    { day: 'Sat', revenue: 920, orders: 32, height: '100%', isPeak: true },
    { day: 'Sun', revenue: 710, orders: 24, height: '82%' },
  ];

  const monthlyData = [
    { day: 'W1', revenue: 2600, orders: 85, height: '60%' },
    { day: 'W2', revenue: 3200, orders: 104, height: '75%' },
    { day: 'W3', revenue: 3850, orders: 128, height: '90%' },
    { day: 'W4', revenue: 4310, orders: 142, height: '100%', isPeak: true },
  ];

  const activeChartData = chartTimeframe === 'weekly' ? weeklyData : monthlyData;

  // Filtered Recent Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Status filter
      if (orderStatusFilter === 'active') {
        const isActive = o.status === 'Confirmed' || o.status === 'Preparing' || o.status === 'Out for Delivery';
        if (!isActive) return false;
      } else if (orderStatusFilter === 'delivered') {
        if (o.status !== 'Delivered') return false;
      } else if (orderStatusFilter === 'cancelled') {
        if (o.status !== 'Cancelled') return false;
      }

      // Search query filter
      if (orderSearchQuery.trim()) {
        const q = orderSearchQuery.toLowerCase();
        const matchesId = o.id.toLowerCase().includes(q);
        const matchesCust = o.customerName.toLowerCase().includes(q) || o.customerEmail.toLowerCase().includes(q);
        const matchesItem = o.items.some((i) => i.item.name.toLowerCase().includes(q));
        if (!matchesId && !matchesCust && !matchesItem) return false;
      }

      return true;
    });
  }, [orders, orderStatusFilter, orderSearchQuery]);

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Order ID,Customer,Status,Items Count,Total Amount,Date\n' +
      orders
        .map(
          (o) =>
            `${o.id},"${o.customerName}",${o.status},${o.items.length},₹${(o.financials?.total || 0).toFixed(
              2
            )},${new Date(o.createdAt).toLocaleDateString()}`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `biterush_orders_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    customToast.success(
      'CSV Report Exported! 📊',
      'The comprehensive orders log has been downloaded to your machine.'
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. TOP HEADER & OPERATIONAL STATUS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-extrabold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>Management & Operations Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Food Delivery Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time analytics for partner restaurants, active kitchen dispatch, menu catalog, and revenue performance.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshFoodCount}
            icon={RefreshCw}
            className="bg-white"
          >
            Refresh
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportCSV}
            icon={Download}
          >
            Export Report (CSV)
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddFoodOpen(true)}
            icon={Plus}
          >
            Add Food Item
          </Button>
        </div>
      </div>

      {/* 2. RESPONSIVE METRICS GRID (6 KEY KPIS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* 1. Total Restaurants */}
        <div
          onClick={() => setIsRestaurantsOpen(true)}
          className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs hover:shadow-md hover:border-orange-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Restaurants</span>
            <div className="p-2.5 rounded-2xl bg-orange-50 text-orange-600 group-hover:scale-110 transition-transform">
              <Store className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalRestaurants}</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>12 Open Now • Click to view</span>
          </div>
        </div>

        {/* 2. Total Food Items */}
        <Link
          to="/menu"
          className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs hover:shadow-md hover:border-orange-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Food Items</span>
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
              <Utensils className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {isLoadingFoodCount ? '...' : `${totalFoodItems}+`}
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Across 8 Global Cuisines
          </div>
        </Link>

        {/* 3. Total Orders */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalOrdersCount}</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            All-Time Registered
          </div>
        </div>

        {/* 4. Active Orders */}
        <div
          onClick={() => setOrderStatusFilter('active')}
          className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs hover:shadow-md hover:border-orange-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Orders</span>
            <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-orange-600 flex items-center gap-2">
            <span>{activeOrders.length}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
          </div>
          <div className="text-[11px] text-orange-700 font-bold mt-1">
            In Prep or On The Way
          </div>
        </div>

        {/* 5. Delivered Orders */}
        <div
          onClick={() => setOrderStatusFilter('delivered')}
          className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Delivered</span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{deliveredOrders.length}</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">
            96.4% Success Rate
          </div>
        </div>

        {/* 6. Total Customers */}
        <div
          onClick={() => setIsCustomersOpen(true)}
          className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs hover:shadow-md hover:border-orange-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customers</span>
            <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-600 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalCustomers}</div>
          <div className="text-[11px] text-slate-500 font-bold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>+18% this month</span>
          </div>
        </div>
      </div>

      {/* 3. REVENUE SUMMARY & VISUAL ANALYTICS (DUMMY DATA & PROJECTIONS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Financial Cards & Interactive Chart (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Revenue Summary & Sales Velocity</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Financial performance metrics and transaction turnover
              </p>
            </div>

            {/* Timeframe switch */}
            <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setChartTimeframe('weekly')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  chartTimeframe === 'weekly'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Last 7 Days
              </button>
              <button
                type="button"
                onClick={() => setChartTimeframe('monthly')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  chartTimeframe === 'monthly'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Last 4 Weeks
              </button>
            </div>
          </div>

          {/* 4 Financial Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Gross Revenue</span>
              <span className="text-xl font-black text-slate-900">{formatCurrency(totalGrossRevenue)}</span>
              <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">+14.2% vs last period</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Today&apos;s Sales</span>
              <span className="text-xl font-black text-orange-600">{formatCurrency(todaysRevenue)}</span>
              <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Estimated 18 orders</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Average Order (AOV)</span>
              <span className="text-xl font-black text-slate-900">{formatCurrency(averageOrderValue)}</span>
              <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Per receipt</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Platform Net Cut</span>
              <span className="text-xl font-black text-emerald-700">{formatCurrency(platformEarnings)}</span>
              <span className="text-[10px] text-slate-400 font-medium block mt-0.5">15% commission</span>
            </div>
          </div>

          {/* Visual Sales Bar Chart */}
          <div className="pt-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-3">
              <span>Sales Trends ({chartTimeframe === 'weekly' ? 'Daily Volume' : 'Weekly Volume'})</span>
              <span className="flex items-center gap-1.5 text-orange-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-orange-500" />
                <span>Peak Volume: Saturday (₹920.00)</span>
              </span>
            </div>

            {/* Bars container */}
            <div className="h-44 w-full flex items-end gap-2 sm:gap-4 pt-6 pb-2 px-2 border-b border-slate-100">
              {activeChartData.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip on Hover */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-xl shadow-lg transition-all duration-200 pointer-events-none whitespace-nowrap z-20">
                    {item.day}: ₹{item.revenue} ({item.orders} orders)
                  </div>

                  {/* Visual Bar */}
                  <div
                    style={{ height: item.height }}
                    className={`w-full max-w-[42px] rounded-t-xl transition-all duration-300 group-hover:opacity-90 ${
                      item.isPeak
                        ? 'bg-gradient-to-t from-orange-600 to-amber-400 shadow-md shadow-orange-500/30'
                        : 'bg-slate-200 hover:bg-orange-300'
                    }`}
                  />

                  {/* Day label */}
                  <span className="text-[11px] font-bold text-slate-500 mt-2 select-none">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Cuisine Sales Breakdown & App Health (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900">Sales by Cuisine</h3>
            <p className="text-xs text-slate-400">Order share across top food categories</p>
          </div>

          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-800">🍕 Italian (Pizza & Pasta)</span>
                <span className="text-orange-600">36%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: '36%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-800">🍔 American Burgers & BBQ</span>
                <span className="text-amber-600">28%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '28%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-800">🍜 Asian Ramen & Wok</span>
                <span className="text-blue-600">18%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '18%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-800">🌮 Mexican Cantina</span>
                <span className="text-emerald-600">12%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '12%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-800">🍰 Desserts & Shakes</span>
                <span className="text-purple-600">6%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '6%' }} />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 bg-orange-50/50 p-4 rounded-2xl border border-orange-100 text-xs">
            <span className="font-bold text-orange-900 block mb-1">System Dispatch Status</span>
            <p className="text-orange-800">
              Avg. Kitchen Prep: <span className="font-extrabold">14.5 mins</span> • Avg. Courier Delivery:{' '}
              <span className="font-extrabold">21.8 mins</span>
            </p>
          </div>
        </div>
      </div>

      {/* 4. QUICK ACTION CARDS */}
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-500" />
            <span>Quick Operations Actions</span>
          </h3>
          <p className="text-xs text-slate-400">One-click administrative workflows and shortcuts</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Add New Food Item */}
          <div
            onClick={() => setIsAddFoodOpen(true)}
            className="p-5 rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 hover:scale-102 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 text-white">
                <Plus className="w-5 h-5" />
              </div>
              <h4 className="font-black text-base">Add New Food Item</h4>
              <p className="text-xs text-orange-100 mt-1">
                List a new recipe with price, restaurant, and cuisine to public menu.
              </p>
            </div>
            <div className="pt-4 flex items-center justify-between text-xs font-bold">
              <span>Open Form</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: Filter Active Kitchen Orders */}
          <div
            onClick={() => setOrderStatusFilter('active')}
            className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-orange-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-black text-base text-slate-900">Manage Active Orders</h4>
              <p className="text-xs text-slate-500 mt-1">
                Filter to view {activeOrders.length} orders currently in kitchen prep or out for delivery.
              </p>
            </div>
            <div className="pt-4 flex items-center justify-between text-xs font-bold text-indigo-600">
              <span>Filter Table ({activeOrders.length})</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 3: Explore Food Catalog */}
          <Link
            to="/menu"
            className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-orange-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Utensils className="w-5 h-5" />
              </div>
              <h4 className="font-black text-base text-slate-900">Explore Full Menu</h4>
              <p className="text-xs text-slate-500 mt-1">
                Review dish cards, prices, dietary tags, and live menu filters.
              </p>
            </div>
            <div className="pt-4 flex items-center justify-between text-xs font-bold text-amber-600">
              <span>Open Catalog</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 4: Customers Directory */}
          <div
            onClick={() => setIsCustomersOpen(true)}
            className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-orange-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-black text-base text-slate-900">Customer Directory</h4>
              <p className="text-xs text-slate-500 mt-1">
                Inspect registered customer contact information and delivery locations.
              </p>
            </div>
            <div className="pt-4 flex items-center justify-between text-xs font-bold text-rose-600">
              <span>View Foodies ({totalCustomers})</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* 5. RECENT ORDERS MANAGEMENT TABLE & CARDS */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-orange-500" />
              <span>Recent Orders & Live Dispatch Log</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Showing {filteredOrders.length} of {orders.length} orders
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                placeholder="Search Order ID, customer, dish..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setOrderStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  orderStatusFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setOrderStatusFilter('active')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  orderStatusFilter === 'active'
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Active ({activeOrders.length})
              </button>
              <button
                type="button"
                onClick={() => setOrderStatusFilter('delivered')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  orderStatusFilter === 'delivered'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Delivered ({deliveredOrders.length})
              </button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No orders match the selected filters or search query.
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-6">Order ID & Date</th>
                    <th className="py-3 px-6">Customer</th>
                    <th className="py-3 px-6">Items Ordered</th>
                    <th className="py-3 px-6">Total Bill</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-4 px-6 font-mono font-bold text-slate-900">
                        <Link
                          to={`/orders/${order.id}`}
                          className="hover:text-orange-600 transition flex items-center gap-1"
                        >
                          <span>{order.id}</span>
                          <ArrowUpRight className="w-3 h-3 text-slate-400" />
                        </Link>
                        <span className="text-[11px] font-normal text-slate-400 block mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString()} •{' '}
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={
                              order.customerAvatar ||
                              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
                            }
                            alt={order.customerName}
                            className="w-8 h-8 rounded-xl object-cover border border-slate-200"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{order.customerName}</span>
                            <span className="text-[11px] text-slate-400">{order.customerEmail}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="font-bold text-slate-800">
                          {order.items.reduce((s, i) => s + i.quantity, 0)} items:
                        </span>{' '}
                        <span className="text-slate-500">
                          {order.items.map((i) => `${i.quantity}x ${i.item.name}`).join(', ')}
                        </span>
                      </td>

                      <td className="py-4 px-6 font-black text-slate-900">
                        {formatCurrency(order.financials?.total || 0)}
                        <span className="text-[10px] text-slate-400 block font-normal">
                          {order.paymentMethod}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <Badge variant={getStatusBadgeVariant(order.status)} size="xs">
                          {order.status}
                        </Badge>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                            <button
                              type="button"
                              onClick={() => advanceOrderStatus(order.id)}
                              className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-[11px] transition flex items-center gap-1 cursor-pointer"
                              title="Advance status to next milestone"
                            >
                              <FastForward className="w-3.5 h-3.5" />
                              <span>Advance</span>
                            </button>
                          )}

                          <Link
                            to={`/orders/${order.id}`}
                            className="p-1.5 text-slate-500 hover:text-orange-600 rounded-xl hover:bg-orange-50 transition"
                            title="View tracking"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                            <button
                              type="button"
                              onClick={() => cancelOrder(order.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition cursor-pointer"
                              title="Cancel order"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-slate-900 text-xs">{order.id}</span>
                      <span className="text-[10px] text-slate-400 block">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Badge variant={getStatusBadgeVariant(order.status)} size="xs">
                      {order.status}
                    </Badge>
                  </div>

                  <div className="text-xs">
                    <span className="font-bold text-slate-800">{order.customerName}</span>
                    <p className="text-slate-500 line-clamp-1">
                      {order.items.map((i) => `${i.quantity}x ${i.item.name}`).join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-50 text-xs">
                    <span className="font-black text-slate-900">
                      {formatCurrency(order.financials?.total || 0)}
                    </span>

                    <div className="flex items-center gap-2">
                      {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                        <button
                          type="button"
                          onClick={() => advanceOrderStatus(order.id)}
                          className="px-2 py-1 bg-indigo-50 text-indigo-700 font-bold rounded-lg text-[11px]"
                        >
                          Advance
                        </button>
                      )}
                      <Link to={`/orders/${order.id}`}>
                        <Button variant="ghost" size="sm">
                          Track
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* --- MODALS --- */}
      {/* 1. Add Food Modal */}
      <AddFoodModal
        isOpen={isAddFoodOpen}
        onClose={() => setIsAddFoodOpen(false)}
        onFoodAdded={() => refreshFoodCount()}
      />

      {/* 2. Customer Directory Modal */}
      <CustomerDirectoryModal
        isOpen={isCustomersOpen}
        onClose={() => setIsCustomersOpen(false)}
        customers={authUsers || []}
      />

      {/* 3. Partner Restaurants Modal */}
      <RestaurantsModal
        isOpen={isRestaurantsOpen}
        onClose={() => setIsRestaurantsOpen(false)}
        restaurants={PARTNER_RESTAURANTS}
      />
    </div>
  );
};

export default DashboardPage;
