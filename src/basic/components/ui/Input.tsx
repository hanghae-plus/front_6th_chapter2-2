import { BlurHandler } from '../../models/common';

interface InputProps {
  type?: 'text' | 'number' | 'email' | 'password';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'search';
  name: string;
  // 추가 props
  onBlur?: BlurHandler;
  required?: boolean;
  min?: string | number;
  max?: string | number;
  disabled?: boolean;
}

const Input = ({
  size = 'md',
  variant = 'default',
  className = '',
  name,
  ...props
}: InputProps) => {
  const baseClasses = 'border border-gray-300 rounded focus:outline-none';

  const sizeClasses = {
    sm: 'w-16 px-2 py-1 text-sm', // 할인율용
    md: 'w-20 px-2 py-1', // 수량용
    lg: 'w-full px-3 py-2', // 기본 폼용
  };

  const variantClasses = {
    default: 'focus:ring-indigo-500 focus:border-indigo-500',
    search: 'focus:border-blue-500 rounded-lg',
  };

  const classes = `
    ${baseClasses} 
    ${sizeClasses[size]} 
    ${variantClasses[variant]} 
    ${variant === 'default' && size === 'lg' ? 'shadow-sm' : ''} 
    ${className}
  `.trim();

  return <input className={classes} name={name} {...props} />;
};
export default Input;
