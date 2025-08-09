import { useMemo } from 'react';
import { CartItem } from '@/types';

export function useTotalItemCount(cart: CartItem[]) {
  return useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
}
