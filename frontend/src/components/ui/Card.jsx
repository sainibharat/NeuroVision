import React from 'react';

export default function Card({
  children,
  className = '',
  variant = 'glass',
  padding = 'p-6 md:p-8',
  ...props
}) {
  const variants = {
    glass: 'bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_20px_50px_-12px_rgba(30,41,59,0.08),0_0_0_1px_rgba(226,232,240,0.8)] rounded-3xl',
    subtle: 'bg-white/60 backdrop-blur-md border border-slate-200/60 shadow-sm rounded-2xl',
    solid: 'bg-white border border-slate-200/80 shadow-md rounded-2xl',
  };

  return (
    <div
      className={`${variants[variant] || variants.glass} ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
