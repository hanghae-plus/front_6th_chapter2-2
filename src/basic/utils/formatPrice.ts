import { Product } from '../models/entities';
import { getRemainingStock } from './getRemainingStock.ts';

export const formatPrice = (
  products: Product[],
  price: number,
  productId?: string
): string => {
  if (productId) {
    const product = products.find(p => p.id === productId);
    if (product && getRemainingStock(product) <= 0) {
      return 'SOLD OUT';
    }
  }

  return `₩${price.toLocaleString()}`;
};
