import React from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'icon' | 'link';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size,
  className = '',
  children,
  disabled,
  ...props
}) => {
  const baseClasses = 'transition-colors focus:outline-none';

  const variantClasses = {
    primary:
      'inline-flex items-center justify-center font-medium bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed',
    secondary:
      'inline-flex items-center justify-center font-medium bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed',
    danger: 'font-medium text-red-600 hover:text-red-800 focus:ring-red-500',
    ghost:
      'inline-flex items-center justify-center font-medium border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed',
    icon: 'inline-flex items-center justify-center text-gray-400 hover:text-gray-600',
    link: 'text-indigo-600 hover:text-indigo-800',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs rounded',
    md: 'px-4 py-2 text-sm rounded-md',
    lg: 'px-6 py-3 text-base rounded-lg',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${
    size ? sizeClasses[size] : ''
  } ${className}`.trim();

  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

export default Button;
