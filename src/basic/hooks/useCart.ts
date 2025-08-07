import { useState, useCallback, useEffect } from 'react';
import { CartItem, Coupon, ProductWithUI } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { generateOrderNumber } from '../utils/generators';
import { cartService } from '../services/cartService';
import { validateCartOperation } from '../utils/validators';
import { calculateCartTotal } from '../utils/calculators';

/**
 * 장바구니 상태 관리 Hook의 Props 인터페이스
 */
interface UseCartProps {
  products: ProductWithUI[];
  selectedCoupon: Coupon | null;
  addNotification: (
    message: string,
    type: 'error' | 'success' | 'warning'
  ) => void;
}

/**
 * 장바구니 상태를 관리하는 커스텀 Hook
 *
 * 기능:
 * - 장바구니 상품 관리 (추가, 제거, 수량 변경)
 * - 총 개수 및 금액 계산
 * - 쿠폰 적용된 할인 금액 계산
 * - 주문 완료 처리
 *
 * @param products - 상품 목록
 * @param selectedCoupon - 선택된 쿠폰
 * @param addNotification - 알림 추가 함수
 * @returns 장바구니 관련 상태와 함수들
 */
export const useCart = ({
  products,
  selectedCoupon,
  addNotification,
}: UseCartProps) => {
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  const [totalItemCount, setTotalItemCount] = useState(0);
  const [totals, setTotals] = useState<{
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  }>({
    totalBeforeDiscount: 0,
    totalAfterDiscount: 0,
  });

  useEffect(() => {
    const calculatedTotals = calculateCartTotal(cart, selectedCoupon);
    setTotals(calculatedTotals);
  }, [cart, selectedCoupon]);

  useEffect(() => {
    const count = cartService.calculateTotalItemCount(cart);
    setTotalItemCount(count);
  }, [cart]);

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
    [cart, addNotification]
  );

  const onRemoveFromCart = useCallback(
    (productId: string) => {
      const newCart = cartService.removeItemFromCart(productId, cart);
      setCart(newCart);
    },
    [cart]
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
    [products, cart, onRemoveFromCart, addNotification]
  );

  const onCompleteOrder = useCallback(() => {
    const orderNumber = generateOrderNumber();
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      'success'
    );
    setCart([]);
  }, [addNotification]);

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
