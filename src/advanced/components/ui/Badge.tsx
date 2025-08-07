import type { ReactNode } from 'react';

type Variant = 'error' | 'discount' | 'stock';

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
  stock: 'bg-orange-100 text-orange-800',
};

const badgeSizes: Record<Size, string> = {
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-2 text-base',
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
