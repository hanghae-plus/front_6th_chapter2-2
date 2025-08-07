// TODO: 장바구니 관리 Hook
// 힌트:
// 1. 장바구니 상태 관리 (localStorage 연동)
// 2. 상품 추가/삭제/수량 변경
// 3. 쿠폰 적용
// 4. 총액 계산
// 5. 재고 확인
//
// 사용할 모델 함수:
// - cartModel.addItemToCart
// - cartModel.removeItemFromCart
// - cartModel.updateCartItemQuantity
// - cartModel.calculateCartTotal
// - cartModel.getRemainingStock
//
// 반환할 값:
// - cart: 장바구니 아이템 배열
// - selectedCoupon: 선택된 쿠폰
// - addToCart: 상품 추가 함수
// - removeFromCart: 상품 제거 함수
// - updateQuantity: 수량 변경 함수
// - applyCoupon: 쿠폰 적용 함수
// - calculateTotal: 총액 계산 함수
// - getRemainingStock: 재고 확인 함수
// - clearCart: 장바구니 비우기 함수
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';

import {
  cartAtom,
  selectedCouponAtom,
  totalItemCountAtom,
  getRemainingStockAtom,
  calculateTotalAtom,
  addToCartAtom,
  removeFromCartAtom,
  updateQuantityAtom,
  clearCartAtom,
  applyCouponAtom,
} from '../atoms/cartAtoms';
import { ProductWithUI, Coupon } from '../types';

const useCart = () => {
  // atoms 구독
  const [cart] = useAtom(cartAtom);
  const [selectedCoupon] = useAtom(selectedCouponAtom);
  const totalItemCount = useAtomValue(totalItemCountAtom);
  const getRemainingStock = useAtomValue(getRemainingStockAtom);
  const calculateTotal = useAtomValue(calculateTotalAtom);

  // action atoms
  const addToCartAction = useSetAtom(addToCartAtom);
  const removeFromCartAction = useSetAtom(removeFromCartAtom);
  const updateQuantityAction = useSetAtom(updateQuantityAtom);
  const clearCartAction = useSetAtom(clearCartAtom);
  const applyCouponAction = useSetAtom(applyCouponAtom);

  // wrapper 함수들
  const addToCart = useCallback(
    (product: ProductWithUI) => {
      addToCartAction(product);
    },
    [addToCartAction],
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      removeFromCartAction(productId);
    },
    [removeFromCartAction],
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      updateQuantityAction({ productId, quantity });
    },
    [updateQuantityAction],
  );

  const clearCart = useCallback(() => {
    clearCartAction();
  }, [clearCartAction]);

  const applyCoupon = useCallback(
    (coupon: Coupon | null) => {
      applyCouponAction(coupon);
    },
    [applyCouponAction],
  );

  return {
    cart,
    selectedCoupon,
    totalItemCount,
    getRemainingStock,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    calculateTotal,
  };
};

export { useCart };
