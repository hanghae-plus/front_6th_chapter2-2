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

import { useLocalStorage } from '../utils/hooks/useLocalStorage.ts';
import { useCallback, useState } from 'react';
import { ProductWithUI } from '../constants';
import {
  addItemToCart,
  calculateCartTotal,
  removeItemFromCart,
  updateCartItemQuantity,
} from '../models/cart.ts';
import { CartItem, Coupon, OperationResult } from '../../types.ts';

export function useCart(): {
  cart: CartItem[];
  selectedCoupon: Coupon | null;
  addToCart: (product: ProductWithUI) => OperationResult;
  removeFromCart: (productId: string) => OperationResult;
  updateQuantity: (
    products: ProductWithUI[],
    productId: string,
    newQuantity: number,
  ) => OperationResult;
  clearSelectedCoupon: (couponCode: string) => void;
  clearCart: () => void;
  applyCoupon: (coupon: Coupon | null) => OperationResult;
} {
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addToCart = useCallback(
    (product: ProductWithUI): OperationResult => {
      const result = addItemToCart(cart, product);

      if (result.data?.cart) {
        setCart(result.data.cart);
      }

      if (result.success) {
        return { success: result.success };
      }

      return { error: result.error! };
    },
    [cart, setCart],
  );

  const removeFromCart = useCallback(
    (productId: string): OperationResult => {
      const result = removeItemFromCart(cart, productId);

      if (result.data?.cart) {
        setCart(result.data.cart);
      }

      if (result.success) {
        return { success: result.success };
      }

      return { error: result.error! };
    },
    [cart, setCart],
  );

  const updateQuantity = useCallback(
    (products: ProductWithUI[], productId: string, newQuantity: number): OperationResult => {
      const result = updateCartItemQuantity(cart, products, productId, newQuantity);

      if (result.data?.cart) {
        setCart(result.data.cart);
      }

      if (result.success) {
        return { success: result.success };
      }

      return { error: result.error! };
    },
    [cart, setCart],
  );

  const clearSelectedCoupon = useCallback(
    (couponCode: string) => {
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
    },
    [selectedCoupon],
  );

  const clearCart = useCallback(() => {
    setCart([]);
    setSelectedCoupon(null);
  }, [setCart]);

  const applyCoupon = useCallback(
    (coupon: Coupon | null): OperationResult => {
      const currentTotal = calculateCartTotal(cart, selectedCoupon).totalAfterDiscount;

      if (currentTotal < 10000 && coupon?.discountType === 'percentage') {
        // onAddNotification('percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.', 'error');
        return {
          error: {
            type: '',
            message: 'percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.',
          },
        };
      }

      setSelectedCoupon(coupon);
      return {
        success: {
          type: '',
          message: '쿠폰이 적용되었습니다.',
        },
      };
    },
    [cart, selectedCoupon],
  );

  return {
    cart,
    selectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    clearSelectedCoupon,
  };
}
