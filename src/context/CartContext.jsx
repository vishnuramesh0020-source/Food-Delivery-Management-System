import React, { createContext, useContext, useState, useEffect } from 'react';
import { COUPON_CODES } from '../utils/helpers';
import customToast from '../utils/customToast';

const CartContext = createContext(null);
const STORAGE_KEY_CART = 'biterate_cart';
const STORAGE_KEY_COUPON = 'biterate_cart_coupon';
const STORAGE_KEY_DELIVERY = 'biterate_cart_delivery';
export const FREE_DELIVERY_THRESHOLD = 35;

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

  const [coupon, setCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COUPON);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [deliveryType, setDeliveryType] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_DELIVERY) || 'standard';
    } catch {
      return 'standard';
    }
  }); // 'standard' or 'express'

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Sync cart items to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to local storage', e);
    }
  }, [cartItems]);

  // Sync coupon to localStorage whenever it changes
  useEffect(() => {
    try {
      if (coupon) {
        localStorage.setItem(STORAGE_KEY_COUPON, JSON.stringify(coupon));
      } else {
        localStorage.removeItem(STORAGE_KEY_COUPON);
      }
    } catch (e) {
      console.error('Failed to save coupon to local storage', e);
    }
  }, [coupon]);

  // Sync delivery speed preference to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DELIVERY, deliveryType);
    } catch (e) {
      console.error('Failed to save delivery speed to local storage', e);
    }
  }, [deliveryType]);

  // Add item to cart
  const addToCart = (item, quantity = 1, instructions = '') => {
    const existing = cartItems.find((ci) => String(ci.item.id) === String(item.id));
    if (existing) {
      const newQty = existing.quantity + quantity;
      customToast.updateQuantity(item, newQty);
    } else {
      customToast.addToCart(item, quantity, () => setIsCartDrawerOpen(true));
    }

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((ci) => String(ci.item.id) === String(item.id));
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          ...(instructions ? { instructions } : {}),
        };
        return updated;
      }
      return [...prevItems, { item, quantity, instructions }];
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    const removed = cartItems.find((ci) => String(ci.item.id) === String(itemId));
    if (removed) {
      customToast.removeFromCart(removed.item.name);
    }
    setCartItems((prevItems) => prevItems.filter((ci) => String(ci.item.id) !== String(itemId)));
  };

  // Update quantity directly
  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((ci) =>
        String(ci.item.id) === String(itemId) ? { ...ci, quantity } : ci
      )
    );
  };

  // Clear entire cart and reset saved preferences
  const clearCart = (options) => {
    const isSilent = options === true || options?.silent === true;
    if (!isSilent && cartItems.length > 0) {
      customToast.clearCart();
    }
    setCartItems([]);
    setCoupon(null);
    setDeliveryType('standard');
  };

  // Financial Subtotal Calculation
  const subtotal = Number(
    cartItems
      .reduce((sum, ci) => sum + (Number(ci.item.price) || 0) * ci.quantity, 0)
      .toFixed(2)
  );

  // Apply discount coupon
  const applyCoupon = (code) => {
    if (!code) return { success: false, message: 'Please enter a coupon code.' };
    const cleanCode = code.trim().toUpperCase();
    const couponData = COUPON_CODES[cleanCode];

    if (!couponData) {
      customToast.error(
        'Invalid Coupon Code',
        'Please check the code or try using "BITE20" or "TASTY50".'
      );
      return { success: false, message: 'Invalid coupon code.' };
    }

    setCoupon(couponData);

    let estimatedDiscount = 0;
    if (couponData.discountPercent) {
      estimatedDiscount = (subtotal * couponData.discountPercent) / 100;
    } else if (couponData.discountFlat) {
      estimatedDiscount = Math.min(couponData.discountFlat, subtotal);
    } else if (couponData.freeShipping) {
      estimatedDiscount = deliveryType === 'express' ? 2.5 : 2.99;
    }

    customToast.couponApplied(couponData.code, estimatedDiscount);
    return { success: true, coupon: couponData };
  };

  // Remove applied coupon
  const removeCoupon = () => {
    setCoupon(null);
    customToast.info('Coupon Removed', 'Promo discount has been removed from your order.');
  };

  // Check if item is currently in cart and get its quantity
  const getItemQuantity = (itemId) => {
    const found = cartItems.find((ci) => String(ci.item.id) === String(itemId));
    return found ? found.quantity : 0;
  };

  // Calculate Discount
  let discount = 0;
  if (coupon) {
    if (coupon.discountPercent) {
      discount = Number(((subtotal * coupon.discountPercent) / 100).toFixed(2));
    } else if (coupon.discountFlat) {
      discount = Number(Math.min(coupon.discountFlat, subtotal).toFixed(2));
    }
  }

  // Calculate Delivery Fee
  let deliveryFee = 0;
  if (cartItems.length > 0) {
    if (coupon?.freeShipping || subtotal >= FREE_DELIVERY_THRESHOLD) {
      deliveryFee = deliveryType === 'express' ? 2.5 : 0;
    } else {
      deliveryFee = deliveryType === 'express' ? 5.49 : 2.99;
    }
  }

  const tax = Number((subtotal * 0.08).toFixed(2));
  const total = Math.max(0, Number((subtotal - discount + deliveryFee + tax).toFixed(2)));
  const totalItemsCount = cartItems.reduce((sum, ci) => sum + ci.quantity, 0);
  const amountToFreeDelivery = Math.max(0, Number((FREE_DELIVERY_THRESHOLD - subtotal).toFixed(2)));

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
        freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
        amountToFreeDelivery,
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
