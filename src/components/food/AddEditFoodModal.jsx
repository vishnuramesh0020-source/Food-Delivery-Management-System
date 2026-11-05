import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Utensils,
  IndianRupee,
  Tag,
  AlignLeft,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Flame,
  Check,
} from 'lucide-react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { foodApi } from '../../api/foodApi';
import customToast from '../../utils/customToast';

const PRESET_IMAGES = [
  { label: 'Pizza', url: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800&auto=format&fit=crop&q=80' },
  { label: 'Burger', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80' },
  { label: 'Pasta', url: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281686?w=800&auto=format&fit=crop&q=80' },
  { label: 'Salad', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80' },
  { label: 'Ramen', url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80' },
  { label: 'Dessert', url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&auto=format&fit=crop&q=80' },
];

const CATEGORIES = [
  'Italian',
  'Asian',
  'American',
  'Mexican',
  'Indian',
  'Mediterranean',
  'Dessert',
];

const AddEditFoodModal = ({ isOpen, onClose, foodItem = null, onSaved }) => {
  const isEditing = Boolean(foodItem);
  const [selectedPreset, setSelectedPreset] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      category: 'Italian',
      isVeg: true,
      isAvailable: true,
      image: '',
      caloriesPerServing: 350,
      prepTimeMinutes: 20,
    },
  });

  const watchedImage = watch('image');
  const watchedIsVeg = watch('isVeg');
  const watchedIsAvailable = watch('isAvailable');

  // Populate form when modal opens or foodItem changes
  useEffect(() => {
    if (foodItem) {
      reset({
        name: foodItem.name || '',
        description: foodItem.description || '',
        price: foodItem.price || '',
        category: foodItem.category || foodItem.cuisine || 'Italian',
        isVeg: typeof foodItem.isVeg === 'boolean' ? foodItem.isVeg : true,
        isAvailable:
          typeof foodItem.isAvailable === 'boolean'
            ? foodItem.isAvailable
            : foodItem.availabilityStatus !== 'Out of Stock',
        image: foodItem.image || '',
        caloriesPerServing: foodItem.caloriesPerServing || 350,
        prepTimeMinutes: foodItem.prepTimeMinutes || 20,
      });
      setSelectedPreset('');
    } else {
      reset({
        name: '',
        description: '',
        price: '',
        category: 'Italian',
        isVeg: true,
        isAvailable: true,
        image: PRESET_IMAGES[0].url,
        caloriesPerServing: 350,
        prepTimeMinutes: 20,
      });
      setSelectedPreset(PRESET_IMAGES[0].url);
    }
  }, [foodItem, isOpen, reset]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name.trim(),
        description: data.description.trim(),
        price: parseFloat(data.price),
        category: data.category,
        cuisine: data.category,
        isVeg: data.isVeg === true || data.isVeg === 'true',
        isAvailable: data.isAvailable === true || data.isAvailable === 'true',
        availabilityStatus:
          data.isAvailable === true || data.isAvailable === 'true'
            ? 'In Stock'
            : 'Out of Stock',
        image:
          data.image.trim() ||
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
        caloriesPerServing: parseInt(data.caloriesPerServing, 10) || 350,
        prepTimeMinutes: parseInt(data.prepTimeMinutes, 10) || 20,
      };

      let result;
      if (isEditing) {
        result = foodApi.updateRecipe(foodItem.id, payload);
        customToast.success(
          `Dish "${payload.name}" Updated! ✏️`,
          'Changes have been saved and menu catalog refreshed.'
        );
      } else {
        result = foodApi.addCustomRecipe(payload);
        customToast.success(
          `Dish "${payload.name}" Published! 🎉`,
          'New menu item is now available for customers to order.'
        );
      }

      if (onSaved) {
        onSaved(result || payload);
      }
      onClose();
    } catch (e) {
      console.error('Failed to save menu item', e);
      customToast.error(
        'Save Failed',
        'Unable to save food item. Please review the form fields.'
      );
    }
  };

  const handleSelectPreset = (url) => {
    setValue('image', url, { shouldValidate: true });
    setSelectedPreset(url);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Header Preview Banner */}
        <div className="flex items-center gap-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
            <img
              src={
                watchedImage ||
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80'
              }
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80';
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold text-orange-600 block uppercase tracking-wider">
              {isEditing ? 'Updating Existing Dish' : 'Creating New Recipe'}
            </span>
            <h4 className="text-sm font-extrabold text-slate-800 truncate">
              {watch('name') || 'Untitled Food Item'}
            </h4>
            <div className="flex items-center gap-2 mt-1 text-xs">
              <span
                className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full ${
                  watchedIsAvailable
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    watchedIsAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                  }`}
                />
                {watchedIsAvailable ? 'In Stock' : 'Out of Stock'}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 font-semibold">{watch('category')}</span>
            </div>
          </div>
        </div>

        {/* Food Name & Price */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="sm:col-span-2">
            <Input
              label="Food Name"
              placeholder="e.g. Truffle Mushroom Penne"
              icon={Utensils}
              error={errors.name}
              {...register('name', {
                required: 'Food name is required',
                minLength: { value: 3, message: 'Must be at least 3 characters' },
              })}
            />
          </div>

          <div>
            <Input
              label="Price (Rs. / ₹)"
              type="number"
              step="0.01"
              placeholder="299.00"
              icon={IndianRupee}
              error={errors.price}
              {...register('price', {
                required: 'Price is required',
                min: { value: 0.5, message: 'Price must be at least ₹0.50' },
              })}
            />
          </div>
        </div>

        {/* Description Field */}
        <div className="text-left">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
            <AlignLeft className="w-3.5 h-3.5 text-slate-400" />
            <span>Description</span>
          </label>
          <textarea
            rows={2}
            placeholder="Appetizing description detailing freshness, seasonings, and culinary appeal..."
            className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
              errors.description
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                : 'border-slate-200 focus:border-orange-500 focus:ring-orange-200'
            }`}
            {...register('description', {
              required: 'Description is required',
              minLength: { value: 10, message: 'Please write a brief description (min 10 characters)' },
            })}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-rose-500 font-medium">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Category & Availability Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="text-left">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span>Category / Cuisine</span>
            </label>
            <select
              {...register('category', { required: 'Category is required' })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-200 cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="text-left">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Availability Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setValue('isAvailable', true)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                  watchedIsAvailable
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs'
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>In Stock</span>
              </button>
              <button
                type="button"
                onClick={() => setValue('isAvailable', false)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                  !watchedIsAvailable
                    ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-xs'
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Out of Stock</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dietary (Veg / Non-Veg) & Prep Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="text-left">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Dietary Classification
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setValue('isVeg', true)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                  watchedIsVeg
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs'
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>🌱 Vegetarian</span>
              </button>
              <button
                type="button"
                onClick={() => setValue('isVeg', false)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                  !watchedIsVeg
                    ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-xs'
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>🍗 Non-Veg</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Prep (Mins)"
              type="number"
              icon={Clock}
              placeholder="20"
              {...register('prepTimeMinutes')}
            />
            <Input
              label="Calories"
              type="number"
              icon={Flame}
              placeholder="350"
              {...register('caloriesPerServing')}
            />
          </div>
        </div>

        {/* Food Image URL with Quick Presets */}
        <div className="text-left space-y-2">
          <Input
            label="Food Image URL"
            type="url"
            icon={ImageIcon}
            placeholder="https://images.unsplash.com/..."
            error={errors.image}
            {...register('image', { required: 'Food image URL is required' })}
          />

          <div>
            <span className="text-[11px] font-bold text-slate-400 block mb-1.5">
              Quick Photo Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_IMAGES.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleSelectPreset(preset.url)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                    selectedPreset === preset.url || watchedImage === preset.url
                      ? 'bg-orange-500 text-white border-orange-500 shadow-2xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {selectedPreset === preset.url && <Check className="w-3 h-3" />}
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            icon={CheckCircle2}
          >
            {isEditing ? 'Save Changes' : 'Publish Menu Item'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEditFoodModal;
