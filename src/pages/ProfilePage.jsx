import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { FALLBACK_RECIPES } from '../api/mockData';
import { formatCurrency, calculateFoodPrice, getRestaurantName } from '../utils/helpers';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { user, updateProfile, addAddress, removeAddress, logout } = useAuth();
  const { orders } = useOrder();
  const { favorites, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState('profile');
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);

  const {
    register: registerInfo,
    handleSubmit: handleInfoSubmit,
    formState: { errors: infoErrors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
    },
  });

  const {
    register: registerAddr,
    handleSubmit: handleAddrSubmit,
    reset: resetAddrForm,
    formState: { errors: addrErrors },
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

  const onUpdateInfo = (data) => {
    updateProfile({
      name: data.name,
      phone: data.phone,
    });
    setIsEditingInfo(false);
  };

  const onAddNewAddress = (data) => {
    addAddress(data);
    setShowAddAddress(false);
    resetAddrForm();
    toast.success('Address saved successfully!');
  };

  const favoriteItems = FALLBACK_RECIPES.filter((r) => favorites.includes(r.id)).map((r) => ({
    ...r,
    price: calculateFoodPrice(r),
    restaurantName: getRestaurantName(r),
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
            alt={user?.name}
            className="w-24 h-24 rounded-3xl object-cover border-4 border-orange-100 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {user?.name}
              </h1>
              <span className="bg-orange-100 text-orange-700 font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-full">
                Gold Foodie
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 justify-center sm:justify-start">
              <Mail className="w-3.5 h-3.5" />
              <span>{user?.email}</span>
            </p>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5 justify-center sm:justify-start">
              <Phone className="w-3.5 h-3.5" />
              <span>{user?.phone || 'No phone number provided'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
          <div className="text-center px-3">
            <span className="text-lg font-black text-slate-900 block">{orders.length}</span>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Orders</span>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="text-center px-3">
            <span className="text-lg font-black text-orange-600 block">{favorites.length}</span>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Favorites</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
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
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
            activeTab === 'addresses'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Addresses ({user?.addresses?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
            activeTab === 'favorites'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Favorite Dishes ({favorites.length})</span>
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs max-w-2xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Personal Information</h3>
              <p className="text-xs text-slate-400">Update your account identity and contact info</p>
            </div>
            {!isEditingInfo && (
              <button
                type="button"
                onClick={() => setIsEditingInfo(true)}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {isEditingInfo ? (
            <form onSubmit={handleInfoSubmit(onUpdateInfo)} className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Sarah Connor"
                icon={User}
                error={infoErrors.name}
                {...registerInfo('name', { required: 'Name is required' })}
              />

              <Input
                label="Phone Number"
                placeholder="+1 (555) 234-5678"
                icon={Phone}
                error={infoErrors.phone}
                {...registerInfo('phone', { required: 'Phone is required' })}
              />

              <div className="flex items-center gap-2 pt-2">
                <Button type="submit" variant="primary" size="md" icon={Save}>
                  Save Changes
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
            <div className="space-y-4 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-400 font-semibold">Full Name</span>
                <span className="font-bold text-slate-800">{user?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-400 font-semibold">Email Address</span>
                <span className="font-bold text-slate-800">{user?.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-400 font-semibold">Phone Number</span>
                <span className="font-bold text-slate-800">{user?.phone}</span>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
            <span className="text-xs text-slate-400">Want to switch accounts?</span>
            <button
              type="button"
              onClick={logout}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Saved Delivery Addresses</h3>
              <p className="text-xs text-slate-400">Manage drop-off destinations for rapid orders</p>
            </div>
            {!showAddAddress && (
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={() => setShowAddAddress(true)}
              >
                Add Address
              </Button>
            )}
          </div>

          {showAddAddress && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm max-w-xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h4 className="font-bold text-sm text-slate-900">New Delivery Location</h4>
                <button
                  type="button"
                  onClick={() => setShowAddAddress(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleAddrSubmit(onAddNewAddress)} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Label"
                    placeholder="e.g. Vacation Home"
                    error={addrErrors.title}
                    {...registerAddr('title', { required: 'Label is required' })}
                  />
                  <Input
                    label="Phone"
                    placeholder="+1 (555) 000-0000"
                    error={addrErrors.phone}
                    {...registerAddr('phone', { required: 'Phone is required' })}
                  />
                </div>

                <Input
                  label="Street Address"
                  placeholder="500 Park Avenue"
                  error={addrErrors.street}
                  {...registerAddr('street', { required: 'Street is required' })}
                />

                <div className="grid grid-cols-3 gap-3">
                  <Input
                    label="City"
                    placeholder="New York"
                    error={addrErrors.city}
                    {...registerAddr('city', { required: 'City is required' })}
                  />
                  <Input
                    label="State"
                    placeholder="NY"
                    error={addrErrors.state}
                    {...registerAddr('state', { required: 'State is required' })}
                  />
                  <Input
                    label="Zip Code"
                    placeholder="10022"
                    error={addrErrors.zipCode}
                    {...registerAddr('zipCode', { required: 'Zip is required' })}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddAddress(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Save Address
                  </Button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(user?.addresses || []).map((addr) => (
              <div
                key={addr.id}
                className="bg-white rounded-3xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      {addr.title}
                    </span>
                    {addr.isDefault && (
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 font-medium">{addr.street}</p>
                  <p className="text-xs text-slate-500">
                    {addr.city}, {addr.state} {addr.zipCode}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{addr.phone}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeAddress(addr.id)}
                    className="text-xs text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
    </div>
  );
};

export default ProfilePage;
