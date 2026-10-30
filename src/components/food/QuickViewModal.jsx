import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Clock, Users, Plus, Minus, ShoppingBag, ExternalLink } from 'lucide-react';
import Modal from '../common/Modal';
import RatingStars from '../common/RatingStars';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';

const QuickViewModal = ({ food, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');

  if (!food) return null;

  const handleAddToCart = () => {
    addToCart(food, quantity, specialInstructions);
    setQuantity(1);
    setSpecialInstructions('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={food.name} maxWidth="max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Image & Tags */}
        <div>
          <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-slate-100 shadow-inner">
            <img
              src={food.image}
              alt={food.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 flex gap-1.5">
              <Badge variant={food.isVeg ? 'veg' : 'nonveg'} size="xs" dot>
                {food.isVeg ? 'VEGETARIAN' : 'NON-VEGETARIAN'}
              </Badge>
              <Badge variant="primary" size="xs">
                {food.cuisine}
              </Badge>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 mt-3 text-center">
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
              <Clock className="w-4 h-4 mx-auto text-orange-500 mb-1" />
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Time</span>
              <span className="text-xs font-bold text-slate-700">{food.estimatedDeliveryTime}</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
              <Flame className="w-4 h-4 mx-auto text-amber-500 mb-1" />
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Calories</span>
              <span className="text-xs font-bold text-slate-700">{food.caloriesPerServing || 350} cal</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
              <Users className="w-4 h-4 mx-auto text-blue-500 mb-1" />
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Servings</span>
              <span className="text-xs font-bold text-slate-700">{food.servings || 2} persons</span>
            </div>
          </div>
        </div>

        {/* Right: Details & Order Controls */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-bold text-orange-600">{food.restaurantName}</span>
              <RatingStars rating={food.rating} reviewCount={food.reviewCount} />
            </div>

            <div className="text-2xl font-black text-slate-900 mb-3">
              {formatCurrency(food.price)}
            </div>

            {/* Ingredients list */}
            {food.ingredients && (
              <div className="mb-4">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Ingredients
                </h5>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {food.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Special notes */}
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Special Instructions (Optional)
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Extra spicy, no onions, cutlery needed..."
                rows={2}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
            </div>
          </div>

          {/* Quantity & CTA */}
          <div>
            <div className="flex items-center justify-between mb-4 pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-600">Quantity</span>
              <div className="flex items-center gap-2 border border-slate-200 rounded-xl p-1 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-700 hover:text-orange-600 transition"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center text-sm font-extrabold text-slate-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-700 hover:text-orange-600 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleAddToCart}
                variant="primary"
                size="md"
                className="flex-1"
                icon={ShoppingBag}
              >
                Add {quantity} for {formatCurrency(food.price * quantity)}
              </Button>
              <Link
                to={`/food/${food.id}`}
                onClick={onClose}
                className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
                title="View Full Recipe Page"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default QuickViewModal;
