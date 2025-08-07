import { CartItem, Coupon } from '../../../types';
import { CartTotal } from './types';

/**
 * 개별 상품의 할인율 계산
 * 상품별로 설정된 수량 할인 정책에 따라 할인율을 결정
 */
export const getProductDiscount = (item: CartItem): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  return discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);
};

/**
 * 대량구매 할인 체크
 * 장바구니에 10개 이상 구매한 상품이 하나라도 있으면 모든 상품에 5% 추가 할인
 */
export const getBulkPurchaseDiscount = (cart: CartItem[]): number => {
  const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);
  return hasBulkPurchase ? 0.05 : 0;
};

/**
 * 개별 아이템의 최대 적용 가능한 할인율 계산
 * @param item 계산할 장바구니 아이템
 * @param cart 전체 장바구니
 */
export const getMaxApplicableDiscount = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const baseDiscount = getProductDiscount(item);
  const bulkDiscount = getBulkPurchaseDiscount(cart);
  return Math.min(baseDiscount + bulkDiscount, 0.5);
};

/**
 * 개별 상품의 할인 적용된 총액 계산
 * @param item 계산할 장바구니 아이템
 * @param cart 전체 장바구니
 */
export const calculateItemTotal = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);

  return Math.round(price * quantity * (1 - discount));
};

/**
 * 장바구니 전체 금액 계산 (쿠폰 할인 포함)
 * 대량구매 할인을 한 번만 계산하여 모든 아이템에 적용
 */
export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null = null
): CartTotal => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  // 대량구매 할인은 한 번만 계산
  const bulkDiscount = getBulkPurchaseDiscount(cart);

  // 각 상품별 금액 계산
  cart.forEach((item) => {
    const itemPrice = item.product.price * item.quantity;
    totalBeforeDiscount += itemPrice;

    // 개별 상품 할인 + 대량구매 할인 조합
    const productDiscount = getProductDiscount(item);
    const totalDiscount = Math.min(productDiscount + bulkDiscount, 0.5);
    const itemTotal = Math.round(itemPrice * (1 - totalDiscount));

    totalAfterDiscount += itemTotal;
  });

  // 쿠폰 할인 적용
  if (selectedCoupon) {
    if (selectedCoupon.discountType === 'amount') {
      totalAfterDiscount = Math.max(
        0,
        totalAfterDiscount - selectedCoupon.discountValue
      );
    } else {
      totalAfterDiscount = Math.round(
        totalAfterDiscount * (1 - selectedCoupon.discountValue / 100)
      );
    }
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
  };
};
