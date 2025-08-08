import { useAtom, useAtomValue } from "jotai";
import { useCallback } from "react";
import {
  cartItemsAtom,
  selectedCouponAtom,
  totalItemCountAtom,
  productsAtom,
} from "../atoms";
import {
  calculateCartTotal,
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  getRemainingStock,
  calculateItemTotal,
} from "../models/cart";
import { CartItem, Coupon, ProductWithUI } from "../../types";

interface UseCartJotaiProps {
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
}

export function useCartJotai({ addNotification }: UseCartJotaiProps) {
  const [cartItems, setCartItems] = useAtom(cartItemsAtom);
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);
  const totalItemCount = useAtomValue(totalItemCountAtom);
  const products = useAtomValue(productsAtom);

  const getRemainingStockById = useCallback(
    (productId: string): number => {
      const product = products.find((p) => p.id === productId);
      if (!product) return 0;

      return getRemainingStock(product, cartItems);
    },
    [products, cartItems]
  );

  // 장바구니에 추가
  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const remaining = getRemainingStock(product, cartItems);
      if (remaining <= 0) {
        addNotification("재고가 부족합니다!", "error");
        return;
      }

      const newCart = addItemToCart(cartItems, product);
      setCartItems(newCart);
      addNotification("장바구니에 담았습니다", "success");
    },
    [cartItems, addNotification, setCartItems]
  );

  // 장바구니에서 제거
  const removeFromCart = useCallback(
    (productId: string) => {
      const newCart = removeItemFromCart(cartItems, productId);
      setCartItems(newCart);
    },
    [cartItems, setCartItems]
  );

  // 수량 변경
  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      const product = products.find((p) => p.id === productId);
      if (!product) {
        addNotification("상품을 찾을 수 없습니다.", "error");
        return;
      }

      if (newQuantity <= 0) {
        const newCart = removeItemFromCart(cartItems, productId);
        setCartItems(newCart);
        return;
      }

      if (newQuantity > product.stock) {
        addNotification(`재고는 ${product.stock}개까지만 있습니다.`, "error");
        return;
      }

      const newCart = updateCartItemQuantity(cartItems, productId, newQuantity);
      setCartItems(newCart);
    },
    [cartItems, products, addNotification, setCartItems]
  );

  // 쿠폰 적용
  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateCartTotal(cartItems, null);

      if (
        currentTotal.totalAfterDiscount < 10000 &&
        coupon.discountType === "percentage"
      ) {
        addNotification(
          "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
          "error"
        );
        return;
      }

      setSelectedCoupon(coupon);
      addNotification("쿠폰이 적용되었습니다.", "success");
    },
    [cartItems, addNotification, setSelectedCoupon]
  );

  // 주문 완료
  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    setCartItems([]);
    setSelectedCoupon(null);
  }, [addNotification, setCartItems, setSelectedCoupon]);

  // totals 계산
  const totals = calculateCartTotal(cartItems, selectedCoupon);

  return {
    // 상태
    cart: cartItems,
    selectedCoupon,
    totalItemCount,
    totals,

    // 함수들
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    completeOrder,

    getRemainingStock: getRemainingStockById,
    // getRemainingStock: (product: ProductWithUI) =>
    //   getRemainingStock(product, cartItems),
    calculateItemTotal: (item: CartItem) => calculateItemTotal(item, cartItems),
    setSelectedCoupon,
  };
}
