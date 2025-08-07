import { useState, useCallback, useEffect, useMemo } from "react";
import { CartItem } from "../../types";
import { ProductWithUI } from "../types/product";
import { useNotification } from "./useNotification";
import { calculateRemainingStock, calculateItemTotal, calculateTotalItemCount } from "../utils/cartCalculations";
import { loadDataFromStorage, removeDataFromStorage, saveDataToStorage } from "../utils/localStorageUtils";
import { addItemToCart, removeItemFromCart, updateItemQuantity, validateStockAvailability, validateQuantity } from "../utils/cartUtils";

interface UseCartProps {
  products: ProductWithUI[];
}

export const useCart = ({ products }: UseCartProps) => {
  /** 알림 표시 */
  const { showToast } = useNotification();

  /** 장바구니 상태 */
  const [cart, setCart] = useState<CartItem[]>(loadDataFromStorage<CartItem[]>("cart", []));

  /** 장바구니 총 아이템 수 */
  const [totalItemCount, setTotalItemCount] = useState(0);

  /** 재고 계산 */
  const getRemainingStock = useMemo(
    () =>
      (product: ProductWithUI): number => {
        return calculateRemainingStock(product, cart);
      },
    [cart]
  );

  /** 개별 상품 총액 계산 */
  const calculateItemTotalForCart = useCallback(
    (item: CartItem): number => {
      return calculateItemTotal(item, cart);
    },
    [cart]
  );

  /** 장바구니 추가 */
  const addToCart = useCallback(
    (product: ProductWithUI) => {
      if (!validateStockAvailability(product, cart)) {
        showToast("재고가 부족합니다!", "error");
        return;
      }

      setCart((prevCart) => {
        const newCart = addItemToCart(prevCart, product);

        // 재고 초과 시 에러 메시지
        if (newCart === prevCart) {
          showToast(`재고는 ${product.stock}개까지만 있습니다.`, "error");
        }

        return newCart;
      });

      showToast("장바구니에 담았습니다", "success");
    },
    [cart, showToast]
  );

  /** 장바구니 삭제 */
  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => removeItemFromCart(prevCart, productId));
  }, []);

  /** 장바구니 수량 변경 */
  const updateCartQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      // 상품 존재 여부 검증
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      // 수량 유효성 검증
      if (!validateQuantity(newQuantity, product.stock)) {
        showToast(`재고는 ${product.stock}개까지만 있습니다.`, "error");
        return;
      }

      setCart((prevCart) => updateItemQuantity(prevCart, productId, newQuantity, product.stock));
    },
    [products, showToast]
  );

  // 장바구니 아이템 카운트 계산
  useEffect(() => {
    const count = calculateTotalItemCount(cart);
    setTotalItemCount(count);
  }, [cart]);

  // localStorage 동기화
  useEffect(() => {
    if (cart.length > 0) {
      saveDataToStorage("cart", cart);
    } else {
      removeDataFromStorage("cart");
    }
  }, [cart]);

  return {
    cart,
    setCart,
    totalItemCount,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    getRemainingStock,
    calculateItemTotal: calculateItemTotalForCart,
  };
};
