import { useState, useCallback, useEffect } from "react";
import { CartItem } from "../models";
import { ProductWithUI, Product } from "../../product/models";
import { Coupon } from "../../coupon/models";
import {
  getRemainingStock,
  calculateItemTotal,
  calculateCartTotal,
} from "../utils";

export const useCart = (
  addNotification?: (
    message: string,
    type?: "success" | "error" | "warning"
  ) => void,
  products?: ProductWithUI[]
) => {
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

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [totalItemCount, setTotalItemCount] = useState(0);

  // localStorage 동기화
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  // 총 아이템 수 계산
  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

  // 남은 재고 계산
  const getRemainingStockForProduct = useCallback(
    (product: Product): number => {
      return getRemainingStock(product, cart);
    },
    [cart]
  );

  // 아이템별 총액 계산 (순수 함수 사용)
  const calculateItemTotalForItem = useCallback(
    (item: CartItem): number => {
      return calculateItemTotal(item, cart);
    },
    [cart]
  );

  // 장바구니 전체 총액 계산 (순수 함수 사용)
  const calculateCartTotalForCart = useCallback((): {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  } => {
    return calculateCartTotal(cart, selectedCoupon);
  }, [cart, selectedCoupon]);

  // 장바구니에 상품 추가
  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getRemainingStockForProduct(product);
      if (remainingStock <= 0) {
        addNotification?.("재고가 부족합니다!", "error");
        return;
      }

      setCart((prevCart) => {
        const existingItem = prevCart.find(
          (item) => item.product.id === product.id
        );

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;

          if (newQuantity > product.stock) {
            addNotification?.(
              `재고는 ${product.stock}개까지만 있습니다.`,
              "error"
            );
            return prevCart;
          }

          return prevCart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: newQuantity }
              : item
          );
        }

        return [...prevCart, { product, quantity: 1 }];
      });

      addNotification?.("장바구니에 담았습니다", "success");
    },
    [getRemainingStockForProduct, addNotification]
  );

  // 장바구니에서 상품 제거
  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );
  }, []);

  // 수량 업데이트
  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      const product = products?.find((p: ProductWithUI) => p.id === productId);
      if (!product) return;

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        addNotification?.(`재고는 ${maxStock}개까지만 있습니다.`, "error");
        return;
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    },
    [removeFromCart, products, addNotification]
  );

  // 쿠폰 적용
  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateCartTotalForCart().totalAfterDiscount;

      if (currentTotal < 10000 && coupon.discountType === "percentage") {
        addNotification?.(
          "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
          "error"
        );
        return;
      }

      setSelectedCoupon(coupon);
      addNotification?.("쿠폰이 적용되었습니다.", "success");
    },
    [calculateCartTotalForCart, addNotification]
  );

  // 주문 완료
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
    totalItemCount,

    // 계산 함수들
    getRemainingStock: getRemainingStockForProduct,
    calculateItemTotal: calculateItemTotalForItem,
    calculateCartTotal: calculateCartTotalForCart,

    // 액션 함수들
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    setSelectedCoupon,
    completeOrder,
  };
};
