import { CartItem, Coupon, Product } from "../../types";

/** 장바구니에서 특정 상품의 남은 재고를 계산 */
export const calculateRemainingStock = (product: Product, cart: CartItem[]): number => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const remaining = product.stock - (cartItem?.quantity || 0);
  return remaining;
};

/** 대량 구매 수량 */
const BULK_PURCHASE_THRESHOLD = 10;
/** 대량 구매 할인율 */
const BULK_DISCOUNT_RATE = 0.05;
/** 최대 할인율 */
const MAX_DISCOUNT_RATE = 0.5;

/** 대량 구매 여부 확인 */
const checkBulkPurchase = (cart: CartItem[]): boolean => {
  return cart.some((cartItem) => cartItem.quantity >= BULK_PURCHASE_THRESHOLD);
};

/** 기본 할인율 계산 */
const calculateBaseDiscount = (item: CartItem): number => {
  const { discounts } = item.product;
  const { quantity } = item;
  return discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount ? discount.rate : maxDiscount;
  }, 0);
};

/** 장바구니 구매 할인율 적용 */
const calculateMaxApplicableDiscount = (item: CartItem, cart: CartItem[]): number => {
  const baseDiscount = calculateBaseDiscount(item); // 기본 할인율 계산
  const bulkDiscount = checkBulkPurchase(cart) ? BULK_DISCOUNT_RATE : 0; // 대량 구매 할인율 계산

  return Math.min(baseDiscount + bulkDiscount, MAX_DISCOUNT_RATE); // 최대 할인율 적용
};

/** 장바구니 아이템의 총액을 계산 */
export const calculateItemTotal = (item: CartItem, cart: CartItem[]): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = calculateMaxApplicableDiscount(item, cart);

  return Math.round(price * quantity * (1 - discount));
};

/** 장바구니의 총 아이템 수를 계산 */
export const calculateTotalItemCount = (cart: CartItem[]): number => {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
};

/** 쿠폰 할인 계산 */
export const calculateDiscount = (total: number, coupon: Coupon): number => {
  if (coupon.discountType === "amount") {
    return Math.max(0, total - coupon.discountValue);
  } else {
    return Math.round(total * (1 - coupon.discountValue / 100));
  }
};
