# 🍔 BiteRush - Food Delivery Management System

A production-grade **Food Delivery Management System** built with **React.js (Vite)**, **Tailwind CSS**, **Context API**, and **DummyJSON Third-Party Food & Recipe APIs**.

---

## 🚀 Technology Stack

| Technology | Purpose |
|---|---|
| **React.js 19 + Vite** | High-performance modern web framework with instant HMR and optimized bundler |
| **Tailwind CSS v4** | Utility-first responsive styling with custom glassmorphism, animations & design system |
| **Context API** | Global state management for Authentication, Cart, Orders, and Favorites |
| **React Router v7** | Single Page Application (SPA) declarative client-side routing with Protected Routes |
| **Axios** | Robust HTTP client with centralized interceptors, timeout handling & error boundaries |
| **React Hook Form** | Performant, uncontrolled form validation with error reporting and feedback |
| **React Toastify** | Beautiful toast notification alerts for user actions |
| **Local Storage** | Client-side persistence for active session, registered users, shopping cart & orders |
| **Lucide React** | Clean, modern iconography |

---

## 🔑 Demo Login Credentials

For quick evaluation, pre-configured accounts are available with one-click autofill on the login screen:

| Email | Password | Role |
|---|---|---|
| `sarah@example.com` | `Password123!` | Registered Foodie (Sample orders & saved addresses) |
| `alex@example.com` | `Password123!` | Registered Foodie |

*You can also register a new account anytime with real-time field validation.*

---

## 📦 Key Modules & Features

### 1. Module 1: Authentication & User Management
- **Login**: Email and password validation with remember-me preference and 1-click demo fill buttons.
- **Register**: Validates full name, email format, phone number, address, password strength, and terms agreement.
- **Forgot Password UI**: 3-step password recovery workflow:
  1. *Enter Registered Email*
  2. *Verify OTP / Recovery code* (prefilled with mock verification code `4821`)
  3. *Set New Password & Confirm* with instant update in `localStorage`.
- **Form Validation**: Powered by `react-hook-form` with clear inline error messages and regex checks.
- **Password Visibility**: Eye / Eye-off toggle buttons on all password inputs.
- **Protected Routes**: `<ProtectedRoute>` prevents unauthorized access to `/checkout`, `/orders`, `/orders/:orderId`, and `/profile`, redirecting users back to their requested page upon login.
- **Logout**: Clears session, resets cart if required, and alerts user via React Toastify.
- **Local Storage Persistence**: Session, registered users list, and default addresses persist across browser refreshes.

### 2. Third-Party Food API Integration
- Integrated with **DummyJSON Recipes API** (`https://dummyjson.com/recipes`).
- Uses **Axios** with base URL, timeout limits, and response interceptors.
- Dynamically decorates dishes with realistic prices, culinary restaurant names, delivery estimates, vegetarian badges, and discounts.
- **Zero-Downtime Fallback**: If the network or DummyJSON is unavailable, the application seamlessly falls back to local high-resolution culinary records so the user never encounters broken views.

### 3. Food Catalog & Menu Exploration
- **Cuisine Filters**: Quick tabs for Italian, Asian, American, Mexican, Indian, Mediterranean, and Desserts.
- **Search Bar**: Real-time keyword search across dish names, ingredients, and cuisines.
- **Dietary Filter**: Instant toggle for *All*, *Vegetarian Only (🌱)*, and *Non-Vegetarian (🍗)*.
- **Rating & Price Sorting**: Sort by Recommended, Highest Rating, Price (Low to High / High to Low), and Fastest Delivery.
- **Quick View Modal**: Preview ingredients, cooking instructions, and nutritional information without leaving the page.
- **Dish Detail Page (`/food/:id`)**: High-res dish visual, step-by-step chef instructions, interactive ingredient checklist, and related recommendations.

### 4. Cart & Discount Management
- **Cart Drawer & Full Page**: Accessible via sticky header trigger or floating mobile pill.
- **Quantity Steppers**: Increment, decrement, or remove dishes with instant price re-calculation.
- **Promo Coupons**:
  - `BITE20` → 20% discount on entire order.
  - `TASTY50` → $5.00 flat discount.
  - `FREESHIP` → Free shipping.
