import { useCallback } from "react";

import { useAtomValue, useSetAtom } from "jotai";

import cartAtom from "@/advanced/features/cart/atoms/cart.atom";
import { cartModel } from "@/advanced/features/cart/models/cart.model";
import { COUPON } from "@/advanced/features/coupon/constants/coupon";
import { useCoupon } from "@/advanced/features/coupon/hooks/useCoupon";
import { Coupon } from "@/advanced/features/coupon/types/coupon.type";
import { DiscountType } from "@/advanced/features/discount/types/discount.type";
import { throwNotificationError } from "@/advanced/features/notification/utils/notificationError.util";

export function useCart() {
  const cart = useAtomValue(cartAtom.cart);
  const totalItemCount = useAtomValue(cartAtom.totalItemCount);
  const addToCart = useSetAtom(cartAtom.addToCart);
  const removeFromCart = useSetAtom(cartAtom.removeFromCart);
  const updateQuantity = useSetAtom(cartAtom.updateQuantity);
  const clearCart = useSetAtom(cartAtom.clearCart);

  const { selectedCoupon, setSelectedCoupon } = useCoupon();

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = cartModel.calculateCartTotal(
        cart,
        selectedCoupon
      ).totalAfterDiscount;

      const isNotOverMinimumAmount =
        currentTotal < COUPON.MINIMUM_AMOUNT_FOR_PERCENTAGE;

      const isPercentageCoupon =
        coupon.discountType === DiscountType.PERCENTAGE;

      if (isNotOverMinimumAmount && isPercentageCoupon) {
        throwNotificationError.error(
          `percentage 쿠폰은 ${COUPON.MINIMUM_AMOUNT_FOR_PERCENTAGE.toLocaleString()}원 이상 구매 시 사용 가능합니다.`
        );

        return;
      }

      setSelectedCoupon(coupon);

      throwNotificationError.success("쿠폰이 적용되었습니다.");
    },
    [cart, selectedCoupon]
  );

  return {
    cart,
    totalItemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    clearCart,
  };
}
