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

import { useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import type { CartItem, Product } from '../../types';
import { addCartAtom, cartAtom, removeFromCartAtom } from '../atoms/cart';
import * as cartModel from '../models/cart';
import { useAtomWithLocalStorage } from '../utils/hooks/useLocalStorage';
import { useNotify } from './useNotification';

interface UseCartReturn {
  cart: CartItem[];
  totalItemCount: number;
  updateQuantity: (params: {
    productId: string;
    newQuantity: number;
    products: Product[];
  }) => void;
  clearCart: () => void;
}

export function useCart(): UseCartReturn {
  const LOCAL_STORAGE_KEY = 'cart';
  const [cart, setCart] = useAtomWithLocalStorage<CartItem[]>({
    key: 'cart',
    initialValue: [],
    atom: cartAtom,
  });
  const notify = useNotify();

  useEffect(() => {
    if (!cart.length) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, [cart]);

  return {
    cart,
    totalItemCount: cartModel.calculateTotalItemCount({ cart }),

    updateQuantity: useCallback(
      ({ productId, newQuantity, products }) => {
        const result = cartModel.updateCartQuantityWithValidation({
          cart,
          newQuantity,
          productId,
          products,
        });

        if (!result.success) {
          notify({ message: result.message, type: 'error' });
          return;
        }

        setCart(result.newCart);
        notify({ message: result.message, type: 'success' });
      },
      [setCart, notify, cart]
    ),

    clearCart: useCallback(() => {
      setCart([]);
    }, [setCart]),
  };
}

export function useAddToCart() {
  const set = useSetAtom(addCartAtom);
  const notify = useNotify();

  const addToCart = useCallback(
    ({ product }: { product: Product }) => {
      set({ product, notify });
    },
    [set, notify]
  );

  return addToCart;
}

export function useRemoveFromCart() {
  return useSetAtom(removeFromCartAtom);
}
