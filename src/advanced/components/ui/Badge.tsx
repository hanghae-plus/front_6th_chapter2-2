import type { ReactNode } from 'react';

type Variant = 'error' | 'discount' | 'stock' | 'yellow' | 'red' | 'orange';

interface BadgeProps {
  children: ReactNode;
  variant: Variant;
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

export function Badge({ children, variant, className = '' }: BadgeProps) {
  const variantClasses = badgeVariants[variant];
  const baseClasses = 'inline-flex items-center font-medium';

  const combinedClasses = `${baseClasses} ${variantClasses} ${className}`;

  return <span className={combinedClasses}>{children}</span>;
}
