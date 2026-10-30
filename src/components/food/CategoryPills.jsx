import React from 'react';

const CategoryPills = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none py-1">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs md:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer shadow-xs ${
              isActive
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25 scale-102 ring-2 ring-orange-400'
                : 'bg-white text-slate-700 hover:bg-orange-50 hover:text-orange-600 border border-slate-200/80 hover:border-orange-200'
            }`}
          >
            <span className="text-base">{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryPills;
