import { CartItem, Product } from '../../types.ts';

const getCartQuantityForProduct = (productId: string) => (cart: CartItem[]) =>
  cart
    .filter((item) => item.product.id === productId)
    .reduce((sum, item) => sum + item.quantity, 0);

export const getRemainingStock = (product: Product, cart: CartItem[]): number => {
  const getQuantity = getCartQuantityForProduct(product.id);
  return product.stock - getQuantity(cart);
};

export const isSoldOut = (product: Product, cart: CartItem[]): boolean => {
  return getRemainingStock(product, cart) <= 0;
};