- **Bill Summary**: Calculates items subtotal, coupon savings, delivery fee (free above $35), 8% tax, and final amount.

### 5. Multi-Step Checkout & Orders
- **Delivery Address**: Select from saved user addresses or add a new delivery location inline.
- **Delivery Speed**: Standard (30-45 mins) or Priority Express (15-25 mins).
- **Payment Methods**: Credit/Debit card with simulated secure input, Cash on Delivery (COD), or Instant UPI QR code.
- **Order Placement**: Automatically generates a unique Order ID (`BR-XXXXX`), records order timeline, and clears the cart.

### 6. Live Order Tracking & Simulation
- **Visual Milestone Stepper**:
  1. *Order Confirmed*
  2. *Preparing in Kitchen*
  3. *Out for Delivery*
  4. *Delivered*
- **Live Simulator Button**: "Simulate Next Stage" button allows reviewers to test milestone state changes in real time!
- **Courier Details**: View courier name, vehicle type, license plate, partner rating, and call driver button.
- **Order History & Reorder**: Re-order past dishes into the active cart with a single click.

---

## 📁 Project Architecture & Folder Structure

```
Food-Delivery-Management-System/
├── public/                     # Static icons and assets
├── src/
│   ├── api/
│   │   ├── axiosClient.js      # Axios instance with base URL, timeout & interceptors
│   │   ├── foodApi.js          # API service for DummyJSON recipes & search
│   │   └── mockData.js         # Offline fallback dataset for network resilience
│   ├── components/
│   │   ├── auth/               # LoginForm, RegisterForm, ForgotPasswordForm
│   │   ├── cart/               # CartDrawer, CartItem
│   │   ├── common/             # Button, Input, Modal, Badge, RatingStars, SearchBar, Spinner
│   │   ├── food/               # FoodCard, CategoryPills, FoodFilterBar, QuickViewModal
│   │   ├── layout/             # Navbar, Footer, MainLayout
│   │   └── routing/            # ProtectedRoute
│   ├── context/
│   │   ├── AuthContext.jsx     # User session, login, register, profile update in LocalStorage
│   │   ├── CartContext.jsx     # Cart items, quantities, coupons, financials in LocalStorage
│   │   ├── OrderContext.jsx    # Orders list, live tracking & simulation in LocalStorage
│   │   └── FavoritesContext.jsx# Favorite meals bookmarking in LocalStorage
│   ├── pages/
│   │   ├── HomePage.jsx        # Landing page with hero, search, deals & top picks
│   │   ├── MenuPage.jsx        # Full food catalog with search, filters & sort
│   │   ├── FoodDetailPage.jsx  # Recipe details, ingredients checklist, prep steps
│   │   ├── CartPage.jsx        # Full-page cart view with delivery speed options
│   │   ├── CheckoutPage.jsx    # Multi-step checkout (address, payment, notes)
│   │   ├── OrderSuccessPage.jsx# Order confirmation screen
│   │   ├── OrdersPage.jsx      # Order history list with reorder & cancel options
│   │   ├── OrderTrackingPage.jsx # Real-time delivery progress timeline
│   │   ├── ProfilePage.jsx     # User profile, saved addresses & favorites
│   │   ├── LoginPage.jsx       # Login view
│   │   ├── RegisterPage.jsx    # Registration view
│   │   ├── ForgotPasswordPage.jsx # Multi-step password reset
│   │   └── NotFoundPage.jsx    # 404 error page
│   ├── utils/
│   │   ├── helpers.js          # Currency formatting, price calculations, coupons
│   │   └── mockUsers.js        # Default initial users for 1-click testing
│   ├── App.jsx                 # Route definitions & ToastContainer
│   ├── index.css               # Tailwind CSS v4 styling & scrollbars
│   └── main.jsx                # Application root mounting
├── index.html                  # HTML entry point with title & responsive viewport
├── package.json                # Project dependencies and npm scripts
└── vite.config.js              # Vite & Tailwind configuration
```

---

## 🛠️ How to Run the Project Locally

1. **Navigate to the project directory:**
   ```bash
   cd "E:\Overal Task\Food-Delivery-Management-System"
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open in your browser:**
   Open the URL displayed in the terminal (e.g. `http://localhost:5173/`).

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```
