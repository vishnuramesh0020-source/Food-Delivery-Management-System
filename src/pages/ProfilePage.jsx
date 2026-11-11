import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Heart,
  Plus,
  Trash2,
  Edit2,
  LogOut,
  Save,
  Camera,
  Upload,
  Check,
  CheckCircle2,
  Briefcase,
  Home,
  AlertCircle,
  Image as ImageIcon,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { FALLBACK_RECIPES } from '../api/mockData';
import { formatCurrency, calculateFoodPrice, getRestaurantName } from '../utils/helpers';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import customToast from '../utils/customToast';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
];

const ADDRESS_LABELS = ['Home', 'Work', 'Studio', 'Other'];
const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

const ProfilePage = () => {
  const {
    user,
    updateProfile,
    addAddress,
    updateAddress,
    setDefaultAddress,
    removeAddress,
    logout,
  } = useAuth();
  const { orders } = useOrder();
  const { favorites, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();

  const fileInputRef = useRef(null);
  const profileEditorRef = useRef(null);

  const [activeTab, setActiveTab] = useState('profile');
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || DEFAULT_AVATAR);
  const [avatarError, setAvatarError] = useState(false);

  // Address Management States
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deletingAddress, setDeletingAddress] = useState(null);

  // Profile Edit Form (Name, Email, Mobile Number, Profile Image)
  const {
    register: registerInfo,
    handleSubmit: handleInfoSubmit,
    reset: resetInfoForm,
    formState: { errors: infoErrors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  // Delivery Address Add/Edit Form
  const {
    register: registerAddr,
    handleSubmit: handleAddrSubmit,
    reset: resetAddrForm,
    setValue: setAddrValue,
    formState: { errors: addrErrors },
  } = useForm({
    defaultValues: {
      title: 'Home',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      phone: user?.phone || '',
      isDefault: false,
    },
  });

  const [selectedAddressLabel, setSelectedAddressLabel] = useState('Home');

  // Sync form values when entering edit mode or when user changes
  useEffect(() => {
    resetInfoForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
  }, [user, resetInfoForm]);

  const handleOpenEditProfile = () => {
    setAvatarUrl(user?.avatar || DEFAULT_AVATAR);
    setAvatarError(false);
    resetInfoForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setActiveTab('profile');
    setIsEditingInfo(true);
    setTimeout(() => {
      profileEditorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 60);
  };

  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      customToast.error('Invalid File', 'Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      customToast.error('File Too Large', 'Please choose an image smaller than 2 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
        setAvatarError(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const onUpdateInfo = (data) => {
    const result = updateProfile({
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      avatar: avatarUrl.trim() || DEFAULT_AVATAR,
    });

    if (result?.success !== false) {
      setIsEditingInfo(false);
    }
  };

  const handleOpenAddAddress = () => {
    setEditingAddress(null);
    setSelectedAddressLabel('Home');
    resetAddrForm({
      title: 'Home',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      phone: user?.phone || '',
      isDefault: (user?.addresses?.length || 0) === 0,
    });
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr) => {
    setEditingAddress(addr);
    const label = addr.title || addr.label || 'Home';
    setSelectedAddressLabel(label);
    resetAddrForm({
      title: label,
      street: addr.street || '',
      city: addr.city || '',
      state: addr.state || '',
      zipCode: addr.zipCode || '',
      phone: addr.phone || user?.phone || '',
      isDefault: Boolean(addr.isDefault),
    });
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = (data) => {
    const payload = {
      ...data,
      title: data.title.trim(),
      street: data.street.trim(),
      city: data.city.trim(),
      state: data.state.trim(),
      zipCode: data.zipCode.trim(),
      phone: data.phone.trim(),
      isDefault: Boolean(data.isDefault),
    };

    if (editingAddress) {
      updateAddress(editingAddress.id, payload);
    } else {
      addAddress(payload);
    }

    setIsAddressModalOpen(false);
    setEditingAddress(null);
    resetAddrForm();
  };

  const handleConfirmDeleteAddress = () => {
    if (deletingAddress) {
      removeAddress(deletingAddress.id);
      setDeletingAddress(null);
    }
  };

  const getAddressIcon = (label = '') => {
    const lower = label.toLowerCase();
    if (lower.includes('work') || lower.includes('office')) return Briefcase;
    if (lower.includes('home')) return Home;
    return MapPin;
  };

  const savedAddresses = user?.addresses || [];

  const favoriteItems = FALLBACK_RECIPES.filter((r) => favorites.includes(r.id)).map((r) => ({
    ...r,
    price: calculateFoodPrice(r),
    restaurantName: getRestaurantName(r),
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. CUSTOMER PROFILE HEADER BANNER */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          {/* Interactive Profile Avatar with Edit Photo Trigger */}
          <div className="relative group shrink-0">
            <img
              src={user?.avatar || DEFAULT_AVATAR}
              alt={user?.name}
              onError={(e) => {
                e.currentTarget.src = DEFAULT_AVATAR;
              }}
              className="w-24 h-24 rounded-3xl object-cover border-4 border-orange-100 shadow-md"
            />
            <button
              type="button"
              onClick={handleOpenEditProfile}
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-md flex items-center justify-center border-2 border-white transition active:scale-95 cursor-pointer"
              title="Change Profile Image"
              aria-label="Change Profile Image"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {user?.name}
              </h1>
              <span className="bg-orange-100 text-orange-700 font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-full">
                Gold Foodie
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 justify-center sm:justify-start pt-0.5">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-orange-500" />
                <span className="font-semibold text-slate-700">{user?.email}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-orange-500" />
                <span className="font-semibold text-slate-700">
                  {user?.phone || 'No mobile number set'}
                </span>
              </span>
            </div>

            {user?.createdAt && (
              <p className="text-[11px] text-slate-400 flex items-center gap-1 justify-center sm:justify-start pt-0.5">
                <Calendar className="w-3 h-3" />
                <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
              </p>
            )}
          </div>
        </div>

        {/* Summary Counters */}
        <div className="flex items-center gap-3 sm:gap-4 bg-slate-50 border border-slate-100 p-3.5 rounded-2xl shrink-0">
          <Link to="/orders" className="text-center px-2.5 hover:opacity-80 transition">
            <span className="text-lg font-black text-slate-900 block">{orders.length}</span>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Orders</span>
          </Link>
          <div className="w-px h-8 bg-slate-200" />
          <button
            type="button"
            onClick={() => setActiveTab('addresses')}
            className="text-center px-2.5 hover:opacity-80 transition cursor-pointer"
          >
            <span className="text-lg font-black text-emerald-600 block">
              {savedAddresses.length}
            </span>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Addresses</span>
          </button>
          <div className="w-px h-8 bg-slate-200" />
          <button
            type="button"
            onClick={() => setActiveTab('favorites')}
            className="text-center px-2.5 hover:opacity-80 transition cursor-pointer"
          >
            <span className="text-lg font-black text-orange-600 block">{favorites.length}</span>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Favorites</span>
          </button>
        </div>
      </div>

      {/* 2. NAVIGATION TABS */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Details</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('addresses')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition cursor-pointer ${
            activeTab === 'addresses'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Addresses ({savedAddresses.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition cursor-pointer ${
            activeTab === 'favorites'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Favorite Dishes ({favorites.length})</span>
        </button>
      </div>

      {/* 3. TAB 1: VIEW & EDIT CUSTOMER PROFILE */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: View / Edit Personal Information */}
          <div
            ref={profileEditorRef}
            className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs space-y-6"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {isEditingInfo ? 'Edit Customer Profile' : 'Personal Information'}
                </h3>
                <p className="text-xs text-slate-400">
                  Manage your full name, email address, mobile number, and profile image
                </p>
              </div>
              {!isEditingInfo && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={Edit2}
                  onClick={handleOpenEditProfile}
                >
                  Edit Profile
                </Button>
              )}
            </div>

            {isEditingInfo ? (
              <form onSubmit={handleInfoSubmit(onUpdateInfo)} className="space-y-6">
                {/* Profile Image Upload & Preset Picker UI */}
                <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/70 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={avatarError ? DEFAULT_AVATAR : avatarUrl || DEFAULT_AVATAR}
                        alt="Profile preview"
                        onError={() => setAvatarError(true)}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-200 shadow-sm bg-white shrink-0"
                      />
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                          Profile Image
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Upload a photo, choose an avatar preset, or paste an image URL
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        icon={Upload}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Upload Photo
                      </Button>
                    </div>
                  </div>

                  {/* Quick Avatar Presets Row */}
                  <div>
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Or Select a Preset Avatar
                    </span>
                    <div className="flex flex-wrap items-center gap-2.5">
                      {PRESET_AVATARS.map((presetUrl, index) => {
                        const isSelected = avatarUrl === presetUrl;
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              setAvatarUrl(presetUrl);
                              setAvatarError(false);
                            }}
                            className={`relative w-11 h-11 rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                              isSelected
                                ? 'border-orange-500 ring-2 ring-orange-500/30 scale-105'
                                : 'border-slate-200 hover:border-orange-300'
                            }`}
                          >
                            <img
                              src={presetUrl}
                              alt={`Avatar preset ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {isSelected && (
                              <div className="absolute inset-0 bg-orange-500/30 flex items-center justify-center">
                                <Check className="w-4 h-4 text-white drop-shadow" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Image URL Input */}
                  <div>
                    <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Profile Image URL
                    </label>
                    <div className="relative">
                      <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={avatarUrl.startsWith('data:') ? '' : avatarUrl}
                        onChange={(e) => {
                          setAvatarUrl(e.target.value);
                          setAvatarError(false);
                        }}
                        placeholder={
                          avatarUrl.startsWith('data:')
                            ? 'Uploaded custom photo selected (or paste external image URL here)'
                            : 'https://example.com/your-photo.jpg'
                        }
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact & Identity Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    placeholder="Sarah Connor"
                    icon={User}
                    error={infoErrors.name}
                    {...registerInfo('name', {
                      required: 'Full name is required',
                      minLength: { value: 2, message: 'Name must be at least 2 characters' },
                    })}
                  />

                  <Input
                    label="Mobile Number"
                    placeholder="+91 98765 43210"
                    icon={Phone}
                    error={infoErrors.phone}
                    {...registerInfo('phone', {
                      required: 'Mobile number is required',
                      pattern: {
                        value: /^[+]?[\d\s()-]{7,20}$/,
                        message: 'Enter a valid mobile number',
                      },
                    })}
                  />
                </div>

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="sarah@example.com"
                  icon={Mail}
                  error={infoErrors.email}
                  {...registerInfo('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Enter a valid email address',
                    },
                  })}
                />

                <div className="flex items-center gap-2.5 pt-2">
                  <Button type="submit" variant="primary" size="md" icon={Save}>
                    Save Profile Changes
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="md"
                    onClick={() => setIsEditingInfo(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <span className="text-slate-400 font-semibold flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    Full Name
                  </span>
                  <span className="font-bold text-slate-900">{user?.name}</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <span className="text-slate-400 font-semibold flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    Email Address
                  </span>
                  <span className="font-bold text-slate-900">{user?.email}</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <span className="text-slate-400 font-semibold flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    Mobile Number
                  </span>
                  <span className="font-bold text-slate-900">
                    {user?.phone || 'Not provided'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <span className="text-slate-400 font-semibold flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-slate-400" />
                    Profile Image
                  </span>
                  <button
                    type="button"
                    onClick={handleOpenEditProfile}
                    className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1.5 cursor-pointer"
                  >
                    <img
                      src={user?.avatar || DEFAULT_AVATAR}
                      alt={user?.name}
                      className="w-6 h-6 rounded-lg object-cover border border-slate-200"
                    />
                    <span>Change Photo</span>
                  </button>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs text-slate-400">Want to switch customer accounts?</span>
              <button
                type="button"
                onClick={logout}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Right: Quick Default Address Card */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span>Primary Address</span>
              </h4>
              <button
                type="button"
                onClick={() => setActiveTab('addresses')}
                className="text-xs font-bold text-orange-600 hover:underline cursor-pointer"
              >
                Manage All ({savedAddresses.length})
              </button>
            </div>

            {savedAddresses.length > 0 ? (
              (() => {
                const primary = savedAddresses.find((a) => a.isDefault) || savedAddresses[0];
                return (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-sm">
                        {primary.title || primary.label || 'Home'}
                      </span>
                      <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    </div>
                    <p className="text-slate-600 font-medium">{primary.street}</p>
                    <p className="text-slate-500">
                      {primary.city}, {primary.state} {primary.zipCode}
                    </p>
                    <p className="text-slate-400 pt-1 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {primary.phone}
                    </p>
                  </div>
                );
              })()
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 text-center space-y-2">
                <p className="text-xs text-slate-500">No delivery address saved yet.</p>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Plus}
                  onClick={() => {
                    setActiveTab('addresses');
                    handleOpenAddAddress();
                  }}
                >
                  Add Address
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. TAB 2: DELIVERY ADDRESS MANAGEMENT & SAVED ADDRESSES */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                Saved Delivery Addresses
              </h3>
              <p className="text-xs text-slate-400">
                Add, edit, delete, or set a default drop-off address for faster checkout
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              icon={Plus}
              onClick={handleOpenAddAddress}
            >
              Add New Address
            </Button>
          </div>

          {savedAddresses.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mx-auto">
                <MapPin className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-800">No Saved Addresses</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Save your home, office, or preferred delivery locations here to speed up every order checkout.
              </p>
              <Button variant="primary" size="md" icon={Plus} onClick={handleOpenAddAddress}>
                Add First Address
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {savedAddresses.map((addr) => {
                const LabelIcon = getAddressIcon(addr.title || addr.label);
                return (
                  <div
                    key={addr.id}
                    className={`bg-white rounded-3xl border p-6 shadow-xs flex flex-col justify-between space-y-4 transition ${
                      addr.isDefault
                        ? 'border-emerald-300 ring-1 ring-emerald-500/20'
                        : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                          <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
                            <LabelIcon className="w-4 h-4" />
                          </div>
                          <span>{addr.title || addr.label || 'Address'}</span>
                        </span>
                        {addr.isDefault && (
                          <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Default
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 text-xs">
                        <p className="text-slate-700 font-semibold">{addr.street}</p>
                        <p className="text-slate-500">
                          {addr.city}, {addr.state} {addr.zipCode}
                        </p>
                        <p className="text-slate-400 pt-1.5 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{addr.phone}</span>
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                      {!addr.isDefault ? (
                        <button
                          type="button"
                          onClick={() => setDefaultAddress(addr.id)}
                          className="font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-2.5 py-1.5 rounded-xl transition cursor-pointer"
                        >
                          Set as Default
                        </button>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-400">
                          Primary address
                        </span>
                      )}

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditAddress(addr)}
                          className="p-2 rounded-xl text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition cursor-pointer"
                          title="Edit address"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingAddress(addr)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Delete address"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 5. TAB 3: FAVORITE DISHES */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-base">Your Favorite Dishes</h3>
            <span className="text-xs text-slate-400">{favorites.length} saved meals</span>
          </div>

          {favoriteItems.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center text-xs text-slate-400">
              No favorites saved yet. Click the heart icon on any dish to save it here!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favoriteItems.map((food) => (
                <div
                  key={food.id}
                  className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs flex flex-col"
                >
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] text-orange-600 font-bold uppercase mb-1">
                        {food.restaurantName}
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 mb-1">{food.name}</h4>
                      <div className="text-xs font-black text-slate-900 mb-3">
                        {formatCurrency(food.price)}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        onClick={() => addToCart(food, 1)}
                      >
                        Add to Cart
                      </Button>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(food)}
                        className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                        title="Remove favorite"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. ADD / EDIT SAVED ADDRESS MODAL */}
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => {
          setIsAddressModalOpen(false);
          setEditingAddress(null);
        }}
        title={editingAddress ? 'Edit Saved Delivery Address' : 'Add New Delivery Address'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleAddrSubmit(handleSaveAddress)} className="space-y-4">
          {/* Quick Address Type Pills */}
          <div className="text-left">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Quick Address Label
            </span>
            <div className="flex flex-wrap gap-2">
              {ADDRESS_LABELS.map((lbl) => (
                <button
                  key={lbl}
                  type="button"
                  onClick={() => {
                    setSelectedAddressLabel(lbl);
                    setAddrValue('title', lbl, { shouldValidate: true });
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    selectedAddressLabel === lbl
                      ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-orange-50'
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Address Label"
              placeholder="e.g. Home, Office"
              error={addrErrors.title}
              {...registerAddr('title', { required: 'Label is required' })}
            />
            <Input
              label="Contact Mobile Number"
              placeholder="+91 98765 43210"
              icon={Phone}
              error={addrErrors.phone}
              {...registerAddr('phone', {
                required: 'Contact mobile number is required',
                pattern: {
                  value: /^[+]?[\d\s()-]{7,20}$/,
                  message: 'Enter a valid phone number',
                },
              })}
            />
          </div>

          <Input
            label="Street Address / Apartment / Landmark"
            placeholder="42 MG Road, Indiranagar"
            icon={MapPin}
            error={addrErrors.street}
            {...registerAddr('street', { required: 'Street address is required' })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="City"
              placeholder="Bengaluru"
              error={addrErrors.city}
              {...registerAddr('city', { required: 'City is required' })}
            />
            <Input
              label="State"
              placeholder="KA"
              error={addrErrors.state}
              {...registerAddr('state', { required: 'State is required' })}
            />
            <Input
              label="Postal / Zip Code"
              placeholder="560038"
              error={addrErrors.zipCode}
              {...registerAddr('zipCode', { required: 'Postal code is required' })}
            />
          </div>

          <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/70 cursor-pointer text-xs font-bold text-slate-700">
            <input
              type="checkbox"
              {...registerAddr('isDefault')}
              className="w-4 h-4 rounded text-orange-500 focus:ring-orange-400"
            />
            <span>Set as my primary default delivery address</span>
          </label>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => {
                setIsAddressModalOpen(false);
                setEditingAddress(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" icon={Save}>
              {editingAddress ? 'Update Address' : 'Save Address'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* 7. DELETE ADDRESS CONFIRMATION MODAL */}
      <Modal
        isOpen={Boolean(deletingAddress)}
        onClose={() => setDeletingAddress(null)}
        title="Confirm Address Removal"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Are you sure you want to delete saved address{' '}
              <span className="font-bold">
                &quot;{deletingAddress?.title || deletingAddress?.label || 'Address'}&quot;
              </span>
              ?
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDeletingAddress(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleConfirmDeleteAddress}
              icon={Trash2}
            >
              Delete Address
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePage;
