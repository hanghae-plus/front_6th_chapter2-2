import { useMemo, useState } from "react";
import { ICartItem, ICoupon, IProductWithUI } from "../type";
import { initialCarts } from "../constants/initialStates";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import { cartModel } from "../models/cart";

export const useCart = () => {
  // 로컬스토리지 연동된 cart
  const [cart, setCart] = useLocalStorage<ICartItem[]>("cart", initialCarts);

  // 현재 선택된 쿠폰
  const [selectedCoupon, setSelectedCoupon] = useState<ICoupon | null>(null);

  /**
   * 장바구니 상품 수량 변경
   */
  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prev) => cartModel.updateQuantity(prev, productId, quantity));
  };

  /**
   * 장바구니에 상품 추가
   */
  const addToCart = (product: IProductWithUI) => {
    setCart((prev) => cartModel.addToCart(prev, product));
  };

  /**
   * 장바구니 상품 제거
   */
  const removeFromCart = (productId: string) => {
    setCart((prev) => cartModel.removeFromCart(prev, productId));
  };

  /**
   * 장바구니 비우기
   */
  const clearCart = () => {
    setCart([]);
  };

  /**
   *  특정 상품의 남은 재고 계산
   */
  const getRemainingStock = (product: IProductWithUI) => {
    return cartModel.getRemainingStock(product, cart);
  };

  /**
   *  개별 아이템의 할인 적용 후 총액 계산
   */
  const calculateItemTotal = (item: ICartItem) => {
    return cartModel.calculateItemTotal(item, cart);
  };

  /**
   * 장바구니 총액 계산 (할인 전/후 할인액)
   */
  const cartTotal = useMemo(
    () => cartModel.calculateCartTotal(cart, selectedCoupon),
    [cart, selectedCoupon]
  );

  return {
    cart,
    updateQuantity,
    addToCart,
    removeFromCart,
    clearCart,
    getRemainingStock,
    calculateItemTotal,
    cartTotal, // { totalBeforeDiscount: number; totalAfterDiscount: number; }
    selectedCoupon,
    setSelectedCoupon,
  };
};
