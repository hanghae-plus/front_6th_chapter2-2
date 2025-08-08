import { CartItem } from '../../../types';
import { discountRate } from '../../utils/cart';

interface CartItemDiscountProps {
  item: CartItem;
  cart: CartItem[];
}

export const CartItemDiscount = ({ item, cart }: CartItemDiscountProps) => {
  const discount = discountRate({ item, cart });

  if (discount <= 0) return null;

  return <span className="text-xs text-red-500 font-medium block">-{discount}%</span>;
};
