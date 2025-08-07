import type { CartItem, Coupon } from '../../types';
import { convertPercentageToRate } from '../utils/formatters';

/**
 * 장바구니 아이템 수량 계산
 * @param cart 장바구니
 * @returns 장바구니 아이템 수량
 */
export function calculateItemTotalQuantity(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * 개별 아이템의 할인 적용 후 총액 계산
 * @param item 아이템
 * @param cart 장바구니
 * @returns 할인 적용 후 총액
 */
export function calculateItemTotal(item: CartItem, cart: CartItem[]): number {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);

  return Math.round(price * quantity * (1 - discount));
}

/**
 * 장바구니 아이템 총액 계산
 * @param cart 장바구니
 * @returns 장바구니 아이템 총액
 */
function calculateCartItemTotals(cart: CartItem[]): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
} {
  return cart.reduce(
    (acc, item) => ({
      totalBeforeDiscount: acc.totalBeforeDiscount + item.product.price * item.quantity,
      totalAfterDiscount: acc.totalAfterDiscount + calculateItemTotal(item, cart),
    }),
    { totalBeforeDiscount: 0, totalAfterDiscount: 0 }
  );
}

/**
 * 쿠폰 할인 적용
 * @param total 할인 적용 전 총액
 * @param coupon 적용할 쿠폰
 * @returns 할인 적용 후 총액
 */
function applyCouponDiscount(total: number, coupon: Coupon): number {
  if (coupon.discountType === 'amount') {
    return Math.max(0, total - coupon.discountValue);
  }

  return Math.round(total * (1 - convertPercentageToRate(coupon.discountValue)));
}

/**
 * 장바구니 총액 계산
 * @param cart 장바구니
 * @param selectedCoupon 선택된 쿠폰
 * @returns 할인 적용 전/후 총액
 */
export function calculateCartTotal(
  cart: CartItem[],
  selectedCoupon: Coupon | null
): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
} {
  const { totalBeforeDiscount, totalAfterDiscount } = calculateCartItemTotals(cart);

  const finalTotalAfterDiscount = selectedCoupon
    ? applyCouponDiscount(totalAfterDiscount, selectedCoupon)
    : totalAfterDiscount;

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(finalTotalAfterDiscount),
  };
}

/**
 * 적용 가능한 최대 할인율 계산
 * @param item 아이템
 * @param cart 장바구니
 * @returns 적용 가능한 최대 할인율
 */
function getMaxApplicableDiscount(item: CartItem, cart: CartItem[]): number {
  const { discounts } = item.product;
  const { quantity } = item;

  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);

  const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);
  if (hasBulkPurchase) {
    return Math.min(baseDiscount + 0.05, 0.5); // 대량 구매 시 추가 5% 할인
  }

  return baseDiscount;
}
