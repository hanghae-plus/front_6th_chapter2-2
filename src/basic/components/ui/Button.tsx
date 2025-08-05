import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'ghost';
  size?: 'sm' | 'md';
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
  const baseClasses = 'font-medium transition-colors focus:outline-none';

  // Origin에서 실제 사용된 공통 패턴들만
  const variantClasses = {
    primary: 'px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700',
    secondary: 'px-4 py-2 bg-gray-900 text-white rounded-md text-sm hover:bg-gray-800',
    outline: 'px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50',
    text: 'text-indigo-600 hover:text-indigo-900',
    ghost:
      'w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    variant !== 'ghost' && variant !== 'text' ? sizeClasses[size] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button onClick={onClick} type={type} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
