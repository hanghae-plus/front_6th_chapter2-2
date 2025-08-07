import { useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import type { CartItem, Product } from '../../types';
import {
  addCartAtom,
  cartAtom,
  removeFromCartAtom,
  updateQuantityAtom,
} from '../atoms/cart';
import * as cartModel from '../models/cart';
import { useAtomWithLocalStorage } from '../utils/hooks/useLocalStorage';
import { useNotify } from './useNotification';

interface UseCartReturn {
  cart: CartItem[];
  totalItemCount: number;
  clearCart: () => void;
}

export function useCart(): UseCartReturn {
  const LOCAL_STORAGE_KEY = 'cart';
  const [cart, setCart] = useAtomWithLocalStorage<CartItem[]>({
    key: 'cart',
    initialValue: [],
    atom: cartAtom,
  });

  useEffect(() => {
    if (!cart.length) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, [cart]);

  return {
    cart,
    totalItemCount: cartModel.calculateTotalItemCount({ cart }),

    clearCart: useCallback(() => {
      setCart([]);
    }, [setCart]),
  };
}

export function useAddToCart() {
  const _addToCart = useSetAtom(addCartAtom);
  const notify = useNotify();

  const addToCart = useCallback(
    ({ product }: { product: Product }) => {
      const { message, success } = _addToCart({ product });

      notify({
        message,
        type: success ? 'success' : 'error',
      });
    },
    [_addToCart, notify]
  );

  return addToCart;
}

export function useRemoveFromCart() {
  return useSetAtom(removeFromCartAtom);
}

export function useUpdateQuantity() {
  const _updateQuantity = useSetAtom(updateQuantityAtom);
  const notify = useNotify();

  const updateQuantity = ({
    productId,
    newQuantity,
    products,
  }: {
    productId: string;
    newQuantity: number;
    products: Product[];
  }) => {
    const { message, success } = _updateQuantity({
      productId,
      newQuantity,
      products,
    });

    notify({
      message,
      type: success ? 'success' : 'error',
    });
  };

  return updateQuantity;
}
