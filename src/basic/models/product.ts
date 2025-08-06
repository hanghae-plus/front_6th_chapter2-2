import type { CartItem, Product } from '../../types';

interface GetRemainingStockParams {
  cart: CartItem[];
  product: Product;
}

// 재고 수량 조회
export function getRemainingStock({ cart, product }: GetRemainingStockParams) {
  const cartItemQuantity =
    cart.find((item) => item.product.id === product.id)?.quantity ?? 0;

  return Math.max(product.stock - cartItemQuantity, 0);
}
