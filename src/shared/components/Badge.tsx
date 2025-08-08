import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'stock' | 'recommended' | 'best' | 'discount';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Badge({ children, variant = 'stock', size = 'md', className = '' }: BadgeProps) {
  // App.tsx에서 실제로 사용되는 스타일만 유지
  const variantClasses = {
    stock:
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800',
    recommended:
      'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700',
    best: 'absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded',
    discount: 'absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  const classes = `${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return <span className={classes}>{children}</span>;
}
