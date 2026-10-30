import React from 'react';

const Badge = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
  dot = false,
}) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-orange-50 text-orange-700 border-orange-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    accent: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    veg: 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold',
    nonveg: 'bg-rose-50 text-rose-700 border-rose-300 font-bold',
  };

  const sizes = {
    xs: 'text-[10px] px-1.5 py-0.5',
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold tracking-wide ${variants[variant] || variants.default} ${sizes[size] || sizes.sm} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            variant === 'veg'
              ? 'bg-emerald-500'
              : variant === 'nonveg'
              ? 'bg-rose-500'
              : 'bg-current'
          }`}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
