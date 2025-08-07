import { Coupon, DiscountType, type CartItem as CartItemType } from "@/types";
import {
  calculateDiscountedPrice,
  calculateDiscountedAmount,
} from "@shared/libs/price";
import { sumBy } from "@shared/libs/calculation";
import {
  findMaxDiscountByQuantity,
  calculateBonusDiscount,
  hasItemWithMinQuantity,
  calculateTotalWithDiscount,
} from "@entities/cart/libs/discountCalculations";

const BULK_PURCHASE_THRESHOLD = 10;
const BULK_PURCHASE_BONUS = 0.05;
const MAX_DISCOUNT_RATE = 0.5;

export const getMaxApplicableDiscount = (
  item: CartItemType,
  cart: CartItemType[]
): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  const baseDiscount = findMaxDiscountByQuantity(quantity, discounts);

  const hasBulkPurchase = hasItemWithMinQuantity(cart, BULK_PURCHASE_THRESHOLD);

  return calculateBonusDiscount(
    baseDiscount,
    hasBulkPurchase,
    BULK_PURCHASE_BONUS,
    MAX_DISCOUNT_RATE
  );
};

export const calculateItemTotal = (
  item: CartItemType,
  cart: CartItemType[]
): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);

  return calculateTotalWithDiscount(price, quantity, discount);
};

export const getCartSubtotal = (cart: CartItemType[]): number => {
  return Math.round(sumBy(cart, (item) => item.product.price * item.quantity));
};

export const getCartTotalWithDiscounts = (cart: CartItemType[]): number => {
  return Math.round(sumBy(cart, (item) => calculateItemTotal(item, cart)));
};

export const getCartTotalWithCoupon = (
  cart: CartItemType[],
  coupon: Coupon
): number => {
  const totalWithDiscounts = getCartTotalWithDiscounts(cart);

  if (coupon.discountType === DiscountType.AMOUNT) {
    return calculateDiscountedAmount(totalWithDiscounts, coupon.discountValue);
  } else {
    return Math.round(
      calculateDiscountedPrice(totalWithDiscounts, coupon.discountValue)
    );
  }
};

export const getCartDiscountSummary = (
  cart: CartItemType[],
  selectedCoupon: Coupon | null
): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
} => {
  const totalBeforeDiscount = getCartSubtotal(cart);
  const totalAfterDiscount = selectedCoupon
    ? getCartTotalWithCoupon(cart, selectedCoupon)
    : getCartTotalWithDiscounts(cart);

  return {
    totalBeforeDiscount,
    totalAfterDiscount,
  };
};
