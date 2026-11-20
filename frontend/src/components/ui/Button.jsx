import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  iconPosition = 'left',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 select-none disabled:opacity-50 disabled:pointer-events-none active:translate-y-0';

  const variants = {
    primary: 'bg-slate-900 hover:bg-slate-800 text-white shadow-pill hover:-translate-y-0.5',
    secondary: 'bg-white/85 hover:bg-white text-slate-800 border border-slate-900/15 hover:border-slate-900/30 shadow-sm backdrop-blur-md hover:-translate-y-0.5',
    subtle: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900',
    danger: 'bg-rose-500 hover:bg-rose-600 text-white shadow-sm hover:-translate-y-0.5',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
    </button>
  );
}
