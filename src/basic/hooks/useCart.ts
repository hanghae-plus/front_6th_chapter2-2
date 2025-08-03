import { useState, useEffect, useMemo, useCallback } from "react";
import { CartItem, Product } from "../types";
import * as cartModel from "../models/cart";
import * as discountModel from "../models/discount";
import * as productModel from "../models/product";

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


  // localStorage 동기화
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // 계산 함수들 (models 활용, useMemo로 최적화)
  const getTotals = useMemo(() => {
    return (selectedCoupon?: any) => cartModel.calculateCartTotal(cart, selectedCoupon);
  }, [cart]);

  const getRemainingStock = useMemo(() => {
    return (product: Product) => productModel.getRemainingStock(product, cart);
  }, [cart]);

  const calculateItemTotal = useMemo(() => {
    return (item: CartItem) => discountModel.calculateItemTotal(item, cart);
  }, [cart]);

  // 최종: 모든 비즈니스 로직을 포함한 완전한 함수들
  const addToCart = useCallback(
    (product: Product) => {
      // 1. 재고 확인
      const remainingStock = productModel.getRemainingStock(product, cart);
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


  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification?.(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    setCart([]);
  }, [addNotification]);

  return {
    // 상태
    cart,

    // 계산된 값들
    getTotals,
    getRemainingStock,
    calculateItemTotal,

    // 장바구니 비즈니스 로직
    addToCart,
    removeFromCart,
    updateQuantity,
    completeOrder,
  };
}
