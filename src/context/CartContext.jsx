import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { COUPON_CODES } from '../utils/helpers';

const CartContext = createContext(null);
const STORAGE_KEY_CART = 'biterate_cart';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CART);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse cart from local storage', e);
      return [];
    }
  });

  const [coupon, setCoupon] = useState(null);
  const [deliveryType, setDeliveryType] = useState('standard'); // 'standard' or 'express'
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Sync cart items to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to local storage', e);
    }
  }, [cartItems]);

  // Add item to cart
  const addToCart = (item, quantity = 1, instructions = '') => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((ci) => ci.item.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        if (instructions) {
          updated[existingIndex].instructions = instructions;
        }
        toast.info(`Updated "${item.name}" quantity (${updated[existingIndex].quantity})`);
        return updated;
      } else {
        toast.success(`Added "${item.name}" to your cart! 🛒`);
        return [...prevItems, { item, quantity, instructions }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => {
      const removed = prevItems.find((ci) => ci.item.id === itemId);
      if (removed) {
        toast.info(`Removed "${removed.item.name}" from cart`);
      }
      return prevItems.filter((ci) => ci.item.id !== itemId);
    });
  };

  // Update quantity directly
  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((ci) =>
        ci.item.id === itemId ? { ...ci, quantity } : ci
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
  };

  // Apply discount coupon
  const applyCoupon = (code) => {
    if (!code) return { success: false, message: 'Please enter a coupon code.' };
    const cleanCode = code.trim().toUpperCase();
    const couponData = COUPON_CODES[cleanCode];

    if (!couponData) {
      toast.error('Invalid coupon code. Try "BITE20" or "TASTY50"');
      return { success: false, message: 'Invalid coupon code.' };
    }

    setCoupon(couponData);
    toast.success(`Coupon "${couponData.code}" applied! 🎉`);
    return { success: true, coupon: couponData };
  };

  // Remove applied coupon
  const removeCoupon = () => {
    setCoupon(null);
    toast.info('Coupon removed.');
  };

  // Check if item is currently in cart and get its quantity
  const getItemQuantity = (itemId) => {
    const found = cartItems.find((ci) => ci.item.id === itemId);
    return found ? found.quantity : 0;
  };

  // Financial Calculations
  const subtotal = cartItems.reduce(
    (sum, ci) => sum + (Number(ci.item.price) || 0) * ci.quantity,
    0
  );

  let discount = 0;
  if (coupon) {
    if (coupon.discountPercent) {
      discount = (subtotal * coupon.discountPercent) / 100;
    } else if (coupon.discountFlat) {
      discount = Math.min(coupon.discountFlat, subtotal);
    }
  }

  // Delivery fee rules: Standard is $2.99 (Free over $35 or if coupon FREESHIP)
  // Express adds an extra $2.50
  let deliveryFee = 0;
  if (cartItems.length > 0) {
    if (coupon?.freeShipping || subtotal >= 35) {
      deliveryFee = deliveryType === 'express' ? 2.50 : 0;
    } else {
      deliveryFee = deliveryType === 'express' ? 5.49 : 2.99;
    }
  }

  const tax = Number((subtotal * 0.08).toFixed(2)); // 8% sales tax
  const total = Math.max(0, Number((subtotal - discount + deliveryFee + tax).toFixed(2)));
  const totalItemsCount = cartItems.reduce((sum, ci) => sum + ci.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        coupon,
        deliveryType,
        setDeliveryType,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        getItemQuantity,
        subtotal,
        discount,
        deliveryFee,
        tax,
        total,
        totalItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
