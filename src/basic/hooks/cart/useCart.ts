import { useCallback, useEffect, useState } from 'react';
import { CartItem, ProductWithUI } from '../../../types';
import { getRemainingStock } from '../../utils/calculations/stockCalculations';

export const useCart = (
  products: ProductWithUI[],
  onSuccess: (message: string) => void,
  onError: (message: string) => void,
) => {
  // 장바구니
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        const parsedCart = JSON.parse(saved);
        if (Array.isArray(parsedCart)) {
          return parsedCart.filter(
            (item) =>
              item &&
              item.product &&
              typeof item.product.id === 'string' &&
              typeof item.product.price === 'number' &&
              typeof item.quantity === 'number',
          );
        }
        return [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // 장바구니 총 아이템 개수
  const [totalCartItem, setTotalCartItem] = useState(0);

  // 장바구니 총 아이템 개수 계산
  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalCartItem(count);
  }, [cart]);

  // 장바구니 관련 로컬스토리지 확인
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cart]);

  // 장바구니에 추가
  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getRemainingStock(product, cart);
      if (remainingStock <= 0) {
        onError?.('재고가 부족합니다!');
        return;
      }

      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.product.id === product.id);

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;

          if (newQuantity > product.stock) {
            onError(`재고는 ${product.stock}개까지만 있습니다.`);
            return prevCart;
          }

          return prevCart.map((item) =>
            item.product.id === product.id ? { ...item, quantity: newQuantity } : item,
          );
        }

        return [...prevCart, { product, quantity: 1 }];
      });

      onSuccess?.('장바구니에 담았습니다');
    },
    [cart, onSuccess, onError, getRemainingStock],
  );

  // 장바구니에서 지우기
  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  }, []);

  // 수량 업데이트
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
        onError(`재고는 ${maxStock}개까지만 있습니다.`);
        return;
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId ? { ...item, quantity: newQuantity } : item,
        ),
      );
    },
    [products, removeFromCart, onError, getRemainingStock],
  );

  return {
    cart,
    setCart,
    totalCartItem,
    setTotalCartItem,
    addToCart,
    removeFromCart,
    updateQuantity,
  };
};
