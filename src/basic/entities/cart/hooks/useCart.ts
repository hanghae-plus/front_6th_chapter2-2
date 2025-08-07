import { useLocalStorageObject } from "../../../shared/hooks/useLocalStorage";
import { calculateItemTotal } from "../libs/cartCalculations";
import { type CartItem } from "../../../../types";

export function useCart() {
  const [cart, setCart] = useLocalStorageObject<CartItem[]>("cart", []);

  const getItemTotal = (item: CartItem) => calculateItemTotal(item, cart);

  const getTotalItemCount = () =>
    cart.reduce((sum, item) => sum + item.quantity, 0);

  const addItem = (item: CartItem) => {
    const existingIndex = cart.findIndex(
      (cartItem) => cartItem.product.id === item.product.id
    );

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
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const updateItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setCart(
      cart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return {
    cart,
    getItemTotal,
    getTotalItemCount,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
  };
}
