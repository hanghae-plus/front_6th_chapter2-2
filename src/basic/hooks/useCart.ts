import { useState, useCallback, useEffect } from 'react';

import { CartItem, Coupon, ProductWithUI, NotificationCallback } from '../../types';
import { calculateItemTotal, getRemainingStock } from '../models/cart';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';

export function useCart(products: ProductWithUI[] = []) {
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const [totalItemCount, setTotalItemCount] = useState(0);

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

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

  const addToCart = useCallback(
    (product: ProductWithUI, onNotification?: NotificationCallback) => {
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
            return prevCart;
          }

          return prevCart.map((item) =>
            item.product.id === product.id ? { ...item, quantity: newQuantity } : item
          );
        }

        return [...prevCart, { product, quantity: 1 }];
      });

      onNotification?.('장바구니에 담았습니다', 'success');
    },
    [setCart]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
    },
    [setCart]
  );

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

  const applyCoupon = useCallback(
    (coupon: Coupon, onNotification?: NotificationCallback) => {
      const { totalAfterDiscount } = calculateCartTotal();

      if (coupon.discountType === 'percentage' && totalAfterDiscount < 10000) {
        onNotification?.('percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.', 'error');
        return;
      }

      setSelectedCoupon(coupon);
      onNotification?.('쿠폰이 적용되었습니다.', 'success');
    },
    [calculateCartTotal, setSelectedCoupon]
  );

  const completeOrder = useCallback(
    (onNotification?: NotificationCallback) => {
      const orderNumber = `ORD-${Date.now()}`;
      onNotification?.(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
      setCart([]);
      setSelectedCoupon(null);
    },
    [setCart]
  );

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
