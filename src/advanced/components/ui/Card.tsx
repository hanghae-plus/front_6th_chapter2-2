import type { ReactNode } from 'react';

type Variant = 'default' | 'gradient';

type Padding = 'md' | 'lg';

interface CardProps {
  children: ReactNode;
  variant?: Variant;
  padding?: Padding;
  className?: string;
}

const cardVariants: Record<Variant, string> = {
  default: 'bg-white rounded-lg border border-gray-200',
  gradient:
    'relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200',
};

const cardPadding: Record<Padding, string> = {
  md: 'p-4',
  lg: 'p-6',
};

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
}: CardProps) {
  const variantClasses = cardVariants[variant];
  const paddingClasses = cardPadding[padding];

  const combinedClasses = `${variantClasses} ${paddingClasses} ${className}`;

  return <div className={combinedClasses}>{children}</div>;
}
