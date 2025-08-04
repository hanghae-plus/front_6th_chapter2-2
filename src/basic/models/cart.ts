// TODO: 장바구니 비즈니스 로직 (순수 함수)
// 힌트: 모든 함수는 순수 함수로 구현 (부작용 없음, 같은 입력에 항상 같은 출력)
//
// 구현할 함수들:
// 1. calculateItemTotal(item): 개별 아이템의 할인 적용 후 총액 계산
// 2. getMaxApplicableDiscount(item): 적용 가능한 최대 할인율 계산
// 3. calculateCartTotal(cart, coupon): 장바구니 총액 계산 (할인 전/후, 할인액)
// 4. updateCartItemQuantity(cart, productId, quantity): 수량 변경
// 5. addItemToCart(cart, product): 상품 추가
// 6. removeItemFromCart(cart, productId): 상품 제거
// 7. getRemainingStock(product, cart): 남은 재고 계산
//
// 원칙:
// - UI와 관련된 로직 없음
// - 외부 상태에 의존하지 않음
// - 모든 필요한 데이터는 파라미터로 전달받음

import { CartItem, Product } from "../../types";
import { getMaxApplicableDiscount } from "./discount";

// 개별 아이템의 할인 적용 후 총액 계산
export function calculateItemTotal(item: CartItem): number {
  const discount = getMaxApplicableDiscount(item);
  return Math.round(item.product.price * item.quantity * (1 - discount));
}

// 수량 변경
export function updateCartItemQuantity(
  cart: CartItem[],
  productId: string,
  quantity: number
): CartItem[] {
  if (quantity <= 0) {
    return cart.filter((item) => item.product.id !== productId);
  }
  return cart.map((item) =>
    item.product.id === productId ? { ...item, quantity } : item
  );
}

// 상품 추가
export function addItemToCart(cart: CartItem[], product: Product): CartItem[] {
  const existing = cart.find((item) => item.product.id === product.id);
  if (existing) {
    const newQuantity = existing.quantity + 1;
    if (newQuantity > product.stock) return cart;
    return cart.map((item) =>
      item.product.id === product.id ? { ...item, quantity: newQuantity } : item
    );
  }
  return [...cart, { product, quantity: 1 }];
}

// 상품 제거
export function removeItemFromCart(
  cart: CartItem[],
  productId: string
): CartItem[] {
  return cart.filter((item) => item.product.id !== productId);
}
