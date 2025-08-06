import { Product, CartItem } from "../../types";

/**
 * 기본 가격 포맷팅 (고객용)
 */
export const formatPrice = (price: number): string => {
  return `₩${price.toLocaleString()}`;
};

/**
 * 관리자용 가격 포맷팅
 */
export const formatAdminPrice = (price: number): string => {
  return `${price.toLocaleString()}원`;
};

/**
 * 재고 상태를 확인하여 가격 또는 품절 메시지 반환
 */
export const formatPriceWithStock = (
  price: number,
  product: Product,
  cart: CartItem[],
  isAdmin: boolean = false
): string => {
  if (getRemainingStock(product, cart) <= 0) {
    return "SOLD OUT";
  }

  return isAdmin ? formatAdminPrice(price) : formatPrice(price);
};

/**
 * 남은 재고를 고려한 가격 포맷팅 (Props Drilling 해결용)
 */
export const formatPriceWithRemainingStock = (
  price: number,
  remainingStock: number,
  isAdmin: boolean = false
): string => {
  if (remainingStock <= 0) {
    return "SOLD OUT";
  }

  return isAdmin ? formatAdminPrice(price) : formatPrice(price);
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
