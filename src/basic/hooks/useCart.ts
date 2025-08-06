import { useState, useCallback } from 'react';
import { CartItem, Coupon, Product } from '../../types';
import { Products } from '../constants/products';
import { cartModel } from '../models/cart';
import { useProducts } from './useProducts';
import { useLocalStorage } from '../utils/hooks/useLocalStorage';

// TODO: 장바구니 관리 Hook
// 힌트:
// 1. 장바구니 상태 관리 (localStorage 연동)
// 2. 상품 추가/삭제/수량 변경
// 3. 쿠폰 적용
// 4. 총액 계산
// 5. 재고 확인
//
// 반환할 값:
// - cart: 장바구니 아이템 배열
// - selectedCoupon: 선택된 쿠폰
// - addToCart: 상품 추가 함수
// - removeFromCart: 상품 제거 함수
// - updateQuantity: 수량 변경 함수
// - applyCoupon: 쿠폰 적용 함수
// - calculateTotal: 총액 계산 함수
// - getRemainingStock: 재고 확인 함수
// - clearCart: 장바구니 비우기 함수

export function useCart(addNotification: any) {
  // 장바구니 상태 관리
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);

  // 선택된 쿠폰 상태 관리
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // 상품 목록 관리
  const { products } = useProducts();

  // 재고 확인
  const getRemainingStock = (product: Product): number => {
    return cartModel.getRemainingStock(product, cart);
  };

  // 총액 계산
  const calculateCartTotal = () => {
    return cartModel.calculateCartTotal(cart, selectedCoupon as Coupon);
  };

  // 상품 추가
  const addToCart = useCallback(
    (product: (typeof Products)[number]) => {
      const remainingStock = getRemainingStock(product);
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

          return cartModel.updateCartItemQuantity(prevCart, product.id, newQuantity);
        }

        return cartModel.addItemToCart(prevCart, product);
      });

      addNotification('장바구니에 담았습니다', 'success');
    },
    [addNotification, getRemainingStock],
  );

  // 상품 제거
  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => cartModel.removeItemFromCart(prevCart, productId));
  }, []);

  // 수량 변경
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

      setCart((prevCart) => cartModel.updateCartItemQuantity(prevCart, productId, newQuantity));
    },
    [products, removeFromCart, addNotification, getRemainingStock],
  );

  // 쿠폰 적용
  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateCartTotal().totalAfterDiscount;

      if (currentTotal < 10000 && coupon.discountType === 'percentage') {
        addNotification('percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.', 'error');
        return;
      }

      setSelectedCoupon(coupon);
      addNotification('쿠폰이 적용되었습니다.', 'success');
    },
    [addNotification, calculateCartTotal],
  );

  // 장바구니 비우기
  const clearCart = useCallback(() => {
    setCart([]);
    setSelectedCoupon(null);
  }, []);

  return {
    cart,
    selectedCoupon,
    setSelectedCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateCartTotal,
    getRemainingStock,
    clearCart,
  };
}
