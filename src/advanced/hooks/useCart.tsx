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

import { useCallback, useEffect } from 'react';
import type { CartItem, Product } from '../../types';
import * as cartModel from '../models/cart';
import * as productModel from '../models/product';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';
import { useNotify } from './useNotification';

interface UseCartReturn {
  cart: CartItem[];
  totalItemCount: number;
  addToCart: (params: { product: Product }) => void;
  removeFromCart: (params: { productId: string }) => void;
  updateQuantity: (params: {
    productId: string;
    newQuantity: number;
    products: Product[];
  }) => void;
  clearCart: () => void;
}

export function useCart(): UseCartReturn {
  const notify = useNotify();
  const LOCAL_STORAGE_KEY = 'cart';
  const [cart, setCart] = useLocalStorage<CartItem[]>({
    key: LOCAL_STORAGE_KEY,
    initialValue: [],
  });

  useEffect(() => {
    if (!cart.length) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, [LOCAL_STORAGE_KEY, cart.length]);

  return {
    cart,
    totalItemCount: cartModel.calculateTotalItemCount({ cart }),

    addToCart: useCallback(
      ({ product }) => {
        const remainingStock = productModel.getRemainingStock({
          cart,
          product,
        });
        const isSoldOut = productModel.isSoldOut({ remainingStock });

        const result = cartModel.addToCartWithStockCheck({
          cart,
          product,
          isSoldOut,
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

    removeFromCart: useCallback(
      ({ productId }) => {
        const newCart = cartModel.removeItemFromCart({
          cart,
          productId: productId,
        });
        setCart(newCart);
      },
      [setCart, cart]
    ),

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
