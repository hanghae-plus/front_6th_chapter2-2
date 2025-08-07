import { atom } from 'jotai';
import { calculateCartTotal } from '../../entities/cart';
import { cartAtom } from './cartAtom';
import { selectedCouponAtom } from './couponsAtom';

// 장바구니 총액 계산 derived atom
export const cartTotalsAtom = atom((get) => {
  const cart = get(cartAtom);
  const selectedCoupon = get(selectedCouponAtom);
  return calculateCartTotal(cart, selectedCoupon);
});