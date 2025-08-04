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

import { useState, useEffect, useCallback } from "react";
import { CartItem, Product, Coupon } from "../../types";
import {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
} from "../models/cart";
import { calculateCartTotal } from "../models/coupon";
import { modelGetRemainingStock } from "../models/product";

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  // 상품 추가
  const addToCart = useCallback((product: Product) => {
    setCart((prev) => addItemToCart(prev, product));
  }, []);

  // 상품 제거
  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => removeItemFromCart(prev, productId));
  }, []);

  // 수량 변경
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCart((prev) => updateCartItemQuantity(prev, productId, quantity));
  }, []);

  // 쿠폰 적용
  const applyCoupon = useCallback((coupon: Coupon | null) => {
    setSelectedCoupon(coupon);
  }, []);

  // 총액 계산
  const calculateTotal = useCallback(() => {
    return calculateCartTotal(cart, selectedCoupon || undefined);
  }, [cart, selectedCoupon]);

  // 재고 확인
  const getRemainingStock = useCallback(
    (product: Product) => {
      return modelGetRemainingStock(product, cart);
    },
    [cart]
  );

  // 장바구니 비우기
  const clearCart = useCallback(() => {
    setCart([]);
    setSelectedCoupon(null);
  }, []);

  return {
    cart,
    selectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    getRemainingStock,
    clearCart,
  };
}
