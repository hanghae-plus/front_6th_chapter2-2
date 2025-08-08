import { getRemainingStock } from './calculateItem';
import { CartItem } from '../../types';
import { ProductWithUI } from '../components/AppContainer';

export const formatPrice = (
  price: number,
  products: ProductWithUI[],
  isAdmin: boolean,
  cart: CartItem[],
  productId?: string
): string => {
  if (productId) {
    const product = products.find((p) => p.id === productId);
    if (product && getRemainingStock(product, cart) <= 0) {
      return 'SOLD OUT';
    }
  }

  if (isAdmin) {
    return `${price.toLocaleString()}원`;
  }

  return `₩${price.toLocaleString()}`;
};
