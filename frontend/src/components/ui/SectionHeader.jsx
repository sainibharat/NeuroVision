import React from 'react';
import Badge from './Badge';

export default function SectionHeader({
  badge,
  badgeIcon: BadgeIcon,
  title,
  subtitle,
  centered = false,
  className = '',
}) {
  return (
    <div className={`flex flex-col gap-2.5 ${centered ? 'text-center items-center' : ''} ${className}`}>
      {badge && (
        <div className="inline-flex">
          <Badge variant="primary" size="md">
            {BadgeIcon && <BadgeIcon size={13} className="mr-1 text-purple-600" />}
            {badge}
          </Badge>
        </div>
      )}
      <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-slate-600 text-sm md:text-base max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
