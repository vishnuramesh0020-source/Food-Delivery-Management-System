import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';
import { useCart } from '../../context/CartContext';
import { ShoppingBag } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const MainLayout = () => {
  const { totalItemsCount, subtotal, setIsCartDrawerOpen } = useCart();
  const location = useLocation();

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      {/* Global Slide-Over Cart Drawer */}
      <CartDrawer />

      {/* Floating Cart Button on Mobile if cart has items */}
      {totalItemsCount > 0 && location.pathname !== '/checkout' && (
        <div className="fixed bottom-5 right-5 z-30 md:hidden animate-bounce">
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="flex items-center gap-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 py-3 rounded-full shadow-2xl active:scale-95 transition"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-white text-orange-600 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {totalItemsCount}
              </span>
            </div>
            <span className="text-sm">{formatCurrency(subtotal)}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MainLayout;
