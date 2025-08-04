import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  disabled,
}: ButtonProps) {
  const baseClasses = '';

  const variantClasses = {
    primary: `bg-gray-900 text-white transition-colors text-sm  hover:bg-gray-800 ${disabled && 'bg-gray-100 text-gray-400 cursor-not-allowed'}`,
    ghost: 'px-3 py-1.5 text-sm rounded transition-colors text-gray-600 hover:text-gray-900',
    link: '',
  };

  const sizeClasses = {
    xs: '',
    sm: 'rounded px-3 py-1.5',
    md: 'rounded-md px-4 py-2',
    lg: 'py-2 px-4 rounded-md font-medium w-full ',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
}
