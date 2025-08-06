import { useState, useCallback, useEffect } from 'react';

import { CartItem, Coupon, ProductWithUI } from '../../types';
import { calculateItemTotal, getRemainingStock } from '../models/cart';

export function useCart(products: ProductWithUI[] = []) {
  // localStorage에서 초기값 가져오기 (원본 패턴과 동일)
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

  // selectedCoupon 상태 관리
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // totalItemCount 상태 관리
  const [totalItemCount, setTotalItemCount] = useState(0);

  // totalItemCount 계산
  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

  // 총액 계산 (함수명 통일)
  const calculateCartTotal = useCallback(() => {
    let totalBeforeDiscount = 0;
    let totalAfterDiscount = 0;

    cart.forEach((item) => {
      const itemPrice = item.product.price * item.quantity;
      totalBeforeDiscount += itemPrice;
      totalAfterDiscount += calculateItemTotal(item, cart);
    });

    if (selectedCoupon) {
      if (selectedCoupon.discountType === 'amount') {
        totalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
      } else {
        totalAfterDiscount = Math.round(
          totalAfterDiscount * (1 - selectedCoupon.discountValue / 100)
        );
      }
    }

    return {
      totalBeforeDiscount: Math.round(totalBeforeDiscount),
      totalAfterDiscount: Math.round(totalAfterDiscount),
    };
  }, [cart, selectedCoupon]);

  // addToCart 함수 (원본 로직과 동일)
  const addToCart = useCallback(
    (
      product: ProductWithUI,
      onNotification?: (message: string, type: 'success' | 'error' | 'warning') => void
    ) => {
      setCart((prevCart) => {
        const remainingStock = getRemainingStock(product, prevCart);
        if (remainingStock <= 0) {
          onNotification?.('재고가 부족합니다!', 'error');
          return prevCart;
        }

        const existingItem = prevCart.find((item) => item.product.id === product.id);

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;

          if (newQuantity > product.stock) {
            onNotification?.(`재고는 ${product.stock}개까지만 있습니다.`, 'error');
            return prevCart; // 원본과 동일하게 prevCart 반환
          }

          return prevCart.map((item) =>
            item.product.id === product.id ? { ...item, quantity: newQuantity } : item
          );
        }

        return [...prevCart, { product, quantity: 1 }];
      });

      onNotification?.('장바구니에 담았습니다', 'success');
    },
    []
  );

  // removeFromCart 함수 (원본 로직과 동일)
  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  }, []);

  // updateQuantity 함수 (원본 로직과 동일)
  const updateQuantity = useCallback(
    (
      productId: string,
      newQuantity: number,
      onNotification?: (message: string, type: 'success' | 'error' | 'warning') => void
    ) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        onNotification?.(`재고는 ${maxStock}개까지만 있습니다.`, 'error');
        return;
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    },
    [products, removeFromCart]
  );

  // applyCoupon 함수
  const applyCoupon = useCallback(
    (
      coupon: Coupon,
      onNotification?: (message: string, type: 'success' | 'error' | 'warning') => void
    ) => {
      // calculateCartTotal 로직을 직접 구현
      let totalAfterDiscount = 0;
      cart.forEach((item) => {
        totalAfterDiscount += calculateItemTotal(item, cart);
      });

      if (selectedCoupon) {
        if (selectedCoupon.discountType === 'amount') {
          totalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
        } else {
          totalAfterDiscount = Math.round(
            totalAfterDiscount * (1 - selectedCoupon.discountValue / 100)
          );
        }
      }

      // 쿠폰 적용 가능 여부 확인 (10,000원 이상 구매 시 사용 가능)
      if (coupon.discountType === 'percentage' && totalAfterDiscount < 10000) {
        onNotification?.('percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.', 'error');
        return;
      }

      setSelectedCoupon(coupon);
      onNotification?.('쿠폰이 적용되었습니다.', 'success');
    },
    [cart, selectedCoupon]
  );

  // completeOrder 함수
  const completeOrder = useCallback(
    (onNotification?: (message: string, type: 'success' | 'error' | 'warning') => void) => {
      const orderNumber = `ORD-${Date.now()}`;
      onNotification?.(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
      setCart([]);
      setSelectedCoupon(null);
    },
    []
  );

  // clearCart 함수
  const clearCart = useCallback(() => {
    setCart([]);
    setSelectedCoupon(null);
  }, []);

  return {
    cart,
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
