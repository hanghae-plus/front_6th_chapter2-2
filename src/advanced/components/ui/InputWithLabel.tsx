import type { InputHTMLAttributes } from 'react';
import { Label } from '../admin-page/ui/Label';

type Variant = 'default' | 'products' | 'coupons';

type Size = 'md' | 'lg';

interface InputWithLabelProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string;
  variant?: Variant;
  size?: Size;
}

const inputVariants: Record<Variant, string> = {
  default: '',
  products:
    'w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border',
  coupons:
    'w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm',
};

const inputSizes: Record<Size, string> = {
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base',
};

export function InputWithLabel({
  label,
  variant = 'default',
  size = 'md',
  className = '',
  ...inputOptions
}: InputWithLabelProps) {
  const baseClasses = inputVariants[variant];
  const sizeClasses = inputSizes[size];
  const combinedClasses = `${baseClasses} ${sizeClasses} ${className}`;

  return (
    <div>
      <Label>{label}</Label>
      <input type="text" className={combinedClasses} {...inputOptions} />
    </div>
  );
}
