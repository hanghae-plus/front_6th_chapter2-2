import { ChangeEvent } from 'react';
import { Coupon } from '../../../types';
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage';

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

export function useCoupon() {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>('coupons', initialCoupons);
  const [selectedCoupon, setSelectedCoupon] = useLocalStorage<Coupon | null>(
    'selectedCoupon',
    null
  );

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
    notificationMessage,
  }: {
    coupon: Coupon;
    totalAfterDiscount: number;
    notificationMessage: () => void;
  }) => {
    const isNotOver10000 = totalAfterDiscount < 10000;
    if (isNotOver10000 && coupon.discountType === 'percentage') {
      notificationMessage();
      return false;
    }

    return true;
  };

  const applyCoupon = ({
    coupon,
    totalAfterDiscount,
    notificationMessage,
  }: {
    coupon: Coupon;
    totalAfterDiscount: number;
    notificationMessage: () => void;
  }) => {
    if (!validateApplyCoupon({ coupon, totalAfterDiscount, notificationMessage })) {
      return;
    }

    updateSelectedCoupon(coupon);
    notificationMessage();
  };

  const updateSelectedCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  const handleChangeCoupon = (
    e: ChangeEvent<HTMLSelectElement>,
    totalAfterDiscount: number,
    notificationMessage: () => void
  ) => {
    const coupon = coupons.find((c) => c.code === e.target.value);
    if (coupon) {
      applyCoupon({
        coupon,
        totalAfterDiscount,
        notificationMessage,
      });

      return;
    }

    resetSelectedCoupon();
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
