import { useCallback } from 'react';
import { CartItem, Coupon, Product } from '../../types';
import {
  calculateCartTotal,
  calculateItemTotal,
  updateCartItemQuantity,
} from '../utils/cart';
import { cartAtom } from '../atoms';
import { useAtom } from 'jotai';

interface UseCartOptions {
  /** localStorage key, default: 'cart' */
  storageKey?: string;
}

export interface UseCartReturn {
  cart: CartItem[];
  addToCart: (product: Product) => { success: boolean; message?: string };
  removeFromCart: (productId: string) => void;
  updateQuantity: (
    productId: string,
    newQuantity: number
  ) => { success: boolean; message?: string };
  clearCart: () => void;
  getRemainingStock: (product: Product) => number;
  calculateTotal: (selectedCoupon?: Coupon | null) => {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
  calculateItemTotal: (item: CartItem) => number;
}

export const useCart = (options?: UseCartOptions): UseCartReturn => {
  const storageKey = options?.storageKey ?? 'cart';

  const [cart, setCart] = useAtom(cartAtom);

  /* ----------------------------- Helpers ----------------------------- */
  const persist = (next: CartItem[]) => {
    setCart(next);
    if (next.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } else {
      localStorage.removeItem(storageKey);
    }
  };

  /* ----------------------------- Actions ----------------------------- */
  const addToCart = useCallback(
    (product: Product) => {
      const existed = cart.find((c) => c.product.id === product.id);
      const newQuantity = existed ? existed.quantity + 1 : 1;
      const { cart: nextCart, error } = updateCartItemQuantity(
        cart,
        product,
        newQuantity
      );

      if (!error) {
        persist(nextCart);
        return { success: true } as const;
      }
      return { success: false, message: error } as const;
    },
    [cart]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      const next = cart.filter((c) => c.product.id !== productId);
      persist(next);
    },
    [cart]
  );

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      const product = cart.find((c) => c.product.id === productId)?.product;
      if (!product) return { success: false, message: '상품을 찾을 수 없습니다.' } as const;

      const { cart: nextCart, error } = updateCartItemQuantity(
        cart,
        product,
        newQuantity
      );

      if (!error) {
        persist(nextCart);
        return { success: true } as const;
      }
      return { success: false, message: error } as const;
    },
    [cart]
  );

  const clearCart = useCallback(() => {
    persist([]);
  }, []);

  /* ----------------------------- Computed ----------------------------- */
  const getRemainingStock = useCallback(
    (product: Product) => {
      const cartItem = cart.find((c) => c.product.id === product.id);
      return product.stock - (cartItem?.quantity ?? 0);
    },
    [cart]
  );

  const calculateTotal = useCallback(
    (selectedCoupon?: Coupon | null) => {
      return calculateCartTotal(cart, selectedCoupon);
    },
    [cart]
  );

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getRemainingStock,
    calculateTotal,
    calculateItemTotal: (item: CartItem) => calculateItemTotal(item, cart),
  };
};
