import React from 'react';
import { Star, MapPin } from 'lucide-react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';

const RestaurantsModal = ({ isOpen, onClose, restaurants = [] }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Partner Restaurants & Kitchens" maxWidth="max-w-3xl">
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        <p className="text-xs text-slate-500">
          Directory of <span className="font-bold text-slate-800">{restaurants.length}</span> active culinary partners and cloud kitchens in the BiteRush network.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {restaurants.map((rest) => (
            <div
              key={rest.id}
              className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-orange-200 transition shadow-xs flex items-center gap-3.5"
            >
              <img
                src={rest.image}
                alt={rest.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 truncate">{rest.name}</h4>
                  <Badge variant="success" size="xs">
                    {rest.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <span className="font-semibold text-orange-600">{rest.cuisine}</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {rest.rating}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1 truncate">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{rest.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default RestaurantsModal;
