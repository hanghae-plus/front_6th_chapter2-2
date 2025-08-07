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

// TODO: 구현

import { CartItem, Coupon } from '../types';

// 1. calculateItemTotal(item): 개별 아이템의 할인 적용 후 총액 계산
const calculateItemTotal = (item: CartItem, cart: CartItem[]): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);

  return Math.round(price * quantity * (1 - discount));
};

// 2. getMaxApplicableDiscount(item): 적용 가능한 최대 할인율 계산
const getMaxApplicableDiscount = (item: CartItem, cart: CartItem[]): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  const baseDiscount = discounts.reduce(
    (maxDiscount, discount) =>
      quantity >= discount.quantity && discount.rate > maxDiscount ? discount.rate : maxDiscount,
    0,
  );

  // 대량 구매 추가 할인 로직
  const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);
  const hasMassivePurchase = cart.some((cartItem) => cartItem.quantity >= 20);

  if (hasMassivePurchase) {
    return Math.min(baseDiscount + 0.1, 0.5); // 20개 이상 시 추가 10% 할인 (최대 30%)
  }

  if (hasBulkPurchase) {
    return Math.min(baseDiscount + 0.05, 0.5); // 10개 이상 시 추가 5% 할인 (최대 25%)
  }

  return baseDiscount;
};

// 3. calculateCartTotal(cart, coupon): 장바구니 총액 계산 (할인 전/후, 할인액)
const calculateCartTotal = (
  cart: CartItem[],
  coupon: Coupon | null,
): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
} => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach((item) => {
    const itemPrice = item.product.price * item.quantity;
    totalBeforeDiscount += itemPrice;
    totalAfterDiscount += calculateItemTotal(item, cart);
  });

  if (coupon) {
    if (coupon.discountType === 'amount') {
      totalAfterDiscount = Math.max(0, totalAfterDiscount - coupon.discountValue);
    } else {
      totalAfterDiscount = Math.round(totalAfterDiscount * (1 - coupon.discountValue / 100));
    }
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
  };
};

// 4. updateCartItemQuantity(cart, productId, quantity): 수량 변경
const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  quantity: number,
): CartItem[] => {
  if (!productId) return cart;

  if (quantity <= 0) {
    return removeItemFromCart(cart, productId);
  }

  return cart.map((item) => (item.product.id === productId ? { ...item, quantity } : item));
};

// 6. removeItemFromCart(cart, productId): 상품 제거
const removeItemFromCart = (cart: CartItem[], productId: string): CartItem[] =>
  cart.filter((item) => item.product.id !== productId);

export { calculateItemTotal, calculateCartTotal, updateCartItemQuantity, removeItemFromCart };
