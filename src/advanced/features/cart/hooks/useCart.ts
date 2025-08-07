import { useCallback } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { ProductWithUI } from '../../../entities/product';
import { getRemainingStock, useNotification } from '../../../shared/utils';
import { cartAtom, productsAtom } from '../../../shared/store';

export function useCart() {
  const { addNotification } = useNotification();
  const [cart, setCart] = useAtom(cartAtom);
  const products = useAtomValue(productsAtom);

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
        cartQuantity,
      });

      if (remainingStock <= 0) {
        addNotification('재고가 부족합니다!', 'error');
        return;
      }

      const existingItem = cart.find((item) => item.product.id === product.id);

      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;

        if (newQuantity > product.stock) {
          addNotification(`재고는 ${product.stock}개까지만 있습니다.`, 'error');
          return;
        }

        const newCart = cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
        setCart(newCart);
      } else {
        setCart([...cart, { product, quantity: 1 }]);
      }

      addNotification('장바구니에 담았습니다', 'success');
    },
    [addNotification, cart, setCart, getCartQuantity]
  );

  // 장바구니에서 상품 제거
  const removeFromCart = useCallback(
    (productId: string) => {
      const newCart = cart.filter((item) => item.product.id !== productId);
      setCart(newCart);
    },
    [cart, setCart]
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

      const newCart = cart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
      setCart(newCart);
    },
    [products, cart, removeFromCart, addNotification, setCart]
  );

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartQuantity,
  };
}
