import { useCallback } from 'react';

import { useCartStore } from './useCartStore';
import type { NotificationVariant, ProductWithUI } from '../constants';
import { getRemainingStock } from '../models/product';

interface UseCartServiceProps {
  products: ProductWithUI[];
  onAddNotification: (message: string, type: NotificationVariant) => void;
  onResetSelectedCoupon: () => void;
}

export function useCartService({
  products,
  onAddNotification,
  onResetSelectedCoupon,
}: UseCartServiceProps) {
  const { cart, addToCart, updateToCart, removeFromCart, resetCart } = useCartStore();

  const handleAddToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getRemainingStock(product, cart);
      if (remainingStock <= 0) {
        onAddNotification('재고가 부족합니다!', 'error');
        return;
      }

      const existingItem = cart.find((item) => item.product.id === product.id);

      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;

        if (newQuantity > product.stock) {
          onAddNotification(`재고는 ${product.stock}개까지만 있습니다.`, 'error');
          return;
        }

        updateToCart(product, newQuantity);
        return;
      }

      addToCart(product);
      onAddNotification('장바구니에 담았습니다', 'success');
    },
    [cart, onAddNotification, addToCart, updateToCart]
  );

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        onAddNotification(`재고는 ${maxStock}개까지만 있습니다.`, 'error');
        return;
      }

      updateToCart(product, newQuantity);
    },
    [products, removeFromCart, onAddNotification, updateToCart]
  );

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    onAddNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
    resetCart();
    onResetSelectedCoupon();
  }, [onAddNotification, resetCart, onResetSelectedCoupon]);

  return {
    cart,
    handleAddToCart,
    updateQuantity,
    removeFromCart,
    completeOrder,
  };
}
