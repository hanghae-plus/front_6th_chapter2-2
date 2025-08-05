import { useNotifications } from './useNotifications.ts';
import { useCallback, useEffect, useState } from 'react';
import { ProductWithUI } from '../App.tsx';
import { getRemainingStock } from '../utils/getRemainingStock.ts';
import { CartItem } from '../models/entities';
import { useProducts } from './useProducts.ts';

export const useCart = () => {
  const { addNotification } = useNotifications();
  const { products } = useProducts();
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [totalItemCount, setTotalItemCount] = useState(0);

  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const cartItem = cart.find(item => item.product.id === product.id);
      const remainingStock = getRemainingStock(product, cartItem as CartItem);
      if (remainingStock <= 0) {
        addNotification('재고가 부족합니다!', 'error');
        return;
      }

      setCart(prevCart => {
        const existingItem = prevCart.find(
          item => item.product.id === product.id
        );

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;

          if (newQuantity > product.stock) {
            addNotification(
              `재고는 ${product.stock}개까지만 있습니다.`,
              'error'
            );
            return prevCart;
          }

          return prevCart.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: newQuantity }
              : item
          );
        }

        return [...prevCart, { product, quantity: 1 }];
      });

      addNotification('장바구니에 담았습니다', 'success');
    },
    [cart, addNotification, getRemainingStock]
  );
  const removeFromCart = useCallback((productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      const product = products.find(p => p.id === productId);
      if (!product) return;

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        addNotification(`재고는 ${maxStock}개까지만 있습니다.`, 'error');
        return;
      }

      setCart(prevCart =>
        prevCart.map(item =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    },
    [products, removeFromCart, addNotification, getRemainingStock]
  );

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);
  return {
    updateQuantity,
    removeFromCart,
    addToCart,
    cart,
    setCart,
  };
};
