import type { ReactNode } from 'react';

type Variant = 'error' | 'discount' | 'stock' | 'yellow' | 'red' | 'orange';

type Size = 'md' | 'lg';

interface BadgeProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
}

const badgeVariants: Record<Variant, string> = {
  error: 'bg-red-100 text-red-800',
  discount: 'bg-white text-indigo-700',
  stock: 'bg-green-100 text-green-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  red: 'bg-red-500 text-white',
  orange: 'bg-orange-500 text-white',
};

const badgeSizes: Record<Size, string> = {
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm',
};

export function Badge({
  children,
  variant = 'error',
  size = 'md',
  className = '',
}: BadgeProps) {
  const variantClasses = badgeVariants[variant];
  const sizeClasses = badgeSizes[size];
  const baseClasses = 'inline-flex items-center rounded-full font-medium';

  const combinedClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`;

  return <span className={combinedClasses}>{children}</span>;
}
