import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';

import { Product } from '../../types';
import { addNotificationAtom, cartAtom, productsAtom } from '../atoms';
import * as cartModel from '../models/cart';

export function useCart() {
  const addNotification = useSetAtom(addNotificationAtom);
  const products = useAtomValue(productsAtom);

  const [cart, setCart] = useAtom(cartAtom);

  const getRemainingStock = useCallback(
    (product: Product): number => {
      return cartModel.getRemainingStock(product, cart);
    },
    [cart],
  );

  const addToCart = useCallback(
    (product: Product) => {
      const remainingStock = getRemainingStock(product);
      if (remainingStock <= 0) {
        addNotification({ message: '재고가 부족합니다!', type: 'error' });
        return;
      }

      const newCart = cartModel.addItemToCart(cart, product);
      setCart(newCart);
      addNotification({ message: '장바구니에 담았습니다', type: 'success' });
    },
    [cart, addNotification, getRemainingStock],
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      const newCart = cartModel.removeItemFromCart(cart, productId);
      setCart(newCart);
    },
    [cart],
  );

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      if (newQuantity > product.stock) {
        addNotification({ message: `재고는 ${product.stock}개까지만 있습니다.`, type: 'error' });
        return;
      }

      const newCart = cartModel.updateCartItemQuantity(cart, productId, newQuantity);
      setCart(newCart);
    },
    [cart, products, addNotification],
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getRemainingStock,
    clearCart,
  };
}
