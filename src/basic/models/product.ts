import { CartItem, Product } from "../../types";

// 남은 재고 계산
export function modelGetRemainingStock(
  product: Product,
  cart: CartItem[]
): number {
  const cartItem = cart.find((item) => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
}
