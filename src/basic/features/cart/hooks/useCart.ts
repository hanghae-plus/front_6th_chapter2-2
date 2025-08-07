import { useCallback } from 'react';
import { CartItem } from '../../../../types';
import { ProductWithUI } from '../../../entities/product';
import { getRemainingStock } from '../../../shared/utils';

interface UseCartProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  products: ProductWithUI[];
  addNotification: (
    message: string,
    type?: 'error' | 'success' | 'warning'
  ) => void;
}

export function useCart({
  cart,
  setCart,
  products,
  addNotification,
}: UseCartProps) {
  // 특정 상품의 장바구니 수량 찾기
  const getCartQuantity = useCallback(
    (productId: string): number => {
      const cartItem = cart.find((item) => item.product.id === productId);
      return cartItem?.quantity || 0;
    },
    [cart]
  );

  // 장바구니에 상품 추가
  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const cartQuantity = getCartQuantity(product.id);
      const remainingStock = getRemainingStock({ 
        stock: product.stock, 
        cartQuantity 
      });
      
      if (remainingStock <= 0) {
        addNotification('재고가 부족합니다!', 'error');
        return;
      }

      setCart((prevCart) => {
        const existingItem = prevCart.find(
          (item) => item.product.id === product.id
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

          return prevCart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: newQuantity }
              : item
          );
        }

        return [...prevCart, { product, quantity: 1 }];
      });

      addNotification('장바구니에 담았습니다', 'success');
    },
    [addNotification, getCartQuantity, setCart]
  );

  // 장바구니에서 상품 제거
  const removeFromCart = useCallback(
    (productId: string) => {
      setCart((prevCart) =>
        prevCart.filter((item) => item.product.id !== productId)
      );
    },
    [setCart]
  );

  // 장바구니 상품 수량 업데이트
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
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    },
    [products, removeFromCart, addNotification, setCart]
  );

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartQuantity,
  };
}