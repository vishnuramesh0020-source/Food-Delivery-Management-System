import React, { useState } from 'react';
import { Trash2, AlertCircle } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { foodApi } from '../../api/foodApi';
import { formatCurrency } from '../../utils/helpers';
import customToast from '../../utils/customToast';

const DeleteFoodModal = ({ isOpen, onClose, foodItem, onDeleted }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!foodItem) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      foodApi.deleteRecipe(foodItem.id);
      customToast.info(
        'Dish Deleted 🗑️',
        `"${foodItem.name}" has been removed from the menu catalog.`
      );
      if (onDeleted) {
        onDeleted(foodItem.id);
      }
      onClose();
    } catch (e) {
      console.error('Failed to delete item', e);
      customToast.error('Delete Failed', 'Could not delete the food item. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Dish Removal" maxWidth="max-w-md">
      <div className="space-y-4">
        {/* Warning Alert Banner */}
        <div className="flex items-start gap-3 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Are you sure you want to remove this item from the active menu? Customers will no longer be able to view or order this dish.
          </p>
        </div>

        {/* Food Item Summary Card */}
        <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
          <img
            src={foodItem.image}
            alt={foodItem.name}
            className="w-16 h-16 rounded-xl object-cover bg-slate-200 shrink-0 border border-slate-200"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <Badge variant={foodItem.isVeg ? 'veg' : 'nonveg'} size="xs" dot>
                {foodItem.isVeg ? 'VEG' : 'NON-VEG'}
              </Badge>
              <span className="text-[11px] font-bold text-slate-500">{foodItem.category || foodItem.cuisine}</span>
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 truncate">
              {foodItem.name}
            </h4>
            <div className="text-xs font-black text-orange-600 mt-0.5">
              {formatCurrency(foodItem.price)}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-2 flex items-center justify-end gap-2.5">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
            icon={Trash2}
          >
            Delete Menu Item
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteFoodModal;
