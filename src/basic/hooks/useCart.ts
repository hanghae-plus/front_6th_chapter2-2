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
// - addItemToCart: 상품 추가 함수
// - removeItemFromCart: 상품 제거 함수
// - updateCartItemQuantity: 수량 변경 함수
// - applyCoupon: 쿠폰 적용 함수
// - calculateTotal: 총액 계산 함수
// - getRemainingStock: 재고 확인 함수
// - clearCart: 장바구니 비우기 함수

import { CartItem, Coupon, Product } from '../../types.ts';
import { useCallback, useEffect, useState } from 'react';
import * as cartModel from '../models/cart.ts';

export function useCart(
  products: Product[],
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void
) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  //
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cart]);

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const addItemToCart = useCallback(
    (product: Product) => {
      setCart((prevCart) => {
        const remainingStock = cartModel.getRemainingStock(product, prevCart);
        if (remainingStock <= 0) {
          addNotification('재고가 부족합니다!', 'error');
          return prevCart;
        }
        const existingItem = prevCart.find((item) => item.product.id === product.id);

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;
          if (newQuantity > product.stock) {
            addNotification(`재고는 ${product.stock}개까지만 있습니다.`, 'error');
            return prevCart;
          }
          return cartModel.updateCartItemQuantity(prevCart, product.id, newQuantity);
        }
        addNotification('장바구니에 담았습니다', 'success');
        return cartModel.addItemToCart(product, prevCart);
      });
    },
    [addNotification]
  );

  const removeItemFromCart = useCallback((productId: string) => {
    setCart((prevCart) => cartModel.removeItemFromCart(productId, prevCart));
  }, []);

  const updateCartItemQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItemFromCart(productId);
        return;
      }

      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const maxStock = product.stock;
      if (quantity > maxStock) {
        addNotification(`재고는 ${maxStock}개까지만 있습니다.`, 'error');
        return;
      }

      setCart((prevCart) => cartModel.updateCartItemQuantity(prevCart, productId, quantity));
    },
    [addNotification, removeItemFromCart]
  );

  const clearCart = useCallback(() => {
    setCart(cartModel.clearCart());
    setSelectedCoupon(null);
  }, []);

  const calculateItemTotal = useCallback(
    (item: CartItem) => {
      return cartModel.calculateItemTotal(item, cart);
    },
    [cart]
  );

  const getRemainingStock = (product: Product): number => {
    return cartModel.getRemainingStock(product, cart);
  };

  const calculateCartTotal = () => {
    return cartModel.calculateCartTotal(cart, selectedCoupon);
  };

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = cartModel.calculateCartTotal(cart, coupon).totalAfterDiscount;

      if (currentTotal < 10000 && coupon.discountType === 'percentage') {
        addNotification('percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.', 'error');
        return;
      }

      setSelectedCoupon(coupon);
      addNotification('쿠폰이 적용되었습니다.', 'success');
    },
    [cart, addNotification]
  );
  return {
    cart,
    setCart,
    selectedCoupon,
    setSelectedCoupon,
    addItemToCart,
    removeItemFromCart,
    updateCartItemQuantity,
    clearCart,
    calculateItemTotal,
    calculateCartTotal,
    getRemainingStock,
    applyCoupon,
  };
}
