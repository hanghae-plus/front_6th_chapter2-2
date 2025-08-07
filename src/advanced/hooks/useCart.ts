import { useState, useCallback, useEffect } from 'react';

import { CartItem, Product } from '../../types';
import * as cartModel from '../models/cart';

interface UseCartProps {
  products: Product[];
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void;
}

export function useCart({ products, addNotification }: UseCartProps) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const getRemainingStock = useCallback(
    (product: Product): number => {
      return cartModel.getRemainingStock(product, cart);
    },
    [cart],
  );

  const addToCart = useCallback(
    (product: Product) => {
      const remainingStock = getRemainingStock(product);
      if (remainingStock <= 0) {
        addNotification('재고가 부족합니다!', 'error');
        return;
      }

      const newCart = cartModel.addItemToCart(cart, product);
      setCart(newCart);
      addNotification('장바구니에 담았습니다', 'success');
    },
    [cart, addNotification, getRemainingStock],
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      const newCart = cartModel.removeItemFromCart(cart, productId);
      setCart(newCart);
    },
    [cart],
  );

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      if (newQuantity > product.stock) {
        addNotification(`재고는 ${product.stock}개까지만 있습니다.`, 'error');
        return;
      }

      const newCart = cartModel.updateCartItemQuantity(cart, productId, newQuantity);
      setCart(newCart);
    },
    [cart, products, addNotification],
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getRemainingStock,
    clearCart,
  };
}
