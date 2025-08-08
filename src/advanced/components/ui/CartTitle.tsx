import type { ReactNode } from 'react';
import { BasketIcon } from '../icons/BasketIcon';

interface CartTitleProps {
  children: ReactNode;
  className?: string;
}

export function CartTitle({ children, className = '' }: CartTitleProps) {
  return (
    <h2 className={`text-lg font-semibold mb-4 flex items-center ${className}`}>
      <BasketIcon className="w-5 h-5 mr-2" />
      {children}
    </h2>
  );
}
