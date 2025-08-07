import { useAtom } from 'jotai';
import { useCallback } from 'react';
import {
  cartAtom,
  totalItemCountAtom,
  cartTotalsAtom,
} from '../atoms/cartAtoms';
import { productsAtom } from '../atoms/productAtoms';
import { generateOrderNumber } from '../utils/generators';
import { cartService } from '../services/cartService';
import { validateCartOperation } from '../utils/validators';
import { useNotifications } from './useNotifications';
import { ProductWithUI } from '../types';

/**
 * 장바구니 상태를 관리하는 커스텀 Hook (완전 Jotai 기반)
 *
 * 기능:
 * - 장바구니 상품 관리 (추가, 제거, 수량 변경)
 * - 총 개수 및 금액 계산
 * - 쿠폰 적용된 할인 금액 계산
 * - 주문 완료 처리
 *
 * @returns 장바구니 관련 상태와 함수들
 */
export const useCart = () => {
  const [cart, setCart] = useAtom(cartAtom);
  const [totalItemCount] = useAtom(totalItemCountAtom);
  const [totals] = useAtom(cartTotalsAtom);
  const [products] = useAtom(productsAtom);
  const { addNotification } = useNotifications();

  const onAddToCart = useCallback(
    (product: ProductWithUI) => {
      // 검증
      const stockValidation = validateCartOperation.validateStockAvailability(
        product,
        cart
      );
      if (!stockValidation.isValid) {
        addNotification(stockValidation.message, 'error');
        return;
      }

      const existingItem = cart.find(item => item.product.id === product.id);
      if (existingItem) {
        const quantityValidation =
          validateCartOperation.validateQuantityIncrease(
            product,
            existingItem.quantity
          );
        if (!quantityValidation.isValid) {
          addNotification(quantityValidation.message, 'error');
          return;
        }
      }

      // 비즈니스 로직
      const newCart = cartService.addItemToCart(product, cart);
      setCart(newCart);
      addNotification('장바구니에 담았습니다', 'success');
    },
    [cart, setCart, addNotification]
  );

  const onRemoveFromCart = useCallback(
    (productId: string) => {
      const newCart = cartService.removeItemFromCart(productId, cart);
      setCart(newCart);
    },
    [cart, setCart]
  );

  const onUpdateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      const validation = validateCartOperation.validateQuantityChange(
        product,
        newQuantity
      );

      if (!validation.isValid) {
        if (validation.action === 'remove') {
          onRemoveFromCart(productId);
          return;
        }
        addNotification(validation.message, 'error');
        return;
      }

      const newCart = cartService.updateItemQuantity(
        productId,
        newQuantity,
        cart
      );
      setCart(newCart);
    },
    [products, cart, setCart, onRemoveFromCart, addNotification]
  );

  const onCompleteOrder = useCallback(() => {
    const orderNumber = generateOrderNumber();
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      'success'
    );
    setCart([]);
  }, [setCart, addNotification]);

  return {
    cart,
    totalItemCount,
    totals,
    onAddToCart,
    onRemoveFromCart,
    onUpdateQuantity,
    onCompleteOrder,
  };
};
