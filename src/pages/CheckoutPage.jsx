import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  CreditCard,
  ShieldCheck,
  Plus,
  ArrowLeft,
  DollarSign,
  Smartphone,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { formatCurrency } from '../utils/helpers';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, addAddress } = useAuth();
  const {
    cartItems,
    subtotal,
    discount,
    deliveryFee,
    tax,
    total,
    deliveryType,
    clearCart,
  } = useCart();
  const { placeOrder } = useOrder();

  const [selectedAddressId, setSelectedAddressId] = useState(
    user?.addresses?.[0]?.id || 'addr-new'
  );
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
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
      state: 'NY',
      zipCode: '',
      phone: user?.phone || '',
    },
  });

  const {
    register: registerCard,
  } = useForm({
    defaultValues: {
      cardNumber: '4242 •••• •••• 4242',
      cardHolder: user?.name || 'Sarah Connor',
      expiry: '12/28',
      cvv: '888',
    },
  });

  const onSaveNewAddress = (data) => {
    addAddress(data);
    setShowNewAddressForm(false);
    resetAddressForm();
    toast.success('New delivery address saved!');
  };

  const handleCompleteOrder = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty.');
      navigate('/menu');
      return;
    }

    let chosenAddress = user?.addresses?.find((a) => a.id === selectedAddressId);
    if (!chosenAddress && user?.addresses?.length > 0) {
      chosenAddress = user.addresses[0];
    } else if (!chosenAddress) {
      toast.error('Please specify or add a delivery address.');
      setShowNewAddressForm(true);
      return;
    }

    setIsPlacingOrder(true);
    try {
      await new Promise((res) => setTimeout(res, 800));

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
        paymentMethod:
          paymentMethod === 'card'
            ? 'Credit Card (Visa ending in 4242)'
            : paymentMethod === 'cod'
            ? 'Cash on Delivery'
            : 'Instant UPI / QR Code',
        deliveryType,
        specialInstructions,
        user,
      });

      clearCart();
      navigate(`/order-success/${newOrder.id}`);
    } catch (err) {
      toast.error(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <h2 className="text-2xl font-black text-slate-800 mb-2">No Items in Cart</h2>
        <p className="text-slate-500 mb-6">Please add items to your cart before proceeding to checkout.</p>
        <Link to="/menu">
          <Button variant="primary">Browse Menu</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-600 transition mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Cart
        </Link>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Secure Checkout
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your delivery details, payment method, and complete your order.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
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
                  <p className="text-xs text-slate-400">Where should we deliver your food?</p>
                </div>
              </div>

              {!showNewAddressForm && (
                <button
                  type="button"
                  onClick={() => setShowNewAddressForm(true)}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {(user?.addresses || []).map((addr) => {
                const isSelected = selectedAddressId === addr.id;
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
                        <span className="font-extrabold text-slate-900 text-sm">
                          {addr.title}
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

            {showNewAddressForm && (
              <form
                onSubmit={handleAddressSubmit(onSaveNewAddress)}
                className="mt-4 p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Add New Delivery Address
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowNewAddressForm(false)}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Label (e.g. Home, Office)"
                    placeholder="Home"
                    error={addressErrors.title}
                    {...registerAddress('title', { required: 'Label is required' })}
                  />
                  <Input
                    label="Contact Phone"
                    placeholder="+1 (555) 000-0000"
                    error={addressErrors.phone}
                    {...registerAddress('phone', { required: 'Phone is required' })}
                  />
                </div>

                <Input
                  label="Street Address"
                  placeholder="123 Main Street, Apt 4"
                  error={addressErrors.street}
                  {...registerAddress('street', { required: 'Street is required' })}
                />

                <div className="grid grid-cols-3 gap-3">
                  <Input
                    label="City"
                    placeholder="New York"
                    error={addressErrors.city}
                    {...registerAddress('city', { required: 'City is required' })}
                  />
                  <Input
                    label="State"
                    placeholder="NY"
                    error={addressErrors.state}
                    {...registerAddress('state', { required: 'State is required' })}
                  />
                  <Input
                    label="Zip Code"
                    placeholder="10001"
                    error={addressErrors.zipCode}
                    {...registerAddress('zipCode', { required: 'Zip code is required' })}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNewAddressForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Save Address
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* STEP 2: PAYMENT METHOD */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-sm">
                2
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Payment Method</h3>
                <p className="text-xs text-slate-400">All transactions are encrypted and 100% secure</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
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
                <DollarSign className="w-5 h-5" />
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
                  <span className="text-[11px] text-slate-400">Mock Card Pre-filled</span>
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
                <DollarSign className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block">Pay with Cash on Delivery</span>
                  <span>
                    Please keep exact cash ready upon arrival. Our courier partner will provide an instant printed receipt.
                  </span>
                </div>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 text-center space-y-2">
                <Smartphone className="w-6 h-6 text-blue-600 mx-auto" />
                <div className="font-bold">Instant UPI QR Code Checkout</div>
                <p className="text-[11px] text-blue-700">
                  A dynamic UPI QR code will be provided to scan from any app (GPay, PhonePe, Paytm).
                </p>
              </div>
            )}
          </div>

          {/* STEP 3: SPECIAL INSTRUCTIONS */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900">
              Delivery Notes & Instructions (Optional)
            </h3>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={2}
              placeholder="e.g. Please leave bag at front door, ring doorbell once, do not disturb pets..."
              className="w-full text-xs p-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
            <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
              Order Review ({cartItems.length} items)
            </h3>

            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1">
              {cartItems.map((ci) => (
                <div key={ci.item.id} className="py-2.5 flex justify-between items-center text-xs">
                  <div className="truncate max-w-[70%]">
                    <span className="font-bold text-slate-800">{ci.quantity}x </span>
                    <span className="text-slate-700 font-medium">{ci.item.name}</span>
                  </div>
                  <span className="font-black text-slate-900">
                    {formatCurrency(ci.item.price * ci.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-bold text-slate-800">{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Delivery ({deliveryType})</span>
                <span className="font-bold text-slate-800">
                  {deliveryFee === 0 ? <span className="text-emerald-600">FREE</span> : formatCurrency(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Sales Tax (8%)</span>
                <span className="font-bold text-slate-800">{formatCurrency(tax)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-slate-900">
              <div>
                <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider">
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
