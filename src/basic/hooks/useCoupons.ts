import { useCallback, useState } from 'react';
import { CartItem, Coupon } from '../models/entities';
import { useNotifications } from './useNotifications.ts';
import { calculateCartTotal } from '../utils/calulator.ts';

const initialCoupons: Coupon[] = [
  {
    name: '5000원 할인',
    code: 'AMOUNT5000',
    discountType: 'amount',
    discountValue: 5000,
  },
  {
    name: '10% 할인',
    code: 'PERCENT10',
    discountType: 'percentage',
    discountValue: 10,
  },
];
export const useCoupons = (cart: CartItem[]) => {
  const { addNotification } = useNotifications();
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('coupons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialCoupons;
      }
    }
    return initialCoupons;
  });
  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const existingCoupon = coupons.find(c => c.code === newCoupon.code);
      if (existingCoupon) {
        addNotification('이미 존재하는 쿠폰 코드입니다.', 'error');
        return;
      }
      setCoupons(prev => [...prev, newCoupon]);
      addNotification('쿠폰이 추가되었습니다.', 'success');
    },
    [coupons, addNotification]
  );
  // 쿠폰 삭제
  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons(prev => prev.filter(c => c.code !== couponCode));
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
      addNotification('쿠폰이 삭제되었습니다.', 'success');
    },
    [selectedCoupon, addNotification]
  );
  // const calculateCartTotal = (): {
  //   totalBeforeDiscount: number;
  //   totalAfterDiscount: number;
  // } => {
  //   let totalBeforeDiscount = 0;
  //   let totalAfterDiscount = 0;
  //
  //   cart.forEach(item => {
  //     const itemPrice = item.product.price * item.quantity;
  //     totalBeforeDiscount += itemPrice;
  //     totalAfterDiscount += calculateItemTotal(item);
  //   });
  //
  //   if (selectedCoupon) {
  //     if (selectedCoupon.discountType === 'amount') {
  //       totalAfterDiscount = Math.max(
  //         0,
  //         totalAfterDiscount - selectedCoupon.discountValue
  //       );
  //     } else {
  //       totalAfterDiscount = Math.round(
  //         totalAfterDiscount * (1 - selectedCoupon.discountValue / 100)
  //       );
  //     }
  //   }
  //
  //   return {
  //     totalBeforeDiscount: Math.round(totalBeforeDiscount),
  //     totalAfterDiscount: Math.round(totalAfterDiscount),
  //   };
  // };

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateCartTotal(
        cart,
        selectedCoupon
      ).totalAfterDiscount;

      if (currentTotal < 10000 && coupon.discountType === 'percentage') {
        addNotification(
          'percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.',
          'error'
        );
        return;
      }

      setSelectedCoupon(coupon);
      addNotification('쿠폰이 적용되었습니다.', 'success');
    },
    [addNotification, calculateCartTotal]
  );
  return { addCoupon, applyCoupon, deleteCoupon, coupons };
};
