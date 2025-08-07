import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';

import {
  addToCartAtom,
  cartAtom,
  removeFromCartAtom,
  updateToCartAtom,
} from '../../../entities/cart';
import { addNotificationAtom } from '../../../entities/notification';
import { getRemainingStock, type ProductWithUI } from '../../../entities/product';

interface UseCartServiceProps {
  products: ProductWithUI[];
}

export function useCartService({ products }: UseCartServiceProps) {
  const cart = useAtomValue(cartAtom);
  const addToCart = useSetAtom(addToCartAtom);
  const updateToCart = useSetAtom(updateToCartAtom);
  const removeFromCart = useSetAtom(removeFromCartAtom);

  const addNotification = useSetAtom(addNotificationAtom);

  const handleAddToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getRemainingStock(product, cart);
      if (remainingStock <= 0) {
        addNotification('재고가 부족합니다!', 'error');
        return;
      }

      const existingItem = cart.find((item) => item.product.id === product.id);

      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;

        if (newQuantity > product.stock) {
          addNotification(`재고는 ${product.stock}개까지만 있습니다.`, 'error');
          return;
        }

        updateToCart(product, newQuantity);
        return;
      }

      addToCart(product);
      addNotification('장바구니에 담았습니다', 'success');
    },
    [cart, addNotification, addToCart, updateToCart]
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
        addNotification(`재고는 ${maxStock}개까지만 있습니다.`, 'error');
        return;
      }

      updateToCart(product, newQuantity);
    },
    [products, removeFromCart, addNotification, updateToCart]
  );

  const resetCart = useCallback(() => {
    cart.forEach((item) => removeFromCart(item.product.id));
  }, [cart, removeFromCart]);

  return { cart, handleAddToCart, updateQuantity, removeFromCart, resetCart };
}
