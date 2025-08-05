import { CartItem } from '@/models/cart';
import { useLocalStorageObject } from '@/shared/hooks';
import { ensureArray } from '@/utils/store-utils';
import { useMemo } from 'react';

export const useCartStore = () => {
  const [cart, setCart] = useLocalStorageObject<CartItem[]>('cart', []);

  const totalItemCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const addCartItems = (cartItems: CartItem[]) => {
    setCart(prev => [...ensureArray(prev), ...cartItems]);
  };

  const removeCartItemByProductId = (productId: string) => {
    setCart(prev =>
      ensureArray(prev).filter(item => item.product.id !== productId)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const findCartItemByProductId = (productId: string) => {
    return cart.find(item => item.product.id === productId);
  };

  return {
    cart,
    setCart,

    // Actions
    clearCart,
    addCartItems,
    removeCartItemByProductId,
    findCartItemByProductId,

    // Computed properties
    totalItemCount
  };
};
