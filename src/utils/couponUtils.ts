import { CartItemType, CouponType } from '@/types';
import { calculateCartTotal } from './calculateUtils';

// 쿠폰 적용
export const applyCoupon = (
  cart: CartItemType[],
  coupon: CouponType,
  setSelectedCoupon: (coupon: CouponType | null) => void,
  addNotification: (message: string, type: 'success' | 'error') => void
) => {
  const currentTotal = calculateCartTotal(cart, coupon).totalAfterDiscount;

  if (currentTotal < 10000 && coupon.discountType === 'percentage') {
    addNotification('percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.', 'error');
    return;
  }

  setSelectedCoupon(coupon);
  addNotification('쿠폰이 적용되었습니다.', 'success');
};
