import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import { CartItem } from '../../types.ts';

export function useCart() {
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", [], {
    removeWhenEmpty: true,
  });

  return { cart, setCart };
}
