import { CartItem } from '@/models/cart';
import { useLocalStorageObject } from '@/shared/hooks';

export const useCartStore = () => {
  const [cart, setCart] = useLocalStorageObject<CartItem[]>('cart', []);
  const totalItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const addCartItems = (cartItems: CartItem[]) => {
    setCart(prev => [...(prev ?? []), ...cartItems]);
  };

  const removeCartItemByProductId = (productId: string) => {
    setCart(prev => prev?.filter(item => item.product.id !== productId) ?? []);
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
