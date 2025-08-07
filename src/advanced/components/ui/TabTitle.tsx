import type { ReactNode } from 'react';

interface TabTitleProps {
  children: ReactNode;
  className?: string;
}

export function TabTitle({ children, className = '' }: TabTitleProps) {
  return <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>;
}
