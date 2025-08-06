import { addNotificationAtom } from './../../atoms/notificationsAtoms';
import { useCallback } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { ProductWithUI } from '../../../types';
import { getRemainingStock } from '../../utils/calculations/stockCalculations';
import { cartAtom, totalCartItemAtom } from '../../atoms/cartAtoms';

export const useCart = () => {
  const [cart, setCart] = useAtom(cartAtom);
  const totalCartItem = useAtomValue(totalCartItemAtom);
  const addNotification = useSetAtom(addNotificationAtom);
  // 장바구니에 추가
  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getRemainingStock(product, cart);
      if (remainingStock <= 0) {
        addNotification({
          message: '재고가 부족합니다!',
          type: 'error',
        });
        return;
      }

      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.product.id === product.id);

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;

          if (newQuantity > product.stock) {
            addNotification({
              message: `재고는 ${product.stock}개까지만 있습니다.`,
              type: 'error',
            });
            return prevCart;
          }

          return prevCart.map((item) =>
            item.product.id === product.id ? { ...item, quantity: newQuantity } : item,
          );
        }

        return [...prevCart, { product, quantity: 1 }];
      });

      addNotification({ message: '장바구니에 담았습니다', type: 'success' });
    },
    [cart, setCart],
  );

  // 장바구니에서 지우기
  const removeFromCart = useCallback(
    (productId: string) => {
      setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
    },
    [setCart],
  );

  // 수량 업데이트
  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      // 장바구니에서 해당 상품 정보를 가져옴
      const cartItem = cart.find((item) => item.product.id === productId);
      if (!cartItem) return;

      const maxStock = cartItem.product.stock;
      if (newQuantity > maxStock) {
        addNotification({
          message: `재고는 ${maxStock}개까지만 있습니다.`,
          type: 'error',
        });
        return;
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId ? { ...item, quantity: newQuantity } : item,
        ),
      );
    },
    [cart, setCart],
  );

  return {
    cart,
    setCart,
    totalCartItem,
    addToCart,
    removeFromCart,
    updateQuantity,
  };
};
