import { useCallback } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { cartAtom, cartItemCountAtom, cartTotalPriceAtom } from '../../../atoms';
import { ProductWithUI } from '../../product';
import { getRemainingStock } from '@/utils';
import { useNotification } from '../../../hooks/useNotification';

export const useCart = () => {
  const [cart, setCart] = useAtom(cartAtom);
  const totalItemCount = useAtomValue(cartItemCountAtom);
  const totalPrice = useAtomValue(cartTotalPriceAtom);
  const { addNotification } = useNotification();

  // 장바구니에 상품 추가
  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getRemainingStock(product, cart);
      if (remainingStock <= 0) {
        addNotification('재고가 부족합니다!', 'error');
        return;
      }

      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.product.id === product.id);

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;

          // 재고 초과 체크
          if (newQuantity > product.stock) {
            addNotification(`재고는 ${product.stock}개까지만 있습니다.`, 'error');
            return prevCart;
          }

          return prevCart.map((item) =>
            item.product.id === product.id ? { ...item, quantity: newQuantity } : item
          );
        }

        return [...prevCart, { product, quantity: 1 }];
      });

      addNotification('장바구니에 담았습니다', 'success');
    },
    [cart, addNotification, setCart]
  );

  // 장바구니에서 상품 제거
  const removeFromCart = useCallback(
    (productId: string) => {
      setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
    },
    [setCart]
  );

  // 장바구니 상품 수량 업데이트
  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      setCart((prevCart) => {
        const item = prevCart.find((item) => item.product.id === productId);
        if (!item) return prevCart;

        const maxStock = item.product.stock;
        if (newQuantity > maxStock) {
          addNotification(`재고는 ${maxStock}개까지만 있습니다.`, 'error');
          return prevCart;
        }

        return prevCart.map((item) =>
          item.product.id === productId ? { ...item, quantity: newQuantity } : item
        );
      });
    },
    [removeFromCart, addNotification, setCart]
  );

  return {
    cart,
    setCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    totalItemCount,
    totalPrice,
  };
};
