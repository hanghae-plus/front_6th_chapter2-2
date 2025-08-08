import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'indigo' | 'ghost' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  // App.tsx에서 실제로 사용되는 스타일만 유지
  const variantClasses = {
    primary: 'px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800',
    secondary:
      'px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50',
    indigo: 'px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700',
    ghost: 'px-3 py-1.5 text-sm rounded transition-colors text-gray-600 hover:text-gray-900',
    yellow:
      'w-full mt-4 py-3 bg-yellow-400 text-gray-900 rounded-md font-medium hover:bg-yellow-500 transition-colors',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const classes = `${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
