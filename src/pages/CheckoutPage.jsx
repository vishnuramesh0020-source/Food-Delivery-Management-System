import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  CreditCard,
  Plus,
  ArrowLeft,
  IndianRupee,
  Smartphone,
  Truck,
  Zap,
  Clock,
  MapPin,
  ShoppingBag,
  AlertTriangle,
  Utensils,
  Wallet,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import {
  formatCurrency,
  getEstimatedArrivalClockTime,
  generateTransactionId,
} from '../utils/helpers';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import customToast from '../utils/customToast';
import CardPaymentForm from '../components/payment/CardPaymentForm';
import UpiPaymentForm from '../components/payment/UpiPaymentForm';
import WalletPaymentForm from '../components/payment/WalletPaymentForm';
import PaymentSummaryCard from '../components/payment/PaymentSummaryCard';
import CouponModal from '../components/cart/CouponModal';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const { user, addAddress } = useAuth();
  const {
    cartItems,
    coupon,
    applyCoupon,
    removeCoupon,
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

  // Payment Method selection: 'card' | 'upi' | 'wallet' | 'cod'
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // State for Payment Sub-Forms
  const [cardData, setCardData] = useState({
    cardNumber: '4532 8920 1234 5678',
    cardHolder: user?.name ? user.name.toUpperCase() : 'GOURMET FOODIE',
    expiry: '12/28',
    cvv: '888',
  });

  const [upiData, setUpiData] = useState({
    methodType: 'qr', // 'qr', 'app', 'vpa'
    selectedApp: 'gpay',
    vpa: 'foodie@okaxis',
  });

  const [walletData, setWalletData] = useState({
    selectedWallet: 'biterush',
    walletName: 'BiteRush Cash Wallet',
  });

  // Modal for browsing coupons
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  // Testing & Evaluation: Simulate Payment Failure Toggle
  const [simulateFailure, setSimulateFailure] = useState(false);

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
      await new Promise((res) => setTimeout(res, 800));

      // Resolve human-readable payment method description
      let paymentLabel = 'Credit/Debit Card';
      let methodCategory = 'CARD';

      if (paymentMethod === 'card') {
        const last4 = cardData.cardNumber.replace(/\s+/g, '').slice(-4) || '4242';
        paymentLabel = `Card (Visa ending in ${last4})`;
        methodCategory = 'CARD';
      } else if (paymentMethod === 'upi') {
        methodCategory = 'UPI';
        if (upiData.methodType === 'qr') {
          paymentLabel = 'UPI (Scanned Dynamic QR)';
        } else if (upiData.methodType === 'app') {
          paymentLabel = `UPI App (${upiData.selectedApp.toUpperCase()})`;
        } else {
          paymentLabel = `UPI VPA (${upiData.vpa || 'instant@upi'})`;
        }
      } else if (paymentMethod === 'wallet') {
        methodCategory = 'WALLET';
        paymentLabel = `${walletData.walletName || 'BiteRush Wallet'} (Digital)`;
      } else if (paymentMethod === 'cod') {
        methodCategory = 'COD';
        paymentLabel = 'Cash on Delivery';
      }

      // Check if simulation failure was requested or CVV is '000' (standard test decline trigger)
      const isCardDecline = paymentMethod === 'card' && cardData.cvv === '000';
      if (simulateFailure || isCardDecline) {
        const transactionId = generateTransactionId(methodCategory);
        const declineReason = isCardDecline
          ? 'Transaction declined by issuer: Invalid CVV / security authentication failed (CVV 000).'
          : 'Payment Gateway Timeout: 3D Secure bank authorization was declined by issuer.';

        customToast.error('Payment Failed', declineReason);

        navigate('/payment-failed', {
          state: {
            reason: declineReason,
            transactionId,
            paymentMethod: paymentLabel,
            amount: total,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          },
        });
        return;
      }

      // Successful flow
      const transactionId = generateTransactionId(methodCategory);

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
        transactionId,
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
      {/* Top Header */}
      <div>
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-600 transition mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cart</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Secure Checkout & Payment
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Select delivery destination, choose speed, apply coupons, and complete payment.
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
        {/* Left Column: Address, Speed, Payment Forms */}
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
                  <p className="text-xs text-slate-400">Select where your food will be delivered</p>
                </div>
              </div>

              {!showNewAddressForm && (
                <button
                  type="button"
                  onClick={() => setShowNewAddressForm(true)}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-xl flex items-center gap-1 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
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
                    label="Address Label (Home, Work, Office)"
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
                  label="Street Address / Building"
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

          {/* STEP 2: DELIVERY SPEED & ETA */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-sm">
                  2
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Delivery Speed</h3>
                  <p className="text-xs text-slate-400">Choose your preferred delivery window</p>
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
                  <p className="text-xs text-slate-500 mt-0.5">Est. 35 - 45 mins delivery window</p>
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
                      {coupon?.freeShipping ? 'FREE' : '+' + formatCurrency(2.50)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Est. 20 - 25 mins direct dispatch</p>
                </div>
              </label>
            </div>
          </div>

          {/* STEP 3: PAYMENT METHOD (CARD, UPI, WALLET, COD) */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-sm">
                  3
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Select Payment Method</h3>
                  <p className="text-xs text-slate-400">All transactions are 256-bit SSL secured & encrypted</p>
                </div>
              </div>

              <span className="text-[11px] font-black uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                Safe & Verified
              </span>
            </div>

            {/* 4 Payment Category Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition cursor-pointer text-center ${
                  paymentMethod === 'card'
                    ? 'border-orange-500 bg-orange-50/40 text-orange-800 ring-1 ring-orange-500 font-extrabold shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white font-bold'
                }`}
              >
                <CreditCard className="w-5 h-5 text-orange-600" />
                <span className="text-xs">Credit / Debit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition cursor-pointer text-center ${
                  paymentMethod === 'upi'
                    ? 'border-orange-500 bg-orange-50/40 text-orange-800 ring-1 ring-orange-500 font-extrabold shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white font-bold'
                }`}
              >
                <Smartphone className="w-5 h-5 text-blue-600" />
                <span className="text-xs">Instant UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition cursor-pointer text-center ${
                  paymentMethod === 'wallet'
                    ? 'border-orange-500 bg-orange-50/40 text-orange-800 ring-1 ring-orange-500 font-extrabold shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white font-bold'
                }`}
              >
                <Wallet className="w-5 h-5 text-emerald-600" />
                <span className="text-xs">Digital Wallets</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 transition cursor-pointer text-center ${
                  paymentMethod === 'cod'
                    ? 'border-orange-500 bg-orange-50/40 text-orange-800 ring-1 ring-orange-500 font-extrabold shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white font-bold'
                }`}
              >
                <IndianRupee className="w-5 h-5 text-amber-600" />
                <span className="text-xs">Cash on Delivery</span>
              </button>
            </div>

            {/* Active Payment Method UI View */}
            <div>
              {paymentMethod === 'card' && (
                <CardPaymentForm
                  cardData={cardData}
                  onChange={setCardData}
                  onAutofill={() => {
                    setCardData({
                      cardNumber: '4532 8920 1234 5678',
                      cardHolder: user?.name ? user.name.toUpperCase() : 'CHEF GOURMET',
                      expiry: '09/29',
                      cvv: '888',
                    });
                  }}
                />
              )}

              {paymentMethod === 'upi' && (
                <UpiPaymentForm
                  upiData={upiData}
                  onChange={setUpiData}
                  totalAmount={total}
                />
              )}

              {paymentMethod === 'wallet' && (
                <WalletPaymentForm
                  walletData={walletData}
                  onChange={setWalletData}
                  totalAmount={total}
                />
              )}

              {paymentMethod === 'cod' && (
                <div className="p-5 bg-amber-50 border border-amber-200 rounded-3xl text-xs text-amber-900 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <IndianRupee className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-extrabold text-sm block">Pay Cash on Delivery</span>
                    <p className="leading-relaxed">
                      Please keep exact cash ready upon arrival. Our courier executive will hand over the food package and provide an instant printed invoice.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* STEP 4: SPECIAL INSTRUCTIONS */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900">
              Delivery Notes & Special Instructions (Optional)
            </h3>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={2}
              placeholder="e.g. Please leave bag at front door, ring bell once, call on arrival..."
              className="w-full text-xs p-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
            />
          </div>
        </div>

        {/* Right Column: Sticky Payment Summary */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <PaymentSummaryCard
            cartItems={cartItems}
            subtotal={subtotal}
            discount={discount}
            coupon={coupon}
            deliveryFee={deliveryFee}
            deliveryType={deliveryType}
            tax={tax}
            total={total}
            totalItemsCount={totalItemsCount}
            chosenAddress={chosenAddress}
            estimatedDuration={estimatedDuration}
            estimatedArrivalClock={estimatedArrivalClock}
            onOpenCouponModal={() => setIsCouponModalOpen(true)}
            onRemoveCoupon={removeCoupon}
            isPlacingOrder={isPlacingOrder}
            onPlaceOrder={handleCompleteOrder}
            simulateFailure={simulateFailure}
            setSimulateFailure={setSimulateFailure}
          />
        </div>
      </div>

      {/* Coupon Modal */}
      <CouponModal
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
        currentSubtotal={subtotal}
        appliedCoupon={coupon}
        onApplyCoupon={applyCoupon}
      />
    </div>
  );
};

export default CheckoutPage;
