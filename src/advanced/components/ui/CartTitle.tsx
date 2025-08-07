import type { ReactNode } from 'react';
import { CartIcon } from '../icons';

interface CartTitleProps {
  children: ReactNode;
  className?: string;
}

export function CartTitle({ children, className = '' }: CartTitleProps) {
  return (
    <h2 className={`text-lg font-semibold mb-4 flex items-center ${className}`}>
      <CartIcon />
      {children}
    </h2>
  );
}
