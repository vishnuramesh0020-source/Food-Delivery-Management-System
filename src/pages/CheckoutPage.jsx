import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  CreditCard,
  ShieldCheck,
  Plus,
  ArrowLeft,
  IndianRupee,
  Smartphone,
  Lock,
  Truck,
  Zap,
  Clock,
  MapPin,
  ShoppingBag,
  AlertTriangle,
  Utensils,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { formatCurrency, getEstimatedArrivalClockTime } from '../utils/helpers';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import customToast from '../utils/customToast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const { user, addAddress } = useAuth();
  const {
    cartItems,
    coupon,
    subtotal,
    discount,
    deliveryFee,
    tax,
    total,
    deliveryType,
    setDeliveryType,
    freeDeliveryThreshold,
    totalItemsCount,
    clearCart,
  } = useCart();
  const { placeOrder } = useOrder();

  const savedAddresses = user?.addresses || [];
  const defaultAddress = savedAddresses.find((a) => a.isDefault) || savedAddresses[0];

  const [selectedAddressId, setSelectedAddressId] = useState(
    defaultAddress?.id || 'addr-new'
  );
  const [showNewAddressForm, setShowNewAddressForm] = useState(
    savedAddresses.length === 0
  );
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const {
    register: registerAddress,
    handleSubmit: handleAddressSubmit,
    reset: resetAddressForm,
    formState: { errors: addressErrors },
  } = useForm({
    defaultValues: {
      title: 'Home',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      phone: user?.phone || '',
    },
  });

  const { register: registerCard } = useForm({
    defaultValues: {
      cardNumber: '4242 •••• •••• 4242',
      cardHolder: user?.name || 'Foodie User',
      expiry: '12/28',
      cvv: '888',
    },
  });

  const chosenAddress =
    savedAddresses.find((a) => a.id === selectedAddressId) || savedAddresses[0] || null;

  const estimatedDuration =
    deliveryType === 'express' ? '20-25 mins' : '35-45 mins';
  const estimatedArrivalClock = getEstimatedArrivalClockTime(deliveryType);

  const onSaveNewAddress = (data) => {
    const created = addAddress(data);
    if (created?.id) {
      setSelectedAddressId(created.id);
    }
    setShowNewAddressForm(false);
    resetAddressForm();
  };

  const handleCompleteOrder = async () => {
    // Prevent Empty Cart Checkout
    if (!cartItems || cartItems.length === 0) {
      customToast.error(
        'Empty Cart Blocked',
        'Please add food items to your cart before placing an order.'
      );
      navigate('/menu');
      return;
    }

    if (!chosenAddress) {
      customToast.error(
        'Delivery Address Required',
        'Please add and save a delivery address before placing your order.'
      );
      setShowNewAddressForm(true);
      return;
    }

    setIsPlacingOrder(true);
    try {
      await new Promise((res) => setTimeout(res, 750));

      const paymentLabel =
        paymentMethod === 'card'
          ? 'Credit Card (Visa ending in 4242)'
          : paymentMethod === 'cod'
          ? 'Cash on Delivery'
          : 'Instant UPI / QR Code';

      const newOrder = await placeOrder({
        items: cartItems,
        financials: {
          subtotal,
          discount,
          deliveryFee,
          tax,
          total,
        },
        shippingAddress: chosenAddress,
        paymentMethod: paymentLabel,
        deliveryType,
        couponCode: coupon?.code || null,
        specialInstructions,
        user,
      });

      setOrderPlaced(true);
      clearCart(true);
      navigate(`/order-success/${newOrder.id}`);
    } catch (err) {
      customToast.error(
        'Order Placement Failed',
        err.message || 'Unable to place your order right now. Please try again.'
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // PREVENT EMPTY CART CHECKOUT GUARD VIEW
  if (!orderPlaced && cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 sm:p-12 space-y-5">
          <div className="w-20 h-20 bg-rose-50 text-rose-500 border border-rose-200 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
            <AlertTriangle className="w-10 h-10" />
          </div>

          <span className="inline-block text-[11px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
            Empty Cart Protection Active
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Cannot Proceed With Empty Cart
          </h2>

          <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Your shopping cart is currently empty. Checkout is locked until you add at least one delicious dish to your order.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/menu" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" icon={Utensils} className="w-full shadow-md shadow-orange-500/20">
                Browse Delicious Menu
              </Button>
            </Link>
            <Link to="/cart" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" icon={ShoppingBag} className="w-full">
                View Cart
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-600 transition mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cart Management</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Secure Checkout
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Confirm your delivery address, estimated arrival window, and payment details to place your order.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200/70 text-orange-700 px-3.5 py-2 rounded-2xl text-xs font-bold self-start sm:self-auto">
            <Clock className="w-4 h-4 text-orange-600" />
            <span>
              Est. Delivery: <strong>{estimatedDuration}</strong> (by {estimatedArrivalClock})
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Address, Delivery Speed, Payment, Instructions */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: DELIVERY ADDRESS */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-sm">
                  1
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Delivery Address</h3>
                  <p className="text-xs text-slate-400">Select or add where your food should be delivered</p>
                </div>
              </div>

              {!showNewAddressForm && (
                <button
                  type="button"
                  onClick={() => setShowNewAddressForm(true)}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-xl flex items-center gap-1 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New</span>
                </button>
              )}
            </div>

            {savedAddresses.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {savedAddresses.map((addr) => {
                  const isSelected = chosenAddress?.id === addr.id;
                  return (
                    <label
                      key={addr.id}
                      onClick={() => {
                        setSelectedAddressId(addr.id);
                        setShowNewAddressForm(false);
                      }}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-start gap-3 ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50/30 ring-1 ring-orange-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={isSelected}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1 text-orange-500 focus:ring-orange-400"
                      />
                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-orange-500" />
                            <span>{addr.title || addr.label || 'Address'}</span>
                          </span>
                          {addr.isDefault && (
                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 font-medium">{addr.street}</p>
                        <p className="text-slate-500">
                          {addr.city}, {addr.state} {addr.zipCode}
                        </p>
                        <p className="text-slate-400 mt-1">{addr.phone}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            {showNewAddressForm && (
              <form
                onSubmit={handleAddressSubmit(onSaveNewAddress)}
                className="mt-4 p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Add New Delivery Address
                  </h4>
                  {savedAddresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowNewAddressForm(false)}
                      className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Address Label (Home, Work)"
                    placeholder="Home"
                    error={addressErrors.title}
                    {...registerAddress('title', { required: 'Label is required' })}
                  />
                  <Input
                    label="Contact Phone"
                    placeholder="+91 98765 43210"
                    error={addressErrors.phone}
                    {...registerAddress('phone', { required: 'Phone is required' })}
                  />
                </div>

                <Input
                  label="Street Address / Apartment"
                  placeholder="42 MG Road, Indiranagar"
                  error={addressErrors.street}
                  {...registerAddress('street', { required: 'Street address is required' })}
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    label="City"
                    placeholder="Bengaluru"
                    error={addressErrors.city}
                    {...registerAddress('city', { required: 'City is required' })}
                  />
                  <Input
                    label="State"
                    placeholder="KA"
                    error={addressErrors.state}
                    {...registerAddress('state', { required: 'State is required' })}
                  />
                  <Input
                    label="Postal / Zip Code"
                    placeholder="560038"
                    error={addressErrors.zipCode}
                    {...registerAddress('zipCode', { required: 'Postal code is required' })}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  {savedAddresses.length > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowNewAddressForm(false)}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button type="submit" variant="primary" size="sm">
                    Save & Use This Address
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* STEP 2: DELIVERY SPEED & ESTIMATED DELIVERY TIME */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-sm">
                  2
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Delivery Speed & ETA</h3>
                  <p className="text-xs text-slate-400">Choose your preferred arrival window</p>
                </div>
              </div>

              <span className="text-xs font-extrabold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
                Arrives ~{estimatedArrivalClock}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                onClick={() => setDeliveryType('standard')}
                className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition ${
                  deliveryType === 'standard'
                    ? 'border-orange-500 bg-orange-50/40 ring-1 ring-orange-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">Standard Delivery</span>
                    <span className="text-xs font-bold text-slate-700">
                      {subtotal >= freeDeliveryThreshold || coupon?.freeShipping
                        ? 'FREE'
                        : formatCurrency(2.99)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Est. 35 - 45 mins delivery time</p>
                </div>
              </label>

              <label
                onClick={() => setDeliveryType('express')}
                className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition ${
                  deliveryType === 'express'
                    ? 'border-orange-500 bg-orange-50/40 ring-1 ring-orange-500'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">Priority Express</span>
                    <span className="text-xs font-bold text-orange-600">
                      {'+' + formatCurrency(2.50)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Est. 20 - 25 mins direct dispatch</p>
                </div>
              </label>
            </div>
          </div>

          {/* STEP 3: PAYMENT METHOD */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-sm">
                3
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Payment Method</h3>
                <p className="text-xs text-slate-400">All transactions are encrypted and 100% secure</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-orange-500 bg-orange-50/30 text-orange-700 ring-1 ring-orange-500'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-xs font-bold">Credit/Debit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                  paymentMethod === 'cod'
                    ? 'border-orange-500 bg-orange-50/30 text-orange-700 ring-1 ring-orange-500'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                }`}
              >
                <IndianRupee className="w-5 h-5" />
                <span className="text-xs font-bold">Cash on Delivery</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'border-orange-500 bg-orange-50/30 text-orange-700 ring-1 ring-orange-500'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                }`}
              >
                <Smartphone className="w-5 h-5" />
                <span className="text-xs font-bold">UPI / QR Code</span>
              </button>
            </div>

            {paymentMethod === 'card' && (
              <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>256-Bit SSL Encrypted Card Details</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Test Card Pre-filled</span>
                </div>

                <Input
                  label="Card Number"
                  placeholder="4242 •••• •••• 4242"
                  icon={CreditCard}
                  {...registerCard('cardNumber')}
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Expiration Date"
                    placeholder="MM/YY"
                    {...registerCard('expiry')}
                  />
                  <Input
                    label="CVV / CVC"
                    placeholder="888"
                    type="password"
                    maxLength={4}
                    {...registerCard('cvv')}
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
                <IndianRupee className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block">Pay with Cash on Delivery</span>
                  <span>
                    Please keep exact change ready upon arrival. Our courier partner will provide an instant printed receipt.
                  </span>
                </div>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 text-center space-y-2">
                <Smartphone className="w-6 h-6 text-blue-600 mx-auto" />
                <div className="font-bold">Instant UPI QR Code Checkout</div>
                <p className="text-[11px] text-blue-700">
                  Your order confirms instantly via any UPI app (GPay, PhonePe, Paytm, BHIM).
                </p>
              </div>
            )}
          </div>

          {/* STEP 4: SPECIAL INSTRUCTIONS */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900">
              Delivery Notes & Instructions (Optional)
            </h3>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={2}
              placeholder="e.g. Please leave bag at front door, ring doorbell once, call on arrival..."
              className="w-full text-xs p-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>
        </div>

        {/* Right Column: Sticky Order Summary */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">Order Summary</h3>
              <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full">
                {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
              </span>
            </div>

            {/* Active Delivery Address Preview */}
            {chosenAddress && (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-500" />
                    Deliver to {chosenAddress.title || chosenAddress.label || 'Address'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">
                  {chosenAddress.street}, {chosenAddress.city}
                </p>
              </div>
            )}

            {/* Estimated Delivery Time Preview */}
            <div className="p-3 bg-orange-50/70 rounded-2xl border border-orange-200/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-bold text-orange-900">
                <Clock className="w-4 h-4 text-orange-600" />
                <span>Estimated Delivery</span>
              </div>
              <div className="text-right">
                <span className="font-black text-orange-700 block">{estimatedDuration}</span>
                <span className="text-[10px] text-orange-600 font-semibold">~{estimatedArrivalClock}</span>
              </div>
            </div>

            {/* Items List */}
            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1">
              {cartItems.map((ci) => (
                <div key={ci.item.id} className="py-2.5 flex justify-between items-start gap-2 text-xs">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          ci.item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                      />
                      <span className="font-bold text-slate-800">{ci.quantity}x</span>
                      <span className="text-slate-700 font-semibold truncate">{ci.item.name}</span>
                    </div>
                    {ci.instructions && (
                      <p className="text-[10px] text-slate-400 italic truncate ml-3">
                        &quot;{ci.instructions}&quot;
                      </p>
                    )}
                  </div>
                  <span className="font-black text-slate-900 shrink-0">
                    {formatCurrency(ci.item.price * ci.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial Totals */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-800">{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Promo Discount {coupon?.code ? `(${coupon.code})` : ''}</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Delivery ({deliveryType === 'express' ? 'Express' : 'Standard'})</span>
                <span className="font-bold text-slate-800">
                  {deliveryFee === 0 ? <span className="text-emerald-600 font-black">FREE</span> : formatCurrency(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Sales Tax (8%)</span>
                <span className="font-bold text-slate-800">{formatCurrency(tax)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-slate-900">
              <div>
                <span className="text-[10px] text-slate-400 block font-black uppercase tracking-wider">
                  Total Payable
                </span>
                <span className="text-2xl font-black">{formatCurrency(total)}</span>
              </div>
            </div>

            <Button
              onClick={handleCompleteOrder}
              variant="primary"
              size="lg"
              className="w-full shadow-lg shadow-orange-500/25"
              isLoading={isPlacingOrder}
            >
              Place Order • {formatCurrency(total)}
            </Button>

            <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe & Secure 256-bit Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
