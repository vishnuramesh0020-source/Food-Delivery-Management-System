import React from 'react';
import { useForm } from 'react-hook-form';
import { Plus, X, Utensils, Image as ImageIcon, DollarSign, Flame, Clock } from 'lucide-react';
import { foodApi } from '../../api/foodApi';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import customToast from '../../utils/customToast';

const AddFoodModal = ({ isOpen, onClose, onFoodAdded }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      restaurantName: 'Trattoria Bella',
      cuisine: 'Italian',
      price: '',
      caloriesPerServing: 380,
      prepTimeMinutes: 15,
      cookTimeMinutes: 15,
      isVeg: true,
      image: '',
      ingredients: 'Fresh mozzarella, Basil, Tomato sauce, Olive oil',
      instructions: 'Preheat oven, roll dough, add toppings, bake until golden.',
    },
  });

  const onSubmit = async (data) => {
    try {
      const ingredientsList = data.ingredients
        .split(',')
        .map((i) => i.trim())
        .filter(Boolean);

      const instructionsList = data.instructions
        .split('.')
        .map((i) => i.trim())
        .filter(Boolean);

      const newDish = {
        name: data.name.trim(),
        restaurantName: data.restaurantName,
        cuisine: data.cuisine,
        price: parseFloat(data.price),
        caloriesPerServing: parseInt(data.caloriesPerServing, 10) || 350,
        prepTimeMinutes: parseInt(data.prepTimeMinutes, 10) || 15,
        cookTimeMinutes: parseInt(data.cookTimeMinutes, 10) || 15,
        isVeg: data.isVeg === 'true' || data.isVeg === true,
        image:
          data.image.trim() ||
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
        ingredients: ingredientsList.length > 0 ? ingredientsList : ['Fresh organic ingredients'],
        instructions: instructionsList.length > 0 ? instructionsList : ['Cook with passion and serve hot.'],
      };

      const created = foodApi.addCustomRecipe(newDish);
      customToast.success(
        `Dish "${created.name}" Published! 🎉`,
        'New recipe is now live and available for customers to order.'
      );
      reset();
      onClose();
      if (onFoodAdded) onFoodAdded(created);
    } catch (err) {
      customToast.error(
        'Failed to Publish Dish',
        'Please check the form inputs and try again.'
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Food Item to Menu" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Dish Title"
            placeholder="e.g. Truffle Mushroom Risotto"
            icon={Utensils}
            error={errors.name}
            {...register('name', { required: 'Dish name is required' })}
          />

          <div className="text-left">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Cuisine Category
            </label>
            <select
              {...register('cuisine', { required: 'Cuisine is required' })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
            >
              <option value="Italian">Italian (Pizza & Pasta)</option>
              <option value="Asian">Asian (Ramen & Bowls)</option>
              <option value="American">American (Burgers & BBQ)</option>
              <option value="Mexican">Mexican (Tacos & Burritos)</option>
              <option value="Indian">Indian (Curry & Tandoori)</option>
              <option value="Mediterranean">Mediterranean (Healthy Salads)</option>
              <option value="Dessert">Dessert (Cakes & Sweets)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="text-left">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Partner Restaurant
            </label>
            <select
              {...register('restaurantName', { required: 'Restaurant is required' })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
            >
              <option value="Trattoria Bella">Trattoria Bella</option>
              <option value="Pasta Fresca Co.">Pasta Fresca Co.</option>
              <option value="Golden Wok Dynasty">Golden Wok Dynasty</option>
              <option value="Umami Kitchen">Umami Kitchen</option>
              <option value="Firehouse Grill & Burgers">Firehouse Grill & Burgers</option>
              <option value="Cantina Del Sol">Cantina Del Sol</option>
              <option value="Royal Tandoor House">Royal Tandoor House</option>
              <option value="Olive & Fig Taverna">Olive & Fig Taverna</option>
              <option value="Sweet Tooth Bakery">Sweet Tooth Bakery</option>
            </select>
          </div>

          <Input
            label="Price ($ USD)"
            type="number"
            step="0.01"
            placeholder="14.99"
            icon={DollarSign}
            error={errors.price}
            {...register('price', {
              required: 'Price is required',
              min: { value: 1, message: 'Price must be at least $1.00' },
            })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Calories"
            type="number"
            placeholder="380"
            icon={Flame}
            error={errors.caloriesPerServing}
            {...register('caloriesPerServing')}
          />
          <Input
            label="Prep Time (mins)"
            type="number"
            placeholder="15"
            icon={Clock}
            error={errors.prepTimeMinutes}
            {...register('prepTimeMinutes')}
          />
          <div className="text-left">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Dietary Type
            </label>
            <select
              {...register('isVeg')}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
            >
              <option value="true">🌱 Vegetarian (Veg)</option>
              <option value="false">🍗 Non-Vegetarian (Meat/Fish)</option>
            </select>
          </div>
        </div>

        <Input
          label="Image URL (Optional)"
          placeholder="https://images.unsplash.com/photo-..."
          icon={ImageIcon}
          helperText="Leave empty to use high-resolution chef default photo"
          {...register('image')}
        />

        <div className="text-left">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Key Ingredients (Comma separated)
          </label>
          <input
            type="text"
            placeholder="Mozzarella, Fresh Basil, Truffle Oil, Parmesan"
            {...register('ingredients')}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
        </div>

        <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" icon={Plus} isLoading={isSubmitting}>
            Add Dish to Menu
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddFoodModal;
