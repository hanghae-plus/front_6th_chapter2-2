import { CartItem } from '../../../types';
import { discountedItemTotalPrice } from '../../utils/cart';
import { commaizedNumberWithUnit } from '../../../shared/utils/commaizedNumber';
import { roundedPrice } from '../../../shared/utils/roundedPrice';

interface CartItemPriceProps {
  item: CartItem;
  cart: CartItem[];
}

export const CartItemPrice = ({ item, cart }: CartItemPriceProps) => {
  const price = roundedPrice(discountedItemTotalPrice({ item, cart }));

  return (
    <p className="text-sm font-medium text-gray-900">{commaizedNumberWithUnit(price, '원')}</p>
  );
};
