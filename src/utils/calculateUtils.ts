import { CartItemType, CouponType } from '@/types';
import { CartTotalType } from '../basic/entities/cart/types/cart';
import { getMaxApplicableDiscount } from './discountUtils';

// 개별 상품 총액 계산 (할인 적용)
export const calculateItemTotal = (item: CartItemType, cart: CartItemType[]): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);

  return Math.round(price * quantity * (1 - discount));
};

// 장바구니 총액 계산
export const calculateCartTotal = (
  cart: CartItemType[],
  selectedCoupon: CouponType | null
): CartTotalType => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  // 각 상품의 할인 적용 전/후 금액 계산
  cart.forEach((item) => {
    const itemPrice = item.product.price * item.quantity;
    totalBeforeDiscount += itemPrice;
    totalAfterDiscount += calculateItemTotal(item, cart);
  });

  // 쿠폰 할인 적용
  if (selectedCoupon) {
    if (selectedCoupon.discountType === 'amount') {
      // 정액 할인
      totalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
    } else {
      // 정률 할인
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
