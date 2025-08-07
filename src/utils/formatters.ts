import { CartItemType } from '@/types';
import { ProductWithUI } from '../basic/entities/product/types/product';
import { getRemainingStock } from './productUtils';

export const formatPrice = (
  product: ProductWithUI,
  products: ProductWithUI[],
  cart: CartItemType[],
  isAdmin: boolean
): string => {
  if (product.id) {
    const findProduct = products.find((p) => p.id === product.id);
    if (findProduct && getRemainingStock(findProduct, cart) <= 0) {
      return 'SOLD OUT'; // 재고가 없으면 SOLD OUT 표시
    }
  }

  if (isAdmin) {
    return `${product.price.toLocaleString()}원`;
  }

  return `₩${product.price.toLocaleString()}`;
};
