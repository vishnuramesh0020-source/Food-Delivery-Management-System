import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 4.5, reviewCount = null, size = 'sm', showNumber = true }) => {
  const rounded = Math.round(rating * 2) / 2;
  const starSize = size === 'lg' ? 'w-5 h-5' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= rounded;
          return (
            <Star
              key={star}
              className={`${starSize} ${
                isFilled ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-100'
              }`}
            />
          );
        })}
      </div>
      {showNumber && (
        <span className="text-xs font-bold text-slate-700">
          {Number(rating).toFixed(1)}
        </span>
      )}
      {reviewCount !== null && (
        <span className="text-xs text-slate-400">({reviewCount})</span>
      )}
    </div>
  );
};

export default RatingStars;
