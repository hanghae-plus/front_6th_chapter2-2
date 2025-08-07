import { useMemo } from "react";
import { CartItem } from "../../types";
import { calculateDiscount } from "../utils/cartCalculations";
import { useAtom } from "jotai";
import { cartAtom } from "../atoms/cartAtoms";
import { selectedCouponAtom } from "../atoms/couponAtoms";

interface CartTotals {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
}

interface UseCartTotalsProps {
  calculateItemTotal: (item: CartItem) => number;
}

export const useCartTotals = ({ calculateItemTotal }: UseCartTotalsProps): CartTotals => {
  /** 장바구니 상태 - Jotai 사용 */
  const [cart] = useAtom(cartAtom);

  /** 선택된 쿠폰 - Jotai 사용 */
  const [selectedCoupon] = useAtom(selectedCouponAtom);

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
