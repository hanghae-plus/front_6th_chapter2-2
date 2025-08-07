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

// 장바구니 비즈니스 로직 (순수 함수)
// 모든 함수는 순수 함수로 구현 (부작용 없음, 같은 입력에 항상 같은 출력)

import { CartItem, Product, Coupon } from "../type/types";

/**
 * 개별 아이템의 적용 가능한 최대 할인율 계산
 * @param item 장바구니 아이템
 * @param cart 전체 장바구니 (대량 구매 할인 확인용)
 * @returns 적용 가능한 최대 할인율 (0~1 사이 값)
 */
export function getMaxApplicableDiscount(
  item: CartItem,
  cart: CartItem[]
): number {
  const { discounts } = item.product;
  const { quantity } = item;

  // 기본 할인율 계산
  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);

  // 대량 구매 할인 확인 (장바구니 내 어떤 상품이든 10개 이상 구매 시)
  const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);
  if (hasBulkPurchase) {
    return Math.min(baseDiscount + 0.05, 0.5); // 추가 5% 할인, 최대 50%
  }

  return baseDiscount;
}

/**
 * 개별 아이템의 할인 적용 후 총액 계산
 * @param item 장바구니 아이템
 * @param cart 전체 장바구니 (대량 구매 할인 확인용)
 * @returns 할인 적용 후 총액
 */
export function calculateItemTotal(item: CartItem, cart: CartItem[]): number {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);

  return Math.round(price * quantity * (1 - discount));
}

/**
 * 장바구니 총액 계산 (할인 전/후, 할인액)
 * @param cart 장바구니 아이템 배열
 * @param coupon 적용할 쿠폰 (선택사항)
 * @returns 할인 전 총액, 할인 후 총액, 총 할인 금액
 */
export function calculateCartTotal(
  cart: CartItem[],
  coupon?: Coupon | null
): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  totalDiscount: number;
} {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  // 각 아이템별 계산
  cart.forEach((item) => {
    const itemPrice = item.product.price * item.quantity;
    totalBeforeDiscount += itemPrice;
    totalAfterDiscount += calculateItemTotal(item, cart);
  });

  // 쿠폰 할인 적용
  if (coupon) {
    if (coupon.discountType === "amount") {
      totalAfterDiscount = Math.max(
        0,
        totalAfterDiscount - coupon.discountValue
      );
    } else {
      totalAfterDiscount = Math.round(
        totalAfterDiscount * (1 - coupon.discountValue / 100)
      );
    }
  }

  const totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    totalDiscount: Math.round(totalDiscount),
  };
}

/**
 * 장바구니 아이템 수량 변경
 * @param cart 기존 장바구니
 * @param productId 상품 ID
 * @param quantity 새로운 수량 (0이면 아이템 제거)
 * @returns 수량이 변경된 새로운 장바구니
 */
export function updateCartItemQuantity(
  cart: CartItem[],
  productId: string,
  quantity: number
): CartItem[] {
  if (quantity <= 0) {
    return removeItemFromCart(cart, productId);
  }

  return cart.map((item) =>
    item.product.id === productId ? { ...item, quantity } : item
  );
}

/**
 * 장바구니에 상품 추가
 * @param cart 기존 장바구니
 * @param product 추가할 상품
 * @param quantity 추가할 수량 (기본값: 1)
 * @returns 상품이 추가된 새로운 장바구니
 */
export function addItemToCart(
  cart: CartItem[],
  product: Product,
  quantity: number = 1
): CartItem[] {
  const existingItem = cart.find((item) => item.product.id === product.id);

  if (existingItem) {
    return cart.map((item) =>
      item.product.id === product.id
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
  }

  return [...cart, { product, quantity }];
}

/**
 * 장바구니에서 상품 제거
 * @param cart 기존 장바구니
 * @param productId 제거할 상품 ID
 * @returns 상품이 제거된 새로운 장바구니
 */
export function removeItemFromCart(
  cart: CartItem[],
  productId: string
): CartItem[] {
  return cart.filter((item) => item.product.id !== productId);
}

/**
 * 상품의 남은 재고 계산
 * @param product 상품
 * @param cart 장바구니
 * @returns 남은 재고 수량
 */
export function getRemainingStock(product: Product, cart: CartItem[]): number {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const remaining = product.stock - (cartItem?.quantity || 0);
  return remaining;
}
