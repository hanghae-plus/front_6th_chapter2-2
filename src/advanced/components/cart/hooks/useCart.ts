import { useAtomValue, useSetAtom } from "jotai";
import { cartAtom } from "../../../store/atoms/cartAtoms";
import {
  couponsAtom,
  selectedCouponAtom,
} from "../../../store/atoms/couponAtoms";
import { cartTotalAtom } from "../../../store/selectors/cartTotalSelector";
import {
  handleAddToCartItem,
  handleClearCartItem,
  handleCompleteOrderItem,
  handleRemoveCartItem,
  handleUpdateQuantityItem,
} from "../../../store/actions/cartActions";
import { handleApplyCouponAtom } from "../../../store/actions/couponActions";

/**
 * 장바구니 관련 모든 상태와 액션을 캡슐화하는 커스텀 훅.
 */
export const useCart = () => {
  // --- 상태(State) Atoms 가져오기 (읽기 전용) ---
  const cart = useAtomValue(cartAtom);
  const coupons = useAtomValue(couponsAtom);
  const selectedCoupon = useAtomValue(selectedCouponAtom);
  const totals = useAtomValue(cartTotalAtom);

  // --- 액션(Action) Atoms 가져오기 (쓰기 전용) ---
  const addCartItem = useSetAtom(handleAddToCartItem);
  const removeCartItem = useSetAtom(handleRemoveCartItem);
  const updateCartQuantity = useSetAtom(handleUpdateQuantityItem);
  const clearCart = useSetAtom(handleClearCartItem);
  const applyCoupon = useSetAtom(handleApplyCouponAtom);
  const completeOrder = useSetAtom(handleCompleteOrderItem);

  // --- 컴포넌트에서 사용할 상태와 함수를 반환 ---
  return {
    // 상태
    cart,
    coupons,
    selectedCoupon,
    totals,

    // 액션
    addCartItem,
    removeCartItem,
    updateCartQuantity,
    clearCart,
    applyCoupon,
    completeOrder,
  };
};
