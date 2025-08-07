import { useCallback } from 'react';
import { ProductWithUI } from '../datas/products';
import { Coupon } from '../../types';
import { useNotifications } from '../store/hooks';

interface UseCartActionsProps {
  products: ProductWithUI[];
  addToCart: (product: ProductWithUI) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  getRemainingStock: (product: any) => number;
  totals: { totalAfterDiscount: number };
}

export const useCartActions = ({
  products,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  setSelectedCoupon,
  getRemainingStock,
  totals
}: UseCartActionsProps) => {
  const { addNotification } = useNotifications();
  const handleAddToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getRemainingStock(product);
      if (remainingStock <= 0) {
        addNotification({ message: '재고가 부족합니다!', type: 'error' });
        return;
      }

      addToCart(product);
      addNotification({ message: '장바구니에 담았습니다', type: 'success' });
    },
    [addToCart, getRemainingStock, addNotification]
  );

  // 장바구니 수량 업데이트
  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        addNotification({ message: `재고는 ${maxStock}개까지만 있습니다.`, type: 'error' });
        return;
      }

      // 장바구니 수량 업데이트
      updateCartQuantity(productId, newQuantity);
    },
    [products, removeFromCart, updateCartQuantity, addNotification]
  );

  // 쿠폰 적용
  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = totals.totalAfterDiscount;

      if (currentTotal < 10000 && coupon.discountType === 'percentage') {
        addNotification({ message: 'percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.', type: 'error' });
        return;
      }

      setSelectedCoupon(coupon);
      addNotification({ message: '쿠폰이 적용되었습니다.', type: 'success' });
    },
    [setSelectedCoupon, totals, addNotification]
  );

  // 주문 완료
  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification({ message: `주문이 완료되었습니다. 주문번호: ${orderNumber}`, type: 'success' });
    clearCart();
    setSelectedCoupon(null);
  }, [addNotification, clearCart, setSelectedCoupon]);

  return {
    handleAddToCart,
    updateQuantity,
    applyCoupon,
    completeOrder
  };
};
