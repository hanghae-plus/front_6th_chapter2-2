import { useCallback } from 'react';

import type { CartItem } from '../../types';
import type { ProductWithUI } from '../constants';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';

export function useCartStore() {
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);

  const addToCart = useCallback((product: ProductWithUI) => {
    setCart((prevCart) => [...prevCart, { product, quantity: 1 }]);
  }, []);

  const updateToCart = useCallback((product: ProductWithUI, newQuantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === product.id ? { ...item, quantity: newQuantity } : item
      )
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  }, []);

  const resetCart = useCallback(() => {
    setCart([]);
  }, []);

  return {
    cart,
    addToCart,
    updateToCart,
    removeFromCart,
    resetCart,
  };
}
