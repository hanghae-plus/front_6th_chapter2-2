import { useCallback } from 'react';
import { CartItem } from '../../types';
import { ProductWithUI } from '../datas/products';
import { useSyncedLocalStorage } from '../utils/hooks/useSyncedLocalStorage';

export const useCarts = () => {
  const [cart, setCart] = useSyncedLocalStorage<CartItem[]>('cart', []);

  // 장바구니에 추가
  const addToCart = useCallback(
    (product: ProductWithUI) => {
      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.product.id === product.id);

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;
          return prevCart.map(item => (item.product.id === product.id ? { ...item, quantity: newQuantity } : item));
        }

        return [...prevCart, { product, quantity: 1 }];
      });
    },
    [setCart]
  );

  // 장바구니에서 삭제
  const removeFromCart = useCallback(
    (productId: string) => {
      setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    },
    [setCart]
  );

  // 장바구니 수량 업데이트
  const updateCartQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      setCart(prevCart =>
        prevCart.map(item => (item.product.id === productId ? { ...item, quantity: newQuantity } : item))
      );
    },
    [setCart]
  );

  // 장바구니 비우기
  const clearCart = useCallback(() => {
    setCart([]);
  }, [setCart]);

  // 장바구니 총 아이템 수 계산
  const getTotalCartItemCount = () => cart.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getTotalCartItemCount
  };
};
