import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { generateOrderId } from '../utils/helpers';

const OrderContext = createContext(null);
const STORAGE_KEY_ORDERS = 'biterate_orders';

const SAMPLE_ORDERS = [
  {
    id: 'BR-SAMPLE-01',
    userId: 'user-1',
    customerName: 'Sarah Connor',
    customerEmail: 'sarah@example.com',
    customerPhone: '+1 (555) 234-5678',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    status: 'Out for Delivery', // Confirmed -> Preparing -> Out for Delivery -> Delivered
    deliveryPartner: {
      name: 'Carlos Mendoza',
      phone: '+1 (555) 345-9876',
      vehicle: 'Yamaha Scooter (License: 7BR-402)',
      rating: 4.9,
    },
    items: [
      {
        item: {
          id: 1,
          name: 'Classic Margherita Pizza',
          price: 15.99,
          image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800&auto=format&fit=crop&q=80',
          restaurantName: 'Trattoria Bella',
        },
        quantity: 2,
      },
      {
        item: {
          id: 8,
          name: 'Decadent Molten Lava Chocolate Cake',
          price: 9.99,
          image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80',
          restaurantName: 'The Rustic Diner',
        },
        quantity: 1,
      },
    ],
    financials: {
      subtotal: 41.97,
      discount: 8.39,
      deliveryFee: 0,
      tax: 3.36,
      total: 36.94,
    },
    shippingAddress: {
      title: 'Home',
      street: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'OR',
      zipCode: '97477',
      phone: '+1 (555) 234-5678',
    },
    paymentMethod: 'Credit Card (ending in 4242)',
    deliveryType: 'Express Delivery (15-25 mins)',
    estimatedDeliveryTime: 'Arriving in ~12 mins',
  },
  {
    id: 'BR-SAMPLE-02',
    userId: 'user-1',
    customerName: 'Sarah Connor',
    customerEmail: 'sarah@example.com',
    customerPhone: '+1 (555) 234-5678',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    status: 'Delivered',
    deliveryPartner: {
      name: 'Marcus Vance',
      phone: '+1 (555) 765-4321',
      vehicle: 'Honda Civic',
      rating: 4.8,
    },
    items: [
      {
        item: {
          id: 2,
          name: 'Signature Gourmet Wagyu Burger',
          price: 17.50,
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
          restaurantName: 'Firehouse Grill & Burgers',
        },
        quantity: 2,
      },
    ],
    financials: {
      subtotal: 35.00,
      discount: 5.00,
      deliveryFee: 2.99,
      tax: 2.80,
      total: 35.79,
    },
    shippingAddress: {
      title: 'Home',
      street: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'OR',
      zipCode: '97477',
      phone: '+1 (555) 234-5678',
    },
    paymentMethod: 'Apple Pay',
    deliveryType: 'Standard Delivery',
    estimatedDeliveryTime: 'Delivered on Oct 28',
  },
];

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(SAMPLE_ORDERS));
      return SAMPLE_ORDERS;
    } catch (e) {
      console.error('Failed to load orders', e);
      return SAMPLE_ORDERS;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  // Place a new order
  const placeOrder = async ({
    items,
    financials,
    shippingAddress,
    paymentMethod,
    deliveryType,
    specialInstructions = '',
    user,
  }) => {
    const newOrder = {
      id: generateOrderId(),
      userId: user?.id || 'guest',
      customerName: user?.name || shippingAddress.name || 'Valued Foodie',
      customerEmail: user?.email || 'customer@example.com',
      customerPhone: shippingAddress.phone || user?.phone || '+1 (555) 000-0000',
      createdAt: new Date().toISOString(),
      status: 'Confirmed', // Confirmed -> Preparing -> Out for Delivery -> Delivered
      deliveryPartner: {
        name: 'Diego Rivera',
        phone: '+1 (555) 432-8765',
        vehicle: 'Vespa Sprint (License: 9TX-501)',
        rating: 4.9,
      },
      items: [...items],
      financials: { ...financials },
      shippingAddress: { ...shippingAddress },
      paymentMethod,
      deliveryType: deliveryType === 'express' ? 'Express Delivery (15-25 mins)' : 'Standard Delivery (30-45 mins)',
      specialInstructions,
      estimatedDeliveryTime: deliveryType === 'express' ? '20-25 mins' : '35-45 mins',
    };

    setOrders((prev) => [newOrder, ...prev]);
    toast.success(`Order #${newOrder.id} placed successfully! 🎉`);
    return newOrder;
  };

  // Get single order by id
  const getOrderById = (orderId) => {
    return orders.find((o) => o.id === orderId);
  };

  // Cancel order (allowed if still Confirmed or Preparing)
  const cancelOrder = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    if (order.status === 'Delivered') {
      toast.error('Cannot cancel an order that has already been delivered.');
      return;
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: 'Cancelled' } : o
      )
    );
    toast.info(`Order #${orderId} has been cancelled.`);
  };

  // Advance order status for demo simulation
  const advanceOrderStatus = (orderId) => {
    const statusFlow = ['Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const currentIndex = statusFlow.indexOf(o.status);
        if (currentIndex < statusFlow.length - 1) {
          const nextStatus = statusFlow[currentIndex + 1];
          toast.success(`Order #${orderId} is now: ${nextStatus}!`);
          return { ...o, status: nextStatus };
        }
        return o;
      })
    );
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        getOrderById,
        cancelOrder,
        advanceOrderStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
