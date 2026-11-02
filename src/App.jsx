import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer, Slide } from 'react-toastify';
import {
  CheckCircle2,
  ShoppingBag,
  Sparkles,
  AlertTriangle,
  AlertCircle,
  X,
} from 'lucide-react';

// Custom toast notification icon matching BiteRush UI
const renderToastIcon = ({ type }) => {
  switch (type) {
    case 'success':
      return (
        <div className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-200/90 flex items-center justify-center text-emerald-600 shadow-xs shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      );
    case 'info':
      return (
        <div className="w-9 h-9 rounded-2xl bg-orange-50 border border-orange-200/90 flex items-center justify-center text-orange-600 shadow-xs shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
      );
    case 'warning':
      return (
        <div className="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-200/90 flex items-center justify-center text-amber-600 shadow-xs shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
      );
    case 'error':
      return (
        <div className="w-9 h-9 rounded-2xl bg-rose-50 border border-rose-200/90 flex items-center justify-center text-rose-600 shadow-xs shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
      );
    default:
      return (
        <div className="w-9 h-9 rounded-2xl bg-orange-50 border border-orange-200/90 flex items-center justify-center text-orange-600 shadow-xs shrink-0">
          <ShoppingBag className="w-5 h-5" />
        </div>
      );
  }
};

// Custom toast close button matching BiteRush UI
const ToastCloseButton = ({ closeToast }) => (
  <button
    type="button"
    onClick={closeToast}
    className="w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-800 flex items-center justify-center transition active:scale-95 shrink-0 ml-2.5 self-center cursor-pointer"
    aria-label="Close notification"
  >
    <X className="w-4 h-4" />
  </button>
);

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { FavoritesProvider } from './context/FavoritesContext';

// Layout & Routing
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/routing/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import FoodDetailPage from './pages/FoodDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrdersPage from './pages/OrdersPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <FavoritesProvider>
              <Routes>
                {/* Main Layout Wrapping General & Protected Routes */}
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="menu" element={<MenuPage />} />
                  <Route path="food/:id" element={<FoodDetailPage />} />
                  <Route path="cart" element={<CartPage />} />

                  {/* Protected Routes */}
                  <Route
                    path="checkout"
                    element={
                      <ProtectedRoute>
                        <CheckoutPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="order-success/:orderId"
                    element={
                      <ProtectedRoute>
                        <OrderSuccessPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="orders"
                    element={
                      <ProtectedRoute>
                        <OrdersPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="orders/:orderId"
                    element={
                      <ProtectedRoute>
                        <OrderTrackingPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Public Auth Pages inside layout */}
                  <Route path="login" element={<LoginPage />} />
                  <Route path="register" element={<RegisterPage />} />
                  <Route path="forgot-password" element={<ForgotPasswordPage />} />

                  {/* 404 */}
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>

              {/* Global Toast Notifications matching BiteRush Project UI */}
              <ToastContainer
                position="top-right"
                autoClose={3000}
                limit={3}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
                theme="light"
                transition={Slide}
                icon={renderToastIcon}
                closeButton={ToastCloseButton}
              />
            </FavoritesProvider>
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
