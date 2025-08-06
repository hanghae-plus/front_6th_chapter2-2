import { CartItem, Coupon, Discount } from "../../types";
import { CartTotals } from "../types";
import { DISCOUNT_CONSTANTS, COUPON_TYPES } from "../constants/discount";

/**
 * 상품의 기본 할인율을 계산합니다.
 */
const calculateBaseDiscount = (item: CartItem): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  return discounts.reduce((maxDiscount: number, discount: Discount) => {
    const isEligible = quantity >= discount.quantity;
    const hasHigherRate = discount.rate > maxDiscount;

    return isEligible && hasHigherRate ? discount.rate : maxDiscount;
  }, 0);
};

/**
 * 대량 구매 보너스 할인을 계산합니다.
 */
const calculateBulkPurchaseBonus = (cart: CartItem[]): number => {
  const hasBulkPurchase = cart.some(
    (cartItem) =>
      cartItem.quantity >= DISCOUNT_CONSTANTS.BULK_PURCHASE_THRESHOLD
  );

  return hasBulkPurchase ? DISCOUNT_CONSTANTS.BULK_PURCHASE_BONUS : 0;
};

/**
 * 상품에 적용 가능한 최대 할인율을 계산합니다.
 */
export const getMaxApplicableDiscount = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const baseDiscount = calculateBaseDiscount(item);
  const bulkBonus = calculateBulkPurchaseBonus(cart);
  const totalDiscount = baseDiscount + bulkBonus;

  return Math.min(totalDiscount, DISCOUNT_CONSTANTS.MAX_DISCOUNT_RATE);
};

/**
 * 개별 상품의 총 가격을 계산합니다.
 */
export const calculateItemTotal = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);
  const finalPrice = price * quantity * (1 - discount);

  return Math.round(finalPrice);
};

/**
 * 쿠폰 할인을 적용합니다.
 */
const applyCouponDiscount = (
  totalAfterDiscount: number,
  selectedCoupon: Coupon
): number => {
  if (selectedCoupon.discountType === COUPON_TYPES.AMOUNT) {
    return Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
  }

  if (selectedCoupon.discountType === COUPON_TYPES.PERCENTAGE) {
    const discountMultiplier = 1 - selectedCoupon.discountValue / 100;
    return Math.round(totalAfterDiscount * discountMultiplier);
  }

  return totalAfterDiscount;
};

/**
 * 장바구니의 총 금액을 계산합니다.
 */
export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
): CartTotals => {
  if (!cart.length) {
    return {
      totalBeforeDiscount: 0,
      totalAfterDiscount: 0,
    };
  }

  const totals = cart.reduce(
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

  const finalTotalAfterDiscount = selectedCoupon
    ? applyCouponDiscount(totals.totalAfterDiscount, selectedCoupon)
    : totals.totalAfterDiscount;

  return {
    totalBeforeDiscount: Math.round(totals.totalBeforeDiscount),
    totalAfterDiscount: Math.round(finalTotalAfterDiscount),
  };
};
