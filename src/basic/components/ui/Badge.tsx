import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  className?: string;
  size?: 'xs' | 'sm';
  rounded?: 'none' | 'sm' | 'full';
}

export default function Badge({ children, className, size = 'xs', rounded = 'none' }: BadgeProps) {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
  };

  const roundedClasses = {
    none: '',
    sm: 'rounded',
    full: 'rounded-full',
  };

  const classes = [sizeClasses[size], roundedClasses[rounded], className].filter(Boolean).join(' ');

  return <span className={classes}>{children}</span>;
}
