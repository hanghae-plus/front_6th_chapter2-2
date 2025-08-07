import { useState, useCallback, useEffect } from 'react';

import { CartItem, Coupon, ProductWithUI, NotificationCallback } from '../../types';
import { calculateItemTotal, getRemainingStock } from '../models/cart';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';

export function useCart(products: ProductWithUI[] = []) {
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);

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
  const addToCart = useCallback((product: ProductWithUI, onNotification?: NotificationCallback) => {
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
  }, [setCart]);

  // removeFromCart 함수 (원본 로직과 동일)
  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  }, [setCart]);

  // updateQuantity 함수 (원본 로직과 동일)
  const updateQuantity = useCallback(
    (productId: string, newQuantity: number, onNotification?: NotificationCallback) => {
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
    [products, removeFromCart, setCart]
  );

  // applyCoupon 함수
  const applyCoupon = useCallback(
    (coupon: Coupon, onNotification?: NotificationCallback) => {
      const { totalAfterDiscount } = calculateCartTotal();

      // 쿠폰 적용 가능 여부 확인 (10,000원 이상 구매 시 사용 가능)
      if (coupon.discountType === 'percentage' && totalAfterDiscount < 10000) {
        onNotification?.('percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.', 'error');
        return;
      }

      setSelectedCoupon(coupon);
      onNotification?.('쿠폰이 적용되었습니다.', 'success');
    },
    [calculateCartTotal, setSelectedCoupon]
  );

  // completeOrder 함수
  const completeOrder = useCallback((onNotification?: NotificationCallback) => {
    const orderNumber = `ORD-${Date.now()}`;
    onNotification?.(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
    setCart([]);
    setSelectedCoupon(null);
  }, [setCart]);

  // clearCart 함수
  const clearCart = useCallback(() => {
    setCart([]);
    setSelectedCoupon(null);
  }, [setCart]);

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
