import { useAtom, useAtomValue } from 'jotai';

import { Coupon, ProductWithUI, NotificationCallback } from '../../types';
import { getRemainingStock } from '../models/cart';
import {
  addToCartAtom,
  removeFromCartAtom,
  updateQuantityAtom,
  applyCouponAtom,
  completeOrderAtom,
  clearCartAtom,
} from '../store/actions';
import { selectedCouponAtom, totalItemCountAtom, cartTotalAtom } from '../store/atoms';

export function useCart() {
  // Jotai atoms 사용
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);
  const totalItemCount = useAtomValue(totalItemCountAtom);
  const cartTotal = useAtomValue(cartTotalAtom);

  // Jotai action atoms 사용
  const [, addToCartAction] = useAtom(addToCartAtom);
  const [, removeFromCartAction] = useAtom(removeFromCartAtom);
  const [, updateQuantityAction] = useAtom(updateQuantityAtom);
  const [, applyCouponAction] = useAtom(applyCouponAtom);
  const [, completeOrderAction] = useAtom(completeOrderAtom);
  const [, clearCartAction] = useAtom(clearCartAtom);

  // 기존 인터페이스 유지를 위한 래퍼 함수들
  const addToCart = (product: ProductWithUI, onNotification?: NotificationCallback) => {
    addToCartAction({
      product,
      onNotification: onNotification as
        | ((message: string, type?: 'success' | 'error' | 'warning') => void)
        | undefined,
    });
  };

  const removeFromCart = (productId: string) => {
    removeFromCartAction(productId);
  };

  const updateQuantity = (
    productId: string,
    newQuantity: number,
    onNotification?: NotificationCallback
  ) => {
    updateQuantityAction({
      productId,
      newQuantity,
      onNotification: onNotification as
        | ((message: string, type?: 'success' | 'error' | 'warning') => void)
        | undefined,
    });
  };

  const applyCoupon = (coupon: Coupon, onNotification?: NotificationCallback) => {
    applyCouponAction({
      coupon,
      onNotification: onNotification as
        | ((message: string, type?: 'success' | 'error' | 'warning') => void)
        | undefined,
    });
  };

  const completeOrder = () => {
    completeOrderAction();
  };

  const clearCart = () => {
    clearCartAction();
  };

  const calculateCartTotal = () => {
    return cartTotal;
  };

  return {
    selectedCoupon,
    setSelectedCoupon,
    totalItemCount,
    calculateCartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    getRemainingStock,
    clearCart,
    completeOrder,
  };
}
