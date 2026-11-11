import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateOrderId, getEstimatedArrivalClockTime } from '../utils/helpers';
import customToast from '../utils/customToast';

const OrderContext = createContext(null);
const STORAGE_KEY_ORDERS = 'biterate_orders';

export const SAMPLE_ORDERS = [
  {
    id: 'BR-9841-A1',
    userId: 'user-1',
    customerName: 'Sarah Connor',
    customerEmail: 'sarah@example.com',
    customerPhone: '+1 (555) 234-5678',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 mins ago
    status: 'Out for Delivery',
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
    estimatedDeliveryTime: 'Arriving in ~10 mins',
  },
  {
    id: 'BR-9842-B2',
    userId: 'user-3',
    customerName: 'Emily Chen',
    customerEmail: 'emily.chen@example.com',
    customerPhone: '+1 (555) 345-6789',
    customerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    status: 'Preparing',
    deliveryPartner: {
      name: 'Liam Zhang',
      phone: '+1 (555) 293-8471',
      vehicle: 'Honda Super Cub (5AZ-912)',
      rating: 4.8,
    },
    items: [
      {
        item: {
          id: 4,
          name: 'Authentic Tonkotsu Ramen Bowl',
          price: 18.50,
          image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80',
          restaurantName: 'Golden Wok Dynasty',
        },
        quantity: 2,
      },
    ],
    financials: {
      subtotal: 37.00,
      discount: 5.00,
      deliveryFee: 2.99,
      tax: 2.96,
      total: 37.95,
    },
    shippingAddress: {
      title: 'Home',
      street: '88 Pearl River Way',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      phone: '+1 (555) 345-6789',
    },
    paymentMethod: 'Instant UPI / QR Code',
    deliveryType: 'Standard Delivery (30-45 mins)',
    estimatedDeliveryTime: 'Preparing in Kitchen (~20 mins)',
  },
  {
    id: 'BR-9843-C3',
    userId: 'user-4',
    customerName: 'David Miller',
    customerEmail: 'david.m@example.com',
    customerPhone: '+1 (555) 456-7890',
    customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    status: 'Confirmed',
    deliveryPartner: {
      name: 'Diego Rivera',
      phone: '+1 (555) 432-8765',
      vehicle: 'Vespa Sprint (License: 9TX-501)',
      rating: 4.9,
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
      {
        item: {
          id: 3,
          name: 'Crispy Golden Chicken Tacos',
          price: 13.99,
          image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80',
          restaurantName: 'Cantina Del Sol',
        },
        quantity: 1,
      },
    ],
    financials: {
      subtotal: 48.99,
      discount: 0,
      deliveryFee: 0,
      tax: 3.92,
      total: 52.91,
    },
    shippingAddress: {
      title: 'Loft',
      street: '520 Madison Ave, Floor 12',
      city: 'New York',
      state: 'NY',
      zipCode: '10022',
      phone: '+1 (555) 456-7890',
    },
    paymentMethod: 'Credit Card (ending in 1092)',
    deliveryType: 'Express Delivery (15-25 mins)',
    estimatedDeliveryTime: 'Order Confirmed (30 mins)',
  },
  {
    id: 'BR-9840-D4',
    userId: 'user-2',
    customerName: 'Alex Johnson',
    customerEmail: 'alex@example.com',
    customerPhone: '+1 (555) 876-5432',
    customerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
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
          id: 5,
          name: 'Fresh Mediterranean Salmon Bowl',
          price: 16.99,
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
          restaurantName: 'Olive & Fig Taverna',
        },
        quantity: 2,
      },
    ],
    financials: {
      subtotal: 33.98,
      discount: 0,
      deliveryFee: 2.99,
      tax: 2.72,
      total: 39.69,
    },
    shippingAddress: {
      title: 'Home',
      street: '123 Market Street, Apt 4B',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103',
      phone: '+1 (555) 876-5432',
    },
    paymentMethod: 'Apple Pay',
    deliveryType: 'Standard Delivery',
    estimatedDeliveryTime: 'Delivered today',
  },
  {
    id: 'BR-9839-E5',
    userId: 'user-5',
    customerName: 'Sophia Martinez',
    customerEmail: 'sophia.m@example.com',
    customerPhone: '+1 (555) 567-8901',
    customerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
    status: 'Delivered',
    deliveryPartner: {
      name: 'Carlos Mendoza',
      phone: '+1 (555) 345-9876',
      vehicle: 'Yamaha Scooter (License: 7BR-402)',
      rating: 4.9,
    },
    items: [
      {
        item: {
          id: 6,
          name: 'Creamy Fettuccine Alfredo',
          price: 14.50,
          image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=800&auto=format&fit=crop&q=80',
          restaurantName: 'Pasta Fresca Co.',
        },
        quantity: 1,
      },
      {
        item: {
          id: 7,
          name: 'Butter Chicken with Garlic Naan',
          price: 19.99,
          image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80',
          restaurantName: 'Royal Tandoor House',
        },
        quantity: 1,
      },
    ],
    financials: {
      subtotal: 34.49,
      discount: 5.00,
      deliveryFee: 2.99,
      tax: 2.76,
      total: 35.24,
    },
    shippingAddress: {
      title: 'Home',
      street: '34 Ocean Drive',
      city: 'Miami',
      state: 'FL',
      zipCode: '33139',
      phone: '+1 (555) 567-8901',
    },
    paymentMethod: 'Cash on Delivery',
    deliveryType: 'Standard Delivery',
    estimatedDeliveryTime: 'Delivered today',
  },
  {
    id: 'BR-9838-F6',
    userId: 'user-1',
    customerName: 'Sarah Connor',
    customerEmail: 'sarah@example.com',
    customerPhone: '+1 (555) 234-5678',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
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
  {
    id: 'BR-9837-G7',
    userId: 'user-1',
    customerName: 'Sarah Connor',
    customerEmail: 'sarah@example.com',
    customerPhone: '+1 (555) 234-5678',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    cancelledAt: new Date(Date.now() - 1000 * 60 * 60 * 23.5).toISOString(),
    status: 'Cancelled',
    deliveryPartner: {
      name: 'Liam Zhang',
      phone: '+1 (555) 293-8471',
      vehicle: 'Honda Super Cub (5AZ-912)',
      rating: 4.8,
    },
    items: [
      {
        item: {
          id: 4,
          name: 'Authentic Tonkotsu Ramen Bowl',
          price: 18.50,
          image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80',
          restaurantName: 'Golden Wok Dynasty',
        },
        quantity: 1,
      },
    ],
    financials: {
      subtotal: 18.50,
      discount: 0,
      deliveryFee: 2.99,
      tax: 1.48,
      total: 22.97,
    },
    shippingAddress: {
      title: 'Office',
      street: '99 Innovation Blvd, Suite 400',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94107',
      phone: '+1 (555) 234-5678',
    },
    paymentMethod: 'Instant UPI / QR Code',
    deliveryType: 'Standard Delivery',
    estimatedDeliveryTime: 'Order Cancelled',
  },
];

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
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
    couponCode = null,
    specialInstructions = '',
    user,
  }) => {
    if (!items || items.length === 0) {
      throw new Error('Cannot place an order with an empty cart.');
    }

    const estimatedDeliveryTime =
      deliveryType === 'express' ? '20-25 mins' : '35-45 mins';
    const estimatedArrivalTime = getEstimatedArrivalClockTime(deliveryType);

    const nowIso = new Date().toISOString();
    const newOrder = {
      id: generateOrderId(),
      userId: user?.id || 'guest',
      customerName: user?.name || shippingAddress.name || 'Valued Foodie',
      customerEmail: user?.email || 'customer@example.com',
      customerPhone: shippingAddress.phone || user?.phone || '+1 (555) 000-0000',
      customerAvatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      createdAt: nowIso,
      status: 'Confirmed',
      statusHistory: {
        Confirmed: nowIso,
      },
      deliveryPartner: {
        name: 'Diego Rivera',
        phone: '+1 (555) 432-8765',
        vehicle: 'Vespa Sprint (License: 9TX-501)',
        rating: 4.9,
      },
      items: [...items],
      financials: { ...financials },
      couponCode,
      shippingAddress: { ...shippingAddress },
      paymentMethod,
      deliveryType:
        deliveryType === 'express'
          ? 'Express Delivery (20-25 mins)'
          : 'Standard Delivery (35-45 mins)',
      specialInstructions,
      estimatedDeliveryTime,
      estimatedArrivalTime,
    };

    setOrders((prev) => [newOrder, ...prev]);
    customToast.orderPlaced(newOrder);
    return newOrder;
  };

  // Helper to resolve realistic estimated time message when status changes
  const resolveEstimatedTimeForStatus = (status, currentEstimate) => {
    switch (status) {
      case 'Confirmed':
        return '30-40 mins';
      case 'Preparing':
        return 'Preparing in Kitchen (~20 mins)';
      case 'Out for Delivery':
        return 'Arriving in ~10 mins';
      case 'Delivered':
        return 'Delivered';
      case 'Cancelled':
        return 'Order Cancelled';
      default:
        return currentEstimate || '25-35 mins';
    }
  };

  // Get single order by id
  const getOrderById = (orderId) => {
    return orders.find((o) => o.id === orderId);
  };

  // Cancel order
  const cancelOrder = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    if (order.status === 'Delivered') {
      customToast.error(
        'Action Not Allowed',
        'Cannot cancel an order that has already been delivered.'
      );
      return;
    }

    if (order.status === 'Cancelled') {
      customToast.info('Already Cancelled', 'This order has already been cancelled.');
      return;
    }

    const nowIso = new Date().toISOString();
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'Cancelled',
              cancelledAt: nowIso,
              estimatedDeliveryTime: 'Order Cancelled',
              statusHistory: { ...(o.statusHistory || {}), Cancelled: nowIso },
            }
          : o
      )
    );
    customToast.orderCancelled(orderId);
  };

  // Set specific status directly (for tracking / dashboard status management)
  const setOrderStatus = (orderId, newStatus) => {
    const nowIso = new Date().toISOString();
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          status: newStatus,
          ...(newStatus === 'Cancelled' ? { cancelledAt: nowIso } : {}),
          estimatedDeliveryTime: resolveEstimatedTimeForStatus(newStatus, o.estimatedDeliveryTime),
          statusHistory: { ...(o.statusHistory || {}), [newStatus]: nowIso },
        };
      })
    );
    if (newStatus === 'Cancelled') {
      customToast.orderCancelled(orderId);
    } else {
      customToast.orderStatusUpdated(orderId, newStatus);
    }
  };

  // Advance order status for demo simulation
  const advanceOrderStatus = (orderId) => {
    const statusFlow = ['Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const currentIndex = statusFlow.indexOf(order.status);
    if (currentIndex > -1 && currentIndex < statusFlow.length - 1) {
      const nextStatus = statusFlow[currentIndex + 1];
      setOrderStatus(orderId, nextStatus);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        getOrderById,
        cancelOrder,
        setOrderStatus,
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
