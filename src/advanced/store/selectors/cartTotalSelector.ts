import { atom } from "jotai";
import { cartAtom } from "../atoms/cartAtoms";
import { selectedCouponAtom } from "../atoms/couponAtoms";
import { calculateCartTotal } from "../../service/cart";

// 장바구니 총액 selector
export const cartTotalAtom = atom((get) => {
  const cart = get(cartAtom);
  const selectedCoupon = get(selectedCouponAtom);
  return calculateCartTotal(cart, selectedCoupon);
});
