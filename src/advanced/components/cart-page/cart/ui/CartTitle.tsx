import type { ReactNode } from 'react';
import { CartIcon } from '../../../icons';

interface Props {
  children: ReactNode;
}

export function CartTitle({ children }: Props) {
  return (
    <h2 className="text-lg font-semibold mb-4 flex items-center">
      <CartIcon />
      {children}
    </h2>
  );
}
