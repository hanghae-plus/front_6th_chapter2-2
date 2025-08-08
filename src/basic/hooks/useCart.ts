import { useState, useCallback, useEffect } from "react";
import { CartItem, ProductWithUI, Coupon } from "../../types";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";

import {
  calculateCartTotal,
  calculateItemTotal,
  getRemainingStock,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart,
  validateCart,
  getOutOfStockItems,
} from "../models/cart";

import { CART_CONSTRAINTS } from "../constants/cart";
import { COUPON_CONSTRAINTS } from "../constants/coupon";

interface UseCartProps {
  products: ProductWithUI[];
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
}

export function useCart({ products, addNotification }: UseCartProps) {
  const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [totalItemCount, setTotalItemCount] = useState(0);

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const remaining = getRemainingStock(product, cart);
      if (remaining <= 0) {
        addNotification("재고가 부족합니다!", "error");
        return;
      }
      const existingItem = cart.find((item) => item.product.id === product.id);
      const currentQuantity = existingItem?.quantity || 0;
      const newQuantity = currentQuantity + 1;

      if (newQuantity > product.stock) {
        addNotification(`재고는 ${product.stock}개까지만 있습니다.`, "error");
        return;
      }

      const newCart = addItemToCart(cart, product);
      setCart(newCart);
      addNotification("장바구니에 담았습니다", "success");
    },
    [cart, addNotification]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      const newCart = removeItemFromCart(cart, productId);
      setCart(newCart);
    },
    [cart]
  );

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      const product = products.find((p) => p.id === productId);
      if (!product) {
        addNotification("상품을 찾을 수 없습니다.", "error");
        return;
      }

      if (newQuantity <= 0) {
        const newCart = removeItemFromCart(cart, productId);
        setCart(newCart);
        return;
      }

      if (newQuantity > product.stock) {
        addNotification(`재고는 ${product.stock}개까지만 있습니다.`, "error");
        return;
      }

      if (newQuantity > CART_CONSTRAINTS.MAX_QUANTITY) {
        addNotification(
          `수량은 ${CART_CONSTRAINTS.MAX_QUANTITY}개를 초과할 수 없습니다.`,
          "error"
        );
        return;
      }

      // ✅ 모든 검증 통과한 경우만 수량 변경
      const newCart = updateCartItemQuantity(cart, productId, newQuantity);
      setCart(newCart);
    },
    [cart, products, addNotification]
  );
  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateCartTotal(cart, null);
      if (
        currentTotal.totalAfterDiscount < COUPON_CONSTRAINTS.MAX_AMOUNT &&
        coupon.discountType === "percentage"
      ) {
        addNotification(
          `percentage 쿠폰은 ${COUPON_CONSTRAINTS.MAX_AMOUNT.toLocaleString()}원 이상 구매 시 사용 가능합니다.`,
          "error"
        );
        return;
      }

      setSelectedCoupon(coupon);
      addNotification("쿠폰이 적용되었습니다.", "success");
    },
    [cart, addNotification]
  );

  const completeOrder = useCallback(() => {
    // ✅ models 함수 사용: 장바구니 검증
    const validation = validateCart(cart);

    if (!validation.isValid) {
      validation.errors.forEach((error) => {
        addNotification(error, "error");
      });
      return;
    }

    // ✅ models 함수 사용: 재고 부족 아이템 체크
    const outOfStockItems = getOutOfStockItems(cart);
    if (outOfStockItems.length > 0) {
      outOfStockItems.forEach((item) => {
        addNotification(`${item.product.name}의 재고가 부족합니다.`, "error");
      });
      return;
    }

    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    setCart([]);
    setSelectedCoupon(null);
  }, [cart, addNotification]); // ✅ cart 의존성 추가

  const totals = calculateCartTotal(cart, selectedCoupon);

  return {
    // 상태
    cart,
    selectedCoupon,
    totalItemCount,
    totals,

    // 함수들
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    completeOrder,

    // 유틸리티 (models 함수 래핑)
    getRemainingStock: (product: ProductWithUI) =>
      getRemainingStock(product, cart),
    calculateItemTotal: (item: CartItem) => calculateItemTotal(item, cart),

    // 쿠폰 관리
    setSelectedCoupon,
  };
}
