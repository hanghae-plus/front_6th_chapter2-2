import { CartItem } from "../../../../types";
import { useLocalStorageObject } from "../../../shared/hooks/useLocalStorage";

export function useCartStorage() {
  const [cart, setCart] = useLocalStorageObject<CartItem[]>("cart", []);

  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cart,
    setCart,
    totalItemCount,
  };
}
