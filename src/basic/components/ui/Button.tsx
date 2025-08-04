import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'link' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  disabled,
}: ButtonProps) {
  const baseClasses = '';

  const variantClasses = {
    primary: `bg-gray-900 text-white transition-colors hover:bg-gray-800 ${disabled && '!bg-gray-100 !text-gray-400 cursor-not-allowed'}`,
    ghost: 'px-3 py-1.5 text-sm rounded transition-colors text-gray-600 hover:text-gray-900',
    link: '',
    outline: 'border border-gray-300 font-medium text-gray-700 hover:bg-gray-50',
  };

  const sizeClasses = {
    xs: '',
    sm: 'rounded px-3 py-1.5 text-sm',
    md: 'rounded-md px-4 py-2 text-sm',
    lg: 'py-2 px-4 rounded-md font-medium',
  };

  return (
    <button
      onClick={onClick}
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
}
