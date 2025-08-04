import { ReactNode } from 'react';

interface IconButtonProps {
  children: ReactNode;
  variant?: 'default' | 'danger' | 'toast' | 'error';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

export default function IconButton({
  children,
  type = 'button',
  variant = 'default',
  className = '',
  onClick,
}: IconButtonProps) {
  const baseClasses = 'p-0 w-auto h-auto transition-colors';

  const variantClasses = {
    default: 'text-gray-400 hover:text-gray-500',
    danger: 'text-gray-400 hover:text-red-500',
    toast: 'text-white hover:text-gray-200',
    error: 'text-red-600 hover:text-red-800',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
