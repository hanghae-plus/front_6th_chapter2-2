import { CartItem, Coupon, Product, Discount } from '../../types';
import { ProductWithUI } from '../shared/types';
import { DISCOUNT } from '../constants/discount';
import { MESSAGES } from '../constants/message';

/**
 * 수량 기반 할인 계산
 * @param item - 장바구니 상품
 * @returns 수량 기반 할인
 */
export const calculateQuantityDiscount = (item: CartItem): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  return discounts.reduce((maxDiscount: number, discount: Discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount ? discount.rate : maxDiscount;
  }, 0);
};

/**
 * 대량 구매 여부 확인
 * @param cart - 장바구니 상품
 * @param bulkPurchaseQuantity - 대량 구매 수량, 기본값 10
 * @returns 대량 구매 여부
 */
export const hasBulkPurchase = (cart: CartItem[], bulkPurchaseQuantity: number = DISCOUNT.BULK_THRESHOLD): boolean => {
  return cart.some((cartItem) => cartItem.quantity >= bulkPurchaseQuantity);
};

/**
 * 최종 할인율 계산
 * @param item - 장바구니에 담긴 상품
 * @param cart - 장바구니 상품 목록
 * @returns 최종 할인율
 */
export const getMaxApplicableDiscount = (item: CartItem, cart: CartItem[]): number => {
  const baseDiscount = calculateQuantityDiscount(item);

  if (hasBulkPurchase(cart)) {
    return Math.min(baseDiscount + DISCOUNT.BULK_BONUS, DISCOUNT.MAX_RATE);
  }

  return baseDiscount;
};

/**
 * 아이템 총액 계산
 * @param item - 장바구니에 담긴 상품
 * @param cart - 장바구니 상품 목록
 * @returns 아이템 총액
 */
export const calculateItemTotal = (item: CartItem, cart: CartItem[]): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);

  return Math.round(price * quantity * (1 - discount));
};

/**
 * 할인 전 총액 계산
 * @param cart - 장바구니 아이템들
 * @returns 할인 전 총액
 */
export const calculateCartSubtotal = (cart: CartItem[]): number => {
  return cart.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);
};

/**
 * 상품 할인 적용된 총액 계산
 * @param cart - 장바구니 아이템들
 * @returns 상품 할인 적용된 총액
 */
export const calculateCartDiscountedTotal = (cart: CartItem[]): number => {
  return cart.reduce((total, item) => {
    return total + calculateItemTotal(item, cart);
  }, 0);
};

/**
 * 쿠폰 할인 적용
 * @param amount - 할인 전 금액
 * @param coupon - 적용할 쿠폰
 * @returns 쿠폰 할인 적용된 금액
 */
export const applyCouponDiscount = (amount: number, coupon: Coupon | null): number => {
  if (!coupon) return amount;

  if (coupon.discountType === 'amount') {
    return Math.max(0, amount - coupon.discountValue);
  } else {
    return Math.round(amount * (1 - coupon.discountValue / DISCOUNT.MAX_PERCENTAGE));
  }
};

/**
 * 최종 장바구니 총액 계산
 * @param cart - 장바구니 아이템들
 * @param selectedCoupon - 선택된 쿠폰
 * @returns 할인 전/후 총액
 */
export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null,
): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
} => {
  const totalBeforeDiscount = calculateCartSubtotal(cart);
  const itemDiscountedTotal = calculateCartDiscountedTotal(cart);
  const totalAfterDiscount = applyCouponDiscount(itemDiscountedTotal, selectedCoupon);

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
  };
};

/**
 * 장바구니에서 특정 상품 제거
 * @param cart - 현재 장바구니
 * @param productId - 제거할 상품 ID
 * @returns 상품이 제거된 새로운 장바구니
 */
export const removeItemFromCart = (cart: CartItem[], productId: string): CartItem[] => {
  return cart.filter((item) => item.product.id !== productId);
};

/**
 * 장바구니 아이템 수량 업데이트
 * @param cart - 현재 장바구니
 * @param productId - 업데이트할 상품 ID
 * @param newQuantity - 새로운 수량
 * @returns 수량이 업데이트된 새로운 장바구니
 */
export const updateCartItemQuantity = (cart: CartItem[], productId: string, newQuantity: number): CartItem[] => {
  return cart.map((item) => (item.product.id === productId ? { ...item, quantity: newQuantity } : item));
};

/**
 * 장바구니에 상품 추가
 * @param cart - 현재 장바구니
 * @param product - 추가할 상품
 * @returns 상품이 추가된 새로운 장바구니
 */
export const addItemToCart = (cart: CartItem[], product: ProductWithUI): CartItem[] => {
  const existingItem = cart.find((item) => item.product.id === product.id);

  if (existingItem) {
    return updateCartItemQuantity(cart, product.id, existingItem.quantity + 1);
  }

  return [...cart, { product, quantity: 1 }];
};

/**
 * 장바구니에 담긴 상품의 재고를 조회
 * @param product - 상품
 * @param cart - 장바구니
 * @returns 재고
 */
export const getRemainingStock = (product: Product, cart: CartItem[]): number => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const remaining = product.stock - (cartItem?.quantity || 0);

  return remaining;
};

/**
 * 수량 업데이트 결과 타입
 */
export type QuantityUpdateResult =
  | { success: true; updatedCart: CartItem[] }
  | { success: false; error: string; errorType: 'INVALID_QUANTITY' | 'PRODUCT_NOT_FOUND' | 'INSUFFICIENT_STOCK' };

/**
 * 수량 업데이트 로직
 * @param cart - 현재 장바구니
 * @param productId - 업데이트할 상품 ID
 * @param newQuantity - 새로운 수량
 * @param availableStock - 사용 가능한 재고
 * @returns 수량 업데이트 결과
 */
export const processQuantityUpdate = (
  cart: CartItem[],
  productId: string,
  newQuantity: number,
  availableStock: number,
): QuantityUpdateResult => {
  if (!Number.isInteger(newQuantity) || newQuantity < 0) {
    return { success: false, error: MESSAGES.PRODUCT.INVALID_QUANTITY, errorType: 'INVALID_QUANTITY' };
  }

  if (newQuantity === 0) {
    return { success: true, updatedCart: removeItemFromCart(cart, productId) };
  }

  if (newQuantity > availableStock) {
    return { success: false, error: MESSAGES.PRODUCT.MAX_STOCK(availableStock), errorType: 'INSUFFICIENT_STOCK' };
  }

  return { success: true, updatedCart: updateCartItemQuantity(cart, productId, newQuantity) };
};
