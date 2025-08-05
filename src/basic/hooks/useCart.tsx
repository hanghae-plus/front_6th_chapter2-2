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

import { useCallback } from 'react';
import type { CartItem, ProductWithUI } from '../../types';
import * as cartModel from '../models/cart';
import type { IsSoldOutParams } from '../models/product';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';
import type { AddNotificationParams } from './useNotification';

export function useCart({
  isSoldOut,
  addNotification,
}: {
  isSoldOut: (params: IsSoldOutParams) => boolean;
  addNotification: (params: AddNotificationParams) => void;
}) {
  const [cart, setCart] = useLocalStorage<CartItem[]>({
    key: 'cart',
    initialValue: [],
  });

  const addToCart = useCallback(
    (product: ProductWithUI) => {
      setCart((prevCart) => {
        return cartModel.addToCart({
          cart: prevCart,
          product,
          checkSoldOut: () => {
            return isSoldOut({ cart: prevCart, product });
          },
          onFailure: ({ message }) => {
            addNotification({ message, type: 'error' });
          },
          onSuccess: () => {
            addNotification({
              message: '장바구니에 담았습니다',
              type: 'success',
            });
          },
        });
      });
    },
    [setCart, isSoldOut, addNotification]
  );

  return {
    cart,
    setCart,
    addToCart,
  };
}
