import { CartItem, Coupon } from "../../types";
import { CartTotals, DiscountInfo } from "../types";
import {
  BULK_PURCHASE_THRESHOLD,
  BULK_PURCHASE_ADDITIONAL_DISCOUNT,
  MAX_DISCOUNT_RATE,
} from "../constants/cart";
import { roundNumber } from "../utils/number";

/**
 * 상품의 기본 할인율을 계산합니다.
 * @param discounts 상품의 할인 정보 배열
 * @param quantity 구매 수량
 * @returns 적용 가능한 최대 할인율
 */
const calculateBaseDiscount = (
  discounts: DiscountInfo[],
  quantity: number
): number => {
  if (!discounts || discounts.length === 0) {
    return 0;
  }

  return discounts.reduce((maxDiscount, discount) => {
    const isEligible = quantity >= discount.quantity;
    const hasHigherRate = discount.rate > maxDiscount;

    return isEligible && hasHigherRate ? discount.rate : maxDiscount;
  }, 0);
};

/**
 * 대량 구매 할인을 적용합니다.
 * @param baseDiscount 기본 할인율
 * @param cart 장바구니 아이템 배열
 * @returns 대량 구매 할인이 적용된 최종 할인율
 */
const applyBulkPurchaseDiscount = (
  baseDiscount: number,
  cart: CartItem[]
): number => {
  const hasBulkPurchase = cart.some(
    (cartItem) => cartItem.quantity >= BULK_PURCHASE_THRESHOLD
  );

  if (hasBulkPurchase) {
    return Math.min(
      baseDiscount + BULK_PURCHASE_ADDITIONAL_DISCOUNT,
      MAX_DISCOUNT_RATE
    );
  }

  return baseDiscount;
};

/**
 * 쿠폰 할인을 적용합니다.
 * @param totalAfterDiscount 쿠폰 적용 전 총액
 * @param selectedCoupon 선택된 쿠폰
 * @returns 쿠폰 적용 후 총액
 */
const applyCouponDiscount = (
  totalAfterDiscount: number,
  selectedCoupon: Coupon | null
): number => {
  if (!selectedCoupon) {
    return totalAfterDiscount;
  }

  if (selectedCoupon.discountType === "amount") {
    return Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
  }

  return roundNumber(
    totalAfterDiscount * (1 - selectedCoupon.discountValue / 100)
  );
};

/**
 * 장바구니 아이템의 총 할인율을 계산합니다.
 * @param item 장바구니 아이템
 * @param cart 전체 장바구니
 * @returns 적용 가능한 최대 할인율
 */
export const getMaxApplicableDiscount = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  const baseDiscount = calculateBaseDiscount(discounts, quantity);
  return applyBulkPurchaseDiscount(baseDiscount, cart);
};

/**
 * 장바구니 아이템의 총 가격을 계산합니다.
 * @param item 장바구니 아이템
 * @param cart 전체 장바구니
 * @returns 할인이 적용된 아이템 총 가격
 */
export const calculateItemTotal = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);

  return roundNumber(price * quantity * (1 - discount));
};

/**
 * 장바구니 아이템들의 기본 가격 정보를 계산합니다.
 * @param cart 장바구니 아이템 배열
 * @returns 기본 가격 정보
 */
const calculateBaseTotals = (cart: CartItem[]) => {
  return cart.reduce(
    (acc, item) => {
      const itemPrice = item.product.price * item.quantity;
      const itemTotal = calculateItemTotal(item, cart);

      return {
        totalBeforeDiscount: acc.totalBeforeDiscount + itemPrice,
        totalAfterDiscount: acc.totalAfterDiscount + itemTotal,
      };
    },
    { totalBeforeDiscount: 0, totalAfterDiscount: 0 }
  );
};

/**
 * 할인율을 계산합니다.
 * @param discountedPrice 할인된 가격
 * @param originalPrice 원래 가격
 * @returns 할인율 (0-100 사이의 정수)
 */
export const calculateDiscountRate = (
  discountedPrice: number,
  originalPrice: number
): number => {
  if (originalPrice <= 0) return 0;

  const discountRate = (1 - discountedPrice / originalPrice) * 100;
  return roundNumber(discountRate);
};

/**
 * 장바구니의 총 가격을 계산합니다.
 * @param cart 장바구니 아이템 배열
 * @param selectedCoupon 선택된 쿠폰
 * @returns 할인 전후 총 가격 정보
 */
export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
): CartTotals => {
  // 빈 장바구니 처리
  if (!cart?.length) {
    return {
      totalBeforeDiscount: 0,
      totalAfterDiscount: 0,
    };
  }

  // 기본 가격 계산
  const baseTotals = calculateBaseTotals(cart);

  // 쿠폰 할인 적용
  const finalTotalAfterDiscount = applyCouponDiscount(
    baseTotals.totalAfterDiscount,
    selectedCoupon
  );

  // 최종 결과 반환
  return createFinalTotals(baseTotals, finalTotalAfterDiscount);
};

/**
 * 최종 가격을 반올림하여 반환합니다.
 * @param totals 계산된 가격 정보
 * @param finalTotalAfterDiscount 쿠폰 적용 후 최종 가격
 * @returns 반올림된 최종 가격 정보
 */
const createFinalTotals = (
  totals: { totalBeforeDiscount: number; totalAfterDiscount: number },
  finalTotalAfterDiscount: number
): CartTotals => {
  return {
    totalBeforeDiscount: Math.round(totals.totalBeforeDiscount),
    totalAfterDiscount: Math.round(finalTotalAfterDiscount),
  };
};
