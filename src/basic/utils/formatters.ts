import { Product, CartItem } from "../../types";

/**
 * 가격을 포맷팅하여 문자열로 반환
 */
export const formatPrice = (
  price: number,
  productId?: string,
  products: Product[] = [],
  cart: CartItem[] = [],
  isAdmin: boolean = false
): string => {
  if (productId) {
    const product = products.find((p) => p.id === productId);
    if (product && getRemainingStock(product, cart) <= 0) {
      return "SOLD OUT";
    }
  }

  if (isAdmin) {
    return `${price.toLocaleString()}원`;
  }

  return `₩${price.toLocaleString()}`;
};

/**
 * 남은 재고 계산
 */
export const getRemainingStock = (product: Product, cart: CartItem[]): number => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const remaining = product.stock - (cartItem?.quantity || 0);
  return remaining;
};

/**
 * 할인율을 백분율로 포맷팅
 */
export const formatDiscountRate = (rate: number): string => {
  return `${Math.round(rate * 100)}%`;
};

/**
 * 통화 형식으로 포맷팅
 */
export const formatCurrency = (amount: number): string => {
  return `${amount.toLocaleString()}원`;
};
