import { CartItem } from '@/models/cart';
import { useLocalStorage } from '@/shared/hooks';
import { createStorage } from '@/utils';

const cartStorage = createStorage<CartItem[]>({ key: 'cart' });

export const useCartStore = () => {
  const cart = useLocalStorage(cartStorage) ?? [];
  const totalItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const addCartItems = (cartItems: CartItem[]) => {
    cartStorage.set([...(cartStorage.get() ?? []), ...cartItems]);
  };

  const removeCartItemByProductId = (productId: string) => {
    cartStorage.set(
      cartStorage.get()?.filter(item => item.product.id !== productId) ?? []
    );
  };

  const setCart = (cart: CartItem[] | ((prev: CartItem[]) => CartItem[])) => {
    if (typeof cart === 'function') {
      cartStorage.set(cart(cartStorage.get() ?? []));
    } else {
      cartStorage.set(cart);
    }
  };

  const clearCart = () => {
    cartStorage.set([]);
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
    totalItemCount,
  };
};
