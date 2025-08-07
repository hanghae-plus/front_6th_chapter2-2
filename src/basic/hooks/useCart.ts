import { useCallback } from "react";
import { CartItem, Product } from "../../types";
import { useLocalStorage } from "./useLocalStorage";

export const useCart = () => {
  const [cart, setCart] = useLocalStorage<CartItem[]>({
    key: "cart",
    initialValue: [],
  });

  const addToCart = useCallback(
    (product: Product) => {
      setCart((prevCart) => {
        const existingItem = prevCart.find(
          (item) => item.product.id === product.id
        );
        if (existingItem) {
          return prevCart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prevCart, { product, quantity: 1 }];
      });
    },
    [setCart]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setCart((prevCart) =>
        prevCart.filter((item) => item.product.id !== productId)
      );
    },
    [setCart]
  );

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    },
    [setCart, removeFromCart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, [setCart]);

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart };
};
