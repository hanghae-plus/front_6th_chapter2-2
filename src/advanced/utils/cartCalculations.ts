import { CartItem, Product } from '../../types';

/**
 * 장바구니 아이템의 최대 적용 가능한 할인율을 계산합니다.
 * @param item 장바구니 아이템
 * @param cart 전체 장바구니 (대량 구매 할인 계산용)
 * @returns 최대 할인율 (0-1 사이의 값)
 */
export const getMaxApplicableDiscount = (item: CartItem, cart: CartItem[]): number => {
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
};

/**
 * 장바구니 아이템의 총액을 계산합니다 (할인 적용 후).
 * @param item 장바구니 아이템
 * @param cart 전체 장바구니
 * @returns 할인 적용된 총액
 */
export const calculateItemTotal = (item: CartItem, cart: CartItem[]): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);

  return Math.round(price * quantity * (1 - discount));
};

/**
 * 장바구니 전체의 총액을 계산합니다.
 * @param cart 장바구니 아이템 배열
 * @param selectedCoupon 선택된 쿠폰 (선택사항)
 * @returns 할인 전/후 총액
 */
export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon?: { discountType: 'amount' | 'percentage'; discountValue: number } | null
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

  if (selectedCoupon) {
    if (selectedCoupon.discountType === 'amount') {
      totalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
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

/**
 * 상품의 남은 재고를 계산합니다.
 * @param product 상품
 * @param cart 장바구니 아이템 배열
 * @returns 남은 재고 수량
 */
export const getRemainingStock = (product: Product, cart: CartItem[]): number => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const remaining = product.stock - (cartItem?.quantity || 0);

  return remaining;
};
