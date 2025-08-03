import { useState, useEffect, useMemo, useCallback } from "react";
import { CartItem, Coupon, Product } from "../types";
import * as cartModel from "../models/cart";

// 최종: 모든 장바구니 비즈니스 로직을 포함한 완전한 훅
export function useCart(
  addNotification?: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void
) {
  // 장바구니 상태 (localStorage에서 복원)
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // 선택된 쿠폰 상태
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // localStorage 동기화
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // 2단계: 계산 함수들 (models 활용, useMemo로 최적화)
  const totals = useMemo(() => {
    return cartModel.calculateCartTotal(cart, selectedCoupon);
  }, [cart, selectedCoupon]);

  const getRemainingStock = useMemo(() => {
    return (product: Product) => cartModel.getRemainingStock(product, cart);
  }, [cart]);

  const calculateItemTotal = useMemo(() => {
    return (item: CartItem) => cartModel.calculateItemTotal(item, cart);
  }, [cart]);

  // 최종: 모든 비즈니스 로직을 포함한 완전한 함수들
  const addToCart = useCallback(
    (product: Product) => {
      // 1. 재고 확인
      const remainingStock = cartModel.getRemainingStock(product, cart);
      if (remainingStock <= 0) {
        addNotification?.("재고가 부족합니다!", "error");
        return;
      }

      // 2. 수량 초과 확인
      const existingItem = cart.find((item) => item.product.id === product.id);
      const newQuantity = (existingItem?.quantity || 0) + 1;

      if (newQuantity > product.stock) {
        addNotification?.(`재고는 ${product.stock}개까지만 있습니다.`, "error");
        return;
      }

      // 3. 상태 변경
      setCart((prevCart) => cartModel.addItemToCart(prevCart, product));

      // 4. 성공 알림
      addNotification?.("장바구니에 담았습니다", "success");
    },
    [cart, addNotification]
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => cartModel.removeItemFromCart(prevCart, productId));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number, products?: Product[]) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      const product = products?.find((p) => p.id === productId);
      if (!product) return;

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        addNotification?.(`재고는 ${maxStock}개까지만 있습니다.`, "error");
        return;
      }

      setCart((prevCart) =>
        cartModel.updateCartItemQuantity(prevCart, productId, newQuantity)
      );
    },
    [removeFromCart, addNotification]
  );

  const applyCoupon = useCallback(
    (coupon: Coupon | null) => {
      if (!coupon) {
        setSelectedCoupon(null);
        return;
      }

      const currentTotal = cartModel.calculateCartTotal(
        cart,
        selectedCoupon
      ).totalAfterDiscount;
      const MIN_ORDER_AMOUNT_FOR_PERCENTAGE_COUPON = 10000;

      if (
        currentTotal < MIN_ORDER_AMOUNT_FOR_PERCENTAGE_COUPON &&
        coupon.discountType === "percentage"
      ) {
        addNotification?.(
          `percentage 쿠폰은 ${MIN_ORDER_AMOUNT_FOR_PERCENTAGE_COUPON.toLocaleString()}원 이상 구매 시 사용 가능합니다.`,
          "error"
        );
        return;
      }

      setSelectedCoupon(coupon);
      addNotification?.("쿠폰이 적용되었습니다.", "success");
    },
    [cart, selectedCoupon, addNotification]
  );

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification?.(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    setCart([]);
    setSelectedCoupon(null);
  }, [addNotification]);

  return {
    // 상태
    cart,
    selectedCoupon,

    // 계산된 값들
    totals,
    getRemainingStock,
    calculateItemTotal,

    // 완전한 비즈니스 로직을 포함한 함수들
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    completeOrder,
  };
}
