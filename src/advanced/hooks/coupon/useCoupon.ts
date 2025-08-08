import { ChangeEvent } from 'react';
import { Coupon } from '../../../types';
import { atom, useAtom } from 'jotai';

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

const couponsAtom = atom<Coupon[]>(initialCoupons);
const selectedCouponAtom = atom<Coupon | null>(null);

export type ApplyCouponResult =
  | { success: true }
  | { success: false; reason: 'PERCENTAGE_UNDER_MIN_TOTAL' | 'COUPON_NOT_FOUND' };

export function useCoupon() {
  const [coupons, setCoupons] = useAtom(couponsAtom);
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);

  const resetSelectedCoupon = () => setSelectedCoupon(null);

  const resetCoupons = () => setCoupons(initialCoupons);

  const addCoupon = (newCoupon: Coupon) => {
    setCoupons((prev) => [...prev, newCoupon]);
  };

  const deleteCoupon = (couponCode: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== couponCode));

    if (selectedCoupon?.code === couponCode) {
      setSelectedCoupon(null);
    }
  };

  const validateApplyCoupon = ({
    coupon,
    totalAfterDiscount,
  }: {
    coupon: Coupon;
    totalAfterDiscount: number;
  }): ApplyCouponResult => {
    const isNotOver10000 = totalAfterDiscount < 10000;
    if (isNotOver10000 && coupon.discountType === 'percentage') {
      return { success: false, reason: 'PERCENTAGE_UNDER_MIN_TOTAL' };
    }

    return { success: true };
  };

  const applyCoupon = ({
    coupon,
    totalAfterDiscount,
  }: {
    coupon: Coupon;
    totalAfterDiscount: number;
  }): ApplyCouponResult => {
    const validation = validateApplyCoupon({ coupon, totalAfterDiscount });
    if (!validation.success) {
      return validation;
    }

    updateSelectedCoupon(coupon);
    return { success: true };
  };

  const updateSelectedCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  const handleChangeCoupon = (
    e: ChangeEvent<HTMLSelectElement>,
    totalAfterDiscount: number
  ): ApplyCouponResult => {
    const coupon = coupons.find((c) => c.code === e.target.value);
    if (coupon) {
      return applyCoupon({ coupon, totalAfterDiscount });
    }

    resetSelectedCoupon();
    return { success: false, reason: 'COUPON_NOT_FOUND' };
  };

  return {
    selectedCoupon,
    updateSelectedCoupon,
    resetSelectedCoupon,

    coupons,
    addCoupon,
    deleteCoupon,
    resetCoupons,
    handleChangeCoupon,
  };
}
