import { initialCoupons } from '@/shared/constants';
import { useLocalStorage } from '@/shared/hooks';
import { Coupon, CartItem } from '@/types';
import { useCallback, useState } from 'react';
import { CouponModel, CartModel } from '@/shared/models';
import { INITIAL_COUPON_FORM } from '@/shared/constants';

interface UseCouponsProps {
  addNotification: (message: string, type: 'error' | 'success' | 'warning') => void;
}

export function useCoupons({ addNotification }: UseCouponsProps) {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>('coupons', initialCoupons);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState<Coupon>(INITIAL_COUPON_FORM);

  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const couponModel = new CouponModel(coupons);
      const validation = couponModel.validateCouponCode(newCoupon.code);
      if (!validation.isValid) {
        addNotification(validation.errorMessage!, 'error');
        return;
      }
      setCoupons((prev) => [...prev, newCoupon]);
      addNotification('쿠폰이 추가되었습니다.', 'success');
    },
    [coupons, addNotification, setCoupons]
  );

  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
      addNotification('쿠폰이 삭제되었습니다.', 'success');
    },
    [selectedCoupon, addNotification, setCoupons]
  );

  const handleCouponSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      addCoupon(couponForm);
      setCouponForm(INITIAL_COUPON_FORM);
      setShowCouponForm(false);
    },
    [couponForm, addCoupon]
  );

  const applyCoupon = useCallback(
    (coupon: Coupon, cart: CartItem[]) => {
      const cartModel = new CartModel(cart);
      const couponModel = new CouponModel();

      const currentTotal = cartModel.calculateTotal(selectedCoupon || undefined).totalAfterDiscount;
      const validation = couponModel.validateCouponApplication(coupon, currentTotal);

      if (!validation.isValid) {
        addNotification(validation.errorMessage!, 'error');
        return;
      }

      setSelectedCoupon(coupon);
      addNotification('쿠폰이 적용되었습니다.', 'success');
    },
    [addNotification, selectedCoupon]
  );

  return {
    coupons,
    selectedCoupon,
    couponForm,
    showCouponForm,
    setShowCouponForm,
    setCouponForm,
    setSelectedCoupon,
    deleteCoupon,
    handleCouponSubmit,
    applyCoupon,
  };
}
