import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import type { CartItem, Product } from '../../types';
import {
  addCartAtom,
  cartAtom,
  clearCartAtom,
  removeFromCartAtom,
  totalItemCountAtom,
  updateQuantityAtom,
} from '../atoms/cart';
import { useAtomWithLocalStorage } from '../utils/hooks/useLocalStorage';
import { useNotify } from './useNotification';

export function useCart(): CartItem[] {
  const LOCAL_STORAGE_KEY = 'cart';
  const [cart] = useAtomWithLocalStorage<CartItem[]>({
    key: 'cart',
    initialValue: [],
    atom: cartAtom,
  });

  useEffect(() => {
    if (!cart.length) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, [cart]);

  return cart;
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

export function useClearCart() {
  return useSetAtom(clearCartAtom);
}

export function useTotalItemCount() {
  return useAtomValue(totalItemCountAtom);
}
