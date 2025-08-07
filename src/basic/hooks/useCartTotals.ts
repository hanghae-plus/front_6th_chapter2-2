import { useMemo } from "react";
import { CartItem, Coupon } from "../../types";
import { calculateDiscount } from "../utils/cartCalculations";

interface CartTotals {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
}

interface UseCartTotalsProps {
  cart: CartItem[];
  selectedCoupon: Coupon | null;
  calculateItemTotal: (item: CartItem) => number;
}

export const useCartTotals = ({ cart, selectedCoupon, calculateItemTotal }: UseCartTotalsProps): CartTotals => {
  const memoizedCalculateItemTotal = useMemo(() => (item: CartItem) => calculateItemTotal(item), [calculateItemTotal]);

  return useMemo(() => {
    // 기본 총액 계산
    const totals = cart.reduce(
      (acc, item) => {
        // 기본 총액 계산
        const itemPrice = item.product.price * item.quantity;
        // 할인 적용 총액 계산
        const itemTotal = memoizedCalculateItemTotal(item);

        return {
          totalBeforeDiscount: acc.totalBeforeDiscount + itemPrice,
          totalAfterDiscount: acc.totalAfterDiscount + itemTotal,
        };
      },
      { totalBeforeDiscount: 0, totalAfterDiscount: 0 }
    );

    // 쿠폰 할인 적용
    const finalTotalAfterDiscount = selectedCoupon ? calculateDiscount(totals.totalAfterDiscount, selectedCoupon) : totals.totalAfterDiscount;

    return {
      totalBeforeDiscount: Math.round(totals.totalBeforeDiscount),
      totalAfterDiscount: Math.round(finalTotalAfterDiscount),
    };
  }, [cart, selectedCoupon, memoizedCalculateItemTotal]);
};
