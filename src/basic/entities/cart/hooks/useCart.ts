import { useLocalStorageObject } from "@shared";
import { calculateItemTotal } from "@entities/cart/libs";
import { Cart } from "@entities/cart/types";

export function useCart() {
  const [cart, setCart] = useLocalStorageObject<Cart[]>("cart", []);

  const getItemTotal = (item: Cart) => calculateItemTotal(item, cart);

  const getTotalItemCount = () =>
    cart.reduce((sum, item) => sum + item.quantity, 0);

  const addItem = (item: Cart) => {
    const existingIndex = cart.findIndex((cartItem) => cartItem.id === item.id);

    if (existingIndex >= 0) {
      const newCart = [...cart];
      newCart[existingIndex] = {
        ...newCart[existingIndex],
        quantity: newCart[existingIndex].quantity + item.quantity,
      };
      setCart(newCart);
    } else {
      setCart([...cart, item]);
    }
  };

  const removeItem = (productId: string) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setCart(
      cart.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return {
    cart,
    getItemTotal,
    cartItemCount: getTotalItemCount(),
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
  };
}
