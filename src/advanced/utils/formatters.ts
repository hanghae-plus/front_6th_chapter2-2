import { Product } from '../models/entities';

export const getRemainingStock = (
  product: Product,
  itemQuantity?: number
): number => {
  return product.stock - (itemQuantity || 0);
};

export const formatters = (price: number): string => {
  return `${price.toLocaleString()}원`;
};
