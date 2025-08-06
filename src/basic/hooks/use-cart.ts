import { CartItem, Coupon, Product } from '@/types';
import { useLocalStorage } from './use-local-storage';
import { useCallback, useState } from 'react';
import { ProductWithUI } from '../constants/mocks';
import { getRemainingStock, validateCouponApplication } from '../utils';

interface UseCartProps {
  products: ProductWithUI[];
  addNotification: (message: string, type: 'error' | 'success' | 'warning') => void;
  setSelectedCoupon: (coupon: Coupon | null) => void;
}

export function useCart({ products, addNotification, setSelectedCoupon }: UseCartProps) {
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  const [totalItemCount, setTotalItemCount] = useState(0);

  const getStock = useCallback(
    (product: Product): number => {
      return getRemainingStock(product, cart);
    },
    [cart]
  );

  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getStock(product);
      if (remainingStock <= 0) {
        addNotification('재고가 부족합니다!', 'error');
        return;
      }

      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.product.id === product.id);

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;

          if (newQuantity > product.stock) {
            addNotification(`재고는 ${product.stock}개까지만 있습니다.`, 'error');
            return prevCart;
          }

          return prevCart.map((item) =>
            item.product.id === product.id ? { ...item, quantity: newQuantity } : item
          );
        }

        return [...prevCart, { product, quantity: 1 }];
      });

      addNotification('장바구니에 담았습니다', 'success');
    },
    [getStock, addNotification]
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        addNotification(`재고는 ${maxStock}개까지만 있습니다.`, 'error');
        return;
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    },
    [products, removeFromCart, addNotification]
  );

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
    setCart([]);
    setSelectedCoupon(null);
  }, [addNotification]);

  return { cart, addToCart, removeFromCart, updateQuantity, completeOrder, getStock };
}
