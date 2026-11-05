import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Bike, MapPin, ChevronRight, Sparkles } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const RestaurantCard = ({ restaurant }) => {
  const {
    id,
    name,
    image,
    cuisine,
    cuisineTags = [],
    rating,
    reviewCount,
    deliveryTime,
    deliveryCharges,
    priceRange = '$$',
    address,
    isOpen = true,
    featuredBadge,
  } = restaurant;

  const fallbackImage =
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80';

  return (
    <div className="group relative flex flex-col bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* 1. RESTAURANT IMAGE & OVERLAY BADGES */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
        <img
          src={image || fallbackImage}
          alt={name}
          onError={(e) => {
            e.target.src = fallbackImage;
          }}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
            !isOpen ? 'grayscale-[30%] opacity-90' : ''
          }`}
          loading="lazy"
        />

        {/* Gradient shadow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top Badges (Open/Closed & Featured Tag) */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          {/* Open / Closed Status Pill */}
          {isOpen ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-black uppercase tracking-wider bg-emerald-500 text-white shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Open Now
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-black uppercase tracking-wider bg-slate-900/90 text-slate-200 border border-slate-700/60 backdrop-blur-md shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              Closed
            </span>
          )}

          {/* Featured / Promotion Badge */}
          {featuredBadge && (
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-200" />
              <span>{featuredBadge}</span>
            </span>
          )}
        </div>

        {/* Bottom Banner Info (Price Tier & Cuisine Pill) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-bold pointer-events-none">
          <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-orange-300 font-extrabold text-[11px]">
            {cuisine}
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md font-mono text-[11px] text-amber-300 tracking-widest">
            {priceRange}
          </span>
        </div>
      </div>

      {/* 2. RESTAURANT DETAILS & METRICS */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Name & Star Rating */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <Link
              to={`/restaurants/${id}`}
              className="text-lg font-black text-slate-900 hover:text-orange-600 transition-colors line-clamp-1 tracking-tight"
            >
              {name}
            </Link>

            {/* Rating Badge */}
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 font-black text-xs shrink-0 shadow-2xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{rating.toFixed(1)}</span>
              {reviewCount && (
                <span className="text-[10px] font-semibold text-slate-400">
                  ({reviewCount})
                </span>
              )}
            </div>
          </div>

          {/* Cuisine Tags Sub-row */}
          {cuisineTags.length > 0 && (
            <p className="text-xs font-semibold text-slate-500 line-clamp-1 mb-3">
              {cuisineTags.slice(0, 3).join(' • ')}
            </p>
          )}

          {/* Delivery Time, Delivery Charges & Address Metadata */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            {/* Delivery Time & Charges */}
            <div className="flex items-center justify-between text-slate-600">
              {/* Delivery Time */}
              <div className="flex items-center gap-1.5 font-bold">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>{deliveryTime}</span>
              </div>

              {/* Delivery Charges */}
              <div className="flex items-center gap-1.5 font-bold">
                <Bike className="w-4 h-4 text-emerald-600" />
                {deliveryCharges === 0 ? (
                  <span className="text-emerald-600 uppercase text-[11px] font-black tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                    Free Delivery
                  </span>
                ) : (
                  <span className="text-slate-800">
                    {formatCurrency(deliveryCharges)} fee
                  </span>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-1.5 text-slate-400 text-[11px] leading-tight pt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{address}</span>
            </div>
          </div>
        </div>

        {/* 3. CALL TO ACTION BUTTON */}
        <Link
          to={`/restaurants/${id}`}
          className={`w-full py-2.5 px-4 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
            isOpen
              ? 'bg-orange-50 hover:bg-orange-600 text-orange-600 hover:text-white border border-orange-200/80 hover:border-transparent shadow-xs hover:shadow-md'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
          }`}
        >
          <span>{isOpen ? 'View Menu & Order' : 'View Restaurant Details'}</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default RestaurantCard;
