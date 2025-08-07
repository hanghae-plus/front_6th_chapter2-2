import { useState, useCallback } from 'react';
import { CartItem, Coupon, Product } from '../../types';
import { ProductWithUI } from '../shared/types';
import { useLocalStorage } from '../shared/hooks';
import * as cartModel from '../models/cart';
import { ORDER } from '../constants/order';
import { MESSAGES } from '../constants/message';

/**
 * 장바구니 관리 Hook
 */
export function useCart() {
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  /**
   * 상품을 장바구니에 추가
   * @param product - 추가할 상품
   * @param onSuccess - 성공 콜백
   * @param onError - 에러 콜백
   */
  const addToCart = useCallback(
    (product: ProductWithUI, onSuccess?: (message: string) => void, onError?: (message: string) => void) => {
      const remainingStock = cartModel.getRemainingStock(product, cart);

      if (remainingStock <= 0) {
        onError?.(MESSAGES.PRODUCT.OUT_OF_STOCK);
        return;
      }

      const existingItem = cart.find((item) => item.product.id === product.id);
      if (existingItem && existingItem.quantity + 1 > product.stock) {
        onError?.(MESSAGES.PRODUCT.MAX_STOCK(product.stock));
        return;
      }

      const updatedCart = cartModel.addItemToCart(cart, product);
      setCart(updatedCart);
      onSuccess?.(MESSAGES.PRODUCT.ADDED_TO_CART);
    },
    [cart, setCart],
  );

  /**
   * 장바구니에서 상품 제거
   * @param productId - 제거할 상품 ID
   */
  const removeFromCart = useCallback(
    (productId: string) => {
      const updatedCart = cartModel.removeItemFromCart(cart, productId);
      setCart(updatedCart);
    },
    [cart, setCart],
  );

  /**
   * 장바구니 상품 수량 변경
   * @param productId - 상품 ID
   * @param newQuantity - 새로운 수량
   * @param products - 상품 목록 (재고 확인용)
   * @param onError - 에러 콜백
   */
  const updateQuantity = useCallback(
    (productId: string, newQuantity: number, products: ProductWithUI[], onError?: (message: string) => void) => {
      const product = products.find((p) => p.id === productId);
      if (!product) {
        onError?.('상품을 찾을 수 없습니다.');
        return;
      }

      const result = cartModel.processQuantityUpdate(cart, productId, newQuantity, product.stock);

      if (result.success) {
        setCart(result.updatedCart);
      } else {
        onError?.(result.error);
      }
    },
    [cart, setCart],
  );

  /**
   * 쿠폰 적용
   * @param coupon - 적용할 쿠폰
   * @param onSuccess - 성공 콜백
   * @param onError - 에러 콜백
   */
  const applyCoupon = useCallback(
    (coupon: Coupon, onSuccess?: (message: string) => void, onError?: (message: string) => void) => {
      const currentTotal = cartModel.calculateCartTotal(cart, selectedCoupon).totalAfterDiscount;

      if (currentTotal < ORDER.MIN_FOR_COUPON && coupon.discountType === 'percentage') {
        onError?.(MESSAGES.COUPON.MIN_PRICE);
        return;
      }

      setSelectedCoupon(coupon);
      onSuccess?.(MESSAGES.COUPON.APPLIED);
    },
    [cart, selectedCoupon],
  );

  /**
   * 총액 계산
   * @returns 할인 전/후 총액
   */
  const calculateTotal = useCallback(() => {
    return cartModel.calculateCartTotal(cart, selectedCoupon);
  }, [cart, selectedCoupon]);

  /**
   * 남은 재고 조회
   * @param product - 상품
   * @returns 남은 재고
   */
  const getRemainingStock = useCallback(
    (product: Product) => {
      return cartModel.getRemainingStock(product, cart);
    },
    [cart],
  );

  /**
   * 장바구니 비우기
   */
  const clearCart = useCallback(() => {
    setCart([]);
    setSelectedCoupon(null);
  }, [setCart]);

  const selectCoupon = (coupon: Coupon | null) => {
    setSelectedCoupon(coupon);
  };

  return {
    cart,
    selectedCoupon,
    selectCoupon,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    getRemainingStock,
    clearCart,
  };
}
