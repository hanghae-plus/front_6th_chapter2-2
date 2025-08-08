import { useEffect } from "react";
import { CartItem } from "../../../types";
import { useLocalStorage } from "../../_shared/utility-hooks/use-local-storage";
import { ProductWithUI } from "../product/types";

export const useCart = () => {
  const [cart, setCart, removeCart] = useLocalStorage<CartItem[]>("cart", []);

  const addToCart = (product: ProductWithUI, quantity: number) => {
    const existingItem = cart.find((item) => item.product.id === product.id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([...cart, { product, quantity }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart(
      cart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const resetCart = () => {
    setCart([]);
  };

  const getCartProductQuantity = (productId: string) => {
    return cart.find((item) => item.product.id === productId)?.quantity || 0;
  };

  useEffect(() => {
    if (cart.length === 0) {
      removeCart();
    }
  }, [cart, removeCart]);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    resetCart,
    getCartProductQuantity,
  };
};
