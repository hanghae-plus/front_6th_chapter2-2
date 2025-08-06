import React, { createContext, useContext, ReactNode } from "react";
import { useCoupons } from "../hooks/useCoupons";
import { useNotificationContext } from "./NotificationContext";
import { useCouponSelectionContext } from "./CouponSelectionContext";
import { Coupon } from "../../types";
import { useCartContext } from "./CartContext";
import { calculateCartTotal } from "../service/cartService";

interface CouponContextType {
  coupons: Coupon[];
  addCoupon: (newCoupon: Coupon) => void;
  deleteCoupon: (couponCode: string) => void;
  applyCoupon: (coupon: Coupon) => void;
  completeOrder: () => void;
}

import { initialCoupons } from "../data/initialData";

const CouponContext = createContext<CouponContextType>({
  coupons: initialCoupons,
  addCoupon: () => {},
  deleteCoupon: () => {},
  applyCoupon: () => {},
  completeOrder: () => {},
});

export const useCouponContext = () => {
  const context = useContext(CouponContext);
  return context;
};

interface CouponProviderProps {
  children: ReactNode;
}

export const CouponProvider: React.FC<CouponProviderProps> = ({ children }) => {
  const { addNotification } = useNotificationContext();
  const { selectedCoupon, setSelectedCoupon } = useCouponSelectionContext();
  const {
    coupons,
    addCoupon: baseAddCoupon,
    deleteCoupon: baseDeleteCoupon,
  } = useCoupons();
  const { cart, clearCart } = useCartContext();

  const addCoupon = (newCoupon: Coupon) => {
    baseAddCoupon(newCoupon, addNotification);
  };

  const deleteCoupon = (couponCode: string) => {
    baseDeleteCoupon(
      couponCode,
      selectedCoupon,
      setSelectedCoupon,
      addNotification
    );
  };

  const applyCoupon = (coupon: Coupon) => {
    const currentTotal = calculateCartTotal(
      cart,
      selectedCoupon
    ).totalAfterDiscount;

    if (currentTotal < 10000 && coupon.discountType === "percentage") {
      addNotification(
        "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
        "error"
      );
      return;
    }

    setSelectedCoupon(coupon);
    addNotification("쿠폰이 적용되었습니다.", "success");
  };

  const completeOrder = () => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    clearCart();
    setSelectedCoupon(null);
  };

  const value = {
    coupons,
    addCoupon,
    deleteCoupon,
    applyCoupon,
    completeOrder,
  };

  return (
    <CouponContext.Provider value={value}>{children}</CouponContext.Provider>
  );
};
