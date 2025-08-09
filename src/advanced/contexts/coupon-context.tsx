import { createContext, useContext, ReactNode, useCallback, useState } from 'react';
import { initialCoupons } from '../constants/mocks';
import { useLocalStorage } from '../hooks/use-local-storage';
import { Coupon } from '@/types';
import { CouponModel } from '../models';
import { INITIAL_COUPON_FORM } from '../constants/forms';
import { useNotifications } from './notification-context';

interface CouponContextType {
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  couponForm: Coupon;
  showCouponForm: boolean;
  setShowCouponForm: (show: boolean) => void;
  setCouponForm: (coupon: Coupon) => void;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  deleteCoupon: (couponCode: string) => void;
  handleCouponSubmit: (e: React.FormEvent) => void;
  applyCoupon: (coupon: Coupon) => void;
}

const CouponContext = createContext<CouponContextType | undefined>(undefined);

interface CouponProviderProps {
  children: ReactNode;
}

export function CouponProvider({ children }: CouponProviderProps) {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>('coupons', initialCoupons);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState<Coupon>(INITIAL_COUPON_FORM);
  const { addNotification } = useNotifications();

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
    (coupon: Coupon) => {
      // Note: This creates a circular dependency issue, so we'll need to restructure this
      // For now, let's implement a simpler version that just sets the coupon
      setSelectedCoupon(coupon);
      addNotification('쿠폰이 적용되었습니다.', 'success');
    },
    [addNotification, setSelectedCoupon]
  );

  const value: CouponContextType = {
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

  return <CouponContext.Provider value={value}>{children}</CouponContext.Provider>;
}

export function useCoupons() {
  const context = useContext(CouponContext);
  if (context === undefined) {
    throw new Error('useCoupons must be used within a CouponProvider');
  }
  return context;
}
